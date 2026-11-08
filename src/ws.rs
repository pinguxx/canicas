use axum::extract::ws::{Message, WebSocket};
use futures_util::{SinkExt, StreamExt};
use rand::RngExt;
use serde::Deserialize;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::{mpsc, RwLock};

use crate::canicas::{
    generate_patio_marbles, generate_patio_stones, PATIO_CENTER_X, PATIO_CENTER_Y,
    PATIO_SHOOT_RADIUS,
};
use crate::game::{
    current_epoch_secs, generate_room_code, GameSettings, Player, PlayerStats, Room, RoomState,
    PLAYER_AVATARS, PLAYER_COLORS,
};

pub type RoomSockets = HashMap<String, mpsc::UnboundedSender<Message>>;
pub const MAX_ACTIVE_ROOMS: usize = 500;

#[derive(Clone)]
pub struct AppState {
    pub rooms: Arc<RwLock<HashMap<String, Room>>>,
    pub sockets: Arc<RwLock<HashMap<String, RoomSockets>>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self::new()
    }
}

impl AppState {
    pub fn new() -> Self {
        Self {
            rooms: Arc::new(RwLock::new(HashMap::new())),
            sockets: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

pub fn sanitize_name(name: &str, fallback: &str) -> String {
    let clean: String = name
        .trim()
        .chars()
        .filter(|c| !c.is_control() && *c != '<' && *c != '>')
        .take(18)
        .collect();

    if clean.is_empty() {
        fallback.to_string()
    } else {
        clean
    }
}

pub fn sanitize_avatar(avatar: Option<String>, default_avatar: &str) -> String {
    if let Some(a) = avatar {
        let trimmed = a.trim();
        if !trimmed.is_empty()
            && trimmed.chars().count() <= 4
            && !trimmed.contains('<')
            && !trimmed.contains('>')
            && !trimmed.contains('&')
            && !trimmed.contains('"')
        {
            return trimmed.to_string();
        }
    }
    default_avatar.to_string()
}

pub fn sanitize_color(color: Option<String>, default_color: &str) -> String {
    if let Some(c) = color {
        let trimmed = c.trim();
        if trimmed.starts_with('#')
            && trimmed.len() == 7
            && trimmed[1..].chars().all(|h| h.is_ascii_hexdigit())
        {
            return trimmed.to_lowercase();
        }
    }
    default_color.to_string()
}

pub fn sanitize_text(raw: &str) -> Option<String> {
    let clean: String = raw
        .trim()
        .chars()
        .filter(|c| !c.is_control() && *c != '<' && *c != '>')
        .take(54)
        .collect();
    if clean.is_empty() {
        None
    } else {
        Some(clean)
    }
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum ClientMessage {
    #[serde(rename = "create_room")]
    CreateRoom {
        #[serde(rename = "playerName")]
        player_name: String,
        avatar: Option<String>,
        color: Option<String>,
        settings: Option<GameSettings>,
    },
    #[serde(rename = "join_room")]
    JoinRoom {
        #[serde(rename = "roomCode")]
        room_code: String,
        #[serde(rename = "playerName")]
        player_name: String,
        avatar: Option<String>,
        color: Option<String>,
        #[serde(rename = "playerId")]
        player_id: Option<String>,
    },
    #[serde(rename = "update_profile")]
    UpdateProfile {
        #[serde(rename = "roomCode")]
        room_code: String,
        #[serde(rename = "playerName")]
        player_name: Option<String>,
        avatar: Option<String>,
        color: Option<String>,
    },
    #[serde(rename = "update_settings")]
    UpdateSettings {
        #[serde(rename = "roomCode")]
        room_code: String,
        settings: GameSettings,
    },
    #[serde(rename = "switch_stage")]
    SwitchStage {
        #[serde(rename = "roomCode")]
        room_code: String,
        stage: String,
    },
    #[serde(rename = "add_bot")]
    AddBot {
        #[serde(rename = "roomCode")]
        room_code: String,
    },
    #[serde(rename = "remove_bot")]
    RemoveBot {
        #[serde(rename = "roomCode")]
        room_code: String,
    },
    #[serde(rename = "start_game")]
    StartGame {
        #[serde(rename = "roomCode")]
        room_code: String,
    },
    #[serde(rename = "shoot_marble")]
    ShootMarble {
        #[serde(rename = "roomCode")]
        room_code: String,
        power: Option<f64>,
        angle: Option<f64>,
        spin: Option<f64>,
        #[serde(rename = "seatAngle")]
        seat_angle: Option<f64>,
    },
    #[serde(rename = "set_seat_angle")]
    SetSeatAngle {
        #[serde(rename = "roomCode")]
        room_code: String,
        #[serde(rename = "seatAngle")]
        seat_angle: f64,
    },
    #[serde(rename = "nudge_arena")]
    NudgeArena {
        #[serde(rename = "roomCode")]
        room_code: String,
        kind: String, // "blow" or "tap"
    },
    #[serde(rename = "send_banter")]
    SendBanter {
        #[serde(rename = "roomCode")]
        room_code: String,
        text: String,
    },
    #[serde(rename = "play_again")]
    PlayAgain {
        #[serde(rename = "roomCode")]
        room_code: String,
    },
    #[serde(rename = "leave_room")]
    LeaveRoom {
        #[serde(rename = "roomCode")]
        room_code: String,
    },
    #[serde(rename = "force_timeout")]
    ForceTimeout {
        #[serde(rename = "roomCode")]
        room_code: String,
    },
    #[serde(rename = "bot_ping")]
    BotPing {
        #[serde(rename = "roomCode")]
        room_code: String,
    },
    #[serde(rename = "ping")]
    Ping,
}

pub async fn broadcast_to_room(state: &AppState, room_code: &str, payload: &Value) {
    let msg_text = payload.to_string();
    let sockets_guard = state.sockets.read().await;
    if let Some(room_map) = sockets_guard.get(room_code) {
        for tx in room_map.values() {
            let _ = tx.send(Message::Text(msg_text.clone().into()));
        }
    }
}

pub fn schedule_bot_if_needed(state: AppState, room_code: String, delay_ms: u64) {
    tokio::spawn(async move {
        tokio::time::sleep(Duration::from_millis(delay_ms)).await;

        let (bot_id, bot_name, bot_avatar, stage) = {
            let rooms_guard = state.rooms.read().await;
            let Some(room) = rooms_guard.get(&room_code) else {
                return;
            };
            if room.state != RoomState::Playing {
                return;
            }
            let Some(current) = room.current_player() else {
                return;
            };
            if !current.is_bot {
                return;
            }
            (
                current.id.clone(),
                current.name.clone(),
                current.avatar.clone(),
                room.active_stage.clone(),
            )
        };

        // Spontaneous Mexican marble banter from bot before shooting
        let (power, angle, spin, maybe_banter) = {
            let mut rng = rand::rng();
            let p = if stage == "feria" {
                rng.random_range(0.45..0.92)
            } else if stage == "hoyita" {
                rng.random_range(0.42..0.80)
            } else {
                rng.random_range(0.65..0.96)
            };
            let a = rng.random_range(-0.35..0.35);
            let s = rng.random_range(-0.45..0.45);
            let banter = if rng.random_bool(0.55) {
                let phrases = [
                    "🔮 ¡Chiras pelas, ahí va mi bolón!",
                    "👌 ¡Con uñita y sin hacer raya!",
                    "👑 ¡Directito al Gallo de Oro!",
                    "🕳️ ¡A encholar en la hoyita!",
                    "💥 ¡Una cuarta y quema!",
                    "🎪 ¡Vengan esos cien puntos de la feria!",
                ];
                let idx = rng.random_range(0..phrases.len());
                Some(phrases[idx].to_string())
            } else {
                None
            };
            (p, a, s, banter)
        };

        if let Some(banter_text) = maybe_banter {
            broadcast_to_room(
                &state,
                &room_code,
                &json!({
                    "type": "player_banter",
                    "playerId": bot_id,
                    "playerName": bot_name,
                    "avatar": bot_avatar,
                    "text": banter_text
                }),
            )
            .await;
        }

        let outcome_opt = {
            let mut rooms_guard = state.rooms.write().await;
            let Some(room) = rooms_guard.get_mut(&room_code) else {
                return;
            };
            if room.state != RoomState::Playing {
                return;
            }
            let Some(curr) = room.current_player() else {
                return;
            };
            if curr.id != bot_id {
                return;
            }
            room.execute_shot(&bot_id, power, angle, spin)
                .ok()
                .map(|out| (out, room.clone()))
        };

        if let Some((outcome, updated_room)) = outcome_opt {
            broadcast_to_room(
                &state,
                &room_code,
                &json!({
                    "type": "shot_result",
                    "outcome": outcome,
                    "room": updated_room
                }),
            )
            .await;

            if updated_room.state == RoomState::Playing {
                if let Some(next_p) = updated_room.current_player() {
                    if next_p.is_bot {
                        schedule_bot_if_needed(state.clone(), room_code, 1100);
                    }
                }
            }
        }
    });
}

pub async fn handle_ws_connection(socket: WebSocket, state: AppState) {
    let (mut ws_tx, mut ws_rx) = socket.split();
    let (tx, mut rx) = mpsc::unbounded_channel::<Message>();

    let conn_id = format!("conn_{}_{}", current_epoch_secs(), generate_room_code());
    let mut active_room_code: Option<String> = None;
    let mut active_player_id: Option<String> = None;
    let mut last_shot_instant = Instant::now() - Duration::from_secs(5);

    let send_task = tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            if ws_tx.send(msg).await.is_err() {
                break;
            }
        }
    });

    while let Some(Ok(msg)) = ws_rx.next().await {
        let Message::Text(text) = msg else {
            continue;
        };
        if text.len() > 8192 {
            continue;
        }
        let Ok(client_msg) = serde_json::from_str::<ClientMessage>(&text) else {
            let _ = tx.send(Message::Text(
                json!({
                    "type": "error",
                    "message": "Formato de mensaje inválido."
                })
                .to_string()
                .into(),
            ));
            continue;
        };

        match client_msg {
            ClientMessage::Ping => {
                let _ = tx.send(Message::Text(json!({ "type": "pong" }).to_string().into()));
            }

            ClientMessage::CreateRoom {
                player_name,
                avatar,
                color,
                settings,
            } => {
                let mut rooms_guard = state.rooms.write().await;
                if rooms_guard.len() >= MAX_ACTIVE_ROOMS {
                    let _ = tx.send(Message::Text(
                        json!({
                            "type": "error",
                            "message": "Servidor lleno temporalmente. Intenta en unos segundos."
                        })
                        .to_string()
                        .into(),
                    ));
                    continue;
                }

                let mut code = generate_room_code();
                while rooms_guard.contains_key(&code) {
                    code = generate_room_code();
                }

                let pid = format!("p_{}", generate_room_code());
                let host = Player {
                    id: pid.clone(),
                    name: sanitize_name(&player_name, "Jugador 1"),
                    avatar: sanitize_avatar(avatar, PLAYER_AVATARS[0]),
                    color: sanitize_color(color, PLAYER_COLORS[0]),
                    score: 0,
                    marbles_captured: 0,
                    is_cazador: false,
                    bonus_shot_pending: false,
                    shooter_x: 500.0,
                    shooter_y: 915.0,
                    connected: true,
                    is_host: true,
                    conn_id: conn_id.clone(),
                    is_bot: false,
                    seat_angle: None,
                    stats: PlayerStats::default(),
                };

                let mut room = Room::new(code.clone(), host, settings.unwrap_or_default());
                room.position_shooters_on_perimeter();
                let room_snapshot = room.clone();
                rooms_guard.insert(code.clone(), room);
                drop(rooms_guard);

                {
                    let mut sockets_guard = state.sockets.write().await;
                    sockets_guard
                        .entry(code.clone())
                        .or_default()
                        .insert(conn_id.clone(), tx.clone());
                }

                active_room_code = Some(code.clone());
                active_player_id = Some(pid.clone());

                let _ = tx.send(Message::Text(
                    json!({
                        "type": "room_joined",
                        "playerId": pid,
                        "room": room_snapshot
                    })
                    .to_string()
                    .into(),
                ));
            }

            ClientMessage::JoinRoom {
                room_code,
                player_name,
                avatar,
                color,
                player_id,
            } => {
                let code = room_code.trim().to_uppercase();
                let mut rooms_guard = state.rooms.write().await;
                let Some(room) = rooms_guard.get_mut(&code) else {
                    let _ = tx.send(Message::Text(
                        json!({
                            "type": "error",
                            "message": "No se encontró la sala. Verifica el código."
                        })
                        .to_string()
                        .into(),
                    ));
                    continue;
                };

                // Check if reconnecting with existing playerId
                let mut resolved_pid: Option<String> = None;
                let host_id = room.host_id.clone();

                if let Some(ref existing_id) = player_id {
                    if let Some(existing_p) = room.players.iter_mut().find(|p| p.id == *existing_id)
                    {
                        existing_p.connected = true;
                        existing_p.conn_id = conn_id.clone();
                        existing_p.is_host = existing_p.id == host_id;
                        if !player_name.trim().is_empty() {
                            existing_p.name = sanitize_name(&player_name, &existing_p.name);
                        }
                        resolved_pid = Some(existing_p.id.clone());
                    }
                }

                if resolved_pid.is_none() {
                    // Fallback 1: Match by name if an existing human has this name (even during rapid refresh)
                    let clean_req = player_name.trim();
                    if !clean_req.is_empty() {
                        if let Some(existing_p) = room
                            .players
                            .iter_mut()
                            .find(|p| !p.is_bot && p.name == clean_req)
                        {
                            existing_p.connected = true;
                            existing_p.conn_id = conn_id.clone();
                            existing_p.is_host = existing_p.id == host_id;
                            resolved_pid = Some(existing_p.id.clone());
                        }
                    }
                }

                if resolved_pid.is_none() {
                    // Fallback 2: If there is exactly 1 disconnected human in the room, re-attach them
                    let disconnected_human_idx: Vec<usize> = room
                        .players
                        .iter()
                        .enumerate()
                        .filter(|(_, p)| !p.is_bot && !p.connected)
                        .map(|(idx, _)| idx)
                        .collect();
                    if disconnected_human_idx.len() == 1 {
                        let idx = disconnected_human_idx[0];
                        let p = &mut room.players[idx];
                        p.connected = true;
                        p.conn_id = conn_id.clone();
                        p.is_host = p.id == host_id;
                        if !player_name.trim().is_empty() {
                            p.name = sanitize_name(&player_name, &p.name);
                        }
                        resolved_pid = Some(p.id.clone());
                    }
                }

                if resolved_pid.is_none() {
                    // Fallback 3: If the room only has 1 human player total (fast refresh before close completed)
                    let human_idx: Vec<usize> = room
                        .players
                        .iter()
                        .enumerate()
                        .filter(|(_, p)| !p.is_bot)
                        .map(|(idx, _)| idx)
                        .collect();
                    if human_idx.len() == 1 {
                        let idx = human_idx[0];
                        let p = &mut room.players[idx];
                        p.connected = true;
                        p.conn_id = conn_id.clone();
                        p.is_host = p.id == host_id;
                        if !player_name.trim().is_empty() {
                            p.name = sanitize_name(&player_name, &p.name);
                        }
                        resolved_pid = Some(p.id.clone());
                    }
                }

                if resolved_pid.is_none() {
                    if room.state != RoomState::Lobby {
                        let _ = tx.send(Message::Text(
                            json!({
                                "type": "error",
                                "message": "La partida ya comenzó. Espera a la siguiente ronda."
                            })
                            .to_string()
                            .into(),
                        ));
                        continue;
                    }
                    if room.players.len() >= 10 {
                        let _ = tx.send(Message::Text(
                            json!({
                                "type": "error",
                                "message": "La sala está llena (máximo 10 jugadores)."
                            })
                            .to_string()
                            .into(),
                        ));
                        continue;
                    }

                    let pid = format!("p_{}", generate_room_code());
                    let default_col = PLAYER_COLORS[room.players.len() % PLAYER_COLORS.len()];
                    let default_av = PLAYER_AVATARS[room.players.len() % PLAYER_AVATARS.len()];
                    let new_player = Player {
                        id: pid.clone(),
                        name: sanitize_name(
                            &player_name,
                            &format!("Jugador {}", room.players.len() + 1),
                        ),
                        avatar: sanitize_avatar(avatar, default_av),
                        color: sanitize_color(color, default_col),
                        score: 0,
                        marbles_captured: 0,
                        is_cazador: false,
                        bonus_shot_pending: false,
                        shooter_x: 500.0,
                        shooter_y: 915.0,
                        connected: true,
                        is_host: false,
                        conn_id: conn_id.clone(),
                        is_bot: false,
                        seat_angle: None,
                        stats: PlayerStats::default(),
                    };
                    room.players.push(new_player);
                    room.position_shooters_on_perimeter();
                    resolved_pid = Some(pid);
                }

                room.touch();
                let pid = resolved_pid.unwrap();
                let room_snapshot = room.clone();
                drop(rooms_guard);

                {
                    let mut sockets_guard = state.sockets.write().await;
                    sockets_guard
                        .entry(code.clone())
                        .or_default()
                        .insert(conn_id.clone(), tx.clone());
                }

                active_room_code = Some(code.clone());
                active_player_id = Some(pid.clone());

                let _ = tx.send(Message::Text(
                    json!({
                        "type": "room_joined",
                        "playerId": pid,
                        "room": room_snapshot
                    })
                    .to_string()
                    .into(),
                ));

                broadcast_to_room(
                    &state,
                    &code,
                    &json!({
                        "type": "room_updated",
                        "room": room_snapshot
                    }),
                )
                .await;
            }

            ClientMessage::UpdateProfile {
                room_code,
                player_name,
                avatar,
                color,
            } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                let mut rooms_guard = state.rooms.write().await;
                let Some(room) = rooms_guard.get_mut(&code) else {
                    continue;
                };
                if let Some(p) = room.players.iter_mut().find(|p| p.id == *pid) {
                    if let Some(name) = player_name {
                        p.name = sanitize_name(&name, &p.name);
                    }
                    if avatar.is_some() {
                        p.avatar = sanitize_avatar(avatar, &p.avatar);
                    }
                    if color.is_some() {
                        p.color = sanitize_color(color, &p.color);
                    }
                    room.touch();
                    let snapshot = room.clone();
                    drop(rooms_guard);
                    broadcast_to_room(
                        &state,
                        &code,
                        &json!({
                            "type": "room_updated",
                            "room": snapshot
                        }),
                    )
                    .await;
                }
            }

            ClientMessage::UpdateSettings {
                room_code,
                settings,
            } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                let mut rooms_guard = state.rooms.write().await;
                let Some(room) = rooms_guard.get_mut(&code) else {
                    continue;
                };
                let is_member = room.players.iter().any(|p| p.id == *pid);
                if !is_member {
                    continue;
                }
                let is_host = room.players.iter().any(|p| p.id == *pid && p.is_host);
                let clean = settings.sanitized();
                if is_host {
                    if room.state == RoomState::Playing {
                        let old_mode = room.settings.game_mode.clone();
                        room.settings = clean;
                        room.settings.game_mode = old_mode;
                    } else {
                        room.settings = clean;
                    }
                } else {
                    room.settings.turn_timer_seconds = clean.turn_timer_seconds;
                }
                if room.state == RoomState::Lobby {
                    room.active_stage = crate::game::stage_for_round(&room.settings.game_mode, 1);
                    let is_hoyita = room.active_stage == "hoyita";
                    room.patio_targets = generate_patio_marbles(is_hoyita);
                    room.patio_stones =
                        generate_patio_stones(is_hoyita, 0, 90.0, &room.patio_targets);
                }
                room.refresh_turn_deadline();
                room.touch();
                let snapshot = room.clone();
                drop(rooms_guard);

                broadcast_to_room(
                    &state,
                    &code,
                    &json!({
                        "type": "room_updated",
                        "room": snapshot
                    }),
                )
                .await;

                if snapshot.state == RoomState::Playing {
                    if let Some(curr) = snapshot.current_player() {
                        if curr.is_bot {
                            schedule_bot_if_needed(state.clone(), code.clone(), 800);
                        }
                    }
                }
            }

            ClientMessage::SwitchStage { room_code, stage } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                if !matches!(stage.as_str(), "feria" | "circulo" | "hoyita") {
                    continue;
                }
                let mut rooms_guard = state.rooms.write().await;
                let Some(room) = rooms_guard.get_mut(&code) else {
                    continue;
                };
                let is_host = room.players.iter().any(|p| p.id == *pid && p.is_host);
                if !is_host {
                    continue;
                };
                if room.state == RoomState::Playing {
                    // Changing game mode during an active game is prohibited mid-match
                    continue;
                }
                room.active_stage = stage.clone();
                room.settings.game_mode = stage.clone();
                if stage != "feria" {
                    let is_hoyita = stage == "hoyita";
                    room.patio_targets = generate_patio_marbles(is_hoyita);
                    room.patio_stones = generate_patio_stones(
                        is_hoyita,
                        room.shot_counter,
                        90.0,
                        &room.patio_targets,
                    );
                    room.position_shooters_on_perimeter();
                } else {
                    room.feria_occupied_holes.clear();
                }
                room.refresh_turn_deadline();
                room.touch();
                let snapshot = room.clone();
                drop(rooms_guard);

                broadcast_to_room(
                    &state,
                    &code,
                    &json!({
                        "type": "room_updated",
                        "room": snapshot
                    }),
                )
                .await;

                if snapshot.state == RoomState::Playing {
                    if let Some(curr) = snapshot.current_player() {
                        if curr.is_bot {
                            schedule_bot_if_needed(state.clone(), code.clone(), 800);
                        }
                    }
                }
            }

