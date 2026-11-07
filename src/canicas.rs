use rand::RngExt;
use serde::{Deserialize, Serialize};
use std::f64::consts::PI;

// ============================================================================
// 1. FERIA BOARD (TABLERO DE CLAVOS Y HOYITOS) DEFINITIONS
// ============================================================================

#[derive(Debug, Clone, Serialize)]
pub struct FeriaHole {
    pub id: u32,
    pub x: f64,
    pub y: f64,
    pub radius: f64,
    pub points: u32,
    pub tier: &'static str,
    pub icon: &'static str,
    pub name_es: &'static str,
    pub name_en: &'static str,
    pub dicho_es: &'static str,
    pub dicho_en: &'static str,
    pub color: &'static str,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FeriaNail {
    pub id: u32,
    pub x: f64,
    pub y: f64,
    pub radius: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrajectoryPoint {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PinHitEvent {
    pub step: u32,
    pub nail_id: u32,
    pub x: f64,
    pub y: f64,
    pub intensity: f64,
}

#[derive(Debug, Clone, Serialize)]
pub struct FeriaShotSimulation {
    pub power: f64,
    pub angle: f64,
    pub spin: f64,
    pub tier: String,
    pub hole: FeriaHole,
    pub base_points: u32,
    pub multiplier: u32,
    pub total_points: u32,
    pub combo_reason_es: Option<String>,
    pub combo_reason_en: Option<String>,
    pub earned_bonus_shot: bool,
    pub path: Vec<TrajectoryPoint>,
    pub pin_hits: Vec<PinHitEvent>,
}

pub fn feria_holes() -> Vec<FeriaHole> {
    vec![
        FeriaHole {
            id: 1,
            x: 468.0,
            y: 235.0,
            radius: 31.0,
            points: 100,
            tier: "oro",
            icon: "👑",
            name_es: "El Gallo de Oro",
            name_en: "The Golden Rooster",
            dicho_es: "«¡Cien puntos al Gallo de Oro, te llevaste el premio mayor de la feria!»",
            dicho_en: "\"100 points in the Golden Rooster, you won the grand carnival prize!\"",
            color: "#f59e0b",
        },
        FeriaHole {
            id: 2,
            x: 255.0,
            y: 305.0,
            radius: 30.0,
            points: 75,
            tier: "diamante",
            icon: "💎",
            name_es: "La Corona Real",
            name_en: "The Royal Crown",
            dicho_es: "«¡Tiro de maestro directo a la Corona Real!»",
            dicho_en: "\"Master shot straight into the Royal Crown!\"",
            color: "#06b6d4",
        },
        FeriaHole {
            id: 3,
            x: 680.0,
            y: 305.0,
            radius: 30.0,
            points: 75,
            tier: "diamante",
            icon: "🌟",
            name_es: "Estrella Azteca",
            name_en: "Aztec Star",
            dicho_es: "«¡Brilló la Estrella Azteca con setenta y cinco tantos!»",
            dicho_en: "\"The Aztec Star shone bright for 75 points!\"",
            color: "#06b6d4",
        },
        FeriaHole {
            id: 4,
            x: 355.0,
            y: 440.0,
            radius: 30.0,
            points: 50,
            tier: "fuego",
            icon: "☀️",
            name_es: "El Sol",
            name_en: "The Sun",
            dicho_es: "«¡Como el sol de mediodía, cincuenta puntos al bolsillo!»",
            dicho_en: "\"Like the midday sun, fifty points in your pocket!\"",
            color: "#ef4444",
        },
        FeriaHole {
            id: 5,
            x: 580.0,
            y: 440.0,
            radius: 30.0,
            points: 50,
            tier: "fuego",
            icon: "🔥",
            name_es: "ElDiablo",
            name_en: "The Fire Devil",
            dicho_es: "«¡Canica encendida, cayó en el hoyito de cincuenta!»",
            dicho_en: "\"Blazing marble, right into the 50-point hole!\"",
            color: "#ef4444",
        },
        FeriaHole {
            id: 6,
            x: 468.0,
            y: 565.0,
            radius: 30.0,
            points: 50,
            tier: "fuego",
            icon: "🌙",
            name_es: "La Luna",
            name_en: "The Moon",
            dicho_es: "«¡Por el centro del tablero, La Luna te da cincuenta!»",
            dicho_en: "\"Right down the center, The Moon grants you fifty!\"",
            color: "#ec4899",
        },
        FeriaHole {
            id: 7,
            x: 185.0,
            y: 565.0,
            radius: 29.0,
            points: 30,
            tier: "esmeralda",
            icon: "🔔",
            name_es: "La Campana",
            name_en: "The Bell",
            dicho_es: "«¡Suena la campana de la kermés con treinta puntos!»",
            dicho_en: "\"The fairground bell rings for thirty points!\"",
            color: "#10b981",
        },
        FeriaHole {
            id: 8,
            x: 750.0,
            y: 565.0,
            radius: 29.0,
            points: 30,
            tier: "esmeralda",
            icon: "❤️",
            name_es: "El Corazón",
            name_en: "The Heart",
            dicho_es: "«¡Directo al Corazón, treinta buenos tantos!»",
            dicho_en: "\"Straight to the Heart, thirty solid points!\"",
            color: "#10b981",
        },
        FeriaHole {
            id: 9,
            x: 310.0,
            y: 695.0,
            radius: 29.0,
            points: 30,
            tier: "esmeralda",
            icon: "🦜",
            name_es: "El Perico",
            name_en: "The Parrot",
            dicho_es: "«¡Cantó el perico verde, treinta puntos seguros!»",
            dicho_en: "\"The green parrot sang, thirty safe points!\"",
            color: "#10b981",
        },
        FeriaHole {
            id: 10,
            x: 625.0,
            y: 695.0,
            radius: 29.0,
            points: 30,
            tier: "esmeralda",
            icon: "🎸",
            name_es: "El Mariachi",
            name_en: "The Mariachi",
            dicho_es: "«¡Con música de mariachi sumas treinta al marcador!»",
            dicho_en: "\"With mariachi music you add thirty to the scoreboard!\"",
            color: "#10b981",
        },
        FeriaHole {
            id: 11,
            x: 170.0,
            y: 825.0,
            radius: 29.0,
            points: 20,
            tier: "barrio",
            icon: "🍉",
            name_es: "La Sandía",
            name_en: "The Watermelon",
            dicho_es: "«¡Fresca la sandía, veinte puntos bien ganados!»",
            dicho_en: "\"Fresh watermelon, twenty points well earned!\"",
            color: "#3b82f6",
        },
        FeriaHole {
            id: 12,
            x: 368.0,
            y: 825.0,
            radius: 29.0,
            points: 20,
            tier: "barrio",
            icon: "🌵",
            name_es: "El Nopal",
            name_en: "The Cactus",
            dicho_es: "«¡Sin espinarse en los clavos, veinte puntos al Nopal!»",
            dicho_en: "\"Dodging the brass nails, twenty points in The Cactus!\"",
            color: "#3b82f6",
        },
        FeriaHole {
            id: 13,
            x: 568.0,
            y: 825.0,
            radius: 29.0,
            points: 20,
            tier: "barrio",
            icon: "🌶️",
            name_es: "El Chile",
            name_en: "The Chili Pepper",
            dicho_es: "«¡Picosito pero sabroso, veinte tantos más!»",
            dicho_en: "\"Spicy and sweet, twenty more points!\"",
            color: "#3b82f6",
        },
        FeriaHole {
            id: 14,
            x: 765.0,
            y: 825.0,
            radius: 29.0,
            points: 20,
            tier: "barrio",
            icon: "🏺",
            name_es: "El Jarrito",
            name_en: "The Clay Pitcher",
            dicho_es: "«¡Adentro del Jarrito de barro, veinte puntos!»",
            dicho_en: "\"Inside the clay pitcher, twenty points!\"",
            color: "#3b82f6",
        },
        FeriaHole {
            id: 15,
            x: 468.0,
            y: 955.0,
            radius: 29.0,
            points: 20,
            tier: "barrio",
            icon: "🌺",
            name_es: "La Dalia",
            name_en: "The Dahlia",
            dicho_es: "«¡En la flor nacional, veinte puntos para tu cuenta!»",
            dicho_en: "\"In the national flower, twenty points for your tally!\"",
            color: "#3b82f6",
        },
        FeriaHole {
            id: 16,
            x: 155.0,
            y: 1085.0,
            radius: 29.0,
            points: 10,
            tier: "madera",
            icon: "🪙",
            name_es: "El Quinto",
            name_en: "The Nickel",
            dicho_es: "«¡De diez en diez se llena el jarrito!»",
            dicho_en: "\"Ten by ten fills the pitcher!\"",
            color: "#a855f7",
        },
        FeriaHole {
            id: 17,
            x: 312.0,
            y: 1085.0,
            radius: 29.0,
            points: 10,
            tier: "madera",
            icon: "💀",
            name_es: "La Calavera",
            name_en: "The Sugar Skull",
            dicho_es: "«¡La Calaverita de azúcar te regala diez puntos!»",
            dicho_en: "\"The sugar skull treats you to ten points!\"",
            color: "#a855f7",
        },
        FeriaHole {
            id: 18,
            x: 468.0,
            y: 1085.0,
            radius: 29.0,
            points: 10,
            tier: "madera",
            icon: "🤠",
            name_es: "El Charro",
            name_en: "The Charro",
            dicho_es: "«¡Con sombrero ancho, diez puntos al Charro!»",
            dicho_en: "\"With a wide sombrero, ten points in The Charro!\"",
            color: "#a855f7",
        },
        FeriaHole {
            id: 19,
            x: 625.0,
            y: 1085.0,
            radius: 29.0,
            points: 10,
            tier: "madera",
            icon: "🐸",
            name_es: "La Rana",
            name_en: "The Frog",
            dicho_es: "«¡Brincó la canica hasta La Rana, diez tantos!»",
            dicho_en: "\"The marble hopped into The Frog, ten points!\"",
            color: "#a855f7",
        },
        FeriaHole {
            id: 20,
            x: 780.0,
            y: 1085.0,
            radius: 29.0,
            points: 10,
            tier: "madera",
            icon: "🎺",
            name_es: "La Trompeta",
            name_en: "The Trumpet",
            dicho_es: "«¡Al final del tablero pero nunca en cero: diez puntos!»",
            dicho_en: "\"At the bottom of the board but never zero: ten points!\"",
            color: "#a855f7",
        },
    ]
}

pub fn feria_nails() -> Vec<FeriaNail> {
    let holes = feria_holes();
    let mut nails: Vec<FeriaNail> = Vec::new();
    let mut id_counter = 1;

    let can_place_nail = |nx: f64, ny: f64, existing: &[FeriaNail]| -> bool {
        let too_close_to_hole = holes
            .iter()
            .any(|h| ((h.x - nx).powi(2) + (h.y - ny).powi(2)).sqrt() < h.radius + 30.0);
        let too_close_to_nail = existing
            .iter()
            .any(|n| ((n.x - nx).powi(2) + (n.y - ny).powi(2)).sqrt() < 64.0);
        !too_close_to_hole && !too_close_to_nail
    };

    // 1. Wide flanking shoulder pegs beside the top jackpot holes (leaving a wide 95px+ top funnel opening)
    let guarded_centers = [
        (468.0, 235.0, 62.0),
        (255.0, 305.0, 62.0),
        (680.0, 305.0, 62.0),
        (355.0, 440.0, 62.0),
        (580.0, 440.0, 62.0),
        (468.0, 565.0, 62.0),
    ];
    for (cx, cy, r) in guarded_centers {
        for deg in [-150.0_f64, -30.0] {
            let rad = deg.to_radians();
            let nx = (cx + r * rad.cos()).round();
            let ny = (cy + r * rad.sin()).round();
            if can_place_nail(nx, ny, &nails) {
                nails.push(FeriaNail {
                    id: id_counter,
                    x: nx,
                    y: ny,
                    radius: 5.0,
                });
                id_counter += 1;
            }
        }
    }

    // 2. Staggered lattice rows across the board with >= 64px minimum spacing so a marble can never wedge
    let row_ys = [175.0, 265.0, 370.0, 495.0, 625.0, 755.0, 885.0, 995.0];
    for (row_idx, &ry) in row_ys.iter().enumerate() {
        let count = if row_idx % 2 == 0 { 7 } else { 6 };
        let start_x = if row_idx % 2 == 0 { 145.0 } else { 198.0 };
        let step_x = 108.0;
        for i in 0..count {
            let nx = start_x + (i as f64) * step_x;
            if can_place_nail(nx, ry, &nails) {
                nails.push(FeriaNail {
                    id: id_counter,
                    x: nx,
                    y: ry,
                    radius: 5.0,
                });
                id_counter += 1;
            }
        }
    }

    nails
}

pub fn simulate_feria_shot(
    raw_power: f64,
    raw_angle: f64,
    raw_spin: f64,
    occupied_hole_ids: &[u32],
    is_golden_marble: bool,
    bonus_shot_rule: bool,
) -> FeriaShotSimulation {
    let mut rng = rand::rng();
    let power = raw_power.clamp(0.10, 1.0);
    let angle = raw_angle.clamp(-1.0, 1.0);
    let spin = raw_spin.clamp(-1.0, 1.0);

    let tier = if power < 0.42 {
        "suave".to_string()
    } else if power < 0.78 {
        "fuerte".to_string()
    } else {
        "turbo".to_string()
    };

    let holes = feria_holes();
    let nails = feria_nails();

    let mut path = Vec::with_capacity(180);
    let mut pin_hits = Vec::new();

    // Phase 1A: Plunger channel launch (x = 908, y: 1120 -> 220)
    for i in 0..16 {
        let frac = (i as f64) / 15.0;
        let y = 1120.0 - frac * 900.0;
        path.push(TrajectoryPoint {
            x: 908.0,
            y: (y * 10.0).round() / 10.0,
        });
    }

    // Phase 1B: Top wooden arch exit point depends on launch power & angle flap
    let jitter: f64 = rng.random_range(-22.0..22.0);
    let target_entry_x = (760.0 - power * 520.0 + angle * 135.0 + jitter).clamp(165.0, 775.0);

    for i in 1..=14 {
        let frac = (i as f64) / 14.0;
        let ease = 1.0 - (1.0 - frac).powi(2);
        let arch_x = 908.0 - (908.0 - target_entry_x) * ease;
        let arch_y = 220.0 - (frac * PI).sin() * 88.0 - frac * 68.0;
        path.push(TrajectoryPoint {
            x: (arch_x * 10.0).round() / 10.0,
            y: (arch_y * 10.0).round() / 10.0,
        });
    }

    // Phase 2: Tilted pinball board descent (continuous downward roll, zero stalling, zero teleporting)
    let mut x = target_entry_x;
    let mut y = 152.0;
    let mut vx = angle * 3.4 - power * 1.1 + rng.random_range(-1.2..1.2);
    let mut vy = 3.2 + power * 1.4;
    let marble_r = 13.5;

    let mut captured_hole: Option<FeriaHole> = None;

    for _sim_step in 0..320 {
        let step_idx = path.len() as u32;
        // Gravity down the tilted wooden board + subtle chanfle spin curve
        vy = (vy + 0.24).clamp(2.2, 7.2);
        vx = (vx + spin * 0.08) * 0.96;
        vx = vx.clamp(-5.8, 5.8);

        x += vx;
        y += vy;

        // Board side rail rebounds
        if x < 118.0 {
            x = 118.0;
            vx = vx.abs() * 0.75 + 1.4;
        } else if x > 818.0 {
            x = 818.0;
            vx = -vx.abs() * 0.75 - 1.4;
        }

        // Check collisions with brass nails: rolling marble glides smoothly around the nail's circular arc
        for nail in &nails {
            let dx = x - nail.x;
            let dy = y - nail.y;
            let dist = (dx * dx + dy * dy).sqrt();
            let min_dist = marble_r + nail.radius;
            if dist < min_dist {
                let side = if dx.abs() > 0.5 {
                    dx.signum()
                } else if spin.abs() > 0.05 {
                    spin.signum()
                } else if rng.random_bool(0.5) {
                    1.0
                } else {
                    -1.0
                };

                let cur_ang = dy.atan2(dx);
                let new_ang = if side > 0.0 {
                    (cur_ang + 0.34).min(0.45)
                } else {
                    (cur_ang - 0.34).max(-PI - 0.45)
                };
                let safe_r = min_dist + 0.8;
                x = (nail.x + safe_r * new_ang.cos()).clamp(118.0, 818.0);
                y = (nail.y + safe_r * new_ang.sin()).max(y + 1.4);
                vx = side * rng.random_range(2.6..3.8);
                vy = (vy * 0.82).clamp(2.2, 5.2);

                let intensity = ((vx.abs() + vy) / 8.5).clamp(0.3, 1.0);
                pin_hits.push(PinHitEvent {
                    step: step_idx,
                    nail_id: nail.id,
                    x: nail.x,
                    y: nail.y,
                    intensity: (intensity * 100.0).round() / 100.0,
                });
            }
        }

        // Bottom wooden lane dividers funnel marbles at the bottom apron (y >= 995) into their lane's bottom hole
        if y >= 995.0 {
            if let Some(bottom_hole) = holes.iter().filter(|h| h.y >= 1050.0).min_by(|a, b| {
                (a.x - x)
                    .abs()
                    .partial_cmp(&(b.x - x).abs())
                    .unwrap_or(std::cmp::Ordering::Equal)
            }) {
                let bdx = bottom_hole.x - x;
                let bdy = (bottom_hole.y - y).max(1.5);
                let bdist = (bdx * bdx + bdy * bdy).sqrt().max(1.0);
                vx = vx * 0.55 + (bdx / bdist) * 3.4;
                vy = (vy * 0.65 + (bdy / bdist) * 2.2).clamp(1.8, 4.8);
            }
            if y > 1088.0 {
                y = 1088.0;
            }
        }

        // Check hole capture wells
        for hole in &holes {
            let dx = hole.x - x;
            let dy = hole.y - y;
            let dist = (dx * dx + dy * dy).sqrt();

            // Beveled wooden rim pulls nearby marbles toward the cup center
            if dist < hole.radius + 14.0 {
                let pull = if hole.y >= 1050.0 { 1.65 } else { 0.95 };
                vx = vx * 0.74 + (dx / dist.max(1.0)) * pull;
                if dy > 0.0 {
                    vy = (vy * 0.78 + (dy / dist.max(1.0)) * pull).clamp(1.8, 5.2);
                }
            }

            // Capture inside hole rim (marble is already physically inside the hole!)
            if dist < hole.radius * 0.74 {
                captured_hole = Some(hole.clone());
                break;
            }
        }

        path.push(TrajectoryPoint {
            x: (x * 10.0).round() / 10.0,
            y: (y * 10.0).round() / 10.0,
        });

        if captured_hole.is_some() {
            break;
        }
    }

    let final_hole = captured_hole.unwrap_or_else(|| {
        holes
            .iter()
            .min_by(|a, b| {
                let da = (a.x - x).powi(2) + (a.y - y).powi(2);
                let db = (b.x - x).powi(2) + (b.y - y).powi(2);
                da.partial_cmp(&db).unwrap_or(std::cmp::Ordering::Equal)
            })
            .cloned()
            .unwrap_or_else(|| holes.last().unwrap().clone())
    });

    // Smooth final cup settle inside the rim of `final_hole`
    let last_pt = path.last().cloned().unwrap_or(TrajectoryPoint {
        x: final_hole.x,
        y: final_hole.y,
    });
    for i in 1..=6 {
        let frac = (i as f64) / 6.0;
        let sx = last_pt.x + (final_hole.x - last_pt.x) * frac;
        let sy = last_pt.y + (final_hole.y - last_pt.y) * frac;
        path.push(TrajectoryPoint {
            x: (sx * 10.0).round() / 10.0,
            y: (sy * 10.0).round() / 10.0,
        });
    }

    let base_points = final_hole.points;
    let mut multiplier = 1;
    let mut combo_reasons_es = Vec::new();
    let mut combo_reasons_en = Vec::new();

    if is_golden_marble {
        multiplier *= 2;
        combo_reasons_es.push("🌟 Canica de Oro (Puntos x2)".to_string());
        combo_reasons_en.push("🌟 Golden Marble (2x Points)".to_string());
    }

    if occupied_hole_ids.contains(&final_hole.id) {
        multiplier *= 2;
        combo_reasons_es.push("🔥 ¡Doble Canica en el Mismo Hoyito! (Combo x2)".to_string());
        combo_reasons_en.push("🔥 Double Marble in the Same Hole! (2x Combo)".to_string());
    }

    let total_points = base_points * multiplier;
    let earned_bonus_shot = bonus_shot_rule && base_points >= 50 && !is_golden_marble;

    FeriaShotSimulation {
        power,
        angle,
        spin,
        tier,
        hole: final_hole,
        base_points,
        multiplier,
        total_points,
        combo_reason_es: if combo_reasons_es.is_empty() {
            None
        } else {
            Some(combo_reasons_es.join(" + "))
        },
        combo_reason_en: if combo_reasons_en.is_empty() {
            None
        } else {
            Some(combo_reasons_en.join(" + "))
        },
        earned_bonus_shot,
        path,
        pin_hits,
    }
}

// ============================================================================
// 2. PATIO ARENA (EL CÍRCULO / LA RUEDA & LA HOYITA / EL POCHITO)
// ============================================================================

pub const PATIO_CENTER_X: f64 = 500.0;
pub const PATIO_CENTER_Y: f64 = 500.0;
pub const PATIO_RING_RADIUS: f64 = 230.0;
pub const PATIO_SHOOT_RADIUS: f64 = 415.0;
pub const PATIO_HOYITA_RADIUS: f64 = 38.0;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TargetMarble {
    pub id: u32,
    pub x: f64,
    pub y: f64,
    pub radius: f64,
    pub points: u32,
    pub kind: String, // "rey", "lechera", "aguita"
    pub color: String,
    pub active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarblePath {
    pub id: String, // "shooter", "target_1", or player_id
    pub color: String,
    pub kind: String,
    pub radius: f64,
    pub captured: bool,
    pub encholada: bool,
    pub points: Vec<TrajectoryPoint>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CollisionEvent {
    pub step: u32,
    pub x: f64,
    pub y: f64,
    pub intensity: f64,
    pub kind: String, // "target", "rival", "hoyita"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatioShotSimulation {
    pub mode: String, // "circulo" or "hoyita"
    pub power: f64,
    pub angle: f64,
    pub spin: f64,
    pub tier: String,
    pub captured_ids: Vec<u32>,
    pub encholada_hoyita: bool,
    pub ponchados_player_ids: Vec<String>,
    pub points_scored: u32,
    pub earned_bonus_shot: bool,
    pub headline_es: String,
    pub headline_en: String,
    pub dicho_es: String,
    pub dicho_en: String,
    pub shooter_final_x: f64,
    pub shooter_final_y: f64,
    pub paths: Vec<MarblePath>,
    pub collisions: Vec<CollisionEvent>,
}

pub fn generate_patio_marbles(is_hoyita: bool) -> Vec<TargetMarble> {
    let mut marbles = Vec::with_capacity(13);
    let mut id = 1;

    // 1. Central Bolón Rey (in Hoyita mode, offset slightly so the center pit at (500,500) is open)
    let (rey_x, rey_y) = if is_hoyita {
        (500.0, 428.0)
    } else {
        (500.0, 500.0)
    };
    marbles.push(TargetMarble {
        id,
        x: rey_x,
        y: rey_y,
        radius: 19.0,
        points: 30,
        kind: "rey".to_string(),
        color: "#f59e0b".to_string(),
        active: true,
    });
    id += 1;

    // 2. Four inner Lecheras (20 pts each)
    let inner_r = if is_hoyita { 94.0 } else { 78.0 };
    let lechera_colors = ["#ec4899", "#06b6d4", "#10b981", "#ef4444"];
    for (i, &col) in lechera_colors.iter().enumerate() {
        let rad = ((i as f64) * 90.0 + 45.0).to_radians();
        marbles.push(TargetMarble {
            id,
            x: (PATIO_CENTER_X + inner_r * rad.cos()).round(),
            y: (PATIO_CENTER_Y + inner_r * rad.sin()).round(),
            radius: 16.0,
            points: 20,
            kind: "lechera".to_string(),
            color: col.to_string(),
            active: true,
        });
        id += 1;
    }

    // 3. Eight outer Agüitas / Ojos de Gato (10 pts each)
    let outer_r = 152.0;
    let aguita_colors = [
        "#3b82f6", "#8b5cf6", "#f97316", "#14b8a6", "#eab308", "#ec4899", "#10b981", "#06b6d4",
    ];
    for (i, &col) in aguita_colors.iter().enumerate() {
        let rad = ((i as f64) * 45.0).to_radians();
        marbles.push(TargetMarble {
            id,
            x: (PATIO_CENTER_X + outer_r * rad.cos()).round(),
            y: (PATIO_CENTER_Y + outer_r * rad.sin()).round(),
            radius: 14.5,
            points: 10,
            kind: "aguita".to_string(),
            color: col.to_string(),
            active: true,
        });
        id += 1;
    }

    marbles
}

#[derive(Clone)]
struct SimBody {
    id_str: String,
    target_id: Option<u32>,
    rival_player_id: Option<String>,
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
    radius: f64,
    mass: f64,
    color: String,
    kind: String,
    points_val: u32,
    captured: bool,
    encholada: bool,
    moved: bool,
    samples: Vec<TrajectoryPoint>,
}

#[allow(clippy::too_many_arguments)]
pub fn simulate_patio_shot(
    mode: &str, // "circulo" or "hoyita"
    seat_angle_deg: f64,
    shooter_color: &str,
    is_cazador: bool,
    raw_power: f64,
    raw_angle: f64,
    raw_spin: f64,
    targets: &mut [TargetMarble],
    rival_shooters: &mut [(String, f64, f64, String)], // (player_id, x, y, color)
    bonus_shot_rule: bool,
) -> PatioShotSimulation {
    let mut rng = rand::rng();
    let is_hoyita = mode == "hoyita";
    let power = raw_power.clamp(0.10, 1.0);
    let angle = raw_angle.clamp(-1.0, 1.0);
    let spin = raw_spin.clamp(-1.0, 1.0);

    let tier = if power < 0.42 {
        "suave".to_string()
    } else if power < 0.78 {
        "fuerte".to_string()
    } else {
        "turbo".to_string()
    };

    // Launch position on the outer shooting line (R = 415)
    let seat_rad = seat_angle_deg.to_radians();
    let start_x = PATIO_CENTER_X + PATIO_SHOOT_RADIUS * seat_rad.cos();
    let start_y = PATIO_CENTER_Y + PATIO_SHOOT_RADIUS * seat_rad.sin();

    // Base direction points inward toward center (500, 500), offset by player's aim angle (-38°..+38°)
    let inward_angle = (PATIO_CENTER_Y - start_y).atan2(PATIO_CENTER_X - start_x);
    let micro_jitter = rng.random_range(-0.022..0.022);
    let aim_rad = inward_angle + (angle * 36.0_f64).to_radians() + micro_jitter;
    let initial_speed = 6.2 + power * 14.5;

    let mut bodies: Vec<SimBody> = Vec::new();

    // Index 0: Active player's Tirador / Bolón
    bodies.push(SimBody {
        id_str: "shooter".to_string(),
        target_id: None,
        rival_player_id: None,
        x: start_x,
        y: start_y,
        vx: aim_rad.cos() * initial_speed,
        vy: aim_rad.sin() * initial_speed,
        radius: 17.5,
        mass: 1.35,
        color: shooter_color.to_string(),
        kind: "shooter".to_string(),
        points_val: 0,
        captured: false,
        encholada: false,
        moved: true,
        samples: vec![TrajectoryPoint {
            x: (start_x * 10.0).round() / 10.0,
            y: (start_y * 10.0).round() / 10.0,
        }],
    });

    // Active target marbles
    for t in targets.iter().filter(|m| m.active) {
        bodies.push(SimBody {
            id_str: format!("target_{}", t.id),
            target_id: Some(t.id),
            rival_player_id: None,
            x: t.x,
            y: t.y,
            vx: 0.0,
            vy: 0.0,
            radius: t.radius,
            mass: if t.kind == "rey" { 1.25 } else { 1.0 },
            color: t.color.clone(),
            kind: t.kind.clone(),
            points_val: t.points,
            captured: false,
            encholada: false,
            moved: false,
            samples: vec![TrajectoryPoint {
                x: (t.x * 10.0).round() / 10.0,
                y: (t.y * 10.0).round() / 10.0,
            }],
        });
    }

    // Rival players' shooter marbles resting on the dirt
    for (pid, rx, ry, rcol) in rival_shooters.iter() {
        let dist_from_center =
            ((*rx - PATIO_CENTER_X).powi(2) + (*ry - PATIO_CENTER_Y).powi(2)).sqrt();
        if dist_from_center < 375.0 {
            bodies.push(SimBody {
                id_str: format!("rival_{}", pid),
                target_id: None,
                rival_player_id: Some(pid.clone()),
                x: *rx,
                y: *ry,
                vx: 0.0,
                vy: 0.0,
                radius: 17.0,
                mass: 1.3,
                color: rcol.clone(),
                kind: "rival".to_string(),
                points_val: 25,
                captured: false,
                encholada: false,
                moved: false,
                samples: vec![TrajectoryPoint {
                    x: (*rx * 10.0).round() / 10.0,
                    y: (*ry * 10.0).round() / 10.0,
                }],
            });
        }
    }

    let mut collisions: Vec<CollisionEvent> = Vec::new();
    let mut ponchados_ids: Vec<String> = Vec::new();
    let mut sample_step = 0_u32;

    for step in 0..120 {
        // 1. Update positions & dirt friction
        for (idx, b) in bodies.iter_mut().enumerate() {
            if b.encholada {
                continue;
            }
            let speed = (b.vx * b.vx + b.vy * b.vy).sqrt();
            if speed > 0.08 {
                b.moved = true;
                // Apply chanfle curve to the shooter marble while rolling fast
                if idx == 0 && speed > 2.5 {
                    let perp_x = -b.vy / speed;
                    let perp_y = b.vx / speed;
                    b.vx += perp_x * spin * 0.14;
                    b.vy += perp_y * spin * 0.14;
                }

                b.x += b.vx;
                b.y += b.vy;
                b.vx *= 0.968;
                b.vy *= 0.968;

                // Soft outer courtyard boundary (R = 460)
                let dx_c = b.x - PATIO_CENTER_X;
                let dy_c = b.y - PATIO_CENTER_Y;
                let dist_c = (dx_c * dx_c + dy_c * dy_c).sqrt();
                if dist_c > 455.0 {
                    let nx = dx_c / dist_c;
                    let ny = dy_c / dist_c;
                    b.x = PATIO_CENTER_X + nx * 455.0;
                    b.y = PATIO_CENTER_Y + ny * 455.0;
                    b.vx *= -0.45;
                    b.vy *= -0.45;
                }

                // In Hoyita mode, center pit (500, 500) pulls nearby marbles inward
                if is_hoyita && dist_c < PATIO_HOYITA_RADIUS + 20.0 {
                    let pull = if dist_c < PATIO_HOYITA_RADIUS {
                        0.55
                    } else {
                        0.24
                    };
                    if dist_c > 1.0 {
                        b.vx -= (dx_c / dist_c) * pull;
                        b.vy -= (dy_c / dist_c) * pull;
                    }
                    b.vx *= 0.90;
                    b.vy *= 0.90;
                    let new_speed = (b.vx * b.vx + b.vy * b.vy).sqrt();
                    if dist_c < PATIO_HOYITA_RADIUS * 0.72 && new_speed < 4.8 {
                        b.encholada = true;
                        b.captured = true;
                        b.x = PATIO_CENTER_X;
                        b.y = PATIO_CENTER_Y;
                        b.vx = 0.0;
                        b.vy = 0.0;
                        collisions.push(CollisionEvent {
                            step: sample_step,
                            x: PATIO_CENTER_X,
                            y: PATIO_CENTER_Y,
                            intensity: 0.9,
                            kind: "hoyita".to_string(),
                        });
                    }
                }
            } else {
                b.vx = 0.0;
                b.vy = 0.0;
            }
        }

        // 2. Pairwise elastic circle-circle collisions
        let len = bodies.len();
        for i in 0..len {
            for j in (i + 1)..len {
                if bodies[i].encholada || bodies[j].encholada {
                    continue;
                }
                let dx = bodies[j].x - bodies[i].x;
                let dy = bodies[j].y - bodies[i].y;
                let dist = (dx * dx + dy * dy).sqrt();
                let min_dist = bodies[i].radius + bodies[j].radius;
                if dist < min_dist && dist > 0.0001 {
                    let nx = dx / dist;
                    let ny = dy / dist;
                    let overlap = min_dist - dist;

                    let total_mass = bodies[i].mass + bodies[j].mass;
                    bodies[i].x -= nx * overlap * (bodies[j].mass / total_mass);
                    bodies[i].y -= ny * overlap * (bodies[j].mass / total_mass);
                    bodies[j].x += nx * overlap * (bodies[i].mass / total_mass);
                    bodies[j].y += ny * overlap * (bodies[i].mass / total_mass);

                    let rvx = bodies[j].vx - bodies[i].vx;
                    let rvy = bodies[j].vy - bodies[i].vy;
                    let vel_along_normal = rvx * nx + rvy * ny;

                    if vel_along_normal < 0.0 {
                        let restitution = 0.92;
                        let impulse = -(1.0 + restitution) * vel_along_normal
                            / (1.0 / bodies[i].mass + 1.0 / bodies[j].mass);
                        let ix = impulse * nx;
                        let iy = impulse * ny;

                        bodies[i].vx -= ix / bodies[i].mass;
                        bodies[i].vy -= iy / bodies[i].mass;
                        bodies[j].vx += ix / bodies[j].mass;
                        bodies[j].vy += iy / bodies[j].mass;
                        bodies[i].moved = true;
                        bodies[j].moved = true;

                        let intensity = (vel_along_normal.abs() / 12.0).clamp(0.2, 1.0);
                        let hit_rival = bodies[i].rival_player_id.is_some()
                            || bodies[j].rival_player_id.is_some();
                        if i == 0 {
                            if let Some(ref rpid) = bodies[j].rival_player_id {
                                if !ponchados_ids.contains(rpid) {
                                    ponchados_ids.push(rpid.clone());
                                }
                            }
                        }

                        if collisions.len() < 18 {
                            collisions.push(CollisionEvent {
                                step: sample_step,
                                x: ((bodies[i].x + bodies[j].x) * 0.5).round(),
                                y: ((bodies[i].y + bodies[j].y) * 0.5).round(),
                                intensity: (intensity * 100.0).round() / 100.0,
                                kind: if hit_rival {
                                    "rival".to_string()
                                } else {
                                    "target".to_string()
                                },
                            });
                        }
                    }
                }
            }
        }

        // 3. Check target marbles knocked outside El Círculo (R > 230)
        for b in bodies.iter_mut().skip(1) {
            if b.target_id.is_some() && !b.captured {
                let dist_c =
                    ((b.x - PATIO_CENTER_X).powi(2) + (b.y - PATIO_CENTER_Y).powi(2)).sqrt();
                if dist_c > PATIO_RING_RADIUS {
                    b.captured = true;
                }
            }
        }

        // Record sampled frame every 2 steps
        if step % 2 == 0 {
            sample_step += 1;
            for b in bodies.iter_mut() {
                b.samples.push(TrajectoryPoint {
                    x: (b.x * 10.0).round() / 10.0,
                    y: (b.y * 10.0).round() / 10.0,
                });
            }
        }

        let any_moving = bodies
            .iter()
            .any(|b| !b.encholada && (b.vx * b.vx + b.vy * b.vy) > 0.08);
        if !any_moving && step > 16 {
            break;
        }
    }

    // Mutate targets & rival shooter positions and compute score
    let mut captured_ids = Vec::new();
    let mut points_scored = 0_u32;
    let encholada_hoyita = bodies[0].encholada;

    if encholada_hoyita {
        points_scored += 50;
    }

    for b in bodies.iter().skip(1) {
        if let Some(tid) = b.target_id {
            if let Some(t) = targets.iter_mut().find(|m| m.id == tid) {
                t.x = (b.x * 10.0).round() / 10.0;
                t.y = (b.y * 10.0).round() / 10.0;
                if b.captured {
                    t.active = false;
                    captured_ids.push(tid);
                    let mult = if b.encholada { 2 } else { 1 };
                    points_scored += b.points_val * mult;
                }
            }
        } else if let Some(ref rpid) = b.rival_player_id {
            if let Some(r) = rival_shooters.iter_mut().find(|r| r.0 == *rpid) {
                r.1 = (b.x * 10.0).round() / 10.0;
                r.2 = (b.y * 10.0).round() / 10.0;
            }
        }
    }

    if !ponchados_ids.is_empty() {
        let ponche_pts = if is_cazador { 40 } else { 25 };
        points_scored += ponche_pts * (ponchados_ids.len() as u32);
    }

    let shooter_final_x = (bodies[0].x * 10.0).round() / 10.0;
    let shooter_final_y = (bodies[0].y * 10.0).round() / 10.0;

    let earned_bonus_shot = bonus_shot_rule
        && (!captured_ids.is_empty() || encholada_hoyita || !ponchados_ids.is_empty());

    let (headline_es, headline_en, dicho_es, dicho_en) = if encholada_hoyita {
        (
            format!("🕳️ ¡ENCHOLADA EN LA HOYITA! (+{} pts)", points_scored),
            format!("🕳️ SUNK IN LA HOYITA! (+{} pts)", points_scored),
            "«¡Adentro del pochito! Te coronas Cazador con derecho a ponchar.»".to_string(),
            "\"Right into the dirt pit! You are crowned Hunter with strike rights.\"".to_string(),
        )
    } else if !captured_ids.is_empty() && !ponchados_ids.is_empty() {
        (
            format!(
                "💥 ¡CHIRAS PELAS Y PONCHE! ({} canicas + {} pts)",
                captured_ids.len(),
                points_scored
            ),
            format!(
                "💥 KNOCKOUT & RIVAL STRIKE! ({} marbles + {} pts)",
                captured_ids.len(),
                points_scored
            ),
            "«¡Tiro de campeonato: sacaste canicas del ruedo y quemaste al rival!»".to_string(),
            "\"Championship shot: knocked marbles out of the ring and struck your rival!\""
                .to_string(),
        )
    } else if !captured_ids.is_empty() {
        (
            format!(
                "🎯 ¡CHIRAS PELAS! Sacaste {} canica{} (+{} pts)",
                captured_ids.len(),
                if captured_ids.len() == 1 { "" } else { "s" },
                points_scored
            ),
            format!(
                "🎯 KNOCKOUT! Knocked out {} marble{} (+{} pts)",
                captured_ids.len(),
                if captured_ids.len() == 1 { "" } else { "s" },
                points_scored
            ),
            "«¡Con uñita y buen pulso, canica fuera del círculo es tuya!»".to_string(),
            "\"With a sharp thumb flick, any marble knocked outside the ring is yours!\""
                .to_string(),
        )
    } else if !ponchados_ids.is_empty() {
        (
            format!(
                "💥 ¡PONCHADO! Quemaste al tirador rival (+{} pts)",
                points_scored
            ),
            format!(
                "💥 PONCHADO! Struck rival's shooter (+{} pts)",
                points_scored
            ),
            "«¡Una cuarta y quema! Le diste directo al bolón contrario.»".to_string(),
            "\"Direct glass-on-glass hit on the opponent's shooter marble!\"".to_string(),
        )
    } else if !collisions.is_empty() {
        (
            "🔮 ¡Choquecito en la tierra! Quedaron en la raya".to_string(),
            "🔮 Glass clack in the dirt! Marbles stayed inside the ring".to_string(),
            "«¡Sonó bonito el cristal, pero faltó galleta para sacarlas del ruedo!»".to_string(),
            "\"Sweet glass clack, but needed a little more power to knock them out!\"".to_string(),
        )
    } else {
        (
            "💨 ¡Pasó de largo por la tierra!".to_string(),
            "💨 Rolled past through the dirt!".to_string(),
            "«¡Apúntale bien al centro del ruedo en la siguiente tirada!»".to_string(),
            "\"Aim right for the heart of the ring on your next flick!\"".to_string(),
        )
    };

    let paths = bodies
        .into_iter()
        .filter(|b| b.moved || b.id_str == "shooter")
        .map(|b| MarblePath {
            id: b.id_str,
            color: b.color,
            kind: b.kind,
            radius: b.radius,
            captured: b.captured,
            encholada: b.encholada,
            points: b.samples,
        })
        .collect();

    PatioShotSimulation {
        mode: mode.to_string(),
        power,
        angle,
        spin,
        tier,
        captured_ids,
        encholada_hoyita,
        ponchados_player_ids: ponchados_ids,
        points_scored,
        earned_bonus_shot,
        headline_es,
        headline_en,
        dicho_es,
        dicho_en,
        shooter_final_x,
        shooter_final_y,
        paths,
        collisions,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_feria_holes_and_nails_layout() {
        let holes = feria_holes();
        assert_eq!(holes.len(), 20);
        assert_eq!(holes[0].points, 100);
        assert_eq!(holes[19].points, 10);

        let nails = feria_nails();
        assert!(nails.len() >= 35);
        // Verify no nail is inside a hole rim and no two nails can ever wedge a marble
        for (i, n) in nails.iter().enumerate() {
            for h in &holes {
                let d = ((h.x - n.x).powi(2) + (h.y - n.y).powi(2)).sqrt();
                assert!(d >= h.radius + 20.0);
            }
            for m in nails.iter().skip(i + 1) {
                let dn = ((m.x - n.x).powi(2) + (m.y - n.y).powi(2)).sqrt();
                assert!(
                    dn >= 61.5,
                    "Nails {} and {} too close: {:.1}px",
                    n.id,
                    m.id,
                    dn
                );
            }
        }
    }

    #[test]
    fn test_feria_shot_simulation_produces_valid_hole_and_path() {
        let sim = simulate_feria_shot(0.75, 0.1, -0.2, &[1, 4], true, true);
        assert!(sim.hole.id >= 1 && sim.hole.id <= 20);
        assert!(sim.total_points >= 20); // Golden marble doubles points
        assert!(sim.multiplier >= 2);
        assert!(sim.path.len() >= 35);

        // Stress-test 300 Feria shots across all power/angle/spin combinations:
        // Verify zero teleporting (no step > 16px in pinfield) and zero stalling between nails.
        for s in 0..300 {
            let p = 0.15 + ((s % 10) as f64) * 0.085;
            let a = -0.9 + (((s / 10) % 10) as f64) * 0.2;
            let sp = -0.8 + ((s / 100) as f64) * 0.8;
            let run = simulate_feria_shot(p, a, sp, &[], false, true);
            let n = run.path.len();
            assert!(n >= 36);
            // Pinfield starts at index 30 (after 16 plunger + 14 arch points)
            for i in 30..(n - 1) {
                let dx = run.path[i + 1].x - run.path[i].x;
                let dy = run.path[i + 1].y - run.path[i].y;
                let step_d = (dx * dx + dy * dy).sqrt();
                assert!(
                    step_d <= 16.5,
                    "Teleport jump detected at step {}/{}: {:.1}px (hole #{})",
                    i,
                    n,
                    step_d,
                    run.hole.id
                );
            }
            // Verify marble never sits spinning in place before the final 6-step cup settle
            if n > 46 {
                for i in 30..(n - 14) {
                    let dx8 = run.path[i + 8].x - run.path[i].x;
                    let dy8 = run.path[i + 8].y - run.path[i].y;
                    let move8 = (dx8 * dx8 + dy8 * dy8).sqrt();
                    assert!(
                        move8 >= 6.0,
                        "Marble stalled spinning in place at step {}/{}: moved only {:.1}px over 8 frames",
                        i,
                        n,
                        move8
                    );
                }
            }
        }
    }

    #[test]
    fn test_patio_circulo_and_hoyita_simulation() {
        let mut marbles = generate_patio_marbles(false);
        assert_eq!(marbles.len(), 13);
        let mut rivals = vec![("p2".to_string(), 510.0, 510.0, "#ef4444".to_string())];

        let sim = simulate_patio_shot(
            "circulo",
            90.0,
            "#06b6d4",
            false,
            0.90,
            0.0,
            0.0,
            &mut marbles,
            &mut rivals,
            true,
        );
        assert_eq!(sim.mode, "circulo");
        assert!(!sim.paths.is_empty());
        assert!(!sim.collisions.is_empty());

        let mut hoyita_marbles = generate_patio_marbles(true);
        let sim_h = simulate_patio_shot(
            "hoyita",
            180.0,
            "#10b981",
            true,
            0.55,
            0.0,
            0.0,
            &mut hoyita_marbles,
            &mut rivals,
            true,
        );
        assert_eq!(sim_h.mode, "hoyita");
        assert!(!sim_h.paths.is_empty());
    }
}
