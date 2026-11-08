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
            y: 1085.0,
            radius: 29.0,
            points: 100,
            tier: "oro",
            icon: "👑",
            name_es: "El Gallo de Oro",
            name_en: "The Golden Rooster",
            dicho_es: "«¡Cien puntos al Gallo de Oro hasta el fondo del tablero, te llevaste el premio mayor!»",
            dicho_en: "\"100 points in the Golden Rooster at the very bottom, you won the grand prize!\"",
            color: "#f59e0b",
        },
        FeriaHole {
            id: 2,
            x: 312.0,
            y: 1085.0,
            radius: 29.0,
            points: 75,
            tier: "diamante",
            icon: "💎",
            name_es: "La Corona Real",
            name_en: "The Royal Crown",
            dicho_es: "«¡Tiro de maestro hasta abajo directo a la Corona Real!»",
            dicho_en: "\"Master shot all the way down into the Royal Crown!\"",
            color: "#06b6d4",
        },
        FeriaHole {
            id: 3,
            x: 625.0,
            y: 1085.0,
            radius: 29.0,
            points: 75,
            tier: "diamante",
            icon: "🌟",
            name_es: "Estrella Azteca",
            name_en: "Aztec Star",
            dicho_es: "«¡Brilló la Estrella Azteca en el fondo con setenta y cinco tantos!»",
            dicho_en: "\"The Aztec Star shone bright at the bottom for 75 points!\"",
            color: "#06b6d4",
        },
        FeriaHole {
            id: 4,
            x: 155.0,
            y: 1085.0,
            radius: 29.0,
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
            x: 780.0,
            y: 1085.0,
            radius: 29.0,
            points: 50,
            tier: "fuego",
            icon: "🔥",
            name_es: "El Diablo",
            name_en: "The Fire Devil",
            dicho_es: "«¡Canica encendida hasta abajo, cayó en el hoyito de cincuenta!»",
            dicho_en: "\"Blazing marble all the way down into the 50-point hole!\"",
            color: "#ef4444",
        },
        FeriaHole {
            id: 6,
            x: 468.0,
            y: 955.0,
            radius: 27.0,
            points: 50,
            tier: "fuego",
            icon: "🌙",
            name_es: "La Luna",
            name_en: "The Moon",
            dicho_es: "«¡Cruzaste todo el tablero hasta La Luna por cincuenta puntos!»",
            dicho_en: "\"Crossed the board down to The Moon for fifty points!\"",
            color: "#ec4899",
        },
        FeriaHole {
            id: 7,
            x: 170.0,
            y: 825.0,
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
            x: 765.0,
            y: 825.0,
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
            x: 368.0,
            y: 825.0,
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
            x: 568.0,
            y: 825.0,
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
            x: 185.0,
            y: 565.0,
            radius: 30.0,
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
            x: 310.0,
            y: 695.0,
            radius: 30.0,
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
            x: 625.0,
            y: 695.0,
            radius: 30.0,
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
            x: 750.0,
            y: 565.0,
            radius: 30.0,
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
            y: 565.0,
            radius: 30.0,
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
            x: 468.0,
            y: 235.0,
            radius: 31.0,
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
            x: 255.0,
            y: 305.0,
            radius: 30.0,
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
            x: 680.0,
            y: 305.0,
            radius: 30.0,
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
            x: 355.0,
            y: 440.0,
            radius: 30.0,
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
            x: 580.0,
            y: 440.0,
            radius: 30.0,
            points: 10,
            tier: "madera",
            icon: "🎺",
            name_es: "La Trompeta",
            name_en: "The Trumpet",
            dicho_es: "«¡Suena la trompeta de la feria con diez puntos!»",
            dicho_en: "\"The fairground trumpet sounds for ten points!\"",
            color: "#a855f7",
        },
    ]
}