            ClientMessage::AddBot { room_code } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                let mut rooms_guard = state.rooms.write().await;
                let Some(room) = rooms_guard.get_mut(&code) else {
                    continue;
                };
                let is_host = room.players.iter().any(|p| p.id == *pid && p.is_host);
                if !is_host || room.state != RoomState::Lobby {
                    continue;
                }
                match room.add_bot() {
                    Ok(_) => {
                        let snapshot = room.clone();
                        drop(rooms_guard);
                        broadcast_to_room(
                            &state,
                            &code,
                            &json!({
                                "type": "room_updated",
                                "room": snapshot
                            }),
                        )
                        .await;
                    }
                    Err(err_msg) => {
                        let _ = tx.send(Message::Text(
                            json!({ "type": "error", "message": err_msg })
                                .to_string()
                                .into(),
                        ));
                    }
                }
            }

            ClientMessage::RemoveBot { room_code } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                let mut rooms_guard = state.rooms.write().await;
                let Some(room) = rooms_guard.get_mut(&code) else {
                    continue;
                };
                let is_host = room.players.iter().any(|p| p.id == *pid && p.is_host);
                if !is_host || room.state != RoomState::Lobby {
                    continue;
                }
                if room.remove_last_bot().is_some() {
                    let snapshot = room.clone();
                    drop(rooms_guard);
                    broadcast_to_room(
                        &state,
                        &code,
                        &json!({
                            "type": "room_updated",
                            "room": snapshot
                        }),
                    )
                    .await;
                }
            }

            ClientMessage::StartGame { room_code } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                let mut rooms_guard = state.rooms.write().await;
                let Some(room) = rooms_guard.get_mut(&code) else {
                    continue;
                };
                let is_host = room.players.iter().any(|p| p.id == *pid && p.is_host);
                if !is_host {
                    continue;
                }
                room.start_game();
                let snapshot = room.clone();
                let first_is_bot = snapshot.current_player().map(|p| p.is_bot).unwrap_or(false);
                drop(rooms_guard);

                broadcast_to_room(
                    &state,
                    &code,
                    &json!({
                        "type": "game_started",
                        "room": snapshot
                    }),
                )
                .await;

                if first_is_bot {
                    schedule_bot_if_needed(state.clone(), code, 1000);
                }
            }

            ClientMessage::SetSeatAngle {
                room_code,
                seat_angle,
            } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                let mut maybe_snapshot: Option<Room> = None;
                {
                    let mut rooms_guard = state.rooms.write().await;
                    if let Some(room) = rooms_guard.get_mut(&code) {
                        if let Some(p) = room.players.iter_mut().find(|p| p.id == *pid) {
                            let deg = seat_angle.rem_euclid(360.0);
                            p.seat_angle = Some(deg);
                            let rad = deg.to_radians();
                            p.shooter_x = (PATIO_CENTER_X + PATIO_SHOOT_RADIUS * rad.cos()).round();
                            p.shooter_y = (PATIO_CENTER_Y + PATIO_SHOOT_RADIUS * rad.sin()).round();
                            room.touch();
                            maybe_snapshot = Some(room.clone());
                        }
                    }
                }
                if let Some(snapshot) = maybe_snapshot {
                    broadcast_to_room(
                        &state,
                        &code,
                        &json!({
                            "type": "room_updated",
                            "room": snapshot
                        }),
                    )
                    .await;
                }
            }

            ClientMessage::ShootMarble {
                room_code,
                power,
                angle,
                spin,
                seat_angle,
            } => {
                if last_shot_instant.elapsed() < Duration::from_millis(350) {
                    continue;
                }
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };

                let result = {
                    let mut rooms_guard = state.rooms.write().await;
                    let Some(room) = rooms_guard.get_mut(&code) else {
                        continue;
                    };
                    if let Some(p) = room.players.iter_mut().find(|p| p.id == *pid) {
                        if let Some(sa) = seat_angle {
                            let deg = sa.rem_euclid(360.0);
                            p.seat_angle = Some(deg);
                            let rad = deg.to_radians();
                            p.shooter_x = (PATIO_CENTER_X + PATIO_SHOOT_RADIUS * rad.cos()).round();
                            p.shooter_y = (PATIO_CENTER_Y + PATIO_SHOOT_RADIUS * rad.sin()).round();
                        }
                    }
                    room.execute_shot_with_seat(
                        pid,
                        power.unwrap_or(0.72),
                        angle.unwrap_or(0.0),
                        spin.unwrap_or(0.0),
                        seat_angle,
                    )
                    .map(|outcome| (outcome, room.clone()))
                };

                match result {
                    Ok((outcome, snapshot)) => {
                        last_shot_instant = Instant::now();
                        broadcast_to_room(
                            &state,
                            &code,
                            &json!({
                                "type": "shot_result",
                                "outcome": outcome,
                                "room": snapshot
                            }),
                        )
                        .await;

                        if snapshot.state == RoomState::Playing {
                            if let Some(next_p) = snapshot.current_player() {
                                if next_p.is_bot {
                                    schedule_bot_if_needed(state.clone(), code, 1100);
                                }
                            }
                        }
                    }
                    Err(err_msg) => {
                        let _ = tx.send(Message::Text(
                            json!({
                                "type": "error",
                                "message": err_msg
                            })
                            .to_string()
                            .into(),
                        ));
                    }
                }
            }

            ClientMessage::NudgeArena { room_code, kind } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                let nudge_kind = if kind == "blow" { "blow" } else { "tap" };
                let player_info = {
                    let rooms_guard = state.rooms.read().await;
                    rooms_guard.get(&code).and_then(|r| {
                        r.players
                            .iter()
                            .find(|p| p.id == *pid)
                            .map(|p| (p.name.clone(), p.avatar.clone()))
                    })
                };
                if let Some((pname, pavatar)) = player_info {
                    broadcast_to_room(
                        &state,
                        &code,
                        &json!({
                            "type": "arena_nudged",
                            "playerId": pid,
                            "playerName": pname,
                            "avatar": pavatar,
                            "kind": nudge_kind
                        }),
                    )
                    .await;
                }
            }

            ClientMessage::SendBanter { room_code, text } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    continue;
                };
                let Some(clean_text) = sanitize_text(&text) else {
                    continue;
                };
                let player_info = {
                    let rooms_guard = state.rooms.read().await;
                    rooms_guard.get(&code).and_then(|r| {
                        r.players
                            .iter()
                            .find(|p| p.id == *pid)
                            .map(|p| (p.name.clone(), p.avatar.clone()))
                    })
                };
                if let Some((pname, pavatar)) = player_info {
                    broadcast_to_room(
                        &state,
                        &code,
                        &json!({
                            "type": "player_banter",
                            "playerId": pid,
                            "playerName": pname,
                            "avatar": pavatar,
                            "text": clean_text
                        }),
                    )
                    .await;
                }
            }

            ClientMessage::PlayAgain { room_code } => {
                let code = room_code.trim().to_uppercase();
                let Some(ref pid) = active_player_id else {
                    let _ = tx.send(Message::Text(
                        json!({
                            "type": "error",
                            "message": "No se encontró la sesión del jugador."
                        })
                        .to_string()
                        .into(),
                    ));
                    continue;
                };
                let mut rooms_guard = state.rooms.write().await;
                let Some(room) = rooms_guard.get_mut(&code) else {
                    let _ = tx.send(Message::Text(
                        json!({
                            "type": "error",
                            "message": "No se encontró la sala. Verifica el código."
                        })
                        .to_string()
                        .into(),
                    ));
                    continue;
                };
                let is_host = room.players.iter().any(|p| p.id == *pid && p.is_host);
                if !is_host && room.state != RoomState::Finished {
                    continue;
                }
                room.reset_to_lobby();
                let snapshot = room.clone();
                drop(rooms_guard);

                broadcast_to_room(
                    &state,
                    &code,
                    &json!({
                        "type": "room_reset",
                        "room": snapshot
                    }),
                )
                .await;
            }

            ClientMessage::LeaveRoom { room_code } => {
                let code = room_code.trim().to_uppercase();
                let mut maybe_snapshot: Option<Room> = None;
                {
                    let mut rooms_guard = state.rooms.write().await;
                    if let Some(room) = rooms_guard.get_mut(&code) {
                        if let Some(ref pid) = active_player_id {
                            if room.state == RoomState::Lobby {
                                room.players.retain(|p| p.id != *pid);
                                room.position_shooters_on_perimeter();
                                if room.host_id == *pid {
                                    if let Some(first_human) =
                                        room.players.iter().find(|p| !p.is_bot)
                                    {
                                        room.host_id = first_human.id.clone();
                                        for p in &mut room.players {
                                            p.is_host = p.id == room.host_id;
                                        }
                                    }
                                }
                            } else if let Some(p) = room.players.iter_mut().find(|p| p.id == *pid) {
                                p.connected = false;
                            }
                        }
                        let any_human = room.players.iter().any(|p| !p.is_bot);
                        if !any_human {
                            rooms_guard.remove(&code);
                        } else {
                            room.touch();
                            maybe_snapshot = Some(room.clone());
                        }
                    }
                }
                active_room_code = None;
                active_player_id = None;
                if let Some(snapshot) = maybe_snapshot {
                    broadcast_to_room(
                        &state,
                        &code,
                        &json!({ "type": "room_updated", "room": snapshot }),
                    )
                    .await;
                }
            }

            ClientMessage::BotPing { room_code } => {
                let code = room_code.trim().to_uppercase();
                let rooms_guard = state.rooms.read().await;
                if let Some(room) = rooms_guard.get(&code) {
                    if room.state == RoomState::Playing {
                        if let Some(curr) = room.current_player() {
                            if curr.is_bot {
                                drop(rooms_guard);
                                schedule_bot_if_needed(state.clone(), code, 250);
                            }
                        }
                    }
                }
            }

            ClientMessage::ForceTimeout { room_code } => {
                let code = room_code.trim().to_uppercase();
                let outcome_opt = {
                    let mut rooms_guard = state.rooms.write().await;
                    if let Some(room) = rooms_guard.get_mut(&code) {
                        if room.state == RoomState::Playing {
                            if let Some(curr) = room.current_player().cloned() {
                                let curr_seat = curr.seat_angle;
                                match room
                                    .execute_shot_with_seat(&curr.id, 0.68, 0.0, 0.0, curr_seat)
                                {
                                    Ok(out) => Some((out, room.clone())),
                                    Err(e) => {
                                        eprintln!("Force timeout error in room {}: {}", code, e);
                                        room.current_turn_idx =
                                            (room.current_turn_idx + 1) % room.players.len().max(1);
                                        room.refresh_turn_deadline();
                                        room.touch();
                                        None
                                    }
                                }
                            } else {
                                None
                            }
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                };

                if let Some((outcome, snapshot)) = outcome_opt {
                    broadcast_to_room(
                        &state,
                        &code,
                        &json!({
                            "type": "shot_result",
                            "outcome": outcome,
                            "room": snapshot,
                            "autoTimeout": true
                        }),
                    )
                    .await;

                    if snapshot.state == RoomState::Playing {
                        if let Some(next_p) = snapshot.current_player() {
                            if next_p.is_bot {
                                schedule_bot_if_needed(state.clone(), code, 750);
                            }
                        }
                    }
                }
            }
        }
    }

    if let Some(code) = active_room_code {
        handle_player_disconnect(&state, &code, &conn_id, active_player_id.as_deref()).await;
    }
    send_task.abort();
}

