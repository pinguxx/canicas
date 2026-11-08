use rand::RngExt;
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

use crate::canicas::{
    feria_holes, feria_nails, generate_patio_marbles, generate_patio_marbles_with_phase,
    generate_patio_stones, simulate_feria_shot, simulate_patio_shot_with_stones, FeriaHole,
    FeriaNail, FeriaShotSimulation, PatioShotSimulation, PatioStone, TargetMarble, PATIO_CENTER_X,
    PATIO_CENTER_Y, PATIO_SHOOT_RADIUS,
};

pub const PLAYER_COLORS: [&str; 11] = [
    "#06b6d4", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f97316",
    "#14b8a6", "#eab308", "#18181b",
];

pub const PLAYER_AVATARS: [&str; 10] = ["🔮", "🤠", "💀", "🌺", "🦅", "🥊", "🎭", "🌶️", "🎸", "👑"];

pub const BOT_PROFILES: [(&str, &str); 9] = [
    ("🤖 El Chavo Bot", "🧢"),
    ("🤖 Don Ramón Bot", "🤠"),
    ("🤖 Quico Bot", "🔮"),
    ("🤖 La Chilindrina Bot", "🌺"),
    ("🤖 El Santo Bot", "🥊"),
    ("🤖 La Catrina Bot", "💀"),
    ("🤖 Cantinflas Bot", "🎭"),
    ("🤖 Lupita Bot", "🌵"),
    ("🤖 Don Goyo Bot", "🦅"),
];

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameSettings {
    #[serde(default = "default_game_mode")]
    pub game_mode: String, // "feria", "circulo", "hoyita"
    #[serde(default = "default_win_condition")]
    pub win_condition: String, // "rounds" or "target"
    #[serde(default = "default_max_rounds")]
    pub max_rounds: u32, // 3, 5, 8, 10
    #[serde(default = "default_target_score")]
    pub target_score: u32, // 150, 250, 400, 600
    #[serde(default = "default_turn_timer")]
    pub turn_timer_seconds: u64, // 0, 15, 25, 40
    #[serde(default = "default_bonus_shot_rule")]
    pub bonus_shot_rule: bool, // Extra shot on 50+ feria hole or patio knockout/encholada
    #[serde(default = "default_combo_multiplier")]
    pub combo_multiplier: bool, // x2 on occupied hole / golden marble / cazador
    #[serde(default = "default_ponche_steal")]
    pub ponche_steal: bool, // Steal 10 pts when striking rival shooter in patio
    #[serde(default = "default_arena_theme")]
    pub arena_theme: String, // "feria", "patio", "talavera"
}

fn default_game_mode() -> String {
    "feria".to_string()
}
fn default_win_condition() -> String {
    "rounds".to_string()
}
fn default_max_rounds() -> u32 {
    5
}
fn default_target_score() -> u32 {
    250
}
fn default_turn_timer() -> u64 {
    0
}
fn default_bonus_shot_rule() -> bool {
    true
}
fn default_combo_multiplier() -> bool {
    true
}
fn default_ponche_steal() -> bool {
    true
}
fn default_arena_theme() -> String {
    "feria".to_string()
}

impl Default for GameSettings {
    fn default() -> Self {
        Self {
            game_mode: default_game_mode(),
            win_condition: default_win_condition(),
            max_rounds: default_max_rounds(),
            target_score: default_target_score(),
            turn_timer_seconds: default_turn_timer(),
            bonus_shot_rule: default_bonus_shot_rule(),
            combo_multiplier: default_combo_multiplier(),
            ponche_steal: default_ponche_steal(),
            arena_theme: default_arena_theme(),
        }
    }
}