pub fn feria_nails() -> Vec<FeriaNail> {
    let holes = feria_holes();
    let mut nails: Vec<FeriaNail> = Vec::new();
    let mut id_counter = 1;

    // Marble diameter is 27px (r=13.5) and nail radius is 4.5px (min touch dist = 36px).
    // Enforcing >= 41.5px between nails guarantees at least 32.5px clear gap so a marble never wedges,
    // while allowing a dense, lively ~105-nail Mexican Feria pinfield!
    let can_place_nail = |nx: f64, ny: f64, existing: &[FeriaNail]| -> bool {
        let too_close_to_hole = holes
            .iter()
            .any(|h| ((h.x - nx).powi(2) + (h.y - ny).powi(2)).sqrt() < h.radius + 17.5);
        let too_close_to_nail = existing
            .iter()
            .any(|n| ((n.x - nx).powi(2) + (n.y - ny).powi(2)).sqrt() < 41.5);
        !too_close_to_hole && !too_close_to_nail
    };

    // 1. Semicircular 4-nail brass crowns above the middle & lower prize holes (y = 565..955)
    // and side-wing nails on the top 10-pt holes (leaving top 10-pt hole mouths open!)
    let guarded_lower_holes: &[(f64, f64, f64, &[f64])] = &[
        (468.0, 955.0, 52.0, &[-116.0_f64, -64.0]),
        (170.0, 825.0, 52.0, &[-162.0, -114.0, -66.0, -18.0]),
        (368.0, 825.0, 52.0, &[-162.0, -114.0, -66.0, -18.0]),
        (568.0, 825.0, 52.0, &[-162.0, -114.0, -66.0, -18.0]),
        (765.0, 825.0, 52.0, &[-162.0, -114.0, -66.0, -18.0]),
        (185.0, 565.0, 52.0, &[-162.0, -114.0, -66.0, -18.0]),
        (468.0, 565.0, 54.0, &[-162.0, -114.0, -66.0, -18.0]),
        (750.0, 565.0, 52.0, &[-162.0, -114.0, -66.0, -18.0]),
        (310.0, 695.0, 52.0, &[-162.0, -114.0, -66.0, -18.0]),
        (625.0, 695.0, 52.0, &[-162.0, -114.0, -66.0, -18.0]),
        (468.0, 235.0, 54.0, &[-162.0, -124.0, -56.0, -18.0]),
        (255.0, 305.0, 54.0, &[-162.0, -124.0, -56.0, -18.0]),
        (680.0, 305.0, 54.0, &[-162.0, -124.0, -56.0, -18.0]),
        (355.0, 440.0, 54.0, &[-162.0, -124.0, -56.0, -18.0]),
        (580.0, 440.0, 54.0, &[-162.0, -124.0, -56.0, -18.0]),
    ];
    for &(cx, cy, r, degs) in guarded_lower_holes {
        for &deg in degs {
            let rad = deg.to_radians();
            let nx = (cx + r * rad.cos()).round();
            let ny = (cy + r * rad.sin()).round();
            if (138.0..=798.0).contains(&nx) && can_place_nail(nx, ny, &nails) {
                nails.push(FeriaNail {
                    id: id_counter,
                    x: nx,
                    y: ny,
                    radius: 4.5,
                });
                id_counter += 1;
            }
        }
    }

    // 2. 12 dense staggered lattice rows of brass nails across the board
    let row_ys = [
        168.0, 232.0, 298.0, 366.0, 434.0, 502.0, 570.0, 638.0, 706.0, 774.0, 842.0, 910.0,
    ];
    for (row_idx, &ry) in row_ys.iter().enumerate() {
        let count = if row_idx % 2 == 0 { 10 } else { 9 };
        let start_x = if row_idx % 2 == 0 { 138.0 } else { 174.5 };
        let step_x = 73.0;
        for i in 0..count {
            let nx = (start_x + (i as f64) * step_x).round();
            if (138.0..=798.0).contains(&nx) && can_place_nail(nx, ry, &nails) {
                nails.push(FeriaNail {
                    id: id_counter,
                    x: nx,
                    y: ry,
                    radius: 4.5,
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
    let bottom_dividers: [f64; 4] = [233.5, 390.0, 546.5, 702.5];

    let mut path = Vec::with_capacity(220);
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
    let jitter: f64 = rng.random_range(-20.0..20.0);
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

    // Phase 2: 4x Sub-stepped Newtonian rigid-body descent on tilted wooden pinboard
    let mut x = target_entry_x;
    let mut y = 152.0;
    let mut vx = angle * 3.0 - power * 0.9 + rng.random_range(-0.9..0.9);
    let mut vy = 3.0 + power * 1.4;
    let marble_r = 13.5;

    let mut captured_hole: Option<FeriaHole> = None;
    let mut last_hit_nail_id: u32 = 0;
    let mut last_hit_step: u32 = 0;
    let mut last_occupied_deflect_id: u32 = 0;
    let mut last_occupied_deflect_step: u32 = 0;

    for _frame in 0..360 {
        let step_idx = path.len() as u32;

        for _sub in 0..4 {
            // Board tilt gravity + subtle chanfle spin curve (per 0.25 sub-step)
            vy += 0.095;
            vx += spin * 0.018;
            vx *= 0.995;
            vy *= 0.995;

            let spd = (vx * vx + vy * vy).sqrt();
            if spd > 8.2 {
                vx = (vx / spd) * 8.2;
                vy = (vy / spd) * 8.2;
            }

            x += vx * 0.25;
            y += vy * 0.25;

            // Side wooden rails + bottom corner funnel ramps (y: 1005 -> 1085)
            let corner_inset = if y > 1005.0 {
                ((y - 1005.0) / 80.0).clamp(0.0, 1.0) * 22.0
            } else {
                0.0
            };
            let min_x = 118.0 + corner_inset;
            let max_x = 818.0 - corner_inset;
            if x < min_x {
                x = min_x;
                vx = vx.abs() * 0.65 + 0.9;
            } else if x > max_x {
                x = max_x;
                vx = -vx.abs() * 0.65 - 0.9;
            }

            // Bottom backstop wooden rail (inside the 5 bottom holes at y = 1085)
            if y > 1088.0 {
                y = 1088.0;
                vy = 0.0;
            }

            // Rigid-body circle-circle collisions with brass nails
            for nail in &nails {
                let dx = x - nail.x;
                let dy = y - nail.y;
                let dist = (dx * dx + dy * dy).sqrt();
                let min_dist = marble_r + nail.radius;
                if dist < min_dist && dist > 0.0001 {
                    let nx = dx / dist;
                    let ny = dy / dist;
                    x = nail.x + nx * (min_dist + 0.3);
                    y = nail.y + ny * (min_dist + 0.3);

                    let vn = vx * nx + vy * ny;
                    if vn < 0.0 {
                        vx -= 1.42 * vn * nx;
                        vy -= 1.42 * vn * ny;
                        // On a tilted wooden Feria pinboard, marbles deflect left/right off round brass
                        // nails and continue rolling downward rather than bouncing upward in place
                        if ny < -0.15 && vx.abs() < 2.4 {
                            let side = if nx.abs() > 0.04 {
                                nx.signum()
                            } else if spin.abs() > 0.05 {
                                spin.signum()
                            } else if rng.random_bool(0.5) {
                                1.0
                            } else {
                                -1.0
                            };
                            vx = side * rng.random_range(2.3..3.2);
                        }
                        if vy < 1.25 {
                            vy = 1.25;
                        }
                        if nail.id != last_hit_nail_id || step_idx > last_hit_step + 3 {
                            let intensity = (vn.abs() / 6.0).clamp(0.25, 1.0);
                            pin_hits.push(PinHitEvent {
                                step: step_idx,
                                nail_id: nail.id,
                                x: nail.x,
                                y: nail.y,
                                intensity: (intensity * 100.0).round() / 100.0,
                            });
                            last_hit_nail_id = nail.id;
                            last_hit_step = step_idx;
                        }
                    }
                }
            }

            // Solid triangular wooden ramp wedges between the 5 bottom holes (y: 1005 -> 1085)
            // The two inner dividers (390.0 and 546.5) slope outward near their top tips (y < 1042)
            // so the center 100-pt Gallo de Oro vault (x = 468) requires threading a narrow center needle!
            if y >= 1005.0 {
                let ramp_t = ((y - 1005.0) / 80.0).clamp(0.0, 1.0);
                let wedge_reach = 2.0 + ramp_t * 50.0; // reaches 52px from divider center at y=1085
                for &div_x in &bottom_dividers {
                    let dx = x - div_x;
                    if dx.abs() < wedge_reach {
                        let side = if dx.abs() > 0.05 {
                            dx.signum()
                        } else if vx.abs() > 0.05 {
                            vx.signum()
                        } else {
                            1.0
                        };
                        x = div_x + side * (wedge_reach + 0.25);
                        vx = vx * 0.55 + side * 1.8;
                        vy = vy.max(2.2);
                    }
                }
            }

            // 3-Zone Hole Interaction:
            // - Zone 1 (Occupied Hole): Resting marble dome bumps & deflects passing marbles away.
            // - Zone 2 (Inner Cup `dist < hole.radius - 2.5`): Marble center is over the hole opening ->
            //   strong cup gravity pulls it in so it NEVER ghosts across a hole without falling in.
            // - Zone 3 (Bevelled Rim Lip `hole.radius - 2.5 <= dist < hole.radius + 9.5`): Marble edge
            //   grazes the carved wooden lip -> tips inward if slow, or deflects sideways if fast.
            for hole in &holes {
                let dx = hole.x - x;
                let dy = hole.y - y;
                let dist = (dx * dx + dy * dy).sqrt();
                let speed = (vx * vx + vy * vy).sqrt();
                let is_occupied = occupied_hole_ids.contains(&hole.id);

                if is_occupied && dist < hole.radius + 10.0 && hole.y < 1050.0 {
                    // Dead-center slow drop can still nestle in for Combo x2, otherwise the resting
                    // marble in the hole bumps the passing marble and visibly changes its direction!
                    if dist < 6.8 && speed < 3.1 {
                        x = hole.x;
                        y = hole.y;
                        captured_hole = Some(hole.clone());
                        break;
                    } else if hole.id != last_occupied_deflect_id
                        || step_idx > last_occupied_deflect_step + 4
                    {
                        let out_nx = -dx / dist.max(1.0);
                        let out_ny = -dy / dist.max(1.0);
                        let side = if out_nx.abs() > 0.06 {
                            out_nx.signum()
                        } else if vx.abs() > 0.1 {
                            vx.signum()
                        } else if rng.random_bool(0.5) {
                            1.0
                        } else {
                            -1.0
                        };
                        if dist < hole.radius - 2.0 {
                            x = hole.x + out_nx * (hole.radius - 1.5);
                            y = hole.y + out_ny * (hole.radius - 1.5);
                        }
                        vx = vx * 0.35 + out_nx * 1.9 + side * rng.random_range(2.4..3.5);
                        vy = (vy * 0.82 + out_ny.max(0.25) * 1.35).max(1.85);
                        pin_hits.push(PinHitEvent {
                            step: step_idx,
                            nail_id: 1000 + hole.id,
                            x: hole.x,
                            y: hole.y,
                            intensity: 0.9,
                        });
                        last_occupied_deflect_id = hole.id;
                        last_occupied_deflect_step = step_idx;
                    }
                } else if dist < hole.radius - 3.0 {
                    if is_occupied
                        && (hole.id != last_occupied_deflect_id
                            || step_idx > last_occupied_deflect_step + 6)
                    {
                        pin_hits.push(PinHitEvent {
                            step: step_idx,
                            nail_id: 1000 + hole.id,
                            x: hole.x,
                            y: hole.y,
                            intensity: 0.8,
                        });
                        last_occupied_deflect_id = hole.id;
                        last_occupied_deflect_step = step_idx;
                    }
                    // Marble center is physically over the open hole cup: strong cup slope pulls it in
                    // at ANY speed so a marble never rolls across a hole (like El Nopal) without falling in!
                    let pull = if hole.y >= 1050.0 { 2.65 } else { 2.45 };
                    vx = vx * 0.46 + (dx / dist.max(1.0)) * pull;
                    vy = vy * 0.46 + (dy / dist.max(1.0)) * pull;

                    if dist < 7.5 {
                        x = hole.x;
                        y = hole.y;
                        captured_hole = Some(hole.clone());
                        break;
                    }
                } else if dist < hole.radius + (if hole.points <= 20 { 11.0 } else { 8.5 }) && hole.y < 1050.0 {
                    // Marble is touching the carved wooden rim/lip around the hole:
                    // Upper 10pt/20pt holes have a slightly wider bevelled lip so they eagerly catch
                    // careless shots near the top, making it harder to reach the 50/75/100 holes at the bottom!
                    let align_ratio = if hole.points <= 20 { 0.80 } else { 0.58 };
                    let tip_speed = if hole.points <= 20 { 5.2 } else { 4.3 };
                    if (dx.abs() < hole.radius * align_ratio && dy > -2.5) || speed < tip_speed {
                        vx = vx * 0.62 + (dx / dist.max(1.0)) * 1.85;
                        vy = vy * 0.74 + (dy / dist.max(1.0)) * 1.70;
                    } else {
                        let out_nx = -dx / dist.max(1.0);
                        let side = if out_nx.abs() > 0.05 {
                            out_nx.signum()
                        } else if vx.abs() > 0.05 {
                            vx.signum()
                        } else {
                            1.0
                        };
                        vx = vx * 0.52 + out_nx * 1.35 + side * 1.35;
                        vy = (vy * 0.94).max(1.75);
                    }
                }
            }

            if captured_hole.is_some() {
                break;
            }
        }

        // Gentle stall safeguard if caught in a low-speed equilibrium
        if path.len() >= 36 {
            let prev4 = &path[path.len() - 4];
            if ((x - prev4.x).powi(2) + (y - prev4.y).powi(2)).sqrt() < 5.0 {
                let dir = if rng.random_bool(0.5) { 1.0 } else { -1.0 };
                vx += dir * 2.8;
                vy = vy.max(2.6);
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

    // Ensure final resting frame is at the exact center of `final_hole`
    path.push(TrajectoryPoint {
        x: final_hole.x,
        y: final_hole.y,
    });

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
    generate_patio_marbles_with_phase(is_hoyita, 0.0)
}

pub fn generate_patio_marbles_with_phase(is_hoyita: bool, phase_deg: f64) -> Vec<TargetMarble> {
    let mut marbles = Vec::with_capacity(13);
    let mut id = 1;

    // 1. Central Bolón Rey (in Hoyita mode, offset around the center pit at R=76)
    let (rey_x, rey_y) = if is_hoyita {
        let rey_rad = (phase_deg - 90.0).to_radians();
        (
            (PATIO_CENTER_X + 76.0 * rey_rad.cos()).round(),
            (PATIO_CENTER_Y + 76.0 * rey_rad.sin()).round(),
        )
    } else {
        (PATIO_CENTER_X, PATIO_CENTER_Y)
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
    let inner_r = if is_hoyita { 104.0 } else { 78.0 };
    let lechera_colors = ["#ec4899", "#06b6d4", "#10b981", "#ef4444"];
    for (i, &col) in lechera_colors.iter().enumerate() {
        let rad = ((i as f64) * 90.0 + 45.0 + phase_deg).to_radians();
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
    let outer_r = 154.0;
    let aguita_colors = [
        "#3b82f6", "#8b5cf6", "#f97316", "#14b8a6", "#eab308", "#ec4899", "#10b981", "#06b6d4",
    ];
    for (i, &col) in aguita_colors.iter().enumerate() {
        let rad = ((i as f64) * 45.0 + phase_deg * 0.5).to_radians();
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatioStone {
    pub x: f64,
    pub y: f64,
    pub r: f64,
}

pub fn generate_patio_stones(
    is_hoyita: bool,
    shot_counter: u32,
    blocked_seat_deg: f64,
    targets: &[TargetMarble],
) -> Vec<PatioStone> {
    let mut stones: Vec<PatioStone> = Vec::with_capacity(24);

    let is_clear = |sx: f64, sy: f64, sr: f64, existing: &[PatioStone]| -> bool {
        let min_center_d = if is_hoyita { 52.0 } else { 38.0 };
        let dc = ((sx - PATIO_CENTER_X).powi(2) + (sy - PATIO_CENTER_Y).powi(2)).sqrt();
        if dc < min_center_d || dc > 214.0 {
            return false;
        }
        let hits_marble = targets.iter().filter(|m| m.active).any(|m| {
            ((m.x - sx).powi(2) + (m.y - sy).powi(2)).sqrt() < m.radius + sr + 3.0
        });
        if hits_marble {
            return false;
        }
        let hits_stone = existing
            .iter()
            .any(|s| ((s.x - sx).powi(2) + (s.y - sy).powi(2)).sqrt() < s.r + sr + 5.0);
        !hits_stone
    };

    // Helper: Place a blocker rock directly along a ray angle (tries candidate radii along the ray first)
    let place_ray_blocker = |ray_deg: f64, sr: f64, stones: &mut Vec<PatioStone>| {
        let candidate_radii: &[f64] = if is_hoyita {
            &[74.0, 96.0, 120.0, 146.0, 172.0, 196.0]
        } else {
            &[84.0, 110.0, 136.0, 162.0, 188.0]
        };
        for &deg_off in &[0.0_f64, 4.0, -4.0, 8.0, -8.0, 12.0, -12.0] {
            let rad = (ray_deg + deg_off).to_radians();
            for &dist_r in candidate_radii {
                let sx = (PATIO_CENTER_X + dist_r * rad.cos()).round();
                let sy = (PATIO_CENTER_Y + dist_r * rad.sin()).round();
                if is_clear(sx, sy, sr, stones) {
                    stones.push(PatioStone { x: sx, y: sy, r: sr });
                    return;
                }
            }
        }
    };

    // 1. Primary blocker rock directly on the active shooter's straight ray!
    place_ray_blocker(blocked_seat_deg, 15.0, &mut stones);

    // 2. Base tactical rock at +120°
    place_ray_blocker((blocked_seat_deg + 120.0).rem_euclid(360.0), 14.0, &mut stones);

    // 3. Base rock at -120° (Circulo) or initial pit guardian (Hoyita)
    if is_hoyita {
        let rot_jitter = (((shot_counter * 37) % 90) as f64).to_radians();
        let dist_r = 68.0;
        let sx = (PATIO_CENTER_X + dist_r * rot_jitter.cos()).round();
        let sy = (PATIO_CENTER_Y + dist_r * rot_jitter.sin()).round();
        if is_clear(sx, sy, 13.5, &stones) {
            stones.push(PatioStone { x: sx, y: sy, r: 13.5 });
        }
    } else {
        place_ray_blocker((blocked_seat_deg - 120.0).rem_euclid(360.0), 14.0, &mut stones);
    }

    // Ensure we start with exactly 3 rocks at the beginning
    if stones.len() < 3 {
        for step in 1..24 {
            let alt_deg = (blocked_seat_deg + (step as f64) * 15.0).rem_euclid(360.0);
            place_ray_blocker(alt_deg, 14.0, &mut stones);
            if stones.len() >= 3 {
                break;
            }
        }
    }

    // Dynamic progression: rocks ramp up as marbles disappear!
    let total_expected = if is_hoyita { 12_usize } else { 13_usize };
    let active_marbles = targets.iter().filter(|m| m.active).count();
    let missing_marbles = total_expected.saturating_sub(active_marbles);

    // If missing_marbles == 0 (start of game), we keep exactly 3 rocks!
    if missing_marbles > 0 {
        // Extra Hoyita pit guardians as pit becomes accessible (up to 3 extra)
        if is_hoyita {
            let extra_guardians = (missing_marbles / 4).min(3);
            let rot_jitter = (((shot_counter * 37) % 90) as f64).to_radians();
            for i in 1..=extra_guardians {
                let base_ang = (i as f64) * std::f64::consts::FRAC_PI_2 + rot_jitter;
                let dist_r = 66.0 + ((shot_counter + (i as u32) * 5) % 9) as f64;
                let sx = (PATIO_CENTER_X + dist_r * base_ang.cos()).round();
                let sy = (PATIO_CENTER_Y + dist_r * base_ang.sin()).round();
                if is_clear(sx, sy, 13.5, &stones) {
                    stones.push(PatioStone { x: sx, y: sy, r: 13.5 });
                }
            }
        }

        // Target total rocks = 3 base rocks + missing_marbles (up to 15 max)
        let target_total_stones = 3 + missing_marbles.min(12);

        for k in 0..16 {
            if stones.len() >= target_total_stones {
                break;
            }
            let seed = (shot_counter.wrapping_add(1))
                .wrapping_mul(2654435761)
                .wrapping_add(((k as u32) + 1).wrapping_mul(1013904223));
            let base_deg = ((seed % 360) as f64) + (k as f64) * 37.0;
            let dist_r = 85.0 + (((seed >> 8) % 120) as f64); // 85..205px
            let sr = 13.5 + (((seed >> 16) % 3) as f64); // 13.5..15.5px

            for step in 0..24 {
                let rad = (base_deg + (step as f64) * 15.0).to_radians();
                let sx = (PATIO_CENTER_X + dist_r * rad.cos()).round();
                let sy = (PATIO_CENTER_Y + dist_r * rad.sin()).round();
                if is_clear(sx, sy, sr, &stones) {
                    stones.push(PatioStone { x: sx, y: sy, r: sr });
                    break;
                }
            }
        }
    }

    stones
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
#[allow(dead_code)]
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
    let default_stones = if mode == "hoyita" {
        generate_patio_stones(true, 0, seat_angle_deg, targets)
    } else {
        Vec::new()
    };
    simulate_patio_shot_with_stones(
        mode,
        seat_angle_deg,
        shooter_color,
        is_cazador,
        raw_power,
        raw_angle,
        raw_spin,
        targets,
        rival_shooters,
        &default_stones,
        bonus_shot_rule,
    )
}

#[allow(clippy::too_many_arguments)]
pub fn simulate_patio_shot_with_stones(
    mode: &str, // "circulo" or "hoyita"
    seat_angle_deg: f64,
    shooter_color: &str,
    is_cazador: bool,
    raw_power: f64,
    raw_angle: f64,
    raw_spin: f64,
    targets: &mut [TargetMarble],
    rival_shooters: &mut [(String, f64, f64, String)], // (player_id, x, y, color)
    stones: &[PatioStone],
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

    // Base direction points inward toward center (500, 500), offset by player's aim angle (-42°..+42°)
    let inward_angle = (PATIO_CENTER_Y - start_y).atan2(PATIO_CENTER_X - start_x);
    let micro_jitter = rng.random_range(-0.022..0.022);
    let aim_rad = inward_angle + (angle * 42.0_f64).to_radians() + micro_jitter;
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

                // Collide with the dynamic courtyard rocks ("Piedritas del Patio")
                for st in stones {
                    let dx_s = b.x - st.x;
                    let dy_s = b.y - st.y;
                    let dist_s = (dx_s * dx_s + dy_s * dy_s).sqrt();
                    let min_s = b.radius + st.r;
                    if dist_s < min_s && dist_s > 0.001 {
                        let nx = dx_s / dist_s;
                        let ny = dy_s / dist_s;
                        b.x = st.x + nx * min_s;
                        b.y = st.y + ny * min_s;
                        let vn = b.vx * nx + b.vy * ny;
                        if vn < 0.0 {
                            b.vx -= 1.82 * vn * nx;
                            b.vy -= 1.82 * vn * ny;
                            if collisions.len() < 18 {
                                collisions.push(CollisionEvent {
                                    step: sample_step,
                                    x: st.x,
                                    y: st.y,
                                    intensity: (vn.abs() / 11.0).clamp(0.25, 0.95),
                                    kind: "stone".to_string(),
                                });
                            }
                        }
                    }
                }

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
    let hit_marble = collisions
        .iter()
        .any(|c| c.kind == "target" || c.kind == "rival");

    for b in bodies.iter().skip(1) {
        if let Some(tid) = b.target_id {
            if let Some(t) = targets.iter_mut().find(|m| m.id == tid) {
                t.x = (b.x * 10.0).round() / 10.0;
                t.y = (b.y * 10.0).round() / 10.0;
                if b.captured {
                    t.active = false;
                    captured_ids.push(tid);
                    let mult = if b.encholada || is_cazador { 2 } else { 1 };
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

    let repeat_empty_hoyita =
        encholada_hoyita && is_cazador && !hit_marble && captured_ids.is_empty() && ponchados_ids.is_empty();

    if encholada_hoyita {
        if repeat_empty_hoyita {
            points_scored += 10;
        } else if hit_marble {
            points_scored += 60;
        } else {
            points_scored += 45;
        }
    }

    if !ponchados_ids.is_empty() {
        let ponche_pts = if is_cazador { 40 } else { 25 };
        points_scored += ponche_pts * (ponchados_ids.len() as u32);
    }

    let shooter_final_x = (bodies[0].x * 10.0).round() / 10.0;
    let shooter_final_y = (bodies[0].y * 10.0).round() / 10.0;

    let earned_bonus_shot = bonus_shot_rule
        && (!captured_ids.is_empty()
            || (encholada_hoyita && !repeat_empty_hoyita)
            || !ponchados_ids.is_empty());

    let (headline_es, headline_en, dicho_es, dicho_en) = if repeat_empty_hoyita {
        (
            "🔮 ¡Ya eres Cazador! (+10 pts) • ¡Saca canicas para Puntos x2!".to_string(),
            "🔮 Already Hunter! (+10 pts) • Knock out marbles for 2x Points!".to_string(),
            "«Como ya eres Cazador, apunta a las canicas del ruedo (valen doble) o haz carambola.»".to_string(),
            "\"Since you are already Hunter, aim at the ring marbles (worth 2x) or bank off a marble!\"".to_string(),
        )
    } else if encholada_hoyita {
        (
            format!("🕳️ ¡ENCHOLADA EN LA HOYITA! (+{} pts)", points_scored),
            format!("🕳️ SUNK IN LA HOYITA! (+{} pts)", points_scored),
            "«¡Adentro del pochito! Te coronas Cazador: ahora tus canicas valen x2.»".to_string(),
            "\"Right into the dirt pit! You are crowned Hunter: your marble knockouts now score 2x!\"".to_string(),
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
        assert!(
            nails.len() >= 70,
            "Expected dense Feria nail field (>=70 nails), got {}",
            nails.len()
        );
        // Verify no nail is inside a hole rim and no two nails can ever wedge a 27px marble
        for (i, n) in nails.iter().enumerate() {
            for h in &holes {
                let d = ((h.x - n.x).powi(2) + (h.y - n.y).powi(2)).sqrt();
                assert!(d >= h.radius + 17.0);
            }
            for m in nails.iter().skip(i + 1) {
                let dn = ((m.x - n.x).powi(2) + (m.y - n.y).powi(2)).sqrt();
                assert!(
                    dn >= 41.0,
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

        let holes = feria_holes();
        // Verify all 10-pt holes are at the top (y <= 440) and all 50/75/100-pt holes are at the bottom (y >= 955)
        for h in &holes {
            if h.points == 10 {
                assert!(h.y <= 440.0);
            } else if h.points >= 50 {
                assert!(h.y >= 955.0);
            }
        }

        let mut count_100 = 0;
        let mut count_upper_cheap = 0;
        // Stress-test 300 Feria shots across all power/angle/spin combinations:
        // Verify zero teleporting (no step > 16px in pinfield), zero stalling between nails,
        // and that a marble never rolls across the inner opening of an empty hole without falling in!
        for s in 0..300 {
            let p = 0.15 + ((s % 10) as f64) * 0.085;
            let a = -0.9 + (((s / 10) % 10) as f64) * 0.2;
            let sp = -0.8 + ((s / 100) as f64) * 0.8;
            let run = simulate_feria_shot(p, a, sp, &[], false, true);
            if run.hole.points == 100 {
                count_100 += 1;
            }
            if run.hole.points <= 30 {
                count_upper_cheap += 1;
            }
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
                for h in &holes {
                    let dh = ((run.path[i].x - h.x).powi(2) + (run.path[i].y - h.y).powi(2)).sqrt();
                    if dh < h.radius - 6.0 {
                        assert_eq!(
                            run.hole.id, h.id,
                            "Marble rolled over inner cup of hole #{} ({}) at dist {:.1}px without falling in (landed in #{})",
                            h.id, h.name_es, dh, run.hole.id
                        );
                    }
                }
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
        println!("300-shot distribution: 100pt = {}, <=30pt = {}", count_100, count_upper_cheap);
        assert!(
            count_100 <= 25,
            "Expected 100pt jackpot hole to be rare (<=25/300), got {}",
            count_100
        );
        assert!(
            count_upper_cheap >= 190,
            "Expected upper/middle <=30pt holes to catch most shots (>=190/300), got {}",
            count_upper_cheap
        );
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

    #[test]
    fn test_patio_dynamic_stones_block_rays_and_randomize() {
        let targets = generate_patio_marbles(true);
        let stones_turn0 = generate_patio_stones(true, 0, 90.0, &targets);
        let stones_turn1 = generate_patio_stones(true, 1, 90.0, &targets);
        let stones_turn2 = generate_patio_stones(true, 2, 180.0, &targets);

        // At start (all 12/13 marbles active): exactly 3 rocks in Circulo and Hoyita!
        let stones_circulo = generate_patio_stones(false, 0, 90.0, &generate_patio_marbles(false));
        assert_eq!(stones_circulo.len(), 3, "Expected exactly 3 rocks at start of Circulo");
        assert_eq!(stones_turn0.len(), 3, "Expected exactly 3 rocks at start of Hoyita");

        // As marbles disappear, rocks progressively ramp up:
        let mut depleted_targets = generate_patio_marbles(true);
        for m in depleted_targets.iter_mut().take(10) {
            m.active = false;
        }
        let stones_depleted = generate_patio_stones(true, 5, 90.0, &depleted_targets);
        assert!(
            stones_depleted.len() >= 12,
            "Expected >=12 stones when 10 marbles disappear, got {}",
            stones_depleted.len()
        );

        // Check that a stone blocks the straight ray from 90° (South)
        let has_90_blocker = stones_turn0.iter().any(|st| {
            let dy = st.y - PATIO_CENTER_Y;
            let dx = st.x - PATIO_CENTER_X;
            let deg = (dy.atan2(dx).to_degrees() + 360.0) % 360.0;
            (deg - 90.0).abs() <= 10.0 && dy > 50.0
        });
        assert!(has_90_blocker, "Expected a stone along the 90° straight ray");

        // Check that a stone blocks the straight ray from 180° (West) on turn 2
        let has_180_blocker = stones_turn2.iter().any(|st| {
            let dy = st.y - PATIO_CENTER_Y;
            let dx = st.x - PATIO_CENTER_X;
            let deg = (dy.atan2(dx).to_degrees() + 360.0) % 360.0;
            (deg - 180.0).abs() <= 10.0 && dx < -50.0
        });
        assert!(has_180_blocker, "Expected a stone along the 180° straight ray");

        // Verify stones shift/re-randomize between shots
        let coords0: Vec<(i64, i64)> = stones_turn0.iter().map(|s| (s.x as i64, s.y as i64)).collect();
        let coords1: Vec<(i64, i64)> = stones_turn1.iter().map(|s| (s.x as i64, s.y as i64)).collect();
        assert_ne!(coords0, coords1, "Stones should re-randomize positions on every shot!");
    }
}
