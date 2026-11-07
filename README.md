# 🔮 Canicas Mexicanas 3D Online • Feria de Clavos & Patio de Tierra 🇲🇽

[![CI/CD Quality Gates](https://github.com/pinguxx/canicas/actions/workflows/ci.yml/badge.svg)](https://github.com/pinguxx/canicas/actions/workflows/ci.yml)
[![Rust](https://img.shields.io/badge/Rust-1.80%2B-orange?logo=rust)](https://www.rust-lang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)](https://render.com)

A high-performance, real-time multiplayer web game celebrating **both classic Mexican Canicas traditions**: **🎡 Canicas de la Feria** (*Tablero de Clavos y Hoyitos*) and **🕳️ Canicas de Patio / Tierra** (*El Círculo / La Rueda* & *La Hoyita / El Pochito*). Built with a **Rust** backend (**Axum**, **Tokio**, **WebSockets**) and an interactive 60fps HTML5 Canvas client with 100% procedural Web Audio API sound effects.

Part of the traditional Mexican games collection alongside **Lotería Mexicana** (`loteria`), **Serpientes y Escaleras** (`shoots_ladders`), **La Pirinola / Toma Todo** (`pirinola`), and **El Juego de la Oca** (`oca`).

---

## 🇺🇸 English Guide

### 🌟 Key Features

1. **Both Traditional Mexican Canicas Styles (4 Playable Modes)**:
   - **🎡 Canicas de la Feria (Fairground Brass-Nail Pinboard)**:
     - Launch your marble up the right-hand brass plunger chute (`Resorte`), curve around the top wooden arch, and bounce through **56 brass nails (*clavos*)** into **20 painted point holes (*hoyitos*)** ranging from `10 pts` (*El Quinto*, *La Calavera*) to `100 pts` (**👑 El Gallo de Oro**).
     - Landing in an already-occupied hole triggers **🔥 Double Marble in the Same Hole (Combo x2)**!
   - **⭕ Canicas de Patio: El Círculo (La Rueda / Knockout Ring)**:
     - Packed-earth courtyard with **13 glass target marbles** inside a chalk circle: 8 *Agüitas* (`10 pts`), 4 *Lecheras* (`20 pts`), and 1 central **👑 Bolón Rey** (`30 pts`).
     - Real server-authoritative 2D multi-body elastic collision physics: flick your shooter (*uñita / huesito*) from the outer shooting line to knock marbles out of the ring (**¡Chiras Pelas!**).
   - **🕳️ Canicas de Patio: La Hoyita (El Pochito / Dirt Pit)**:
     - Aim for the concave pit dug into the center of the dirt courtyard (**¡Encholar en la Hoyita!**) for **+50 points**, an immediate bonus shot, and **🔥 Cazador (Hunter)** status (`+40 pts` for striking rival shooters).
   - **🏆 Torneo Mixto (Mixed Championship)**:
     - Cycles automatically between **Feria de Clavos**, **El Círculo**, and **La Hoyita** each round (and lets the host switch arenas live at any time).

2. **Tactile Slingshot Aiming, Chanfle & Table Nudges**:
   - Drag directly on the canvas to aim angle and power with a live dotted trajectory preview, or use the precision angle slider, **🌪️ Chanfle (Left / Straight / Right spin curve)**, and hold-to-charge power meter.
   - **🔮 4 Artisanal Glass Marble Skins**: *Agüita / Ojo de Gato*, *Lechera*, *Galaxia*, and *Obsidiana & Oro*.
   - **💨 ¡Sóplale! & 👊 ¡Golpecito!**: Live interactive table/ground nudges broadcast to all players.

3. **Real-Time Multiplayer & Solo Mexican Bots (Rust + Axum WebSockets)**:
   - 6-character private room codes, 1-click invite links (`?room=CODE`), and offline **📱 QR Code Party Invite** modal.
   - Up to 10 players + **🤖 Mexican Bots** (`🤖 El Chavo Bot`, `🤖 Don Ramón Bot`, `🤖 Quico Bot`, `🤖 La Chilindrina Bot`, `🤖 El Santo Bot`, etc.).
   - **📸 Shareable 800×1000 Canvas Trophy Card** with 1st/2nd/3rd podium and 4 match telemetry awards.

---

## 🇲🇽 Guía en Español

### 🌟 Características Principales

* **Los Dos Estilos Clásicos de Canicas en México**:
  * **🎡 Canicas de la Feria (Tablero de Clavos y Hoyitos)**: Tablero inclinado de madera con resorte de latón, 56 clavos y 20 hoyitos tradicionales (desde 10 puntos hasta **👑 El Gallo de Oro de 100 puntos**).
  * **⭕ Canicas de Patio — El Círculo (La Rueda)**: Ruedo en tierra apisonada con 13 canicas apostadas (*Agüitas*, *Lecheras* y el *Bolón Rey*). ¡Saca canicas del círculo (**¡Chiras Pelas!**) con física elástica 2D real!
  * **🕳️ Canicas de Patio — La Hoyita (El Pochito)**: Enchola tu tiro en el pocito central para ganar **+50 puntos**, tiro extra y coronarte **🔥 Cazador** con derecho a ponchar el bolón de tus rivales.
  * **🏆 Torneo Mixto**: Alterna automáticamente entre la Feria y el Patio en cada ronda.
* **🎵 Audio 100% Procedural Web Audio API + Voz del Gritón (`SpeechSynthesis`)**: Sonido cristalino de choque de canicas (`¡clack!`), campaneo en los clavos de latón (`ting!`), resorte de feria y dichos mexicanos hablados.

---

## 🚀 Running Locally / Cómo Ejecutar Localmente

```bash
cargo run --release
```

Then open `http://localhost:3000` in your browser.