impl GameSettings {
    pub fn sanitized(mut self) -> Self {
        if !matches!(self.game_mode.as_str(), "feria" | "circulo" | "hoyita") {
            self.game_mode = "feria".to_string();
        }
        if !matches!(self.win_condition.as_str(), "rounds" | "target") {
            self.win_condition = "rounds".to_string();
        }
        self.max_rounds = self.max_rounds.clamp(2, 20);
        self.target_score = self.target_score.clamp(80, 2000);
        if self.turn_timer_seconds > 0 {
            self.turn_timer_seconds = self.turn_timer_seconds.clamp(2, 120);
        }
        if !matches!(self.arena_theme.as_str(), "feria" | "patio" | "talavera") {
            self.arena_theme = "feria".to_string();
        }
        self
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct PlayerStats {
    pub shots_taken: u32,
    pub best_shot_points: u32,
    pub marbles_knocked: u32,
    pub jackpots_hit: u32,
    pub ponches_dealt: u32,
    pub combos_hit: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    pub id: String,
    pub name: String,
    pub avatar: String,
    pub color: String,
    pub score: u32,
    pub marbles_captured: u32,
    pub is_cazador: bool,
    pub bonus_shot_pending: bool,
    pub shooter_x: f64,
    pub shooter_y: f64,
    pub connected: bool,
    pub is_host: bool,
    #[serde(default)]
    pub conn_id: String,
    #[serde(default)]
    pub is_bot: bool,
    #[serde(default)]
    pub seat_angle: Option<f64>,
    #[serde(default)]
    pub stats: PlayerStats,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RoomState {
    Lobby,
    Playing,
    Finished,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OccupiedHole {
    pub hole_id: u32,
    pub player_id: String,
    pub player_name: String,
    pub color: String,
    pub points: u32,
}

#[derive(Debug, Clone, Serialize)]
pub struct ShotOutcome {
    pub shot_number: u32,
    pub round_number: u32,
    pub stage: String, // "feria", "circulo", "hoyita"
    pub player_id: String,
    pub player_name: String,
    pub player_avatar: String,
    pub player_color: String,
    pub points_scored: u32,
    pub new_total_score: u32,
    pub earned_bonus_shot: bool,
    pub was_golden_marble: bool,
    pub headline_es: String,
    pub headline_en: String,
    pub dicho_es: String,
    pub dicho_en: String,
    pub feria_sim: Option<FeriaShotSimulation>,
    pub patio_sim: Option<PatioShotSimulation>,
    pub ring_refilled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShotHistoryEntry {
    pub shot_number: u32,
    pub round_number: u32,
    pub stage: String,
    pub player_name: String,
    pub player_avatar: String,
    pub player_color: String,
    pub points_scored: u32,
    pub summary_es: String,
    pub summary_en: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PodiumEntry {
    pub place: u32,
    pub player_id: String,
    pub name: String,
    pub avatar: String,
    pub color: String,
    pub score: u32,
    pub marbles_captured: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatchAward {
    pub id: String,
    pub icon: String,
    pub title_es: String,
    pub title_en: String,
    pub winner_name: String,
    pub winner_avatar: String,
    pub detail_es: String,
    pub detail_en: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct ArenaMetadata {
    pub feria_holes: Vec<FeriaHole>,
    pub feria_nails: Vec<FeriaNail>,
}

impl ArenaMetadata {
    pub fn load() -> Self {
        Self {
            feria_holes: feria_holes(),
            feria_nails: feria_nails(),
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct Room {
    pub code: String,
    pub host_id: String,
    pub state: RoomState,
    pub settings: GameSettings,
    pub players: Vec<Player>,
    pub current_turn_idx: usize,
    pub round_number: u32,
    pub shot_counter: u32,
    pub active_stage: String, // "feria", "circulo", "hoyita"
    pub feria_occupied_holes: Vec<OccupiedHole>,
    pub patio_targets: Vec<TargetMarble>,
    pub patio_stones: Vec<PatioStone>,
    pub last_shot: Option<ShotOutcome>,
    pub history: Vec<ShotHistoryEntry>,
    pub winner_id: Option<String>,
    pub victory_reason_es: Option<String>,
    pub victory_reason_en: Option<String>,
    pub podium: Vec<PodiumEntry>,
    pub awards: Vec<MatchAward>,
    pub turn_deadline_epoch: Option<u64>,
    #[serde(skip)]
    pub last_activity_epoch: u64,
}

pub fn current_epoch_secs() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

pub fn generate_room_code() -> String {
    const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let mut rng = rand::rng();
    (0..6)
        .map(|_| {
            let idx = rng.random_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect()
}

pub fn stage_for_round(game_mode: &str, _round_number: u32) -> String {
    match game_mode {
        "circulo" => "circulo".to_string(),
        "hoyita" => "hoyita".to_string(),
        _ => "feria".to_string(),
    }
}

impl Room {
    pub fn new(code: String, host: Player, settings: GameSettings) -> Self {
        let clean_settings = settings.sanitized();
        let initial_stage = stage_for_round(&clean_settings.game_mode, 1);
        let is_hoyita = initial_stage == "hoyita";
        let initial_targets = generate_patio_marbles(is_hoyita);
        let initial_stones = generate_patio_stones(is_hoyita, 0, 90.0, &initial_targets);
        let host_id = host.id.clone();
        Self {
            code,
            host_id,
            state: RoomState::Lobby,
            settings: clean_settings,
            players: vec![host],
            current_turn_idx: 0,
            round_number: 1,
            shot_counter: 0,
            active_stage: initial_stage,
            feria_occupied_holes: Vec::new(),
            patio_targets: initial_targets,
            patio_stones: initial_stones,
            last_shot: None,
            history: Vec::new(),
            winner_id: None,
            victory_reason_es: None,
            victory_reason_en: None,
            podium: Vec::new(),
            awards: Vec::new(),
            turn_deadline_epoch: None,
            last_activity_epoch: current_epoch_secs(),
        }
    }

    pub fn touch(&mut self) {
        self.last_activity_epoch = current_epoch_secs();
    }

    pub fn current_player(&self) -> Option<&Player> {
        self.players.get(self.current_turn_idx)
    }

    pub fn refresh_turn_deadline(&mut self) {
        if self.state == RoomState::Playing && self.settings.turn_timer_seconds > 0 {
            self.turn_deadline_epoch =
                Some(current_epoch_secs() + self.settings.turn_timer_seconds);
        } else {
            self.turn_deadline_epoch = None;
        }
    }

    pub fn position_shooters_on_perimeter(&mut self) {
        let total = self.players.len().max(1);
        for (i, p) in self.players.iter_mut().enumerate() {
            let deg = (i as f64) * (360.0 / (total as f64)) + 90.0;
            p.seat_angle = Some(deg);
            let rad = deg.to_radians();
            p.shooter_x = (PATIO_CENTER_X + PATIO_SHOOT_RADIUS * rad.cos()).round();
            p.shooter_y = (PATIO_CENTER_Y + PATIO_SHOOT_RADIUS * rad.sin()).round();
        }
    }

    pub fn start_game(&mut self) {
        self.state = RoomState::Playing;
        self.current_turn_idx = 0;
        self.round_number = 1;
        self.shot_counter = 0;
        self.active_stage = stage_for_round(&self.settings.game_mode, 1);
        let is_hoyita = self.active_stage == "hoyita";
        self.feria_occupied_holes.clear();
        self.patio_targets = generate_patio_marbles(is_hoyita);
        self.patio_stones = generate_patio_stones(is_hoyita, 0, 90.0, &self.patio_targets);
        self.last_shot = None;
        self.history.clear();
        self.winner_id = None;
        self.victory_reason_es = None;
        self.victory_reason_en = None;
        self.podium.clear();
        self.awards.clear();

        for p in &mut self.players {
            p.score = 0;
            p.marbles_captured = 0;
            p.is_cazador = false;
            p.bonus_shot_pending = false;
            p.stats = PlayerStats::default();
        }

        self.position_shooters_on_perimeter();
        self.refresh_turn_deadline();
        self.touch();
    }

    pub fn reset_to_lobby(&mut self) {
        self.state = RoomState::Lobby;
        self.current_turn_idx = 0;
        self.round_number = 1;
        self.shot_counter = 0;
        self.active_stage = stage_for_round(&self.settings.game_mode, 1);
        let is_hoyita = self.active_stage == "hoyita";
        self.feria_occupied_holes.clear();
        self.patio_targets = generate_patio_marbles(is_hoyita);
        self.patio_stones = generate_patio_stones(is_hoyita, 0, 90.0, &self.patio_targets);
        self.last_shot = None;
        self.turn_deadline_epoch = None;
        for p in &mut self.players {
            p.score = 0;
            p.marbles_captured = 0;
            p.is_cazador = false;
            p.bonus_shot_pending = false;
            p.stats = PlayerStats::default();
        }
        self.position_shooters_on_perimeter();
        self.touch();
    }

    pub fn add_bot(&mut self) -> Result<Player, &'static str> {
        if self.players.len() >= 10 {
            return Err("La sala está llena (máximo 10 jugadores).");
        }
        let existing_names: Vec<String> = self.players.iter().map(|p| p.name.clone()).collect();
        let (bot_name, bot_avatar) = BOT_PROFILES
            .iter()
            .find(|(n, _)| !existing_names.iter().any(|en| en == *n))
            .copied()
            .unwrap_or(("🤖 Bot Caniquero", "🔮"));

        let used_colors: Vec<String> = self.players.iter().map(|p| p.color.clone()).collect();
        let color = PLAYER_COLORS
            .iter()
            .find(|&&c| !used_colors.iter().any(|uc| uc == c))
            .copied()
            .unwrap_or(PLAYER_COLORS[self.players.len() % PLAYER_COLORS.len()]);

        let bot_id = format!("bot_{}_{}", self.players.len() + 1, generate_room_code());
        let bot = Player {
            id: bot_id,
            name: bot_name.to_string(),
            avatar: bot_avatar.to_string(),
            color: color.to_string(),
            score: 0,
            marbles_captured: 0,
            is_cazador: false,
            bonus_shot_pending: false,
            shooter_x: PATIO_CENTER_X,
            shooter_y: PATIO_CENTER_Y + PATIO_SHOOT_RADIUS,
            connected: true,
            is_host: false,
            conn_id: String::new(),
            is_bot: true,
            seat_angle: None,
            stats: PlayerStats::default(),
        };
        self.players.push(bot.clone());
        self.position_shooters_on_perimeter();
        self.touch();
        Ok(bot)
    }

    pub fn remove_last_bot(&mut self) -> Option<Player> {
        if let Some(pos) = self.players.iter().rposition(|p| p.is_bot) {
            let removed = self.players.remove(pos);
            if self.current_turn_idx >= self.players.len() && !self.players.is_empty() {
                self.current_turn_idx = 0;
            }
            self.position_shooters_on_perimeter();
            self.touch();
            Some(removed)
        } else {
            None
        }
    }

    pub fn execute_shot(
        &mut self,
        player_id: &str,
        raw_power: f64,
        raw_angle: f64,
        raw_spin: f64,
    ) -> Result<ShotOutcome, &'static str> {
        self.execute_shot_with_seat(player_id, raw_power, raw_angle, raw_spin, None)
    }

    pub fn execute_shot_with_seat(
        &mut self,
        player_id: &str,
        raw_power: f64,
        raw_angle: f64,
        raw_spin: f64,
        custom_seat_angle: Option<f64>,
    ) -> Result<ShotOutcome, &'static str> {
        if self.state != RoomState::Playing {
            return Err("La partida no está en curso.");
        }
        let turn_idx = self.current_turn_idx;
        let current = self
            .players
            .get(turn_idx)
            .ok_or("No hay jugador activo en turno.")?;
        if current.id != player_id {
            return Err("No es tu turno de tirar la canica.");
        }

        let p_id = current.id.clone();
        let p_name = current.name.clone();
        let p_avatar = current.avatar.clone();
        let p_color = current.color.clone();
        let was_golden_marble = current.bonus_shot_pending;
        let is_cazador = current.is_cazador;

        self.shot_counter += 1;
        let stage = self.active_stage.clone();
        let total_players = self.players.len().max(1);
        let default_seat_deg = (turn_idx as f64) * (360.0 / (total_players as f64)) + 90.0;
        let seat_angle_deg = custom_seat_angle
            .or(current.seat_angle)
            .filter(|d| d.is_finite())
            .map(|d| d.rem_euclid(360.0))
            .unwrap_or(default_seat_deg);

        let mut points_scored: u32;
        let earned_bonus_shot: bool;
        let mut headline_es: String;
        let mut headline_en: String;
        let dicho_es: String;
        let dicho_en: String;
        let mut feria_sim_opt = None;
        let mut patio_sim_opt = None;
        let mut ring_refilled = false;
        let captured_count_delta: u32;
        let mut hit_jackpot = false;
        let mut ponches_count = 0_u32;
        let mut hit_combo = false;

        if stage == "feria" {
            let occupied_ids: Vec<u32> = self
                .feria_occupied_holes
                .iter()
                .map(|h| h.hole_id)
                .collect();

            let sim = simulate_feria_shot(
                raw_power,
                raw_angle,
                raw_spin,
                &occupied_ids,
                was_golden_marble && self.settings.combo_multiplier,
                self.settings.bonus_shot_rule,
            );

            points_scored = sim.total_points;
            earned_bonus_shot = sim.earned_bonus_shot;
            captured_count_delta = 1;
            if sim.base_points >= 75 {
                hit_jackpot = true;
            }
            if sim.multiplier > 1 {
                hit_combo = true;
            }

            self.feria_occupied_holes.push(OccupiedHole {
                hole_id: sim.hole.id,
                player_id: p_id.clone(),
                player_name: p_name.clone(),
                color: p_color.clone(),
                points: sim.total_points,
            });

            let combo_suffix_es = sim
                .combo_reason_es
                .as_ref()
                .map(|c| format!(" • {}", c))
                .unwrap_or_default();
            let combo_suffix_en = sim
                .combo_reason_en
                .as_ref()
                .map(|c| format!(" • {}", c))
                .unwrap_or_default();

            headline_es = format!(
                "{} ¡{}! +{} pts{}",
                sim.hole.icon, sim.hole.name_es, sim.total_points, combo_suffix_es
            );
            headline_en = format!(
                "{} {}! +{} pts{}",
                sim.hole.icon, sim.hole.name_en, sim.total_points, combo_suffix_en
            );
            dicho_es = sim.hole.dicho_es.to_string();
            dicho_en = sim.hole.dicho_en.to_string();
            feria_sim_opt = Some(sim);
        } else {
            // Patio Mode: "circulo" or "hoyita"
            let mut rivals: Vec<(String, f64, f64, String)> = self
                .players
                .iter()
                .enumerate()
                .filter(|(idx, _)| *idx != turn_idx)
                .map(|(_, rp)| (rp.id.clone(), rp.shooter_x, rp.shooter_y, rp.color.clone()))
                .collect();

            let sim = simulate_patio_shot_with_stones(
                &stage,
                seat_angle_deg,
                &p_color,
                is_cazador && self.settings.combo_multiplier,
                raw_power,
                raw_angle,
                raw_spin,
                &mut self.patio_targets,
                &mut rivals,
                &self.patio_stones,
                self.settings.bonus_shot_rule && !was_golden_marble,
            );

            points_scored = sim.points_scored;
            if was_golden_marble && self.settings.combo_multiplier && points_scored > 0 {
                points_scored += 15; // Bonus golden follow-up boost
                hit_combo = true;
            }

            earned_bonus_shot = sim.earned_bonus_shot;
            captured_count_delta = sim.captured_ids.len() as u32 + u32::from(sim.encholada_hoyita);
            if sim.encholada_hoyita || sim.points_scored >= 50 {
                hit_jackpot = true;
            }
            ponches_count = sim.ponchados_player_ids.len() as u32;

            // Update rival shooter positions and apply optional Ponche point steal
            for (rpid, rx, ry, _) in &rivals {
                if let Some(rp) = self.players.iter_mut().find(|p| p.id == *rpid) {
                    rp.shooter_x = *rx;
                    rp.shooter_y = *ry;
                }
            }

            if self.settings.ponche_steal && !sim.ponchados_player_ids.is_empty() {
                let mut stolen_total = 0_u32;
                for struck_id in &sim.ponchados_player_ids {
                    if let Some(victim) = self.players.iter_mut().find(|p| p.id == *struck_id) {
                        let steal = victim.score.min(10);
                        victim.score = victim.score.saturating_sub(steal);
                        stolen_total += steal;
                    }
                }
                points_scored += stolen_total;
            }

            // Update active player's shooter position & Cazador status
            if let Some(me) = self.players.get_mut(turn_idx) {
                me.shooter_x = sim.shooter_final_x;
                me.shooter_y = sim.shooter_final_y;
                if sim.encholada_hoyita {
                    me.is_cazador = true;
                }
            }

            headline_es = sim.headline_es.clone();
            headline_en = sim.headline_en.clone();
            dicho_es = sim.dicho_es.clone();
            dicho_en = sim.dicho_en.clone();

            // Refill the ring automatically as soon as <= 4 marbles remain so the arena is never sparse!
            let remaining_active = self.patio_targets.iter().filter(|m| m.active).count();
            if remaining_active <= 4 {
                let phase = (self.shot_counter as f64) * 53.0;
                self.patio_targets = generate_patio_marbles_with_phase(stage == "hoyita", phase);
                ring_refilled = true;
                if !sim.captured_ids.is_empty() {
                    points_scored += 15;
                    headline_es.push_str(" • 🌊 ¡Nueva tanda (+15)!");
                    headline_en.push_str(" • 🌊 New wave (+15)!");
                }
            }

            patio_sim_opt = Some(sim);
        }

        // Update player score & telemetry stats
        let new_total_score = {
            let me = &mut self.players[turn_idx];
            me.score += points_scored;
            me.marbles_captured += captured_count_delta;
            me.stats.shots_taken += 1;
            if points_scored > me.stats.best_shot_points {
                me.stats.best_shot_points = points_scored;
            }
            me.stats.marbles_knocked += captured_count_delta;
            if hit_jackpot {
                me.stats.jackpots_hit += 1;
            }
            me.stats.ponches_dealt += ponches_count;
            if hit_combo {
                me.stats.combos_hit += 1;
            }
            me.bonus_shot_pending = earned_bonus_shot;
            me.score
        };

        let outcome = ShotOutcome {
            shot_number: self.shot_counter,
            round_number: self.round_number,
            stage: stage.clone(),
            player_id: p_id.clone(),
            player_name: p_name.clone(),
            player_avatar: p_avatar.clone(),
            player_color: p_color.clone(),
            points_scored,
            new_total_score,
            earned_bonus_shot,
            was_golden_marble,
            headline_es: headline_es.clone(),
            headline_en: headline_en.clone(),
            dicho_es,
            dicho_en,
            feria_sim: feria_sim_opt,
            patio_sim: patio_sim_opt,
            ring_refilled,
        };

        self.history.insert(
            0,
            ShotHistoryEntry {
                shot_number: self.shot_counter,
                round_number: self.round_number,
                stage,
                player_name: p_name,
                player_avatar: p_avatar,
                player_color: p_color,
                points_scored,
                summary_es: headline_es,
                summary_en: headline_en,
            },
        );
        if self.history.len() > 40 {
            self.history.truncate(40);
        }

        self.last_shot = Some(outcome.clone());

        // Check if target score win condition is met immediately
        if self.settings.win_condition == "target" && new_total_score >= self.settings.target_score
        {
            self.finish_game(
                Some(p_id),
                format!(
                    "¡Alcanzó la meta de {} puntos con {} pts!",
                    self.settings.target_score, new_total_score
                ),
                format!(
                    "Reached the {} point target with {} pts!",
                    self.settings.target_score, new_total_score
                ),
            );
            return Ok(outcome);
        }

        // Advance turn if player didn't earn an immediate bonus shot
        if !earned_bonus_shot {
            let next_idx = (self.current_turn_idx + 1) % self.players.len().max(1);
            if next_idx == 0 {
                // Completed a full table orbit (round)
                if self.settings.win_condition == "rounds"
                    && self.round_number >= self.settings.max_rounds
                {
                    self.finish_by_highest_score();
                    return Ok(outcome);
                }
                self.round_number += 1;
                let next_stage = stage_for_round(&self.settings.game_mode, self.round_number);
                if next_stage != self.active_stage {
                    self.active_stage = next_stage.clone();
                    let is_hoyita = next_stage == "hoyita";
                    self.patio_targets = generate_patio_marbles(is_hoyita);
                    self.position_shooters_on_perimeter();
                }
                // Clear Feria holes between rounds so the board is fresh for the new round
                self.feria_occupied_holes.clear();
            }
            self.current_turn_idx = next_idx;
        }

        // Re-randomize courtyard rocks after EVERY shot and block the straight line for the NEXT shooter!
        if self.active_stage != "feria" {
            let is_hoyita = self.active_stage == "hoyita";
            let next_seat_deg = if earned_bonus_shot {
                seat_angle_deg
            } else {
                let total = self.players.len().max(1);
                let default_deg = (self.current_turn_idx as f64) * (360.0 / (total as f64)) + 90.0;
                self.current_player().and_then(|p| p.seat_angle).unwrap_or(default_deg)
            };
            self.patio_stones = generate_patio_stones(
                is_hoyita,
                self.shot_counter,
                next_seat_deg,
                &self.patio_targets,
            );
        }

        self.refresh_turn_deadline();
        self.touch();
        Ok(outcome)
    }

    pub fn finish_by_highest_score(&mut self) {
        let mut sorted = self.players.clone();
        sorted.sort_by(|a, b| {
            b.score
                .cmp(&a.score)
                .then_with(|| b.marbles_captured.cmp(&a.marbles_captured))
                .then_with(|| b.stats.best_shot_points.cmp(&a.stats.best_shot_points))
        });

        let winner = sorted.first().cloned();
        if let Some(w) = winner {
            let reason_es = format!(
                "¡Campeón tras {} rondas con {} puntos y {} canicas!",
                self.settings.max_rounds, w.score, w.marbles_captured
            );
            let reason_en = format!(
                "Champion after {} rounds with {} points and {} marbles!",
                self.settings.max_rounds, w.score, w.marbles_captured
            );
            self.finish_game(Some(w.id), reason_es, reason_en);
        }
    }

    pub fn finish_game(&mut self, winner_id: Option<String>, reason_es: String, reason_en: String) {
        self.state = RoomState::Finished;
        self.winner_id = winner_id;
        self.victory_reason_es = Some(reason_es);
        self.victory_reason_en = Some(reason_en);
        self.turn_deadline_epoch = None;

        let mut ranked = self.players.clone();
        ranked.sort_by(|a, b| {
            b.score
                .cmp(&a.score)
                .then_with(|| b.marbles_captured.cmp(&a.marbles_captured))
                .then_with(|| b.stats.best_shot_points.cmp(&a.stats.best_shot_points))
        });

        self.podium = ranked
            .iter()
            .take(3)
            .enumerate()
            .map(|(i, p)| PodiumEntry {
                place: (i + 1) as u32,
                player_id: p.id.clone(),
                name: p.name.clone(),
                avatar: p.avatar.clone(),
                color: p.color.clone(),
                score: p.score,
                marbles_captured: p.marbles_captured,
            })
            .collect();

        self.awards = self.compute_awards(&ranked);
        self.touch();
    }

    fn compute_awards(&self, ranked: &[Player]) -> Vec<MatchAward> {
        let mut awards = Vec::new();
        if ranked.is_empty() {
            return awards;
        }

        // 1. Francotirador / Mano Santa (Best single shot score)
        if let Some(best_shot_p) = ranked
            .iter()
            .max_by_key(|p| (p.stats.best_shot_points, p.score))
        {
            awards.push(MatchAward {
                id: "sniper".to_string(),
                icon: "🎯".to_string(),
                title_es: "Mano Santa (Mejor Tiro)".to_string(),
                title_en: "Golden Thumb (Best Shot)".to_string(),
                winner_name: best_shot_p.name.clone(),
                winner_avatar: best_shot_p.avatar.clone(),
                detail_es: format!(
                    "{} pts en una sola tirada",
                    best_shot_p.stats.best_shot_points
                ),
                detail_en: format!(
                    "{} pts in a single shot",
                    best_shot_p.stats.best_shot_points
                ),
            });
        }

        // 2. Terror del Ruedo (Most marbles captured / holes hit)
        if let Some(collector) = ranked
            .iter()
            .max_by_key(|p| (p.marbles_captured, p.stats.marbles_knocked))
        {
            awards.push(MatchAward {
                id: "collector".to_string(),
                icon: "🔮".to_string(),
                title_es: "Terror del Ruedo".to_string(),
                title_en: "Ring Dominator".to_string(),
                winner_name: collector.name.clone(),
                winner_avatar: collector.avatar.clone(),
                detail_es: format!("{} canicas / hoyitos ganados", collector.marbles_captured),
                detail_en: format!("{} marbles / holes won", collector.marbles_captured),
            });
        }

        // 3. Rey del Gallo y la Hoyita (Most jackpots hit)
        if let Some(jackpot_p) = ranked
            .iter()
            .max_by_key(|p| (p.stats.jackpots_hit, p.score))
        {
            awards.push(MatchAward {
                id: "jackpot".to_string(),
                icon: "👑".to_string(),
                title_es: "Maestro Encholador".to_string(),
                title_en: "Jackpot Master".to_string(),
                winner_name: jackpot_p.name.clone(),
                winner_avatar: jackpot_p.avatar.clone(),
                detail_es: format!(
                    "{} tiros mayores / encholadas",
                    jackpot_p.stats.jackpots_hit
                ),
                detail_en: format!("{} jackpots / pit sinkings", jackpot_p.stats.jackpots_hit),
            });
        }

        // 4. El Ponchador / Combo Master
        if let Some(brawler) = ranked
            .iter()
            .max_by_key(|p| (p.stats.ponches_dealt + p.stats.combos_hit, p.score))
        {
            let total_specials = brawler.stats.ponches_dealt + brawler.stats.combos_hit;
            awards.push(MatchAward {
                id: "ponchador".to_string(),
                icon: "💥".to_string(),
                title_es: "Rey del Ponche y Combo".to_string(),
                title_en: "Strike & Combo King".to_string(),
                winner_name: brawler.name.clone(),
                winner_avatar: brawler.avatar.clone(),
                detail_es: format!("{} ponches y combos dobles", total_specials),
                detail_en: format!("{} rival strikes & double combos", total_specials),
            });
        }

        awards
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_host() -> Player {
        Player {
            id: "p1".to_string(),
            name: "Ivan".to_string(),
            avatar: "🔮".to_string(),
            color: "#06b6d4".to_string(),
            score: 0,
            marbles_captured: 0,
            is_cazador: false,
            bonus_shot_pending: false,
            shooter_x: 500.0,
            shooter_y: 915.0,
            connected: true,
            is_host: true,
            conn_id: "c1".to_string(),
            is_bot: false,
            seat_angle: None,
            stats: PlayerStats::default(),
        }
    }

    #[test]
    fn test_room_lifecycle_and_fixed_selected_game_mode() {
        let settings = GameSettings {
            game_mode: "feria".to_string(),
            max_rounds: 3,
            bonus_shot_rule: false, // Disable bonus shot for deterministic turn advance test
            ..Default::default()
        };

        let mut room = Room::new("CANI26".to_string(), sample_host(), settings);
        room.add_bot().unwrap();
        assert_eq!(room.players.len(), 2);

        room.start_game();
        assert_eq!(room.state, RoomState::Playing);
        assert_eq!(room.active_stage, "feria");

        // Round 1: Player 1 and Bot shoot in Feria
        let p1_id = room.players[0].id.clone();
        let p2_id = room.players[1].id.clone();
        let out1 = room.execute_shot(&p1_id, 0.7, 0.0, 0.0).unwrap();
        assert_eq!(out1.stage, "feria");
        assert!(out1.points_scored >= 10);

        let _out2 = room.execute_shot(&p2_id, 0.65, 0.1, -0.1).unwrap();
        // Round 2 stays in Feria (never switches to another game type!)
        assert_eq!(room.round_number, 2);
        assert_eq!(room.active_stage, "feria");

        let out3 = room.execute_shot(&p1_id, 0.85, 0.0, 0.0).unwrap();
        assert_eq!(out3.stage, "feria");
        let _out4 = room.execute_shot(&p2_id, 0.80, 0.0, 0.0).unwrap();

        // Round 3 stays in Feria
        assert_eq!(room.round_number, 3);
        assert_eq!(room.active_stage, "feria");

        let _out5 = room.execute_shot(&p1_id, 0.55, 0.0, 0.0).unwrap();
        let _out6 = room.execute_shot(&p2_id, 0.60, 0.0, 0.0).unwrap();

        // After 3 rounds, game finishes with podium and 4 awards
        assert_eq!(room.state, RoomState::Finished);
        assert!(!room.podium.is_empty());
        assert_eq!(room.awards.len(), 4);
    }
}
