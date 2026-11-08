mod canicas;
mod game;
mod ws;

use axum::extract::{State, WebSocketUpgrade};
use axum::http::{header, HeaderValue};
use axum::response::{IntoResponse, Json};
use axum::routing::get;
use axum::Router;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;
use tower_http::set_header::SetResponseHeaderLayer;

use crate::game::ArenaMetadata;
use crate::ws::{handle_ws_connection, start_background_maintenance, AppState};

async fn health_check_api(State(state): State<AppState>) -> impl IntoResponse {
    let rooms_count = state.rooms.read().await.len();
    let sockets_guard = state.sockets.read().await;
    let connections_count: usize = sockets_guard.values().map(|r| r.len()).sum();

    Json(serde_json::json!({
        "status": "ok",
        "service": "canicas-mexicanas-rust",
        "active_rooms": rooms_count,
        "active_connections": connections_count
    }))
}

async fn get_arenas_api() -> impl IntoResponse {
    Json(serde_json::json!({
        "arenas": ArenaMetadata::load()
    }))
}

async fn ws_handler(ws: WebSocketUpgrade, State(state): State<AppState>) -> impl IntoResponse {
    ws.max_message_size(16 * 1024)
        .on_upgrade(move |socket| handle_ws_connection(socket, state))
}

pub fn create_app(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/health", get(health_check_api))
        .route("/healthz", get(health_check_api))
        .route("/api/health", get(health_check_api))
        .route("/api/arenas", get(get_arenas_api))
        .route("/ws", get(ws_handler))
        .fallback_service(ServeDir::new("public"))
        .layer(SetResponseHeaderLayer::overriding(
            header::CACHE_CONTROL,
            HeaderValue::from_static("no-cache, no-store, must-revalidate"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::PRAGMA,
            HeaderValue::from_static("no-cache"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::EXPIRES,
            HeaderValue::from_static("0"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::X_CONTENT_TYPE_OPTIONS,
            HeaderValue::from_static("nosniff"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::X_FRAME_OPTIONS,
            HeaderValue::from_static("SAMEORIGIN"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::REFERRER_POLICY,
            HeaderValue::from_static("strict-origin-when-cross-origin"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::CONTENT_SECURITY_POLICY,
            HeaderValue::from_static(
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data:; connect-src 'self' ws: wss:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';",
            ),
        ))
        .layer(cors)
        .with_state(state)
}

#[tokio::main]
async fn main() {
    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(3000);

    let state = AppState::new();
    tokio::spawn(start_background_maintenance(state.clone()));

    let app = create_app(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    println!("\n========================================================");
    println!("🔮 CANICAS ONLINE • FERIA Y PATIO (RUST / AXUM) 🇲🇽");
    println!("========================================================");
    println!("> Local:   http://localhost:{}", port);
    println!("> Network: http://0.0.0.0:{}", port);
    println!("========================================================\n");

    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use futures_util::{SinkExt, StreamExt};
    use serde_json::{json, Value};
    use tokio_tungstenite::{connect_async, tungstenite::protocol::Message as WsMsg};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_http_endpoints_and_security_headers() {
        let state = AppState::new();
        let app = create_app(state);

        let res = app
            .clone()
            .oneshot(
                Request::builder()
                    .uri("/health")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.status(), StatusCode::OK);
        assert_eq!(
            res.headers().get(header::X_CONTENT_TYPE_OPTIONS).unwrap(),
            "nosniff"
        );
        assert_eq!(
            res.headers().get(header::X_FRAME_OPTIONS).unwrap(),
            "SAMEORIGIN"
        );
        assert_eq!(
            res.headers().get(header::REFERRER_POLICY).unwrap(),
            "strict-origin-when-cross-origin"
        );
        assert!(res.headers().contains_key(header::CONTENT_SECURITY_POLICY));

        let res_arenas = app
            .oneshot(
                Request::builder()
                    .uri("/api/arenas")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res_arenas.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_websocket_end_to_end_feria_and_patio_modes() {
        let state = AppState::new();
        let app = create_app(state);
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();

        tokio::spawn(async move {
            axum::serve(listener, app).await.unwrap();
        });

        let ws_url = format!("ws://{}/ws", addr);
        let (mut ws_stream, _) = connect_async(&ws_url).await.unwrap();

        // 1. Create Room in Feria mode
        ws_stream
            .send(WsMsg::Text(
                json!({
                    "type": "create_room",
                    "playerName": "Elena",
                    "avatar": "🔮",
                    "color": "#06b6d4",
                    "settings": {
                        "game_mode": "feria",
                        "win_condition": "rounds",
                        "max_rounds": 5,
                        "target_score": 250,
                        "turn_timer_seconds": 0,
                        "bonus_shot_rule": false,
                        "combo_multiplier": true,
                        "ponche_steal": true,
                        "arena_theme": "feria"
                    }
                })
                .to_string()
                .into(),
            ))
            .await
            .unwrap();

        let msg = ws_stream.next().await.unwrap().unwrap();
        let parsed: Value = serde_json::from_str(msg.to_text().unwrap()).unwrap();
        assert_eq!(parsed["type"], "room_joined");
        let room_code = parsed["room"]["code"].as_str().unwrap().to_string();

        // 2. Add Bot
        ws_stream
            .send(WsMsg::Text(
                json!({
                    "type": "add_bot",
                    "roomCode": room_code
                })
                .to_string()
                .into(),
            ))
            .await
            .unwrap();

        let msg_bot = ws_stream.next().await.unwrap().unwrap();
        let parsed_bot: Value = serde_json::from_str(msg_bot.to_text().unwrap()).unwrap();
        assert_eq!(parsed_bot["type"], "room_updated");
        assert_eq!(parsed_bot["room"]["players"].as_array().unwrap().len(), 2);

        // 3. Start Game
        ws_stream
            .send(WsMsg::Text(
                json!({
                    "type": "start_game",
                    "roomCode": room_code
                })
                .to_string()
                .into(),
            ))
            .await
            .unwrap();

        let msg_start = ws_stream.next().await.unwrap().unwrap();
        let parsed_start: Value = serde_json::from_str(msg_start.to_text().unwrap()).unwrap();
        assert_eq!(parsed_start["type"], "game_started");

        // 4. Shoot Marble in Feria stage
        ws_stream
            .send(WsMsg::Text(
                json!({
                    "type": "shoot_marble",
                    "roomCode": room_code,
                    "power": 0.80,
                    "angle": 0.1,
                    "spin": -0.2
                })
                .to_string()
                .into(),
            ))
            .await
            .unwrap();

        let msg_shot = ws_stream.next().await.unwrap().unwrap();
        let parsed_shot: Value = serde_json::from_str(msg_shot.to_text().unwrap()).unwrap();
        assert_eq!(parsed_shot["type"], "shot_result");
        assert_eq!(parsed_shot["outcome"]["stage"], "feria");
    }

    #[tokio::test]
    async fn test_websocket_reconnection_preserves_room_and_host_on_refresh() {
        let state = AppState::new();
        let app = create_app(state);
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();

        tokio::spawn(async move {
            axum::serve(listener, app).await.unwrap();
        });

        let ws_url = format!("ws://{}/ws", addr);

        // 1. First connection: create room in lobby
        let (mut ws1, _) = connect_async(&ws_url).await.unwrap();
        ws1.send(WsMsg::Text(
            json!({
                "type": "create_room",
                "playerName": "Pix",
                "avatar": "🤠",
                "color": "#f59e0b"
            })
            .to_string()
            .into(),
        ))
        .await
        .unwrap();

        let msg1 = ws1.next().await.unwrap().unwrap();
        let parsed1: Value = serde_json::from_str(msg1.to_text().unwrap()).unwrap();
        assert_eq!(parsed1["type"], "room_joined");
        let room_code = parsed1["room"]["code"].as_str().unwrap().to_string();
        let player_id = parsed1["playerId"].as_str().unwrap().to_string();

        // 2. Simulate browser refresh in Lobby: drop ws1
        drop(ws1);
        tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;

        // 3. Reconnect with new websocket connection ws2 using saved room_code & player_id
        let (mut ws2, _) = connect_async(&ws_url).await.unwrap();
        ws2.send(WsMsg::Text(
            json!({
                "type": "join_room",
                "roomCode": room_code,
                "playerName": "Pix",
                "avatar": "🤠",
                "color": "#f59e0b",
                "playerId": player_id
            })
            .to_string()
            .into(),
        ))
        .await
        .unwrap();

        let msg2 = ws2.next().await.unwrap().unwrap();
        let parsed2: Value = serde_json::from_str(msg2.to_text().unwrap()).unwrap();
        assert_eq!(parsed2["type"], "room_joined");
        assert_eq!(parsed2["playerId"], player_id);
        assert_eq!(parsed2["room"]["code"], room_code);
        let players = parsed2["room"]["players"].as_array().unwrap();
        assert_eq!(players.len(), 1);
        assert_eq!(players[0]["id"], player_id);
        assert_eq!(players[0]["connected"], true);
        assert_eq!(players[0]["is_host"], true);

        // Read room_updated broadcast sent to room members
        let msg2_bcast = ws2.next().await.unwrap().unwrap();
        let parsed2_bcast: Value = serde_json::from_str(msg2_bcast.to_text().unwrap()).unwrap();
        assert_eq!(parsed2_bcast["type"], "room_updated");

        // 4. Start game on ws2
        ws2.send(WsMsg::Text(
            json!({
                "type": "start_game",
                "roomCode": room_code
            })
            .to_string()
            .into(),
        ))
        .await
        .unwrap();

        let msg_start = ws2.next().await.unwrap().unwrap();
        let parsed_start: Value = serde_json::from_str(msg_start.to_text().unwrap()).unwrap();
        assert_eq!(parsed_start["type"], "game_started");

        // 5. Simulate browser refresh during active game: drop ws2
        drop(ws2);
        tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;

        // 6. Reconnect on ws3: player is still in the room, state is still playing!
        let (mut ws3, _) = connect_async(&ws_url).await.unwrap();
        ws3.send(WsMsg::Text(
            json!({
                "type": "join_room",
                "roomCode": room_code,
                "playerName": "Pix",
                "avatar": "🤠",
                "color": "#f59e0b",
                "playerId": player_id
            })
            .to_string()
            .into(),
        ))
        .await
        .unwrap();

        let msg3 = ws3.next().await.unwrap().unwrap();
        let parsed3: Value = serde_json::from_str(msg3.to_text().unwrap()).unwrap();
        assert_eq!(parsed3["type"], "room_joined");
        assert_eq!(parsed3["room"]["state"], "playing");
        assert_eq!(parsed3["playerId"], player_id);
        let players_after = parsed3["room"]["players"].as_array().unwrap();
        assert_eq!(players_after[0]["connected"], true);
        assert_eq!(players_after[0]["is_host"], true);

        // 7. Simulate browser refresh where storage/playerId was cleared: drop ws3, reconnect ws4 with NO playerId
        drop(ws3);
        tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;

        let (mut ws4, _) = connect_async(&ws_url).await.unwrap();
        ws4.send(WsMsg::Text(
            json!({
                "type": "join_room",
                "roomCode": room_code,
                "playerName": "Pix",
                "avatar": "🤠",
                "color": "#f59e0b",
                "playerId": null
            })
            .to_string()
            .into(),
        ))
        .await
        .unwrap();

        let msg4 = ws4.next().await.unwrap().unwrap();
        let parsed4: Value = serde_json::from_str(msg4.to_text().unwrap()).unwrap();
        assert_eq!(parsed4["type"], "room_joined");
        assert_eq!(parsed4["room"]["state"], "playing");
        assert_eq!(parsed4["playerId"], player_id);
        let players_after4 = parsed4["room"]["players"].as_array().unwrap();
        assert_eq!(players_after4[0]["connected"], true);
        assert_eq!(players_after4[0]["is_host"], true);
    }

    #[tokio::test]
    async fn test_websocket_invalid_room_and_play_again_error_handling() {
        let state = AppState::new();
        let app = create_app(state);

        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();

        tokio::spawn(async move {
            axum::serve(listener, app).await.unwrap();
        });

        let ws_url = format!("ws://127.0.0.1:{}/ws", addr.port());
        let (mut ws, _) = connect_async(&ws_url).await.unwrap();

        // 1. Attempt to join a room that does not exist
        ws.send(WsMsg::Text(
            json!({
                "type": "join_room",
                "roomCode": "NOEXIS",
                "playerName": "Caniquero",
                "avatar": "🤠",
                "color": "#f59e0b"
            })
            .to_string()
            .into(),
        ))
        .await
        .unwrap();

        let msg_err = ws.next().await.unwrap().unwrap();
        let parsed_err: Value = serde_json::from_str(msg_err.to_text().unwrap()).unwrap();
        assert_eq!(parsed_err["type"], "error");
        assert!(parsed_err["message"]
            .as_str()
            .unwrap()
            .contains("No se encontró la sala"));

        // 2. Attempt to play again on a non-existent room
        ws.send(WsMsg::Text(
            json!({
                "type": "play_again",
                "roomCode": "NOEXIS"
            })
            .to_string()
            .into(),
        ))
        .await
        .unwrap();

        let msg_err2 = ws.next().await.unwrap().unwrap();
        let parsed_err2: Value = serde_json::from_str(msg_err2.to_text().unwrap()).unwrap();
        assert_eq!(parsed_err2["type"], "error");
        assert!(parsed_err2["message"]
            .as_str()
            .unwrap()
            .contains("No se encontró la sala"));
    }
}
