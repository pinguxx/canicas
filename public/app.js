// ============================================================================
// CANICAS MEXICANAS 3D • CLIENT APPLICATION (FERIA DE CLAVOS & PATIO DE TIERRA)
// Supports both Rust/Axum WebSockets AND Standalone Artifact Offline Mode!
// ============================================================================

(() => {
  const AVATARS = ['🔮', '🤠', '💀', '🌺', '🦅', '🥊', '🎭', '🌶️', '🎸', '👑'];
  const COLORS = [
    '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ef4444', '#f97316', '#14b8a6', '#eab308', '#18181b'
  ];
  const BOT_PROFILES = [
    ['🤖 El Chavo Bot', '🧢'],
    ['🤖 Don Ramón Bot', '🤠'],
    ['🤖 Quico Bot', '🔮'],
    ['🤖 La Chilindrina Bot', '🌺'],
    ['🤖 El Santo Bot', '🥊'],
    ['🤖 La Catrina Bot', '💀'],
    ['🤖 Cantinflas Bot', '🎭'],
    ['🤖 Lupita Bot', '🌵'],
    ['🤖 Don Goyo Bot', '🦅']
  ];
  const MARBLE_SKINS = [
    { id: 'aguita', labelEs: 'Agüita', labelEn: 'Cat-Eye' },
    { id: 'lechera', labelEs: 'Lechera', labelEn: 'Milk Glass' },
    { id: 'galaxia', labelEs: 'Galaxia', labelEn: 'Galaxy' },
    { id: 'obsidiana', labelEs: 'Obsidiana', labelEn: 'Obsidian' }
  ];
  const ARENA_THEMES = [
    { id: 'feria', labelEs: 'Feria', labelEn: 'Carnival' },
    { id: 'patio', labelEs: 'Patio', labelEn: 'Dirt Yard' },
    { id: 'talavera', labelEs: 'Talavera', labelEn: 'Talavera' }
  ];

  // Built-in Feria Holes & Brass Nails (so standalone HTML artifact works with zero network requests)
  const DEFAULT_FERIA_HOLES = [
    { id: 1, x: 468, y: 235, radius: 31, points: 100, tier: 'oro', icon: '👑', name_es: 'El Gallo de Oro', name_en: 'The Golden Rooster', dicho_es: '«¡Cien puntos al Gallo de Oro, te llevaste el premio mayor de la feria!»', dicho_en: '"100 points in the Golden Rooster, you won the grand carnival prize!"', color: '#f59e0b' },
    { id: 2, x: 255, y: 305, radius: 30, points: 75, tier: 'diamante', icon: '💎', name_es: 'La Corona Real', name_en: 'The Royal Crown', dicho_es: '«¡Tiro de maestro directo a la Corona Real!»', dicho_en: '"Master shot straight into the Royal Crown!"', color: '#06b6d4' },
    { id: 3, x: 680, y: 305, radius: 30, points: 75, tier: 'diamante', icon: '🌟', name_es: 'Estrella Azteca', name_en: 'Aztec Star', dicho_es: '«¡Brilló la Estrella Azteca con setenta y cinco tantos!»', dicho_en: '"The Aztec Star shone bright for 75 points!"', color: '#06b6d4' },
    { id: 4, x: 355, y: 440, radius: 30, points: 50, tier: 'fuego', icon: '☀️', name_es: 'El Sol', name_en: 'The Sun', dicho_es: '«¡Como el sol de mediodía, cincuenta puntos al bolsillo!»', dicho_en: '"Like the midday sun, fifty points in your pocket!"', color: '#ef4444' },
    { id: 5, x: 580, y: 440, radius: 30, points: 50, tier: 'fuego', icon: '🔥', name_es: 'El Diablo', name_en: 'The Fire Devil', dicho_es: '«¡Canica encendida, cayó en el hoyito de cincuenta!»', dicho_en: '"Blazing marble, right into the 50-point hole!"', color: '#ef4444' },
    { id: 6, x: 468, y: 565, radius: 30, points: 50, tier: 'fuego', icon: '🌙', name_es: 'La Luna', name_en: 'The Moon', dicho_es: '«¡Por el centro del tablero, La Luna te da cincuenta!»', dicho_en: '"Right down the center, The Moon grants you fifty!"', color: '#ec4899' },
    { id: 7, x: 185, y: 565, radius: 29, points: 30, tier: 'esmeralda', icon: '🔔', name_es: 'La Campana', name_en: 'The Bell', dicho_es: '«¡Suena la campana de la kermés con treinta puntos!»', dicho_en: '"The fairground bell rings for thirty points!"', color: '#10b981' },
    { id: 8, x: 750, y: 565, radius: 29, points: 30, tier: 'esmeralda', icon: '❤️', name_es: 'El Corazón', name_en: 'The Heart', dicho_es: '«¡Directo al Corazón, treinta buenos tantos!»', dicho_en: '"Straight to the Heart, thirty solid points!"', color: '#10b981' },
    { id: 9, x: 310, y: 695, radius: 29, points: 30, tier: 'esmeralda', icon: '🦜', name_es: 'El Perico', name_en: 'The Parrot', dicho_es: '«¡Cantó el perico verde, treinta puntos seguros!»', dicho_en: '"The green parrot sang, thirty safe points!"', color: '#10b981' },
    { id: 10, x: 625, y: 695, radius: 29, points: 30, tier: 'esmeralda', icon: '🎸', name_es: 'El Mariachi', name_en: 'The Mariachi', dicho_es: '«¡Con música de mariachi sumas treinta al marcador!»', dicho_en: '"With mariachi music you add thirty to the scoreboard!"', color: '#10b981' },
    { id: 11, x: 170, y: 825, radius: 29, points: 20, tier: 'barrio', icon: '🍉', name_es: 'La Sandía', name_en: 'The Watermelon', dicho_es: '«¡Fresca la sandía, veinte puntos bien ganados!»', dicho_en: '"Fresh watermelon, twenty points well earned!"', color: '#3b82f6' },
    { id: 12, x: 368, y: 825, radius: 29, points: 20, tier: 'barrio', icon: '🌵', name_es: 'El Nopal', name_en: 'The Cactus', dicho_es: '«¡Sin espinarse en los clavos, veinte puntos al Nopal!»', dicho_en: '"Dodging the brass nails, twenty points in The Cactus!"', color: '#3b82f6' },
    { id: 13, x: 568, y: 825, radius: 29, points: 20, tier: 'barrio', icon: '🌶️', name_es: 'El Chile', name_en: 'The Chili Pepper', dicho_es: '«¡Picosito pero sabroso, veinte tantos más!»', dicho_en: '"Spicy and sweet, twenty more points!"', color: '#3b82f6' },
    { id: 14, x: 765, y: 825, radius: 29, points: 20, tier: 'barrio', icon: '🏺', name_es: 'El Jarrito', name_en: 'The Clay Pitcher', dicho_es: '«¡Adentro del Jarrito de barro, veinte puntos!»', dicho_en: '"Inside the clay pitcher, twenty points!"', color: '#3b82f6' },
    { id: 15, x: 468, y: 955, radius: 29, points: 20, tier: 'barrio', icon: '🌺', name_es: 'La Dalia', name_en: 'The Dahlia', dicho_es: '«¡En la flor nacional, veinte puntos para tu cuenta!»', dicho_en: '"In the national flower, twenty points for your tally!"', color: '#3b82f6' },
    { id: 16, x: 155, y: 1085, radius: 29, points: 10, tier: 'madera', icon: '🪙', name_es: 'El Quinto', name_en: 'The Nickel', dicho_es: '«¡De diez en diez se llena el jarrito!»', dicho_en: '"Ten by ten fills the pitcher!"', color: '#a855f7' },
    { id: 17, x: 312, y: 1085, radius: 29, points: 10, tier: 'madera', icon: '💀', name_es: 'La Calavera', name_en: 'The Sugar Skull', dicho_es: '«¡La Calaverita de azúcar te regala diez puntos!»', dicho_en: '"The sugar skull treats you to ten points!"', color: '#a855f7' },
    { id: 18, x: 468, y: 1085, radius: 29, points: 10, tier: 'madera', icon: '🤠', name_es: 'El Charro', name_en: 'The Charro', dicho_es: '«¡Con sombrero ancho, diez puntos al Charro!»', dicho_en: '"With a wide sombrero, ten points in The Charro!"', color: '#a855f7' },
    { id: 19, x: 625, y: 1085, radius: 29, points: 10, tier: 'madera', icon: '🐸', name_es: 'La Rana', name_en: 'The Frog', dicho_es: '«¡Brincó la canica hasta La Rana, diez tantos!»', dicho_en: '"The marble hopped into The Frog, ten points!"', color: '#a855f7' },
    { id: 20, x: 780, y: 1085, radius: 29, points: 10, tier: 'madera', icon: '🎺', name_es: 'La Trompeta', name_en: 'The Trumpet', dicho_es: '«¡Al final del tablero pero nunca en cero: diez puntos!»', dicho_en: '"At the bottom of the board but never zero: ten points!"', color: '#a855f7' }
  ];

  function buildDefaultFeriaNails() {
    const nails = [];
    let idCounter = 1;
    const guarded = [
      [468, 235, 48], [255, 305, 46], [680, 305, 46],
      [355, 440, 46], [580, 440, 46], [468, 565, 46]
    ];
    guarded.forEach(([cx, cy, r]) => {
      [-145, -110, -70, -35].forEach((deg) => {
        const rad = (deg * Math.PI) / 180;
        nails.push({
          id: idCounter++,
          x: Math.round(cx + r * Math.cos(rad)),
          y: Math.round(cy + r * Math.sin(rad)),
          radius: 5.5
        });
      });
    });
    const rowYs = [175, 265, 370, 500, 630, 760, 890, 1015];
    rowYs.forEach((ry, rowIdx) => {
      const count = rowIdx % 2 === 0 ? 7 : 6;
      const startX = rowIdx % 2 === 0 ? 145 : 195;
      for (let i = 0; i < count; i++) {
        const nx = startX + i * 108;
        const tooCloseHole = DEFAULT_FERIA_HOLES.some(
          (h) => Math.hypot(h.x - nx, h.y - ry) < h.radius + 18
        );
        const tooCloseNail = nails.some((n) => Math.hypot(n.x - nx, n.y - ry) < 22);
        if (!tooCloseHole && !tooCloseNail) {
          nails.push({ id: idCounter++, x: nx, y: ry, radius: 5.5 });
        }
      }
    });
    return nails;
  }

  const I18N = {
    es: {
      header_title: 'CANICAS MEXICANAS',
      header_sub: 'FERIA DE CLAVOS • EL CÍRCULO • LA HOYITA',
      resume_label: 'Partida activa en sala:',
      btn_resume: 'Reconectar',
      profile_title: '🎭 Tu Perfil Caniquero',
      your_name_label: 'Tu Nombre o Apodo',
      choose_avatar_label: 'Elige tu Avatar',
      choose_color_label: 'Color de tu Canica Tiradora (Bolón)',
      tab_create: '🔮 Crear Sala',
      tab_join: '🔑 Unirse a Sala',
      mode_label: '🎪 Estilo de Juego de Canicas',
      mode_torneo: '🏆 Torneo Mixto (Feria + El Círculo + La Hoyita)',
      mode_feria: '🎡 Canicas de la Feria (Tablero de Clavos y Hoyitos)',
      mode_circulo: '⭕ Canicas de Patio: El Círculo (La Rueda)',
      mode_hoyita: '🕳️ Canicas de Patio: La Hoyita (El Pochito)',
      win_cond_label: '🏁 Meta de la Partida',
      win_rounds: 'Por Rondas (Tiradas)',
      win_target: 'Carrera de Puntos',
      max_rounds_label: '🔄 Número de Rondas',
      target_score_label: '🎯 Puntos para Ganar',
      turn_timer_label: '⏱️ Tiempo por Turno',
      timer_none: 'Sin límite (Manual)',
      arena_theme_label: '🎨 Escenario Inicial',
      special_rules_title: '🎪 Reglas Especiales del Barrio y la Feria',
      toggle_bonus_shot: '🔥 <strong>Tiro Seguido y Canica de Oro:</strong> Hoyito de 50+ pts o sacar canica del ruedo da 1 tiro extra',
      toggle_combo_mult: '✨ <strong>Combos Dobles (x2):</strong> Doble canica en el mismo hoyito o encholar en La Hoyita multiplica puntos',
      toggle_ponche_steal: '💥 <strong>¡Chiras Pelas y Quema!:</strong> Ponchar el bolón de un rival en el patio le roba 10 pts + bono',
      btn_create_room: '🔮 ¡Crear Sala y Jugar!',
      room_code_label: 'Código de la Sala (6 letras)',
      btn_join_room: '🚀 Entrar al Ruedo',
      lobby_code_title: 'CÓDIGO DE SALA',
      btn_copy_link: '🔗 Copiar',
      btn_leave: '🚪 Salir',
      btn_add_bot: '🤖 +Bot',
      btn_remove_bot: '➖ Bot',
      waiting_host_msg: 'Esperando a que el anfitrión inicie la partida...',
      btn_start_game: '🔮 ¡ABRIR EL RUEDO Y JUGAR!',
      history_short: 'Historial',
      drag_hint: 'Arrastra en el tablero para apuntar o usa los controles abajo',
      btn_blow: '¡Sóplale!',
      btn_tap: '¡Golpecito!',
      aim_label: '🎯 Dirección / Apunte',
      spin_label: '🌪️ Efecto (Chanfle)',
      spin_left: '↩️ Curva Izq',
      spin_straight: '⬆️ Recto',
      spin_right: '↪️ Curva Der',
      power_label: '⚡ Fuerza del Tiro',
      power_soft: 'Suave',
      power_strong: 'Fuerte',
      power_turbo: '¡Turbo!',
      btn_shoot_main: '¡TIRAR CANICA!',
      btn_shoot_sub: 'Toca o mantén para cargar fuerza',
      banter_chiras: '¡Chiras pelas!',
      banter_gallo: '¡Al Gallo de Cien!',
      banter_hoyita: '¡Directo a la hoyita!',
      banter_unita: '¡Huesito y sin raya!',
      banter_quema: '¡Una cuarta y quema!',
      banter_suerte: '¡Canica bendita!',
      banter_hurry: '¡Ándale, tírale!',
      awards_heading: '🏅 Reconocimientos del Ruedo y la Feria',
      btn_share_card: '📸 Descargar / Compartir Trofeo',
      btn_play_again: '🔄 Volver a la Sala',
      qr_modal_title: '📱 Escanea para Entrar al Ruedo',
      btn_close: 'Cerrar',
      history_modal_title: '📜 Crónica de Tiros',
      rules_modal_title: '📖 Cómo Jugar a las Canicas Mexicanas (Feria y Patio)',
      rules_intro: '¡Disfruta los <strong>dos estilos tradicionales de Canicas en México</strong>! Puedes jugarlos por separado o combinados en el <strong>🏆 Torneo Mixto</strong>:'
    },
    en: {
      header_title: 'MEXICAN MARBLES 3D',
      header_sub: 'CARNIVAL PINBOARD • KNOCKOUT RING • DIRT PIT',
      resume_label: 'Active match in room:',
      btn_resume: 'Reconnect',
      profile_title: '🎭 Your Marble Shooter Profile',
      your_name_label: 'Your Name or Nickname',
      choose_avatar_label: 'Choose Your Avatar',
      choose_color_label: 'Shooter Marble Color (Bolón)',
      tab_create: '🔮 Create Room',
      tab_join: '🔑 Join Room',
      mode_label: '🎪 Mexican Marbles Game Style',
      mode_torneo: '🏆 Mixed Tournament (Carnival + Ring + Dirt Pit)',
      mode_feria: '🎡 Fairground Marbles (Brass Nails & Holes Board)',
      mode_circulo: '⭕ Courtyard Marbles: El Círculo (Knockout Ring)',
      mode_hoyita: '🕳️ Courtyard Marbles: La Hoyita (Center Dirt Pit)',
      win_cond_label: '🏁 Win Condition',
      win_rounds: 'By Rounds (Turns)',
      win_target: 'Target Score Race',
      max_rounds_label: '🔄 Number of Rounds',
      target_score_label: '🎯 Target Score to Win',
      turn_timer_label: '⏱️ Turn Timer',
      timer_none: 'No limit (Manual)',
      arena_theme_label: '🎨 Visual Theme',
      special_rules_title: '🎪 Special Fairground & Street Rules',
      toggle_bonus_shot: '🔥 <strong>Bonus Shot & Golden Marble:</strong> 50+ pt hole or ring knockout grants 1 extra shot',
      toggle_combo_mult: '✨ <strong>Double Combos (2x):</strong> Landing in an occupied hole or La Hoyita doubles points',
      toggle_ponche_steal: '💥 <strong>Rival Strike Steal:</strong> Hitting a rival shooter marble in the courtyard steals 10 pts + bonus',
      btn_create_room: '🔮 Create Room & Play!',
      room_code_label: 'Room Code (6 letters)',
      btn_join_room: '🚀 Join the Arena',
      lobby_code_title: 'ROOM CODE',
      btn_copy_link: '🔗 Copy Link',
      btn_leave: '🚪 Leave',
      btn_add_bot: '🤖 +Bot',
      btn_remove_bot: '➖ Bot',
      waiting_host_msg: 'Waiting for the host to start the match...',
      btn_start_game: '🔮 OPEN THE ARENA & PLAY!',
      history_short: 'History',
      drag_hint: 'Drag on the board to aim or use the controls below',
      btn_blow: 'Blow on It!',
      btn_tap: 'Nudge Board!',
      aim_label: '🎯 Aim Angle',
      spin_label: '🌪️ Spin Curve (Chanfle)',
      spin_left: '↩️ Curve Left',
      spin_straight: '⬆️ Straight',
      spin_right: '↪️ Curve Right',
      power_label: '⚡ Shot Power',
      power_soft: 'Soft',
      power_strong: 'Strong',
      power_turbo: 'Turbo!',
      btn_shoot_main: 'SHOOT MARBLE!',
      btn_shoot_sub: 'Tap or hold to charge power',
      banter_chiras: '¡Chiras pelas! Knockout!',
      banter_gallo: 'Going for 100 pts!',
      banter_hoyita: 'Straight into the pit!',
      banter_unita: 'Thumb flick special!',
      banter_quema: 'Direct rival strike!',
      banter_suerte: 'Lucky glass marble!',
      banter_hurry: 'Hurry up and shoot!',
      awards_heading: '🏅 Arena & Fairground Awards',
      btn_share_card: '📸 Download / Share Trophy',
      btn_play_again: '🔄 Back to Lobby',
      qr_modal_title: '📱 Scan to Join the Arena',
      btn_close: 'Close',
      history_modal_title: '📜 Shot Chronicle',
      rules_modal_title: '📖 How to Play Mexican Canicas (Carnival & Courtyard)',
      rules_intro: 'Enjoy <strong>both traditional styles of Mexican Marbles</strong>! Play them individually or combined in the <strong>🏆 Mixed Tournament</strong>:'
    }
  };

  // State
  let lang = window.safeStorage.getItem('canicas_lang') || 'es';
  let selectedAvatar = window.safeStorage.getItem('canicas_avatar') || AVATARS[0];
  let selectedColor = window.safeStorage.getItem('canicas_color') || COLORS[0];
  let skinIdx = Math.max(0, MARBLE_SKINS.findIndex((s) => s.id === (window.safeStorage.getItem('canicas_skin') || 'aguita')));
  let themeIdx = Math.max(0, ARENA_THEMES.findIndex((t) => t.id === (window.safeStorage.getItem('canicas_theme') || 'feria')));

  let ws = null;
  let useOfflineEngine = false;
  let myPlayerId = window.safeStorage.getItem('canicas_player_id') || null;
  let currentRoom = null;
  let arenaMeta = {
    feria_holes: DEFAULT_FERIA_HOLES,
    feria_nails: buildDefaultFeriaNails()
  };

  // Shot control state
  let aimAngle = 0.0;
  let shotSpin = 0.0;
  let shotPower = 0.72;
  let isCharging = false;
  let chargeInterval = null;
  let isAnimatingShot = false;

  // Active shot animation state
  let activeAnim = null;
  let sparkParticles = [];
  let floatingPopups = [];
  let previewSpinPhase = 0;

  // Canvas drag state
  let isDraggingCanvas = false;
  let dragStartPt = null;

  const screenHome = document.getElementById('screen-home');
  const screenLobby = document.getElementById('screen-lobby');
  const screenGame = document.getElementById('screen-game');

  const inputName = document.getElementById('input-name');
  const avatarPicker = document.getElementById('avatar-picker');
  const colorPicker = document.getElementById('color-picker');
  const previewCanvas = document.getElementById('profile-marble-preview');

  const canvas = document.getElementById('canicas-canvas');
  const ctx = canvas.getContext('2d');

  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    fetch('/api/arenas')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.arenas) {
          arenaMeta = data.arenas;
        }
      })
      .catch(() => {
        useOfflineEngine = true;
      });
  } else {
    useOfflineEngine = true;
  }

  // ==========================================================================
  // BUILT-IN STANDALONE / OFFLINE PHYSICS & ROOM ENGINE
  // ==========================================================================

  function generatePatioMarblesLocal(isHoyita) {
    const marbles = [];
    let id = 1;
    marbles.push({
      id: id++,
      x: 500,
      y: isHoyita ? 428 : 500,
      radius: 19,
      points: 30,
      kind: 'rey',
      color: '#f59e0b',
      active: true
    });
    const innerR = isHoyita ? 94 : 78;
    ['#ec4899', '#06b6d4', '#10b981', '#ef4444'].forEach((col, i) => {
      const rad = ((i * 90 + 45) * Math.PI) / 180;
      marbles.push({
        id: id++,
        x: Math.round(500 + innerR * Math.cos(rad)),
        y: Math.round(500 + innerR * Math.sin(rad)),
        radius: 16,
        points: 20,
        kind: 'lechera',
        color: col,
        active: true
      });
    });
    const outerR = 152;
    ['#3b82f6', '#8b5cf6', '#f97316', '#14b8a6', '#eab308', '#ec4899', '#10b981', '#06b6d4'].forEach((col, i) => {
      const rad = ((i * 45) * Math.PI) / 180;
      marbles.push({
        id: id++,
        x: Math.round(500 + outerR * Math.cos(rad)),
        y: Math.round(500 + outerR * Math.sin(rad)),
        radius: 14.5,
        points: 10,
        kind: 'aguita',
        color: col,
        active: true
      });
    });
    return marbles;
  }

  function stageForRoundLocal(gameMode, roundNumber) {
    if (gameMode === 'feria' || gameMode === 'circulo' || gameMode === 'hoyita') {
      return gameMode;
    }
    const idx = (Math.max(1, roundNumber) - 1) % 3;
    return idx === 0 ? 'feria' : idx === 1 ? 'circulo' : 'hoyita';
  }

  function simulateFeriaShotLocal(rawPower, rawAngle, rawSpin, occupiedIds, isGolden, bonusRule) {
    const power = Math.max(0.1, Math.min(1.0, rawPower));
    const angle = Math.max(-1.0, Math.min(1.0, rawAngle));
    const spin = Math.max(-1.0, Math.min(1.0, rawSpin));
    const holes = arenaMeta.feria_holes;
    const nails = arenaMeta.feria_nails;
    const path = [];
    const pinHits = [];

    for (let i = 0; i < 8; i++) {
      path.push({ x: 908, y: 1120 - (i / 7) * 900 });
    }
    const jitter = (Math.random() - 0.5) * 56;
    const targetEntryX = Math.max(165, Math.min(775, 760 - power * 520 + angle * 135 + jitter));
    for (let i = 1; i <= 6; i++) {
      const frac = i / 6;
      path.push({
        x: 908 - (908 - targetEntryX) * frac,
        y: 220 - Math.sin(frac * Math.PI) * 95 - frac * 65
      });
    }

    let x = targetEntryX;
    let y = 155;
    let vx = angle * 3.8 - power * 1.4 + (Math.random() - 0.5) * 3.2;
    let vy = 2.6 + power * 1.8;
    let capturedHole = null;
    let stepIdx = path.length;

    for (let simStep = 0; simStep < 150; simStep++) {
      vy += 0.34;
      vx += spin * 0.085;
      vx *= 0.985;
      vy *= 0.988;
      x += vx;
      y += vy;

      if (x < 115) {
        x = 115;
        vx = Math.abs(vx) * 0.78 + 0.8;
      } else if (x > 820) {
        x = 820;
        vx = -Math.abs(vx) * 0.78 - 0.8;
      }

      for (const nail of nails) {
        const dx = x - nail.x;
        const dy = y - nail.y;
        const dist = Math.hypot(dx, dy);
        const minDist = 14 + nail.radius;
        if (dist < minDist && dist > 0.001) {
          const nx = dx / dist;
          const ny = dy / dist;
          x = nail.x + nx * (minDist + 1);
          y = nail.y + ny * (minDist + 1);
          const dot = vx * nx + vy * ny;
          if (dot < 0) {
            vx = (vx - 1.85 * dot * nx) * 0.76 + (Math.random() - 0.5) * 1.8;
            vy = Math.max(1.6, (vy - 1.85 * dot * ny) * 0.72);
            pinHits.push({
              step: stepIdx,
              nail_id: nail.id,
              x: nail.x,
              y: nail.y,
              intensity: Math.min(1, Math.max(0.25, Math.abs(dot) / 8))
            });
          }
        }
      }

      for (const hole of holes) {
        const dx = hole.x - x;
        const dy = hole.y - y;
        const dist = Math.hypot(dx, dy);
        const speed = Math.hypot(vx, vy);
        if (dist < hole.radius + 12) {
          vx += (dx / Math.max(1, dist)) * 0.55;
          vy += (dy / Math.max(1, dist)) * 0.55;
        }
        const capR = simStep > 20 ? hole.radius * 0.78 : hole.radius * 0.65;
        if (dist < capR && (speed < 9.2 || hole.y > 1000)) {
          capturedHole = hole;
          break;
        }
      }

      if (simStep % 2 === 0) {
        path.push({ x, y });
        stepIdx++;
      }
      if (capturedHole || y >= 1110) break;
    }

    const finalHole =
      capturedHole ||
      holes
        .filter((h) => h.y >= 900)
        .reduce((best, h) =>
          Math.hypot(h.x - x, h.y - y) < Math.hypot(best.x - x, best.y - y) ? h : best
        );

    const lastPt = path[path.length - 1] || { x: finalHole.x, y: finalHole.y };
    for (let i = 1; i <= 4; i++) {
      const f = i / 4;
      path.push({
        x: lastPt.x + (finalHole.x - lastPt.x) * f,
        y: lastPt.y + (finalHole.y - lastPt.y) * f
      });
    }

    let mult = 1;
    const reasonsEs = [];
    const reasonsEn = [];
    if (isGolden) {
      mult *= 2;
      reasonsEs.push('🌟 Canica de Oro (Puntos x2)');
      reasonsEn.push('🌟 Golden Marble (2x Points)');
    }
    if (occupiedIds.includes(finalHole.id)) {
      mult *= 2;
      reasonsEs.push('🔥 ¡Doble Canica en el Mismo Hoyito! (Combo x2)');
      reasonsEn.push('🔥 Double Marble in the Same Hole! (2x Combo)');
    }
    const totalPoints = finalHole.points * mult;

    return {
      power,
      angle,
      spin,
      tier: power < 0.42 ? 'suave' : power < 0.78 ? 'fuerte' : 'turbo',
      hole: finalHole,
      base_points: finalHole.points,
      multiplier: mult,
      total_points: totalPoints,
      combo_reason_es: reasonsEs.length ? reasonsEs.join(' + ') : null,
      combo_reason_en: reasonsEn.length ? reasonsEn.join(' + ') : null,
      earned_bonus_shot: Boolean(bonusRule && finalHole.points >= 50 && !isGolden),
      path,
      pin_hits: pinHits
    };
  }

  function simulatePatioShotLocal(
    mode,
    seatAngleDeg,
    shooterColor,
    isCazador,
    rawPower,
    rawAngle,
    rawSpin,
    targets,
    rivals,
    bonusRule
  ) {
    const isHoyita = mode === 'hoyita';
    const power = Math.max(0.1, Math.min(1.0, rawPower));
    const angle = Math.max(-1.0, Math.min(1.0, rawAngle));
    const spin = Math.max(-1.0, Math.min(1.0, rawSpin));

    const seatRad = (seatAngleDeg * Math.PI) / 180;
    const startX = 500 + 415 * Math.cos(seatRad);
    const startY = 500 + 415 * Math.sin(seatRad);
    const inwardAngle = Math.atan2(500 - startY, 500 - startX);
    const aimRad = inwardAngle + (angle * 36 * Math.PI) / 180 + (Math.random() - 0.5) * 0.04;
    const initSpeed = 6.2 + power * 14.5;

    const bodies = [
      {
        id_str: 'shooter',
        target_id: null,
        rival_id: null,
        x: startX,
        y: startY,
        vx: Math.cos(aimRad) * initSpeed,
        vy: Math.sin(aimRad) * initSpeed,
        radius: 17.5,
        mass: 1.35,
        color: shooterColor,
        kind: 'shooter',
        points_val: 0,
        captured: false,
        encholada: false,
        moved: true,
        samples: [{ x: startX, y: startY }]
      }
    ];

    targets.filter((t) => t.active).forEach((t) => {
      bodies.push({
        id_str: `target_${t.id}`,
        target_id: t.id,
        rival_id: null,
        x: t.x,
        y: t.y,
        vx: 0,
        vy: 0,
        radius: t.radius,
        mass: t.kind === 'rey' ? 1.25 : 1.0,
        color: t.color,
        kind: t.kind,
        points_val: t.points,
        captured: false,
        encholada: false,
        moved: false,
        samples: [{ x: t.x, y: t.y }]
      });
    });

    rivals.forEach((r) => {
      if (Math.hypot(r.x - 500, r.y - 500) < 375) {
        bodies.push({
          id_str: `rival_${r.id}`,
          target_id: null,
          rival_id: r.id,
          x: r.x,
          y: r.y,
          vx: 0,
          vy: 0,
          radius: 17,
          mass: 1.3,
          color: r.color,
          kind: 'rival',
          points_val: 25,
          captured: false,
          encholada: false,
          moved: false,
          samples: [{ x: r.x, y: r.y }]
        });
      }
    });

    const collisions = [];
    const ponchadosIds = [];
    let sampleStep = 0;

    for (let step = 0; step < 120; step++) {
      bodies.forEach((b, idx) => {
        if (b.encholada) return;
        const spd = Math.hypot(b.vx, b.vy);
        if (spd > 0.08) {
          b.moved = true;
          if (idx === 0 && spd > 2.5) {
            b.vx += (-b.vy / spd) * spin * 0.14;
            b.vy += (b.vx / spd) * spin * 0.14;
          }
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.968;
          b.vy *= 0.968;

          const dxC = b.x - 500;
          const dyC = b.y - 500;
          const distC = Math.hypot(dxC, dyC);
          if (distC > 455) {
            b.x = 500 + (dxC / distC) * 455;
            b.y = 500 + (dyC / distC) * 455;
            b.vx *= -0.45;
            b.vy *= -0.45;
          }

          if (isHoyita && distC < 58) {
            const pull = distC < 38 ? 0.55 : 0.24;
            if (distC > 1) {
              b.vx -= (dxC / distC) * pull;
              b.vy -= (dyC / distC) * pull;
            }
            b.vx *= 0.9;
            b.vy *= 0.9;
            if (distC < 27 && Math.hypot(b.vx, b.vy) < 4.8) {
              b.encholada = true;
              b.captured = true;
              b.x = 500;
              b.y = 500;
              b.vx = 0;
              b.vy = 0;
              collisions.push({ step: sampleStep, x: 500, y: 500, intensity: 0.9, kind: 'hoyita' });
            }
          }
        } else {
          b.vx = 0;
          b.vy = 0;
        }
      });

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          if (bodies[i].encholada || bodies[j].encholada) continue;
          const dx = bodies[j].x - bodies[i].x;
          const dy = bodies[j].y - bodies[i].y;
          const dist = Math.hypot(dx, dy);
          const minD = bodies[i].radius + bodies[j].radius;
          if (dist < minD && dist > 0.0001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minD - dist;
            const tm = bodies[i].mass + bodies[j].mass;
            bodies[i].x -= nx * overlap * (bodies[j].mass / tm);
            bodies[i].y -= ny * overlap * (bodies[j].mass / tm);
            bodies[j].x += nx * overlap * (bodies[i].mass / tm);
            bodies[j].y += ny * overlap * (bodies[i].mass / tm);

            const rvx = bodies[j].vx - bodies[i].vx;
            const rvy = bodies[j].vy - bodies[i].vy;
            const vn = rvx * nx + rvy * ny;
            if (vn < 0) {
              const imp = (-(1 + 0.92) * vn) / (1 / bodies[i].mass + 1 / bodies[j].mass);
              bodies[i].vx -= (imp * nx) / bodies[i].mass;
              bodies[i].vy -= (imp * ny) / bodies[i].mass;
              bodies[j].vx += (imp * nx) / bodies[j].mass;
              bodies[j].vy += (imp * ny) / bodies[j].mass;
              bodies[i].moved = true;
              bodies[j].moved = true;
              if (i === 0 && bodies[j].rival_id && !ponchadosIds.includes(bodies[j].rival_id)) {
                ponchadosIds.push(bodies[j].rival_id);
              }
              if (collisions.length < 18) {
                collisions.push({
                  step: sampleStep,
                  x: Math.round((bodies[i].x + bodies[j].x) * 0.5),
                  y: Math.round((bodies[i].y + bodies[j].y) * 0.5),
                  intensity: Math.min(1, Math.max(0.2, Math.abs(vn) / 12)),
                  kind: bodies[i].rival_id || bodies[j].rival_id ? 'rival' : 'target'
                });
              }
            }
          }
        }
      }

      bodies.slice(1).forEach((b) => {
        if (b.target_id && !b.captured && Math.hypot(b.x - 500, b.y - 500) > 230) {
          b.captured = true;
        }
      });

      if (step % 2 === 0) {
        sampleStep++;
        bodies.forEach((b) => b.samples.push({ x: b.x, y: b.y }));
      }
    }

    const capturedIds = [];
    let pointsScored = bodies[0].encholada ? 50 : 0;
    bodies.slice(1).forEach((b) => {
      if (b.target_id) {
        const t = targets.find((m) => m.id === b.target_id);
        if (t) {
          t.x = b.x;
          t.y = b.y;
          if (b.captured) {
            t.active = false;
            capturedIds.push(t.id);
            pointsScored += b.points_val * (b.encholada ? 2 : 1);
          }
        }
      } else if (b.rival_id) {
        const rv = rivals.find((r) => r.id === b.rival_id);
        if (rv) {
          rv.x = b.x;
          rv.y = b.y;
        }
      }
    });

    if (ponchadosIds.length > 0) {
      pointsScored += (isCazador ? 40 : 25) * ponchadosIds.length;
    }

    const earnedBonus = Boolean(
      bonusRule && (capturedIds.length > 0 || bodies[0].encholada || ponchadosIds.length > 0)
    );

    const headlineEs = bodies[0].encholada
      ? `🕳️ ¡ENCHOLADA EN LA HOYITA! (+${pointsScored} pts)`
      : capturedIds.length > 0
        ? `🎯 ¡CHIRAS PELAS! Sacaste ${capturedIds.length} canica(s) (+${pointsScored} pts)`
        : ponchadosIds.length > 0
          ? `💥 ¡PONCHADO! Quemaste al rival (+${pointsScored} pts)`
          : '🔮 ¡Choquecito en la tierra!';

    const headlineEn = bodies[0].encholada
      ? `🕳️ SUNK IN LA HOYITA! (+${pointsScored} pts)`
      : capturedIds.length > 0
        ? `🎯 KNOCKOUT! Knocked out ${capturedIds.length} marble(s) (+${pointsScored} pts)`
        : ponchadosIds.length > 0
          ? `💥 RIVAL STRIKE! (+${pointsScored} pts)`
          : '🔮 Glass clack in the dirt!';

    return {
      mode,
      power,
      angle,
      spin,
      tier: 'fuerte',
      captured_ids: capturedIds,
      encholada_hoyita: bodies[0].encholada,
      ponchados_player_ids: ponchadosIds,
      points_scored: pointsScored,
      earned_bonus_shot: earnedBonus,
      headline_es: headlineEs,
      headline_en: headlineEn,
      dicho_es: '«¡Con uñita y buen pulso en el ruedo mexicano!»',
      dicho_en: '"With a sharp thumb flick in the Mexican ring!"',
      shooter_final_x: bodies[0].x,
      shooter_final_y: bodies[0].y,
      paths: bodies
        .filter((b) => b.moved || b.id_str === 'shooter')
        .map((b) => ({
          id: b.id_str,
          color: b.color,
          kind: b.kind,
          radius: b.radius,
          captured: b.captured,
          encholada: b.encholada,
          points: b.samples
        })),
      collisions
    };
  }

  function handleOfflineCommand(payload) {
    if (payload.type === 'create_room' || payload.type === 'join_room') {
      const code = payload.roomCode || 'CANI26';
      myPlayerId = 'p_local_1';
      const settings = payload.settings || {
        game_mode: 'torneo',
        win_condition: 'rounds',
        max_rounds: 5,
        target_score: 250,
        turn_timer_seconds: 0,
        bonus_shot_rule: true,
        combo_multiplier: true,
        ponche_steal: true,
        arena_theme: 'feria'
      };
      const initStage = stageForRoundLocal(settings.game_mode, 1);
      currentRoom = {
        code,
        state: 'lobby',
        settings,
        players: [
          {
            id: myPlayerId,
            name: payload.playerName || 'Jugador 1',
            avatar: payload.avatar || selectedAvatar,
            color: payload.color || selectedColor,
            score: 0,
            marbles_captured: 0,
            is_cazador: false,
            bonus_shot_pending: false,
            shooter_x: 500,
            shooter_y: 915,
            connected: true,
            is_host: true,
            is_bot: false,
            stats: { shots_taken: 0, best_shot_points: 0, marbles_knocked: 0, jackpots_hit: 0, ponches_dealt: 0, combos_hit: 0 }
          }
        ],
        current_turn_idx: 0,
        round_number: 1,
        shot_counter: 0,
        active_stage: initStage,
        feria_occupied_holes: [],
        patio_targets: generatePatioMarblesLocal(initStage === 'hoyita'),
        history: [],
        podium: [],
        awards: []
      };
      // Automatically add 1 bot in standalone mode so the user can play immediately, or let them add more!
      handleOfflineCommand({ type: 'add_bot' });
      handleServerMessage({ type: 'room_joined', playerId: myPlayerId, room: currentRoom });
      return;
    }

    if (!currentRoom) return;

    if (payload.type === 'add_bot') {
      if (currentRoom.players.length >= 10) return;
      const used = currentRoom.players.map((p) => p.name);
      const prof = BOT_PROFILES.find(([n]) => !used.includes(n)) || ['🤖 Bot Caniquero', '🔮'];
      const col = COLORS[currentRoom.players.length % COLORS.length];
      currentRoom.players.push({
        id: `bot_${currentRoom.players.length + 1}`,
        name: prof[0],
        avatar: prof[1],
        color: col,
        score: 0,
        marbles_captured: 0,
        is_cazador: false,
        bonus_shot_pending: false,
        shooter_x: 500,
        shooter_y: 85,
        connected: true,
        is_host: false,
        is_bot: true,
        stats: { shots_taken: 0, best_shot_points: 0, marbles_knocked: 0, jackpots_hit: 0, ponches_dealt: 0, combos_hit: 0 }
      });
      handleServerMessage({ type: 'room_updated', room: currentRoom });
    } else if (payload.type === 'remove_bot') {
      const idx = currentRoom.players.map((p) => p.is_bot).lastIndexOf(true);
      if (idx !== -1) {
        currentRoom.players.splice(idx, 1);
        handleServerMessage({ type: 'room_updated', room: currentRoom });
      }
    } else if (payload.type === 'start_game') {
      currentRoom.state = 'playing';
      currentRoom.current_turn_idx = 0;
      currentRoom.round_number = 1;
      currentRoom.shot_counter = 0;
      currentRoom.active_stage = stageForRoundLocal(currentRoom.settings.game_mode, 1);
      currentRoom.feria_occupied_holes = [];
      currentRoom.patio_targets = generatePatioMarblesLocal(currentRoom.active_stage === 'hoyita');
      currentRoom.players.forEach((p, i) => {
        p.score = 0;
        p.marbles_captured = 0;
        p.is_cazador = false;
        p.bonus_shot_pending = false;
        const rad = ((i * (360 / currentRoom.players.length) + 90) * Math.PI) / 180;
        p.shooter_x = Math.round(500 + 415 * Math.cos(rad));
        p.shooter_y = Math.round(500 + 415 * Math.sin(rad));
      });
      handleServerMessage({ type: 'game_started', room: currentRoom });
    } else if (payload.type === 'switch_stage') {
      currentRoom.active_stage = payload.stage;
      if (payload.stage !== 'feria') {
        currentRoom.patio_targets = generatePatioMarblesLocal(payload.stage === 'hoyita');
      } else {
        currentRoom.feria_occupied_holes = [];
      }
      handleServerMessage({ type: 'room_updated', room: currentRoom });
    } else if (payload.type === 'shoot_marble') {
      executeOfflineShot(payload.power ?? 0.72, payload.angle ?? 0, payload.spin ?? 0);
    } else if (payload.type === 'nudge_arena') {
      const me = currentRoom.players.find((p) => p.id === myPlayerId) || currentRoom.players[0];
      handleServerMessage({
        type: 'arena_nudged',
        playerId: me.id,
        playerName: me.name,
        avatar: me.avatar,
        kind: payload.kind
      });
    } else if (payload.type === 'send_banter') {
      const me = currentRoom.players.find((p) => p.id === myPlayerId) || currentRoom.players[0];
      handleServerMessage({
        type: 'player_banter',
        playerId: me.id,
        playerName: me.name,
        avatar: me.avatar,
        text: payload.text
      });
    } else if (payload.type === 'play_again') {
      currentRoom.state = 'lobby';
      handleServerMessage({ type: 'room_reset', room: currentRoom });
    }
  }

  function executeOfflineShot(power, angle, spin) {
    if (!currentRoom || currentRoom.state !== 'playing') return;
    const turnIdx = currentRoom.current_turn_idx;
    const p = currentRoom.players[turnIdx];
    if (!p) return;

    currentRoom.shot_counter++;
    const stage = currentRoom.active_stage;
    const wasGolden = p.bonus_shot_pending;
    let outcome;

    if (stage === 'feria') {
      const occIds = currentRoom.settings.combo_multiplier
        ? currentRoom.feria_occupied_holes.map((h) => h.hole_id)
        : [];
      const sim = simulateFeriaShotLocal(
        power,
        angle,
        spin,
        occIds,
        wasGolden && currentRoom.settings.combo_multiplier,
        currentRoom.settings.bonus_shot_rule
      );
      currentRoom.feria_occupied_holes.push({
        hole_id: sim.hole.id,
        player_id: p.id,
        player_name: p.name,
        color: p.color,
        points: sim.total_points
      });
      p.score += sim.total_points;
      p.marbles_captured += 1;
      p.bonus_shot_pending = sim.earned_bonus_shot;
      p.stats.best_shot_points = Math.max(p.stats.best_shot_points, sim.total_points);

      outcome = {
        shot_number: currentRoom.shot_counter,
        round_number: currentRoom.round_number,
        stage,
        player_id: p.id,
        player_name: p.name,
        player_avatar: p.avatar,
        player_color: p.color,
        points_scored: sim.total_points,
        new_total_score: p.score,
        earned_bonus_shot: sim.earned_bonus_shot,
        was_golden_marble: wasGolden,
        headline_es: `${sim.hole.icon} ¡${sim.hole.name_es}! +${sim.total_points} pts`,
        headline_en: `${sim.hole.icon} ${sim.hole.name_en}! +${sim.total_points} pts`,
        dicho_es: sim.hole.dicho_es,
        dicho_en: sim.hole.dicho_en,
        feria_sim: sim,
        patio_sim: null
      };
    } else {
      const seatDeg = turnIdx * (360 / currentRoom.players.length) + 90;
      const rivals = currentRoom.players
        .filter((_, idx) => idx !== turnIdx)
        .map((rp) => ({ id: rp.id, x: rp.shooter_x, y: rp.shooter_y, color: rp.color }));
      const sim = simulatePatioShotLocal(
        stage,
        seatDeg,
        p.color,
        p.is_cazador,
        power,
        angle,
        spin,
        currentRoom.patio_targets,
        rivals,
        currentRoom.settings.bonus_shot_rule && !wasGolden
      );
      rivals.forEach((rv) => {
        const rp = currentRoom.players.find((pl) => pl.id === rv.id);
        if (rp) {
          rp.shooter_x = rv.x;
          rp.shooter_y = rv.y;
        }
      });
      p.shooter_x = sim.shooter_final_x;
      p.shooter_y = sim.shooter_final_y;
      if (sim.encholada_hoyita) p.is_cazador = true;
      p.score += sim.points_scored;
      p.marbles_captured += sim.captured_ids.length + (sim.encholada_hoyita ? 1 : 0);
      p.bonus_shot_pending = sim.earned_bonus_shot;
      p.stats.best_shot_points = Math.max(p.stats.best_shot_points, sim.points_scored);

      if (currentRoom.patio_targets.filter((m) => m.active).length === 0) {
        currentRoom.patio_targets = generatePatioMarblesLocal(stage === 'hoyita');
      }

      outcome = {
        shot_number: currentRoom.shot_counter,
        round_number: currentRoom.round_number,
        stage,
        player_id: p.id,
        player_name: p.name,
        player_avatar: p.avatar,
        player_color: p.color,
        points_scored: sim.points_scored,
        new_total_score: p.score,
        earned_bonus_shot: sim.earned_bonus_shot,
        was_golden_marble: wasGolden,
        headline_es: sim.headline_es,
        headline_en: sim.headline_en,
        dicho_es: sim.dicho_es,
        dicho_en: sim.dicho_en,
        feria_sim: null,
        patio_sim: sim
      };
    }

    currentRoom.history.unshift({
      shot_number: outcome.shot_number,
      round_number: outcome.round_number,
      stage: outcome.stage,
      player_name: p.name,
      player_avatar: p.avatar,
      player_color: p.color,
      points_scored: outcome.points_scored,
      summary_es: outcome.headline_es,
      summary_en: outcome.headline_en
    });

    if (!outcome.earned_bonus_shot) {
      const nextIdx = (currentRoom.current_turn_idx + 1) % currentRoom.players.length;
      if (nextIdx === 0) {
        if (
          currentRoom.settings.win_condition === 'rounds' &&
          currentRoom.round_number >= currentRoom.settings.max_rounds
        ) {
          currentRoom.state = 'finished';
          const ranked = [...currentRoom.players].sort((a, b) => b.score - a.score);
          currentRoom.podium = ranked.slice(0, 3).map((pl, idx) => ({
            place: idx + 1,
            player_id: pl.id,
            name: pl.name,
            avatar: pl.avatar,
            color: pl.color,
            score: pl.score,
            marbles_captured: pl.marbles_captured
          }));
          currentRoom.victory_reason_es = `¡Campeón tras ${currentRoom.settings.max_rounds} rondas con ${ranked[0].score} puntos!`;
          currentRoom.victory_reason_en = `Champion after ${currentRoom.settings.max_rounds} rounds with ${ranked[0].score} points!`;
          currentRoom.awards = [
            {
              id: 'sniper',
              icon: '🎯',
              title_es: 'Mano Santa (Mejor Tiro)',
              title_en: 'Golden Thumb (Best Shot)',
              winner_name: ranked[0].name,
              winner_avatar: ranked[0].avatar,
              detail_es: `${ranked[0].stats.best_shot_points} pts en un tiro`,
              detail_en: `${ranked[0].stats.best_shot_points} pts in a single shot`
            }
          ];
        } else {
          currentRoom.round_number++;
          const nextStage = stageForRoundLocal(
            currentRoom.settings.game_mode,
            currentRoom.round_number
          );
          if (nextStage !== currentRoom.active_stage) {
            currentRoom.active_stage = nextStage;
            currentRoom.patio_targets = generatePatioMarblesLocal(nextStage === 'hoyita');
          }
          currentRoom.feria_occupied_holes = [];
        }
      }
      currentRoom.current_turn_idx = nextIdx;
    }

    handleServerMessage({ type: 'shot_result', outcome, room: currentRoom });

    if (currentRoom.state === 'playing') {
      const nextP = currentRoom.players[currentRoom.current_turn_idx];
      if (nextP && nextP.is_bot) {
        setTimeout(() => {
          if (currentRoom && currentRoom.state === 'playing') {
            executeOfflineShot(
              0.5 + Math.random() * 0.42,
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 0.5
            );
          }
        }, 2500);
      }
    }
  }

  // ==========================================================================
  // 1. INITIALIZATION & PROFILE PICKERS
  // ==========================================================================

  function initProfileUI() {
    inputName.value = window.safeStorage.getItem('canicas_name') || '';
    inputName.addEventListener('input', () => {
      window.safeStorage.setItem('canicas_name', inputName.value.trim());
    });

    avatarPicker.innerHTML = '';
    AVATARS.forEach((av) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `picker-item${av === selectedAvatar ? ' selected' : ''}`;
      btn.textContent = av;
      btn.addEventListener('click', () => {
        selectedAvatar = av;
        window.safeStorage.setItem('canicas_avatar', av);
        initProfileUI();
      });
      avatarPicker.appendChild(btn);
    });

    colorPicker.innerHTML = '';
    COLORS.forEach((col) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `picker-item color-swatch${col === selectedColor ? ' selected' : ''}`;
      btn.style.background = col;
      btn.addEventListener('click', () => {
        selectedColor = col;
        window.safeStorage.setItem('canicas_color', col);
        initProfileUI();
      });
      colorPicker.appendChild(btn);
    });
  }

  function applyThemeAndSkin() {
    const skin = MARBLE_SKINS[skinIdx];
    const theme = ARENA_THEMES[themeIdx];
    document.documentElement.setAttribute('data-marble-skin', skin.id);
    document.documentElement.setAttribute('data-theme', theme.id);
    document.getElementById('skin-label').textContent = lang === 'en' ? skin.labelEn : skin.labelEs;
    document.getElementById('theme-label').textContent = lang === 'en' ? theme.labelEn : theme.labelEs;
    window.safeStorage.setItem('canicas_skin', skin.id);
    window.safeStorage.setItem('canicas_theme', theme.id);
  }

  function applyTranslations() {
    const dict = I18N[lang] || I18N.es;
    document.getElementById('header-title').textContent = dict.header_title;
    document.getElementById('header-subtitle').textContent = dict.header_sub;
    document.getElementById('btn-lang').textContent = lang === 'es' ? '🌐 EN' : '🌐 ES';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
    applyThemeAndSkin();
    updateAngleLabel();
    if (currentRoom) {
      renderRoomState();
    }
  }

  function showToast(msg) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }

  function switchScreen(target) {
    [screenHome, screenLobby, screenGame].forEach((s) => s.classList.remove('active'));
    target.classList.add('active');
  }

  // ==========================================================================
  // 2. WEBSOCKET CONNECTION & PROTOCOL (WITH AUTOMATIC STANDALONE FALLBACK)
  // ==========================================================================

  function connectWebSocket(onOpenCallback) {
    if (useOfflineEngine) {
      if (onOpenCallback) onOpenCallback();
      return;
    }
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      if (ws.readyState === WebSocket.OPEN && onOpenCallback) {
        onOpenCallback();
      }
      return;
    }

    try {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${proto}//${window.location.host}/ws`);

      ws.addEventListener('open', () => {
        if (onOpenCallback) onOpenCallback();
      });

      ws.addEventListener('message', (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          handleServerMessage(msg);
        } catch (_) {}
      });

      ws.addEventListener('error', () => {
        useOfflineEngine = true;
        if (onOpenCallback) onOpenCallback();
      });
    } catch (_) {
      useOfflineEngine = true;
      if (onOpenCallback) onOpenCallback();
    }
  }

  function sendWs(payload) {
    if (useOfflineEngine) {
      handleOfflineCommand(payload);
      return;
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    } else {
      connectWebSocket(() => {
        if (useOfflineEngine) {
          handleOfflineCommand(payload);
        } else if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(payload));
        } else {
          useOfflineEngine = true;
          handleOfflineCommand(payload);
        }
      });
    }
  }

  function getPlayerName() {
    const raw = inputName.value.trim();
    if (raw) return raw;
    return lang === 'en' ? 'Player 1' : 'Jugador 1';
  }

  function handleServerMessage(msg) {
    switch (msg.type) {
      case 'room_joined': {
        myPlayerId = msg.playerId;
        currentRoom = msg.room;
        window.safeStorage.setItem('canicas_player_id', myPlayerId);
        window.safeStorage.setItem('canicas_room_code', currentRoom.code);
        renderRoomState();
        break;
      }

      case 'room_updated': {
        currentRoom = msg.room;
        renderRoomState();
        break;
      }

      case 'game_started': {
        currentRoom = msg.room;
        isAnimatingShot = false;
        activeAnim = null;
        document.getElementById('modal-victory').classList.add('hidden');
        renderRoomState();
        showToast(lang === 'en' ? '🔮 The arena is open! Aim and shoot!' : '🔮 ¡Se abrió el ruedo! Apunta y tira tu canica.');
        break;
      }

      case 'shot_result': {
        currentRoom = msg.room;
        startShotAnimation(msg.outcome);
        break;
      }

      case 'arena_nudged': {
        const stageBox = document.getElementById('canicas-stage-box');
        stageBox.classList.remove('shake-nudge');
        void stageBox.offsetWidth;
        stageBox.classList.add('shake-nudge');
        if (msg.kind === 'blow') {
          window.canicasAudio.playBlowSound();
          spawnBanterBubble(`${msg.avatar} ${msg.playerName}: 💨 ¡Fuuu!`);
        } else {
          window.canicasAudio.playTableTapSound();
          spawnBanterBubble(`${msg.avatar} ${msg.playerName}: 👊 ¡Toc-toc!`);
        }
        break;
      }

      case 'player_banter': {
        spawnBanterBubble(`${msg.avatar} ${msg.playerName}: ${msg.text}`);
        break;
      }

      case 'room_reset': {
        currentRoom = msg.room;
        isAnimatingShot = false;
        activeAnim = null;
        document.getElementById('modal-victory').classList.add('hidden');
        renderRoomState();
        break;
      }

      case 'error': {
        showToast(`⚠️ ${msg.message}`);
        break;
      }
    }
  }

  function spawnBanterBubble(text) {
    const layer = document.getElementById('banter-layer');
    const b = document.createElement('div');
    b.className = 'banter-bubble';
    b.textContent = text;
    b.style.top = `${12 + Math.random() * 18}%`;
    layer.appendChild(b);
    setTimeout(() => b.remove(), 2600);
  }

  // ==========================================================================
  // 3. RENDER ROOM STATE (LOBBY & GAME)
  // ==========================================================================

  function renderRoomState() {
    if (!currentRoom) return;

    if (currentRoom.state === 'lobby') {
      switchScreen(screenLobby);
      renderLobby();
    } else {
      switchScreen(screenGame);
      renderGameHUD();
      if (currentRoom.state === 'finished' && !isAnimatingShot) {
        showVictoryModal();
      }
    }
  }

  function renderLobby() {
    document.getElementById('lobby-code').textContent = currentRoom.code;

    const s = currentRoom.settings;
    const modeNames = {
      torneo: lang === 'en' ? '🏆 Mixed Tournament (Feria + Patio)' : '🏆 Torneo Mixto (Feria + Patio)',
      feria: lang === 'en' ? '🎡 Fairground Pinboard' : '🎡 Canicas de la Feria',
      circulo: lang === 'en' ? '⭕ El Círculo (Knockout Ring)' : '⭕ Patio: El Círculo',
      hoyita: lang === 'en' ? '🕳️ La Hoyita (Center Pit)' : '🕳️ Patio: La Hoyita'
    };

    const pills = [
      modeNames[s.game_mode] || modeNames.torneo,
      s.win_condition === 'target'
        ? `🎯 ${s.target_score} pts`
        : `🔄 ${s.max_rounds} ${lang === 'en' ? 'rounds' : 'rondas'}`,
      s.turn_timer_seconds > 0 ? `⏱️ ${s.turn_timer_seconds}s` : `⏱️ Manual`
    ];
    if (s.bonus_shot_rule) pills.push(lang === 'en' ? '🔥 Bonus Shot' : '🔥 Tiro Extra');
    if (s.combo_multiplier) pills.push('✨ Combo x2');
    if (s.ponche_steal) pills.push(lang === 'en' ? '💥 Strike Steal' : '💥 Ponche y Quema');

    const pillsBox = document.getElementById('lobby-rules-pills');
    pillsBox.innerHTML = pills.map((p) => `<span class="rule-pill">${p}</span>`).join('');

    document.getElementById('lobby-players-count').textContent =
      lang === 'en'
        ? `Players in Room (${currentRoom.players.length}/10)`
        : `Jugadores en la Sala (${currentRoom.players.length}/10)`;

    const list = document.getElementById('lobby-players-list');
    list.innerHTML = currentRoom.players
      .map(
        (p) => `
      <div class="lobby-player-card">
        <div class="lp-avatar" style="background:${p.color}">${p.avatar}</div>
        <div>
          <div class="lp-name">${escapeHtml(p.name)}</div>
          <span class="lp-tag">${p.is_host ? '👑 Host' : p.is_bot ? '🤖 Bot IA' : '🔮 Caniquero'}</span>
        </div>
      </div>`
      )
      .join('');

    const me = currentRoom.players.find((p) => p.id === myPlayerId);
    const isHost = Boolean(me && me.is_host);
    document.getElementById('host-bot-controls').classList.toggle('hidden', !isHost);
    document.getElementById('btn-start-game').classList.toggle('hidden', !isHost);
    document.getElementById('lobby-wait-msg').classList.toggle('hidden', isHost);
  }

  function renderGameHUD() {
    document.getElementById('game-room-badge').textContent = currentRoom.code;
    const s = currentRoom.settings;
    document.getElementById('game-round-badge').textContent =
      s.win_condition === 'rounds'
        ? `${lang === 'en' ? 'ROUND' : 'RONDA'} ${currentRoom.round_number}/${s.max_rounds}`
        : `${lang === 'en' ? 'TARGET' : 'META'} ${s.target_score} PTS`;

    const stageLabels = {
      feria: lang === 'en' ? '🎡 FAIRGROUND BOARD' : '🎡 FERIA DE CLAVOS',
      circulo: lang === 'en' ? '⭕ EL CÍRCULO (RING)' : '⭕ PATIO: EL CÍRCULO',
      hoyita: lang === 'en' ? '🕳️ LA HOYITA (PIT)' : '🕳️ PATIO: LA HOYITA'
    };
    document.getElementById('game-stage-badge').textContent =
      stageLabels[currentRoom.active_stage] || stageLabels.feria;

    const me = currentRoom.players.find((p) => p.id === myPlayerId);
    const isHost = Boolean(me && me.is_host);
    const switcher = document.getElementById('host-stage-switcher');
    switcher.classList.toggle('hidden', !isHost);
    switcher.querySelectorAll('.stage-switch-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.stage === currentRoom.active_stage);
    });

    const seatsRing = document.getElementById('seats-ring');
    seatsRing.innerHTML = currentRoom.players
      .map((p, idx) => {
        const isTurn = idx === currentRoom.current_turn_idx && currentRoom.state === 'playing';
        const badges = `${p.is_cazador ? '🔥' : ''}${p.bonus_shot_pending ? '🌟' : ''}`;
        return `
        <div class="seat-chip${isTurn ? ' active-turn' : ''}">
          <div class="seat-avatar" style="background:${p.color}">${p.avatar}</div>
          <div class="seat-info">
            <span class="seat-name">${escapeHtml(p.name)} ${badges}</span>
            <span class="seat-score">🏆 ${p.score} pts • 🔮 ${p.marbles_captured}</span>
          </div>
        </div>`;
      })
      .join('');

    const activePlayer = currentRoom.players[currentRoom.current_turn_idx];
    const isMyTurn = Boolean(
      activePlayer && activePlayer.id === myPlayerId && currentRoom.state === 'playing'
    );

    const turnEl = document.getElementById('turn-indicator');
    if (activePlayer) {
      turnEl.textContent = isMyTurn
        ? lang === 'en'
          ? `🎯 YOUR TURN, ${activePlayer.name}!`
          : `🎯 ¡TU TURNO, ${activePlayer.name}!`
        : `${lang === 'en' ? 'Turn of:' : 'Turno de:'} ${activePlayer.avatar} ${activePlayer.name}`;
    }

    const bonusPill = document.getElementById('bonus-shot-pill');
    bonusPill.classList.toggle('hidden', !(activePlayer && activePlayer.bonus_shot_pending));

    const shootBtn = document.getElementById('btn-shoot');
    shootBtn.disabled = !isMyTurn || isAnimatingShot;
  }

  // ==========================================================================
  // 4. SHOT ANIMATION ORCHESTRATION
  // ==========================================================================

  function startShotAnimation(outcome) {
    isAnimatingShot = true;
    renderGameHUD();

    if (outcome.stage === 'feria' && outcome.feria_sim) {
      window.canicasAudio.playPlungerLaunch(outcome.feria_sim.power);
      const sim = outcome.feria_sim;
      const playedHits = new Set();
      activeAnim = {
        kind: 'feria',
        outcome,
        sim,
        stepFloat: 0,
        speed: 0.72,
        playedHits
      };
    } else if (outcome.patio_sim) {
      window.canicasAudio.playThumbFlick(outcome.patio_sim.power);
      const sim = outcome.patio_sim;
      const maxSteps = Math.max(10, ...sim.paths.map((p) => p.points.length));
      const playedCollisions = new Set();
      activeAnim = {
        kind: 'patio',
        outcome,
        sim,
        stepFloat: 0,
        maxSteps,
        speed: 0.68,
        playedCollisions
      };
    } else {
      finishShotAnimation(outcome);
    }
  }

  function finishShotAnimation(outcome) {
    isAnimatingShot = false;
    activeAnim = null;

    const headline = lang === 'en' ? outcome.headline_en : outcome.headline_es;
    const dicho = lang === 'en' ? outcome.dicho_en : outcome.dicho_es;
    document.getElementById('outcome-headline').textContent = headline;
    document.getElementById('outcome-dicho').textContent = dicho;

    if (outcome.points_scored >= 75 || (outcome.patio_sim && outcome.patio_sim.encholada_hoyita)) {
      window.canicasAudio.playJackpotFanfare();
    } else if (outcome.points_scored > 0) {
      window.canicasAudio.playHoleDrop(outcome.points_scored);
    }

    if (outcome.points_scored > 0) {
      floatingPopups.push({
        x: 500,
        y: 340,
        text: `+${outcome.points_scored} PTS!`,
        color: '#fde047',
        alpha: 1.0,
        vy: -1.6
      });
    }

    window.canicasAudio.speak(`${headline}. ${dicho}`, lang);
    renderGameHUD();

    if (currentRoom && currentRoom.state === 'finished') {
      setTimeout(() => showVictoryModal(), 900);
    }
  }

  // ==========================================================================
  // 5. 3D GLASS MARBLE RENDERER & 60FPS CANVAS LOOP
  // ==========================================================================

  function drawGlassMarble(
    g,
    x,
    y,
    radius,
    baseColor = '#06b6d4',
    skin = 'aguita',
    spinPhase = 0,
    isGolden = false,
    isCazador = false
  ) {
    g.save();

    g.beginPath();
    g.arc(x + radius * 0.16, y + radius * 0.22, radius * 0.98, 0, Math.PI * 2);
    g.fillStyle = 'rgba(0, 0, 0, 0.42)';
    g.fill();

    if (isGolden) {
      g.beginPath();
      g.arc(x, y, radius + 4.5, 0, Math.PI * 2);
      g.strokeStyle = '#fde047';
      g.lineWidth = 3;
      g.stroke();
    } else if (isCazador) {
      g.beginPath();
      g.arc(x, y, radius + 4.5, 0, Math.PI * 2);
      g.strokeStyle = '#ef4444';
      g.lineWidth = 3;
      g.stroke();
    }

    const grad = g.createRadialGradient(
      x - radius * 0.32,
      y - radius * 0.32,
      radius * 0.1,
      x,
      y,
      radius
    );

    if (skin === 'lechera') {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.55, '#f1f5f9');
      grad.addColorStop(0.88, baseColor);
      grad.addColorStop(1, '#0f172a');
    } else if (skin === 'obsidiana') {
      grad.addColorStop(0, '#475569');
      grad.addColorStop(0.45, '#1e293b');
      grad.addColorStop(0.85, '#090d16');
      grad.addColorStop(1, '#000000');
    } else if (skin === 'galaxia') {
      grad.addColorStop(0, '#a5f3fc');
      grad.addColorStop(0.38, baseColor);
      grad.addColorStop(0.78, '#1e1b4b');
      grad.addColorStop(1, '#09071a');
    } else {
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(0.35, baseColor);
      grad.addColorStop(0.82, '#0f172a');
      grad.addColorStop(1, '#020617');
    }

    g.beginPath();
    g.arc(x, y, radius, 0, Math.PI * 2);
    g.fillStyle = grad;
    g.fill();

    g.save();
    g.beginPath();
    g.arc(x, y, radius * 0.92, 0, Math.PI * 2);
    g.clip();

    g.translate(x, y);
    g.rotate(spinPhase);

    g.beginPath();
    g.moveTo(-radius * 0.65, -radius * 0.25);
    g.bezierCurveTo(
      -radius * 0.15,
      -radius * 0.7,
      radius * 0.2,
      radius * 0.7,
      radius * 0.65,
      radius * 0.25
    );
    g.strokeStyle =
      skin === 'obsidiana'
        ? '#fbbf24'
        : isGolden
          ? '#fde047'
          : baseColor;
    g.lineWidth = radius * 0.34;
    g.lineCap = 'round';
    g.globalAlpha = 0.82;
    g.stroke();

    if (skin === 'galaxia') {
      g.fillStyle = '#fde047';
      for (let i = 0; i < 5; i++) {
        const ang = i * 1.25;
        const r = radius * 0.42;
        g.beginPath();
        g.arc(Math.cos(ang) * r, Math.sin(ang) * r, radius * 0.09, 0, Math.PI * 2);
        g.fill();
      }
    }
    g.restore();

    g.beginPath();
    g.ellipse(
      x - radius * 0.3,
      y - radius * 0.32,
      radius * 0.32,
      radius * 0.17,
      -0.48,
      0,
      Math.PI * 2
    );
    g.fillStyle = 'rgba(255, 255, 255, 0.76)';
    g.fill();

    g.beginPath();
    g.arc(x + radius * 0.28, y + radius * 0.28, radius * 0.1, 0, Math.PI * 2);
    g.fillStyle = 'rgba(255, 255, 255, 0.32)';
    g.fill();

    g.beginPath();
    g.arc(x, y, radius, 0, Math.PI * 2);
    g.strokeStyle = isGolden ? '#fde047' : 'rgba(255, 255, 255, 0.35)';
    g.lineWidth = 1.4;
    g.stroke();

    g.restore();
  }

  function renderProfilePreview() {
    if (!previewCanvas) return;
    const pctx = previewCanvas.getContext('2d');
    pctx.clearRect(0, 0, 56, 56);
    previewSpinPhase += 0.025;
    const skinId = MARBLE_SKINS[skinIdx].id;
    drawGlassMarble(pctx, 28, 28, 21, selectedColor, skinId, previewSpinPhase, false, false);
  }

  function renderArenaCanvas() {
    renderProfilePreview();

    if (!currentRoom || !screenGame.classList.contains('active')) {
      requestAnimationFrame(renderArenaCanvas);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stage = activeAnim ? activeAnim.outcome.stage : currentRoom.active_stage;
    if (stage === 'feria') {
      drawFeriaPinboard();
    } else {
      drawPatioCourtyard(stage);
    }

    drawEffectsLayer();
    requestAnimationFrame(renderArenaCanvas);
  }

  function drawFeriaPinboard() {
    const scaleY = 1150 / 1300;
    ctx.save();
    ctx.scale(1, scaleY);

    const woodGrad = ctx.createLinearGradient(0, 0, 1000, 1300);
    const theme = ARENA_THEMES[themeIdx].id;
    if (theme === 'talavera') {
      woodGrad.addColorStop(0, '#0f294a');
      woodGrad.addColorStop(1, '#08182e');
    } else if (theme === 'patio') {
      woodGrad.addColorStop(0, '#422817');
      woodGrad.addColorStop(1, '#26150b');
    } else {
      woodGrad.addColorStop(0, '#2c1810');
      woodGrad.addColorStop(0.5, '#3b2115');
      woodGrad.addColorStop(1, '#1e100a');
    }

    ctx.fillStyle = woodGrad;
    ctx.fillRect(40, 30, 920, 1230);

    ctx.lineWidth = 14;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(46, 36, 908, 1218);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fde047';
    ctx.strokeRect(56, 46, 888, 1198);

    ctx.save();
    ctx.beginPath();
    ctx.arc(500, 220, 420, Math.PI, 0, false);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.font = '900 26px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      lang === 'en' ? '🎡 GRAND MEXICAN MARBLE FAIR 🎡' : '🎡 GRAN FERIA DE CANICAS 🎡',
      468,
      92
    );
    ctx.restore();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
    ctx.fillRect(868, 195, 74, 1020);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(868, 225);
    ctx.lineTo(868, 1215);
    ctx.stroke();

    const activePlayer = currentRoom.players[currentRoom.current_turn_idx];
    const isMyTurn = Boolean(
      activePlayer && activePlayer.id === myPlayerId && !isAnimatingShot && currentRoom.state === 'playing'
    );
    if (isMyTurn) {
      const previewEntryX = Math.max(
        165,
        Math.min(775, 760 - shotPower * 520 + aimAngle * 135)
      );
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(165, 243, 252, 0.78)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(908, 980);
      ctx.lineTo(908, 220);
      ctx.quadraticCurveTo(908, 110, previewEntryX, 155);
      ctx.lineTo(previewEntryX + aimAngle * 45 + shotSpin * 55, 310);
      ctx.stroke();
      ctx.restore();
    }

    const occupiedMap = new Map();
    if (currentRoom.feria_occupied_holes) {
      currentRoom.feria_occupied_holes.forEach((oh) => {
        occupiedMap.set(oh.hole_id, oh);
      });
    }

    arenaMeta.feria_holes.forEach((h) => {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius + 7, 0, Math.PI * 2);
      ctx.fillStyle = h.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#090d16';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#fde047';
      ctx.stroke();

      const occ = occupiedMap.get(h.id);
      if (occ && (!activeAnim || activeAnim.sim.hole.id !== h.id || activeAnim.stepFloat < activeAnim.sim.path.length - 3)) {
        drawGlassMarble(
          ctx,
          h.x,
          h.y,
          h.radius * 0.68,
          occ.color,
          MARBLE_SKINS[skinIdx].id,
          0.4,
          false,
          false
        );
        if (currentRoom.settings.combo_multiplier) {
          ctx.fillStyle = '#fde047';
          ctx.font = '900 14px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('x2', h.x, h.y - h.radius - 10);
        }
      } else {
        ctx.font = '18px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(h.icon, h.x, h.y - 3);
        ctx.fillStyle = '#fef08a';
        ctx.font = '900 15px system-ui, sans-serif';
        ctx.fillText(`${h.points}`, h.x, h.y + 16);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
      ctx.font = '700 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lang === 'en' ? h.name_en : h.name_es, h.x, h.y + h.radius + 20);
    });

    arenaMeta.feria_nails.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x + 2, n.y + 3, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      const nGrad = ctx.createRadialGradient(n.x - 2, n.y - 2, 1, n.x, n.y, n.radius);
      nGrad.addColorStop(0, '#fef08a');
      nGrad.addColorStop(0.55, '#f59e0b');
      nGrad.addColorStop(1, '#78350f');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = nGrad;
      ctx.fill();
    });

    const compression = isAnimatingShot ? 0.1 : shotPower * 70;
    const plungerY = 1135 + compression;

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      const sy = plungerY + 12 + i * ((1210 - plungerY) / 6);
      ctx.beginPath();
      ctx.moveTo(886, sy);
      ctx.lineTo(926, sy + 5);
      ctx.stroke();
    }
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(882, plungerY, 48, 12);

    const skinId = MARBLE_SKINS[skinIdx].id;

    if (activeAnim && activeAnim.kind === 'feria') {
      const sim = activeAnim.sim;
      activeAnim.stepFloat += activeAnim.speed;
      const idx = Math.min(sim.path.length - 1, Math.floor(activeAnim.stepFloat));
      const nextIdx = Math.min(sim.path.length - 1, idx + 1);
      const frac = activeAnim.stepFloat - idx;

      const p0 = sim.path[idx];
      const p1 = sim.path[nextIdx];
      const mx = p0.x + (p1.x - p0.x) * frac;
      const my = p0.y + (p1.y - p0.y) * frac;

      sim.pin_hits.forEach((hit, hIdx) => {
        if (!activeAnim.playedHits.has(hIdx) && idx >= hit.step) {
          activeAnim.playedHits.add(hIdx);
          window.canicasAudio.playPinTing(hit.intensity, hit.y / 1200);
          spawnSparks(hit.x, hit.y * scaleY, '#fde047', 6);
        }
      });

      drawGlassMarble(
        ctx,
        mx,
        my,
        16.5,
        activeAnim.outcome.player_color,
        skinId,
        activeAnim.stepFloat * 0.35,
        activeAnim.outcome.was_golden_marble,
        false
      );

      if (activeAnim.stepFloat >= sim.path.length - 1) {
        finishShotAnimation(activeAnim.outcome);
      }
    } else if (activePlayer) {
      drawGlassMarble(
        ctx,
        906,
        plungerY - 17,
        16.5,
        activePlayer.color,
        skinId,
        previewSpinPhase,
        activePlayer.bonus_shot_pending,
        false
      );
    }

    ctx.restore();
  }

  function drawPatioCourtyard(stage) {
    const isHoyita = stage === 'hoyita';
    const offsetY = 75;

    ctx.save();
    const dirtGrad = ctx.createRadialGradient(500, 500 + offsetY, 60, 500, 500 + offsetY, 540);
    dirtGrad.addColorStop(0, '#5c3a21');
    dirtGrad.addColorStop(0.65, '#3d2414');
    dirtGrad.addColorStop(1, '#1f1108');
    ctx.fillStyle = dirtGrad;
    ctx.fillRect(25, 25, 950, 1100);

    ctx.lineWidth = 10;
    ctx.strokeStyle = '#b45309';
    ctx.strokeRect(30, 30, 940, 1090);

    ctx.fillStyle = '#fde047';
    ctx.font = '900 25px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      isHoyita
        ? '🕳️ PATIO DE TIERRA • LA HOYITA (EL POCHITO)'
        : '⭕ PATIO DE TIERRA • EL CÍRCULO (LA RUEDA)',
      500,
      72
    );

    ctx.translate(0, offsetY);

    ctx.save();
    ctx.beginPath();
    ctx.arc(500, 500, 415, 0, Math.PI * 2);
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(500, 500, 230, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fef3c7';
    ctx.stroke();

    if (isHoyita) {
      const pitGrad = ctx.createRadialGradient(500, 500, 4, 500, 500, 40);
      pitGrad.addColorStop(0, '#090503');
      pitGrad.addColorStop(0.7, '#291509');
      pitGrad.addColorStop(1, '#78350f');
      ctx.beginPath();
      ctx.arc(500, 500, 38, 0, Math.PI * 2);
      ctx.fillStyle = pitGrad;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = '800 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🕳️ HOYITA (+50)', 500, 554);
    }

    const skinId = MARBLE_SKINS[skinIdx].id;
    const totalPlayers = Math.max(1, currentRoom.players.length);
    const turnIdx = currentRoom.current_turn_idx;
    const activePlayer = currentRoom.players[turnIdx];

    if (activeAnim && activeAnim.kind === 'patio') {
      const sim = activeAnim.sim;
      activeAnim.stepFloat += activeAnim.speed;
      const stepIdx = Math.floor(activeAnim.stepFloat);

      sim.collisions.forEach((col, cIdx) => {
        if (!activeAnim.playedCollisions.has(cIdx) && stepIdx >= col.step) {
          activeAnim.playedCollisions.add(cIdx);
          if (col.kind === 'hoyita') {
            window.canicasAudio.playHoleDrop(50);
            spawnSparks(col.x, col.y + offsetY, '#fde047', 12);
          } else {
            window.canicasAudio.playGlassClack(col.intensity, col.kind === 'rival');
            spawnSparks(
              col.x,
              col.y + offsetY,
              col.kind === 'rival' ? '#ef4444' : '#e0f2fe',
              8
            );
          }
        }
      });

      const movingIds = new Set(sim.paths.map((p) => p.id));

      if (currentRoom.patio_targets) {
        currentRoom.patio_targets.forEach((t) => {
          if (t.active && !movingIds.has(`target_${t.id}`)) {
            drawGlassMarble(
              ctx,
              t.x,
              t.y,
              t.radius,
              t.color,
              t.kind === 'lechera' ? 'lechera' : skinId,
              0.2,
              t.kind === 'rey',
              false
            );
          }
        });
      }

      sim.paths.forEach((mp) => {
        const idx = Math.min(mp.points.length - 1, stepIdx);
        const nextIdx = Math.min(mp.points.length - 1, idx + 1);
        const frac = Math.min(1, Math.max(0, activeAnim.stepFloat - idx));
        const p0 = mp.points[idx];
        const p1 = mp.points[nextIdx];
        const mx = p0.x + (p1.x - p0.x) * frac;
        const my = p0.y + (p1.y - p0.y) * frac;

        drawGlassMarble(
          ctx,
          mx,
          my,
          mp.radius,
          mp.color,
          mp.kind === 'lechera' ? 'lechera' : skinId,
          activeAnim.stepFloat * 0.3,
          mp.kind === 'rey',
          false
        );
      });

      if (activeAnim.stepFloat >= activeAnim.maxSteps - 1) {
        finishShotAnimation(activeAnim.outcome);
      }
    } else {
      if (currentRoom.patio_targets) {
        currentRoom.patio_targets.forEach((t) => {
          if (!t.active) return;
          drawGlassMarble(
            ctx,
            t.x,
            t.y,
            t.radius,
            t.color,
            t.kind === 'lechera' ? 'lechera' : skinId,
            0.3,
            t.kind === 'rey',
            false
          );
          if (t.kind === 'rey') {
            ctx.fillStyle = '#fde047';
            ctx.font = '900 12px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👑 30', t.x, t.y - t.radius - 6);
          }
        });
      }

      currentRoom.players.forEach((p, idx) => {
        if (idx === turnIdx) return;
        drawGlassMarble(
          ctx,
          p.shooter_x,
          p.shooter_y,
          17,
          p.color,
          skinId,
          0,
          p.bonus_shot_pending,
          p.is_cazador
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '700 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${p.avatar} ${p.name}`, p.shooter_x, p.shooter_y + 30);
      });

      if (activePlayer) {
        const seatDeg = turnIdx * (360 / totalPlayers) + 90;
        const seatRad = (seatDeg * Math.PI) / 180;
        const sx = 500 + 415 * Math.cos(seatRad);
        const sy = 500 + 415 * Math.sin(seatRad);

        const inwardAngle = Math.atan2(500 - sy, 500 - sx);
        const aimRad = inwardAngle + ((aimAngle * 36) * Math.PI) / 180;
        const reach = 140 + shotPower * 280;
        const curveX = -Math.sin(aimRad) * shotSpin * 55;
        const curveY = Math.cos(aimRad) * shotSpin * 55;
        const endX = sx + Math.cos(aimRad) * reach + curveX;
        const endY = sy + Math.sin(aimRad) * reach + curveY;

        ctx.save();
        ctx.setLineDash([8, 7]);
        ctx.strokeStyle = 'rgba(165, 243, 252, 0.85)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(
          (sx + endX) * 0.5 + curveX * 0.4,
          (sy + endY) * 0.5 + curveY * 0.4,
          endX,
          endY
        );
        ctx.stroke();
        ctx.restore();

        drawGlassMarble(
          ctx,
          sx,
          sy,
          18.5,
          activePlayer.color,
          skinId,
          previewSpinPhase,
          activePlayer.bonus_shot_pending,
          activePlayer.is_cazador
        );

        ctx.fillStyle = '#fde047';
        ctx.font = '900 13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🎯 ${activePlayer.name}`, sx, sy + 34);
      }
    }

    ctx.restore();
  }

  function spawnSparks(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const spd = 2 + Math.random() * 4.5;
      sparkParticles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        color,
        alpha: 1.0,
        r: 3 + Math.random() * 2.5
      });
    }
  }

  function drawEffectsLayer() {
    for (let i = sparkParticles.length - 1; i >= 0; i--) {
      const p = sparkParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.045;
      if (p.alpha <= 0) {
        sparkParticles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }

    for (let i = floatingPopups.length - 1; i >= 0; i--) {
      const fp = floatingPopups[i];
      fp.y += fp.vy;
      fp.alpha -= 0.022;
      if (fp.alpha <= 0) {
        floatingPopups.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = fp.alpha;
      ctx.font = '900 34px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = fp.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(fp.text, fp.x, fp.y);
      ctx.fillText(fp.text, fp.x, fp.y);
      ctx.restore();
    }
  }

  // ==========================================================================
  // 6. USER CONTROLS, SLINGSHOT DRAG & EVENT LISTENERS
  // ==========================================================================

  function updateAngleLabel() {
    const deg = Math.round(aimAngle * 36);
    const label = document.getElementById('angle-val-label');
    if (deg === 0) {
      label.textContent = lang === 'en' ? 'Center (0°)' : 'Centro (0°)';
    } else if (deg < 0) {
      label.textContent = `${lang === 'en' ? 'Left' : 'Izq'} (${deg}°)`;
    } else {
      label.textContent = `${lang === 'en' ? 'Right' : 'Der'} (+${deg}°)`;
    }
  }

  function setPower(val) {
    shotPower = Math.max(0.12, Math.min(1.0, val));
    const pct = Math.round(shotPower * 100);
    document.getElementById('power-val-label').textContent = `${pct}%`;
    document.getElementById('power-meter-fill').style.width = `${pct}%`;
  }

  function triggerShoot() {
    if (!currentRoom || currentRoom.state !== 'playing' || isAnimatingShot) return;
    const activePlayer = currentRoom.players[currentRoom.current_turn_idx];
    if (!activePlayer || activePlayer.id !== myPlayerId) return;

    sendWs({
      type: 'shoot_marble',
      roomCode: currentRoom.code,
      power: shotPower,
      angle: aimAngle,
      spin: shotSpin
    });
  }

  function getCanvasCoords(ev) {
    const rect = canvas.getBoundingClientRect();
    const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
    const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  }

  canvas.addEventListener('pointerdown', (ev) => {
    if (!currentRoom || currentRoom.state !== 'playing' || isAnimatingShot) return;
    const activePlayer = currentRoom.players[currentRoom.current_turn_idx];
    if (!activePlayer || activePlayer.id !== myPlayerId) return;

    isDraggingCanvas = true;
    dragStartPt = getCanvasCoords(ev);
    canvas.setPointerCapture(ev.pointerId);
  });

  canvas.addEventListener('pointermove', (ev) => {
    if (!isDraggingCanvas || !dragStartPt) return;
    const pt = getCanvasCoords(ev);
    const dx = pt.x - dragStartPt.x;
    const dy = pt.y - dragStartPt.y;

    aimAngle = Math.max(-1.0, Math.min(1.0, dx / 220));
    document.getElementById('input-angle').value = String(Math.round(aimAngle * 100));
    updateAngleLabel();

    const dist = Math.hypot(dx, dy);
    if (dist > 15) {
      setPower(Math.min(1.0, 0.25 + dist / 340));
    }
  });

  canvas.addEventListener('pointerup', () => {
    if (!isDraggingCanvas) return;
    isDraggingCanvas = false;
    dragStartPt = null;
  });

  document.getElementById('input-angle').addEventListener('input', (ev) => {
    aimAngle = Number(ev.target.value) / 100;
    updateAngleLabel();
  });

  document.getElementById('btn-angle-left').addEventListener('click', () => {
    aimAngle = Math.max(-1.0, aimAngle - 0.15);
    document.getElementById('input-angle').value = String(Math.round(aimAngle * 100));
    updateAngleLabel();
  });

  document.getElementById('btn-angle-right').addEventListener('click', () => {
    aimAngle = Math.min(1.0, aimAngle + 0.15);
    document.getElementById('input-angle').value = String(Math.round(aimAngle * 100));
    updateAngleLabel();
  });

  document.querySelectorAll('.spin-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.spin-preset-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      shotSpin = Number(btn.dataset.spin);
    });
  });

  document.querySelectorAll('.power-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.power-preset-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setPower(Number(btn.dataset.power));
    });
  });

  const btnShoot = document.getElementById('btn-shoot');
  let holdTriggered = false;

  btnShoot.addEventListener('pointerdown', () => {
    if (btnShoot.disabled) return;
    holdTriggered = false;
    let dir = 1;
    chargeInterval = setInterval(() => {
      holdTriggered = true;
      isCharging = true;
      let nextP = shotPower + dir * 0.04;
      if (nextP >= 1.0) {
        nextP = 1.0;
        dir = -1;
      } else if (nextP <= 0.2) {
        nextP = 0.2;
        dir = 1;
      }
      setPower(nextP);
      window.canicasAudio.playChargeTick(shotPower);
    }, 55);
  });

  function stopChargeAndFire() {
    if (chargeInterval) {
      clearInterval(chargeInterval);
      chargeInterval = null;
    }
    if (isCharging || !holdTriggered) {
      isCharging = false;
      triggerShoot();
    }
  }

  btnShoot.addEventListener('pointerup', stopChargeAndFire);

  document.getElementById('btn-marble-skin').addEventListener('click', () => {
    skinIdx = (skinIdx + 1) % MARBLE_SKINS.length;
    applyThemeAndSkin();
  });

  document.getElementById('btn-theme').addEventListener('click', () => {
    themeIdx = (themeIdx + 1) % ARENA_THEMES.length;
    applyThemeAndSkin();
  });

  document.getElementById('btn-voice').addEventListener('click', () => {
    const on = window.canicasAudio.toggleVoice();
    document.getElementById('btn-voice').style.opacity = on ? '1' : '0.45';
  });

  document.getElementById('btn-mute').addEventListener('click', () => {
    const muted = window.canicasAudio.toggleMute();
    document.getElementById('btn-mute').textContent = muted ? '🔇' : '🔊';
  });

  document.getElementById('btn-lang').addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    window.safeStorage.setItem('canicas_lang', lang);
    applyTranslations();
  });

  document.getElementById('tab-create').addEventListener('click', () => {
    document.getElementById('tab-create').classList.add('active');
    document.getElementById('tab-join').classList.remove('active');
    document.getElementById('panel-create').classList.add('active');
    document.getElementById('panel-join').classList.remove('active');
  });

  document.getElementById('tab-join').addEventListener('click', () => {
    document.getElementById('tab-join').classList.add('active');
    document.getElementById('tab-create').classList.remove('active');
    document.getElementById('panel-join').classList.add('active');
    document.getElementById('panel-create').classList.remove('active');
  });

  document.getElementById('select-win-cond').addEventListener('change', (ev) => {
    const isTarget = ev.target.value === 'target';
    document.getElementById('group-target-score').classList.toggle('hidden', !isTarget);
    document.getElementById('group-max-rounds').classList.toggle('hidden', isTarget);
  });

  document.getElementById('btn-create-room').addEventListener('click', () => {
    window.canicasAudio.ensureContext();
    const settings = {
      game_mode: document.getElementById('select-mode').value,
      win_condition: document.getElementById('select-win-cond').value,
      max_rounds: Number(document.getElementById('select-max-rounds').value),
      target_score: Number(document.getElementById('select-target-score').value),
      turn_timer_seconds: Number(document.getElementById('select-timer').value),
      bonus_shot_rule: document.getElementById('chk-bonus-shot').checked,
      combo_multiplier: document.getElementById('chk-combo-mult').checked,
      ponche_steal: document.getElementById('chk-ponche-steal').checked,
      arena_theme: document.getElementById('select-arena-theme').value
    };
    sendWs({
      type: 'create_room',
      playerName: getPlayerName(),
      avatar: selectedAvatar,
      color: selectedColor,
      settings
    });
  });

  document.getElementById('btn-join-room').addEventListener('click', () => {
    window.canicasAudio.ensureContext();
    const code = document.getElementById('input-room-code').value.trim().toUpperCase();
    if (!code) {
      showToast(lang === 'en' ? 'Enter a 6-letter room code' : 'Ingresa el código de 6 letras');
      return;
    }
    sendWs({
      type: 'join_room',
      roomCode: code,
      playerName: getPlayerName(),
      avatar: selectedAvatar,
      color: selectedColor,
      playerId: myPlayerId
    });
  });

  document.getElementById('btn-add-bot').addEventListener('click', () => {
    if (currentRoom) sendWs({ type: 'add_bot', roomCode: currentRoom.code });
  });

  document.getElementById('btn-remove-bot').addEventListener('click', () => {
    if (currentRoom) sendWs({ type: 'remove_bot', roomCode: currentRoom.code });
  });

  document.getElementById('btn-start-game').addEventListener('click', () => {
    if (currentRoom) sendWs({ type: 'start_game', roomCode: currentRoom.code });
  });

  document.getElementById('btn-copy-link').addEventListener('click', () => {
    if (!currentRoom) return;
    const url = `${window.location.origin}/?room=${currentRoom.code}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast(lang === 'en' ? '🔗 Invite link copied!' : '🔗 ¡Enlace de invitación copiado!');
    });
  });

  document.getElementById('btn-qr').addEventListener('click', () => {
    if (!currentRoom) return;
    const qrBox = document.getElementById('qr-container');
    qrBox.innerHTML = '';
    const url = `${window.location.origin}/?room=${currentRoom.code}`;
    if (window.QRCode) {
      new window.QRCode(qrBox, { text: url, width: 190, height: 190 });
    }
    document.getElementById('qr-room-label').textContent = currentRoom.code;
    document.getElementById('modal-qr').classList.remove('hidden');
  });

  document.getElementById('btn-close-qr').addEventListener('click', () => {
    document.getElementById('modal-qr').classList.add('hidden');
  });

  function leaveCurrentRoom() {
    if (currentRoom && !useOfflineEngine) {
      sendWs({ type: 'leave_room', roomCode: currentRoom.code });
    }
    window.safeStorage.removeItem('canicas_room_code');
    currentRoom = null;
    switchScreen(screenHome);
  }

  document.getElementById('btn-leave-lobby').addEventListener('click', leaveCurrentRoom);
  document.getElementById('btn-leave-game').addEventListener('click', leaveCurrentRoom);

  document.querySelectorAll('.stage-switch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!currentRoom) return;
      sendWs({
        type: 'switch_stage',
        roomCode: currentRoom.code,
        stage: btn.dataset.stage
      });
    });
  });

  document.getElementById('btn-blow').addEventListener('click', () => {
    if (currentRoom) sendWs({ type: 'nudge_arena', roomCode: currentRoom.code, kind: 'blow' });
  });

  document.getElementById('btn-table-tap').addEventListener('click', () => {
    if (currentRoom) sendWs({ type: 'nudge_arena', roomCode: currentRoom.code, kind: 'tap' });
  });

  document.querySelectorAll('.banter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (!currentRoom) return;
      sendWs({
        type: 'send_banter',
        roomCode: currentRoom.code,
        text: chip.textContent.trim()
      });
    });
  });

  document.getElementById('btn-rules').addEventListener('click', () => {
    document.getElementById('modal-rules').classList.remove('hidden');
  });

  document.getElementById('btn-close-rules').addEventListener('click', () => {
    document.getElementById('modal-rules').classList.add('hidden');
  });

  document.getElementById('btn-open-history').addEventListener('click', () => {
    if (!currentRoom) return;
    const list = document.getElementById('history-list');
    if (!currentRoom.history || currentRoom.history.length === 0) {
      list.innerHTML = `<div class="history-item">${lang === 'en' ? 'No shots recorded yet.' : 'Aún no hay tiros registrados.'}</div>`;
    } else {
      list.innerHTML = currentRoom.history
        .map(
          (h) => `
        <div class="history-item">
          <span><strong>#${h.shot_number}</strong> (R${h.round_number}) ${h.player_avatar} <strong>${escapeHtml(h.player_name)}</strong>: ${escapeHtml(lang === 'en' ? h.summary_en : h.summary_es)}</span>
          <strong style="color:#fde047">+${h.points_scored} pts</strong>
        </div>`
        )
        .join('');
    }
    document.getElementById('modal-history').classList.remove('hidden');
  });

  document.getElementById('btn-close-history').addEventListener('click', () => {
    document.getElementById('modal-history').classList.add('hidden');
  });

  // ==========================================================================
  // 7. VICTORY MODAL & SHAREABLE 800x1000 TROPHY CERTIFICATE
  // ==========================================================================

  function showVictoryModal() {
    if (!currentRoom) return;
    window.canicasAudio.playVictoryFanfare();

    const reason =
      lang === 'en' ? currentRoom.victory_reason_en : currentRoom.victory_reason_es;
    document.getElementById('victory-reason').textContent = reason || '';

    const medals = ['🥇', '🥈', '🥉'];
    document.getElementById('victory-podium').innerHTML = (currentRoom.podium || [])
      .map(
        (p) => `
      <div class="podium-card place-${p.place}">
        <div style="font-size:1.85rem">${medals[p.place - 1] || '🏅'} ${p.avatar}</div>
        <div style="font-weight:900;margin-top:0.25rem">${escapeHtml(p.name)}</div>
        <div style="color:#fde047;font-weight:800;margin-top:0.2rem">${p.score} pts • 🔮 ${p.marbles_captured}</div>
      </div>`
      )
      .join('');

    document.getElementById('victory-awards').innerHTML = (currentRoom.awards || [])
      .map(
        (a) => `
      <div class="award-card">
        <div style="font-weight:900;color:#fde047">${a.icon} ${escapeHtml(lang === 'en' ? a.title_en : a.title_es)}</div>
        <div style="margin-top:0.2rem">${a.winner_avatar} <strong>${escapeHtml(a.winner_name)}</strong></div>
        <div style="color:#cbd5e1;font-size:0.74rem">${escapeHtml(lang === 'en' ? a.detail_en : a.detail_es)}</div>
      </div>`
      )
      .join('');

    document.getElementById('modal-victory').classList.remove('hidden');
  }

  document.getElementById('btn-play-again').addEventListener('click', () => {
    if (currentRoom) sendWs({ type: 'play_again', roomCode: currentRoom.code });
  });

  document.getElementById('btn-share-card').addEventListener('click', () => {
    if (!currentRoom) return;
    const vc = document.getElementById('victory-canvas');
    const vctx = vc.getContext('2d');

    const grad = vctx.createLinearGradient(0, 0, 800, 1000);
    grad.addColorStop(0, '#0b1623');
    grad.addColorStop(1, '#1e293b');
    vctx.fillStyle = grad;
    vctx.fillRect(0, 0, 800, 1000);

    vctx.strokeStyle = '#f59e0b';
    vctx.lineWidth = 10;
    vctx.strokeRect(24, 24, 752, 952);

    vctx.fillStyle = '#fde047';
    vctx.font = '900 42px system-ui, sans-serif';
    vctx.textAlign = 'center';
    vctx.fillText('🔮 CANICAS MEXICANAS 3D 🇲🇽', 400, 110);

    vctx.fillStyle = '#f8fafc';
    vctx.font = '700 24px system-ui, sans-serif';
    vctx.fillText(
      (lang === 'en' ? currentRoom.victory_reason_en : currentRoom.victory_reason_es) || '',
      400,
      165
    );

    (currentRoom.podium || []).forEach((p, idx) => {
      const y = 260 + idx * 110;
      vctx.fillStyle = 'rgba(255,255,255,0.08)';
      vctx.fillRect(90, y - 50, 620, 85);
      vctx.fillStyle = '#fde047';
      vctx.font = '900 30px system-ui, sans-serif';
      vctx.textAlign = 'left';
      vctx.fillText(`#${p.place} ${p.avatar} ${p.name}`, 120, y);
      vctx.textAlign = 'right';
      vctx.fillText(`${p.score} PTS (${p.marbles_captured} 🔮)`, 680, y);
    });

    vctx.textAlign = 'center';
    vctx.fillStyle = '#a5f3fc';
    vctx.font = '800 26px system-ui, sans-serif';
    vctx.fillText('🏅 RECONOCIMIENTOS DE LA MESA', 400, 630);

    (currentRoom.awards || []).forEach((a, idx) => {
      const y = 695 + idx * 62;
      vctx.fillStyle = '#f8fafc';
      vctx.font = '700 22px system-ui, sans-serif';
      vctx.fillText(
        `${a.icon} ${lang === 'en' ? a.title_en : a.title_es}: ${a.winner_avatar} ${a.winner_name} (${lang === 'en' ? a.detail_en : a.detail_es})`,
        400,
        y
      );
    });

    vc.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canicas-trofeo-${currentRoom.code}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // ==========================================================================
  // 8. TURN COUNTDOWN TIMER & URL / SESSION RESUME
  // ==========================================================================

  setInterval(() => {
    const disp = document.getElementById('timer-display');
    if (!currentRoom || currentRoom.state !== 'playing' || !currentRoom.turn_deadline_epoch) {
      disp.textContent = '∞';
      return;
    }
    const nowSec = Math.floor(Date.now() / 1000);
    const rem = Math.max(0, currentRoom.turn_deadline_epoch - nowSec);
    disp.textContent = `${rem}s`;
  }, 500);

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function checkAutoJoinOrResume() {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom) {
      document.getElementById('input-room-code').value = urlRoom.toUpperCase();
      document.getElementById('tab-join').click();
      return;
    }

    const savedRoom = window.safeStorage.getItem('canicas_room_code');
    if (savedRoom && myPlayerId) {
      const banner = document.getElementById('resume-banner');
      document.getElementById('resume-code').textContent = savedRoom;
      banner.classList.remove('hidden');

      document.getElementById('btn-resume-session').onclick = () => {
        banner.classList.add('hidden');
        sendWs({
          type: 'join_room',
          roomCode: savedRoom,
          playerName: getPlayerName(),
          avatar: selectedAvatar,
          color: selectedColor,
          playerId: myPlayerId
        });
      };

      document.getElementById('btn-dismiss-session').onclick = () => {
        window.safeStorage.removeItem('canicas_room_code');
        banner.classList.add('hidden');
      };
    }
  }

  if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  initProfileUI();
  applyTranslations();
  checkAutoJoinOrResume();
  requestAnimationFrame(renderArenaCanvas);
})();