async fn handle_player_disconnect(
    state: &AppState,
    room_code: &str,
    conn_id: &str,
    player_id: Option<&str>,
) {
    {
        let mut sockets_guard = state.sockets.write().await;
        if let Some(map) = sockets_guard.get_mut(room_code) {
            map.remove(conn_id);
            if map.is_empty() {
                sockets_guard.remove(room_code);
            }
        }
    }

    let mut maybe_snapshot: Option<Room> = None;
    {
        let mut rooms_guard = state.rooms.write().await;
        if let Some(room) = rooms_guard.get_mut(room_code) {
            if let Some(pid) = player_id {
                if let Some(p) = room
                    .players
                    .iter_mut()
                    .find(|p| p.id == pid && p.conn_id == conn_id)
                {
                    p.connected = false;
                }
            }
            // Do NOT delete the room or strip host on temporary socket disconnection!
            // The room and player state persist across page reloads, network switches, and browser refreshes.
            room.touch();
            maybe_snapshot = Some(room.clone());
        }
    }

    if let Some(snapshot) = maybe_snapshot {
        broadcast_to_room(
            state,
            room_code,
            &json!({
                "type": "room_updated",
                "room": snapshot
            }),
        )
        .await;
    }
}

pub async fn start_background_maintenance(state: AppState) {
    let mut interval = tokio::time::interval(Duration::from_secs(1));
    loop {
        interval.tick().await;
        let now = current_epoch_secs();

        let mut timed_out_shots: Vec<(String, String)> = Vec::new();
        let mut expired_rooms: Vec<String> = Vec::new();

        {
            let rooms_guard = state.rooms.read().await;
            for (code, room) in rooms_guard.iter() {
                // If all humans are disconnected for > 15 minutes, or inactive for > 2 hours, expire the room
                let has_connected_human = room.players.iter().any(|p| !p.is_bot && p.connected);
                let timeout_secs = if has_connected_human { 7200 } else { 900 };
                if now.saturating_sub(room.last_activity_epoch) > timeout_secs {
                    expired_rooms.push(code.clone());
                    continue;
                }
                if room.state == RoomState::Playing {
                    if let Some(deadline) = room.turn_deadline_epoch {
                        if now >= deadline {
                            if let Some(curr) = room.current_player() {
                                timed_out_shots.push((code.clone(), curr.id.clone()));
                            }
                        }
                    }
                }
            }
        }

        if !expired_rooms.is_empty() {
            let mut rooms_guard = state.rooms.write().await;
            let mut sockets_guard = state.sockets.write().await;
            for code in expired_rooms {
                rooms_guard.remove(&code);
                sockets_guard.remove(&code);
            }
        }

        for (code, pid) in timed_out_shots {
            let outcome_opt = {
                let mut rooms_guard = state.rooms.write().await;
                if let Some(room) = rooms_guard.get_mut(&code) {
                    let curr_seat = room
                        .players
                        .iter()
                        .find(|p| p.id == pid)
                        .and_then(|p| p.seat_angle);
                    match room.execute_shot_with_seat(&pid, 0.68, 0.0, 0.0, curr_seat) {
                        Ok(out) => Some((out, room.clone())),
                        Err(e) => {
                            eprintln!("Auto timeout shot error in room {}: {}", code, e);
                            room.current_turn_idx =
                                (room.current_turn_idx + 1) % room.players.len().max(1);
                            room.refresh_turn_deadline();
                            room.touch();
                            None
                        }
                    }
                } else {
                    None
                }
            };

            if let Some((outcome, snapshot)) = outcome_opt {
                broadcast_to_room(
                    &state,
                    &code,
                    &json!({
                        "type": "shot_result",
                        "outcome": outcome,
                        "room": snapshot,
                        "autoTimeout": true
                    }),
                )
                .await;

                if snapshot.state == RoomState::Playing {
                    if let Some(next_p) = snapshot.current_player() {
                        if next_p.is_bot {
                            schedule_bot_if_needed(state.clone(), code, 1100);
                        }
                    }
                }
            }
        }
    }
}
