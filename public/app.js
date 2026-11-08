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
    { id: 1, x: 468, y: 1085, radius: 29, points: 100, tier: 'oro', icon: '👑', name_es: 'El Gallo de Oro', name_en: 'The Golden Rooster', dicho_es: '«¡Cien puntos al Gallo de Oro hasta el fondo del tablero, te llevaste el premio mayor!»', dicho_en: '"100 points in the Golden Rooster at the very bottom, you won the grand prize!"', color: '#f59e0b' },
    { id: 2, x: 312, y: 1085, radius: 29, points: 75, tier: 'diamante', icon: '💎', name_es: 'La Corona Real', name_en: 'The Royal Crown', dicho_es: '«¡Tiro de maestro hasta abajo directo a la Corona Real!»', dicho_en: '"Master shot all the way down into the Royal Crown!"', color: '#06b6d4' },
    { id: 3, x: 625, y: 1085, radius: 29, points: 75, tier: 'diamante', icon: '🌟', name_es: 'Estrella Azteca', name_en: 'Aztec Star', dicho_es: '«¡Brilló la Estrella Azteca en el fondo con setenta y cinco tantos!»', dicho_en: '"The Aztec Star shone bright at the bottom for 75 points!"', color: '#06b6d4' },
    { id: 4, x: 155, y: 1085, radius: 29, points: 50, tier: 'fuego', icon: '☀️', name_es: 'El Sol', name_en: 'The Sun', dicho_es: '«¡Como el sol de mediodía, cincuenta puntos al bolsillo!»', dicho_en: '"Like the midday sun, fifty points in your pocket!"', color: '#ef4444' },
    { id: 5, x: 780, y: 1085, radius: 29, points: 50, tier: 'fuego', icon: '🔥', name_es: 'El Diablo', name_en: 'The Fire Devil', dicho_es: '«¡Canica encendida hasta abajo, cayó en el hoyito de cincuenta!»', dicho_en: '"Blazing marble all the way down into the 50-point hole!"', color: '#ef4444' },
    { id: 6, x: 468, y: 955, radius: 27, points: 50, tier: 'fuego', icon: '🌙', name_es: 'La Luna', name_en: 'The Moon', dicho_es: '«¡Cruzaste todo el tablero hasta La Luna por cincuenta puntos!»', dicho_en: '"Crossed the board down to The Moon for fifty points!"', color: '#ec4899' },
    { id: 7, x: 170, y: 825, radius: 29, points: 30, tier: 'esmeralda', icon: '🔔', name_es: 'La Campana', name_en: 'The Bell', dicho_es: '«¡Suena la campana de la kermés con treinta puntos!»', dicho_en: '"The fairground bell rings for thirty points!"', color: '#10b981' },
    { id: 8, x: 765, y: 825, radius: 29, points: 30, tier: 'esmeralda', icon: '❤️', name_es: 'El Corazón', name_en: 'The Heart', dicho_es: '«¡Directo al Corazón, treinta buenos tantos!»', dicho_en: '"Straight to the Heart, thirty solid points!"', color: '#10b981' },
    { id: 9, x: 368, y: 825, radius: 29, points: 30, tier: 'esmeralda', icon: '🦜', name_es: 'El Perico', name_en: 'The Parrot', dicho_es: '«¡Cantó el perico verde, treinta puntos seguros!»', dicho_en: '"The green parrot sang, thirty safe points!"', color: '#10b981' },
    { id: 10, x: 568, y: 825, radius: 29, points: 30, tier: 'esmeralda', icon: '🎸', name_es: 'El Mariachi', name_en: 'The Mariachi', dicho_es: '«¡Con música de mariachi sumas treinta al marcador!»', dicho_en: '"With mariachi music you add thirty to the scoreboard!"', color: '#10b981' },
    { id: 11, x: 185, y: 565, radius: 30, points: 20, tier: 'barrio', icon: '🍉', name_es: 'La Sandía', name_en: 'The Watermelon', dicho_es: '«¡Fresca la sandía, veinte puntos bien ganados!»', dicho_en: '"Fresh watermelon, twenty points well earned!"', color: '#3b82f6' },
    { id: 12, x: 310, y: 695, radius: 30, points: 20, tier: 'barrio', icon: '🌵', name_es: 'El Nopal', name_en: 'The Cactus', dicho_es: '«¡Sin espinarse en los clavos, veinte puntos al Nopal!»', dicho_en: '"Dodging the brass nails, twenty points in The Cactus!"', color: '#3b82f6' },
    { id: 13, x: 625, y: 695, radius: 30, points: 20, tier: 'barrio', icon: '🌶️', name_es: 'El Chile', name_en: 'The Chili Pepper', dicho_es: '«¡Picosito pero sabroso, veinte tantos más!»', dicho_en: '"Spicy and sweet, twenty more points!"', color: '#3b82f6' },
    { id: 14, x: 750, y: 565, radius: 30, points: 20, tier: 'barrio', icon: '🏺', name_es: 'El Jarrito', name_en: 'The Clay Pitcher', dicho_es: '«¡Adentro del Jarrito de barro, veinte puntos!»', dicho_en: '"Inside the clay pitcher, twenty points!"', color: '#3b82f6' },
    { id: 15, x: 468, y: 565, radius: 30, points: 20, tier: 'barrio', icon: '🌺', name_es: 'La Dalia', name_en: 'The Dahlia', dicho_es: '«¡En la flor nacional, veinte puntos para tu cuenta!»', dicho_en: '"In the national flower, twenty points for your tally!"', color: '#3b82f6' },
    { id: 16, x: 468, y: 235, radius: 31, points: 10, tier: 'madera', icon: '🪙', name_es: 'El Quinto', name_en: 'The Nickel', dicho_es: '«¡De diez en diez se llena el jarrito!»', dicho_en: '"Ten by ten fills the pitcher!"', color: '#a855f7' },
    { id: 17, x: 255, y: 305, radius: 30, points: 10, tier: 'madera', icon: '💀', name_es: 'La Calavera', name_en: 'The Sugar Skull', dicho_es: '«¡La Calaverita de azúcar te regala diez puntos!»', dicho_en: '"The sugar skull treats you to ten points!"', color: '#a855f7' },
    { id: 18, x: 680, y: 305, radius: 30, points: 10, tier: 'madera', icon: '🤠', name_es: 'El Charro', name_en: 'The Charro', dicho_es: '«¡Con sombrero ancho, diez puntos al Charro!»', dicho_en: '"With a wide sombrero, ten points in The Charro!"', color: '#a855f7' },
    { id: 19, x: 355, y: 440, radius: 30, points: 10, tier: 'madera', icon: '🐸', name_es: 'La Rana', name_en: 'The Frog', dicho_es: '«¡Brincó la canica hasta La Rana, diez tantos!»', dicho_en: '"The marble hopped into The Frog, ten points!"', color: '#a855f7' },
    { id: 20, x: 580, y: 440, radius: 30, points: 10, tier: 'madera', icon: '🎺', name_es: 'La Trompeta', name_en: 'The Trumpet', dicho_es: '«¡Suena la trompeta de la feria con diez puntos!»', dicho_en: '"The fairground trumpet sounds for ten points!"', color: '#a855f7' }
  ];

  function buildDefaultFeriaNails() {
    const nails = [];
    let idCounter = 1;
    const canPlace = (nx, ny) => {
      const tooCloseHole = DEFAULT_FERIA_HOLES.some(
        (h) => Math.hypot(h.x - nx, h.y - ny) < h.radius + 17.5
      );
      const tooCloseNail = nails.some((n) => Math.hypot(n.x - nx, n.y - ny) < 41.5);
      return !tooCloseHole && !tooCloseNail;
    };
    const guarded = [
      [468, 955, 52, [-116, -64]],
      [170, 825, 52, [-162, -114, -66, -18]],
      [368, 825, 52, [-162, -114, -66, -18]],
      [568, 825, 52, [-162, -114, -66, -18]],
      [765, 825, 52, [-162, -114, -66, -18]],
      [185, 565, 52, [-162, -114, -66, -18]],
      [468, 565, 54, [-162, -114, -66, -18]],
      [750, 565, 52, [-162, -114, -66, -18]],
      [310, 695, 52, [-162, -114, -66, -18]],
      [625, 695, 52, [-162, -114, -66, -18]],
      [468, 235, 54, [-162, -124, -56, -18]],
      [255, 305, 54, [-162, -124, -56, -18]],
      [680, 305, 54, [-162, -124, -56, -18]],
      [355, 440, 54, [-162, -124, -56, -18]],
      [580, 440, 54, [-162, -124, -56, -18]]
    ];
    guarded.forEach(([cx, cy, r, degs]) => {
      degs.forEach((deg) => {
        const rad = (deg * Math.PI) / 180;
        const nx = Math.round(cx + r * Math.cos(rad));
        const ny = Math.round(cy + r * Math.sin(rad));
        if (nx >= 138 && nx <= 798 && canPlace(nx, ny)) {
          nails.push({ id: idCounter++, x: nx, y: ny, radius: 4.5 });
        }
      });
    });
    const rowYs = [168, 232, 298, 366, 434, 502, 570, 638, 706, 774, 842, 910];
    rowYs.forEach((ry, rowIdx) => {
      const count = rowIdx % 2 === 0 ? 10 : 9;
      const startX = rowIdx % 2 === 0 ? 138 : 174.5;
      for (let i = 0; i < count; i++) {
        const nx = Math.round(startX + i * 73);
        if (nx >= 138 && nx <= 798 && canPlace(nx, ry)) {
          nails.push({ id: idCounter++, x: nx, y: ry, radius: 4.5 });
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
      lobby_mode_label: '🎪 Cambiar Tipo de Juego (Anfitrión):',
      lobby_mode_feria: '🎡 Canicas de la Feria',
      lobby_mode_circulo: '⭕ Patio: El Círculo',
      lobby_mode_hoyita: '🕳️ Patio: La Hoyita',
      lobby_change_mode_label: '🎪 Cambiar Tipo de Juego en esta Sala (Anfitrión):',
      lobby_change_timer_label: '⏱️ Tiempo por Turno (cámbialo cuando quieras):',
      back_to_sala_short: 'Sala',
      sala_short: 'Sala',
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
      rules_intro: '¡Disfruta los <strong>dos estilos tradicionales de Canicas en México</strong>! Puedes cambiar el estilo en la Sala cuando quieras:'
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
      lobby_mode_label: '🎪 Change Game Type (Host):',
      lobby_change_mode_label: '🎪 Change Game Mode in this Room (Host):',
      lobby_change_timer_label: '⏱️ Turn Timer (change anytime):',
      lobby_mode_feria: '🎡 Fairground Board',
      lobby_mode_circulo: '⭕ Courtyard: El Círculo',
      lobby_mode_hoyita: '🕳️ Courtyard: La Hoyita',
      back_to_sala_short: 'Lobby',
      sala_short: 'Lobby',
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
  let patioSeatAngle = 90.0;
  let lastTurnPlayerId = null;
  let reyAngleToggle = false;
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
  let isDraggingRingPos = false;
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

  function generatePatioMarblesLocal(isHoyita, phaseDeg = 0) {
    const marbles = [];
    let id = 1;
    const reyRad = ((phaseDeg - 90) * Math.PI) / 180;
    marbles.push({
      id: id++,
      x: isHoyita ? Math.round(500 + 76 * Math.cos(reyRad)) : 500,
      y: isHoyita ? Math.round(500 + 76 * Math.sin(reyRad)) : 500,
      radius: 19,
      points: 30,
      kind: 'rey',
      color: '#f59e0b',
      active: true
    });
    const innerR = isHoyita ? 104 : 78;
    ['#ec4899', '#06b6d4', '#10b981', '#ef4444'].forEach((col, i) => {
      const rad = ((i * 90 + 45 + phaseDeg) * Math.PI) / 180;
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
    const outerR = 154;
    ['#3b82f6', '#8b5cf6', '#f97316', '#14b8a6', '#eab308', '#ec4899', '#10b981', '#06b6d4'].forEach((col, i) => {
      const rad = ((i * 45 + phaseDeg * 0.5) * Math.PI) / 180;
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

  function generatePatioStonesLocal(isHoyita, shotCounter = 0, blockedSeatDeg = 90, targets = []) {
    const stones = [];
    const minCenterD = isHoyita ? 52 : 38;
    const isClear = (sx, sy, sr) => {
      const dc = Math.hypot(sx - 500, sy - 500);
      if (dc < minCenterD || dc > 214) return false;
      const hitsMarble = (targets || []).some(
        (m) => m.active && Math.hypot(m.x - sx, m.y - sy) < m.radius + sr + 3
      );
      if (hitsMarble) return false;
      const hitsStone = stones.some((s) => Math.hypot(s.x - sx, s.y - sy) < s.r + sr + 5);
      return !hitsStone;
    };

    const placeRayBlocker = (rayDeg, sr) => {
      const candidateRadii = isHoyita
        ? [74, 96, 120, 146, 172, 196]
        : [84, 110, 136, 162, 188];
      for (const degOff of [0, 4, -4, 8, -8, 12, -12]) {
        const rad = ((rayDeg + degOff) * Math.PI) / 180;
        for (const distR of candidateRadii) {
          const sx = Math.round(500 + distR * Math.cos(rad));
          const sy = Math.round(500 + distR * Math.sin(rad));
          if (isClear(sx, sy, sr)) {
            stones.push({ x: sx, y: sy, r: sr });
            return;
          }
        }
      }
    };

    // 1. Primary blocker rock directly on the active shooter's straight ray!
    placeRayBlocker(blockedSeatDeg, 15.0);

    // 2. Base tactical rock at +120°
    placeRayBlocker((blockedSeatDeg + 120.0) % 360, 14.0);

    // 3. Base rock at -120° (Circulo) or initial pit guardian (Hoyita)
    if (isHoyita) {
      const rotJitter = (((shotCounter * 37) % 90) * Math.PI) / 180;
      const distR = 68.0;
      const sx = Math.round(500 + distR * Math.cos(rotJitter));
      const sy = Math.round(500 + distR * Math.sin(rotJitter));
      if (isClear(sx, sy, 13.5)) {
        stones.push({ x: sx, y: sy, r: 13.5 });
      }
    } else {
      placeRayBlocker(((blockedSeatDeg - 120.0) % 360 + 360) % 360, 14.0);
    }

    // Ensure we start with exactly 3 rocks at the beginning
    if (stones.length < 3) {
      for (let step = 1; step < 24; step++) {
        const altDeg = ((blockedSeatDeg + step * 15.0) % 360 + 360) % 360;
        placeRayBlocker(altDeg, 14.0);
        if (stones.length >= 3) break;
      }
    }

    // Dynamic progression: rocks ramp up as marbles disappear!
    const totalExpected = isHoyita ? 12 : 13;
    const activeMarbles = (targets || []).filter((m) => m.active).length;
    const missingMarbles = Math.max(0, totalExpected - activeMarbles);

    // If missingMarbles === 0 (start of game), we keep exactly 3 rocks!
    if (missingMarbles > 0) {
      // Extra Hoyita pit guardians as pit becomes accessible (up to 3 extra)
      if (isHoyita) {
        const extraGuardians = Math.min(3, Math.floor(missingMarbles / 4));
        const rotJitter = (((shotCounter * 37) % 90) * Math.PI) / 180;
        for (let i = 1; i <= extraGuardians; i++) {
          const baseAng = i * (Math.PI / 2) + rotJitter;
          const distR = 66 + ((shotCounter + i * 5) % 9);
          const sx = Math.round(500 + distR * Math.cos(baseAng));
          const sy = Math.round(500 + distR * Math.sin(baseAng));
          if (isClear(sx, sy, 13.5)) {
            stones.push({ x: sx, y: sy, r: 13.5 });
          }
        }
      }

      // Target total rocks = 3 base rocks + missingMarbles (up to 15 max)
      const targetTotalStones = 3 + Math.min(12, missingMarbles);

      for (let k = 0; k < 16; k++) {
        if (stones.length >= targetTotalStones) break;
        const seed =
          (Math.imul((shotCounter + 1) >>> 0, 2654435761) +
            Math.imul((k + 1) >>> 0, 1013904223)) >>>
          0;
        const baseDeg = (seed % 360) + k * 37;
        const distR = 85 + ((seed >>> 8) % 120);
        const sr = 13.5 + ((seed >>> 16) % 3);

        for (let step = 0; step < 24; step++) {
          const rad = ((baseDeg + step * 15) * Math.PI) / 180;
          const sx = Math.round(500 + distR * Math.cos(rad));
          const sy = Math.round(500 + distR * Math.sin(rad));
          if (isClear(sx, sy, sr)) {
            stones.push({ x: sx, y: sy, r: sr });
            break;
          }
        }
      }
    }

    return stones;
  }

  function stageForRoundLocal(gameMode, _roundNumber) {
    if (gameMode === 'circulo' || gameMode === 'hoyita') {
      return gameMode;
    }
    return 'feria';
  }

  function simulateFeriaShotLocal(rawPower, rawAngle, rawSpin, occupiedIds, isGolden, bonusRule) {
    const power = Math.max(0.1, Math.min(1.0, rawPower));
    const angle = Math.max(-1.0, Math.min(1.0, rawAngle));
    const spin = Math.max(-1.0, Math.min(1.0, rawSpin));
    const holes = arenaMeta.feria_holes;
    const nails = arenaMeta.feria_nails;
    const bottomDividers = [233.5, 390.0, 546.5, 702.5];
    const path = [];
    const pinHits = [];

    for (let i = 0; i < 16; i++) {
      path.push({ x: 908, y: Math.round((1120 - (i / 15) * 900) * 10) / 10 });
    }
    const jitter = (Math.random() - 0.5) * 40;
    const targetEntryX = Math.max(165, Math.min(775, 760 - power * 520 + angle * 135 + jitter));
    for (let i = 1; i <= 14; i++) {
      const frac = i / 14;
      const ease = 1 - Math.pow(1 - frac, 2);
      path.push({
        x: Math.round((908 - (908 - targetEntryX) * ease) * 10) / 10,
        y: Math.round((220 - Math.sin(frac * Math.PI) * 88 - frac * 68) * 10) / 10
      });
    }

    let x = targetEntryX;
    let y = 152;
    let vx = angle * 3.0 - power * 0.9 + (Math.random() - 0.5) * 1.8;
    let vy = 3.0 + power * 1.4;
    const marbleR = 13.5;
    let capturedHole = null;
    let lastHitNailId = 0;
    let lastHitStep = 0;
    let lastOccupiedDeflectId = 0;
    let lastOccupiedDeflectStep = 0;

    for (let frame = 0; frame < 360; frame++) {
      const stepIdx = path.length;

      for (let sub = 0; sub < 4; sub++) {
        vy += 0.095;
        vx += spin * 0.018;
        vx *= 0.995;
        vy *= 0.995;

        const spd = Math.hypot(vx, vy);
        if (spd > 8.2) {
          vx = (vx / spd) * 8.2;
          vy = (vy / spd) * 8.2;
        }

        x += vx * 0.25;
        y += vy * 0.25;

        const cornerInset = y > 1005 ? Math.min(1, Math.max(0, (y - 1005) / 80)) * 22 : 0;
        const minX = 118 + cornerInset;
        const maxX = 818 - cornerInset;
        if (x < minX) {
          x = minX;
          vx = Math.abs(vx) * 0.65 + 0.9;
        } else if (x > maxX) {
          x = maxX;
          vx = -Math.abs(vx) * 0.65 - 0.9;
        }

        if (y > 1088) {
          y = 1088;
          vy = 0;
        }

        for (const nail of nails) {
          const dx = x - nail.x;
          const dy = y - nail.y;
          const dist = Math.hypot(dx, dy);
          const minDist = marbleR + nail.radius;
          if (dist < minDist && dist > 0.0001) {
            const nx = dx / dist;
            const ny = dy / dist;
            x = nail.x + nx * (minDist + 0.3);
            y = nail.y + ny * (minDist + 0.3);

            const vn = vx * nx + vy * ny;
            if (vn < 0) {
              vx -= 1.42 * vn * nx;
              vy -= 1.42 * vn * ny;
              if (ny < -0.15 && Math.abs(vx) < 2.4) {
                const side =
                  Math.abs(nx) > 0.04
                    ? Math.sign(nx)
                    : Math.abs(spin) > 0.05
                      ? Math.sign(spin)
                      : Math.random() < 0.5
                        ? 1
                        : -1;
                vx = side * (2.3 + Math.random() * 0.9);
              }
              if (vy < 1.25) {
                vy = 1.25;
              }
              if (nail.id !== lastHitNailId || stepIdx > lastHitStep + 3) {
                pinHits.push({
                  step: stepIdx,
                  nail_id: nail.id,
                  x: nail.x,
                  y: nail.y,
                  intensity: Math.min(1, Math.max(0.25, Math.abs(vn) / 6.0))
                });
                lastHitNailId = nail.id;
                lastHitStep = stepIdx;
              }
            }
          }
        }

        if (y >= 1005) {
          const rampT = Math.min(1, Math.max(0, (y - 1005) / 80));
          const wedgeReach = 2.0 + rampT * 50.0;
          for (const divX of bottomDividers) {
            const dx = x - divX;
            if (Math.abs(dx) < wedgeReach) {
              const side =
                Math.abs(dx) > 0.05
                  ? Math.sign(dx)
                  : Math.abs(vx) > 0.05
                    ? Math.sign(vx)
                    : 1;
              x = divX + side * (wedgeReach + 0.25);
              vx = vx * 0.55 + side * 1.8;
              vy = Math.max(vy, 2.2);
            }
          }
        }

        for (const hole of holes) {
          const dx = hole.x - x;
          const dy = hole.y - y;
          const dist = Math.hypot(dx, dy);
          const speed = Math.hypot(vx, vy);
          const isOccupied = occupiedIds.includes(hole.id);

          if (isOccupied && dist < hole.radius + 10.0 && hole.y < 1050) {
            if (dist < 6.8 && speed < 3.1) {
              x = hole.x;
              y = hole.y;
              capturedHole = hole;
              break;
            } else if (
              hole.id !== lastOccupiedDeflectId ||
              stepIdx > lastOccupiedDeflectStep + 4
            ) {
              const outNx = -dx / Math.max(1, dist);
              const outNy = -dy / Math.max(1, dist);
              const side =
                Math.abs(outNx) > 0.06
                  ? Math.sign(outNx)
                  : Math.abs(vx) > 0.1
                    ? Math.sign(vx)
                    : Math.random() < 0.5
                      ? 1
                      : -1;
              if (dist < hole.radius - 2.0) {
                x = hole.x + outNx * (hole.radius - 1.5);
                y = hole.y + outNy * (hole.radius - 1.5);
              }
              vx = vx * 0.35 + outNx * 1.9 + side * (2.4 + Math.random() * 1.1);
              vy = Math.max(1.85, vy * 0.82 + Math.max(0.25, outNy) * 1.35);
              pinHits.push({
                step: stepIdx,
                nail_id: 1000 + hole.id,
                x: hole.x,
                y: hole.y,
                intensity: 0.9
              });
              lastOccupiedDeflectId = hole.id;
              lastOccupiedDeflectStep = stepIdx;
            }
          } else if (dist < hole.radius - 3.0) {
            if (
              isOccupied &&
              (hole.id !== lastOccupiedDeflectId || stepIdx > lastOccupiedDeflectStep + 6)
            ) {
              pinHits.push({
                step: stepIdx,
                nail_id: 1000 + hole.id,
                x: hole.x,
                y: hole.y,
                intensity: 0.8
              });
              lastOccupiedDeflectId = hole.id;
              lastOccupiedDeflectStep = stepIdx;
            }
            const pull = hole.y >= 1050 ? 2.65 : 2.45;
            vx = vx * 0.46 + (dx / Math.max(1, dist)) * pull;
            vy = vy * 0.46 + (dy / Math.max(1, dist)) * pull;
            if (dist < 7.5) {
              x = hole.x;
              y = hole.y;
              capturedHole = hole;
              break;
            }
          } else if (dist < hole.radius + (hole.points <= 20 ? 11.0 : 8.5) && hole.y < 1050) {
            const alignRatio = hole.points <= 20 ? 0.80 : 0.58;
            const tipSpeed = hole.points <= 20 ? 5.2 : 4.3;
            if ((Math.abs(dx) < hole.radius * alignRatio && dy > -2.5) || speed < tipSpeed) {
              vx = vx * 0.62 + (dx / Math.max(1, dist)) * 1.85;
              vy = vy * 0.74 + (dy / Math.max(1, dist)) * 1.70;
            } else {
              const outNx = -dx / Math.max(1, dist);
              const side =
                Math.abs(outNx) > 0.05
                  ? Math.sign(outNx)
                  : Math.abs(vx) > 0.05
                    ? Math.sign(vx)
                    : 1;
              vx = vx * 0.52 + outNx * 1.35 + side * 1.35;
              vy = Math.max(1.75, vy * 0.94);
            }
          }
        }

        if (capturedHole) break;
      }

      if (path.length >= 36) {
        const prev4 = path[path.length - 4];
        if (Math.hypot(x - prev4.x, y - prev4.y) < 5.0) {
          vx += (Math.random() < 0.5 ? 1 : -1) * 2.8;
          vy = Math.max(vy, 2.6);
        }
      }

      path.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
      if (capturedHole) break;
    }

    const finalHole =
      capturedHole ||
      holes.reduce((best, h) =>
        Math.hypot(h.x - x, h.y - y) < Math.hypot(best.x - x, best.y - y) ? h : best
      );

    path.push({ x: finalHole.x, y: finalHole.y });

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
    bonusRule,
    customStones
  ) {
    const isHoyita = mode === 'hoyita';
    const power = Math.max(0.1, Math.min(1.0, rawPower));
    const angle = Math.max(-1.0, Math.min(1.0, rawAngle));
    const spin = Math.max(-1.0, Math.min(1.0, rawSpin));

    const seatRad = (seatAngleDeg * Math.PI) / 180;
    const startX = 500 + 415 * Math.cos(seatRad);
    const startY = 500 + 415 * Math.sin(seatRad);
    const inwardAngle = Math.atan2(500 - startY, 500 - startX);
    const aimRad = inwardAngle + (angle * 42 * Math.PI) / 180 + (Math.random() - 0.5) * 0.04;
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

    const stones =
      customStones && customStones.length
        ? customStones
        : generatePatioStonesLocal(isHoyita, 0, seatAngleDeg, targets);
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

          stones.forEach((st) => {
            const dxS = b.x - st.x;
            const dyS = b.y - st.y;
            const distS = Math.hypot(dxS, dyS);
            const minS = b.radius + st.r;
            if (distS < minS && distS > 0.001) {
              const nx = dxS / distS;
              const ny = dyS / distS;
              b.x = st.x + nx * minS;
              b.y = st.y + ny * minS;
              const vn = b.vx * nx + b.vy * ny;
              if (vn < 0) {
                b.vx -= 1.82 * vn * nx;
                b.vy -= 1.82 * vn * ny;
                if (collisions.length < 18) {
                  collisions.push({
                    step: sampleStep,
                    x: st.x,
                    y: st.y,
                    intensity: Math.min(0.95, Math.max(0.25, Math.abs(vn) / 11)),
                    kind: 'stone'
                  });
                }
              }
            }
          });

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
    let pointsScored = 0;
    const hitMarble = collisions.some((c) => c.kind === 'target' || c.kind === 'rival');

    bodies.slice(1).forEach((b) => {
      if (b.target_id) {
        const t = targets.find((m) => m.id === b.target_id);
        if (t) {
          t.x = b.x;
          t.y = b.y;
          if (b.captured) {
            t.active = false;
            capturedIds.push(t.id);
            pointsScored += b.points_val * (b.encholada || isCazador ? 2 : 1);
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

    const repeatEmptyHoyita =
      bodies[0].encholada && isCazador && !hitMarble && capturedIds.length === 0 && ponchadosIds.length === 0;

    if (bodies[0].encholada) {
      if (repeatEmptyHoyita) {
        pointsScored += 10;
      } else if (hitMarble) {
        pointsScored += 60;
      } else {
        pointsScored += 45;
      }
    }

    if (ponchadosIds.length > 0) {
      pointsScored += (isCazador ? 40 : 25) * ponchadosIds.length;
    }

    const earnedBonus = Boolean(
      bonusRule &&
        (capturedIds.length > 0 ||
          (bodies[0].encholada && !repeatEmptyHoyita) ||
          ponchadosIds.length > 0)
    );

    const headlineEs = repeatEmptyHoyita
      ? '🔮 ¡Ya eres Cazador! (+10 pts) • ¡Saca canicas para Puntos x2!'
      : bodies[0].encholada
        ? `🕳️ ¡ENCHOLADA EN LA HOYITA! (+${pointsScored} pts)`
        : capturedIds.length > 0
          ? `🎯 ¡CHIRAS PELAS! Sacaste ${capturedIds.length} canica(s) (+${pointsScored} pts)`
          : ponchadosIds.length > 0
            ? `💥 ¡PONCHADO! Quemaste al rival (+${pointsScored} pts)`
            : '🔮 ¡Choquecito en la tierra!';

    const headlineEn = repeatEmptyHoyita
      ? '🔮 Already Hunter! (+10 pts) • Knock out marbles for 2x Points!'
      : bodies[0].encholada
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
      dicho_es: repeatEmptyHoyita
        ? '«Como ya eres Cazador, apunta a las canicas del ruedo (valen doble) o haz carambola.»'
        : '«¡Con uñita y buen pulso en el ruedo mexicano!»',
      dicho_en: repeatEmptyHoyita
        ? '"Since you are already Hunter, aim at the ring marbles (worth 2x) or bank off a marble!"'
        : '"With a sharp thumb flick in the Mexican ring!"',
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

  function saveCurrentRoomLocally() {
    if (!currentRoom) return;
    try {
      window.safeStorage.setItem('canicas_room_code', currentRoom.code);
      if (myPlayerId) {
        window.safeStorage.setItem('canicas_player_id', myPlayerId);
      }
      window.safeStorage.setItem('canicas_offline_room', JSON.stringify(currentRoom));
    } catch (_) {}
  }

  function handleOfflineCommand(payload) {
    if (payload.type === 'create_room' || payload.type === 'join_room') {
      const code = (payload.roomCode || 'CANI26').trim().toUpperCase();
      myPlayerId = payload.playerId || myPlayerId || 'p_local_1';

      // Check if reconnecting to an existing saved offline room!
      const savedOffline = window.safeStorage.getItem('canicas_offline_room');
      if (savedOffline) {
        try {
          const parsed = JSON.parse(savedOffline);
          if (parsed && parsed.code && (!code || parsed.code.toUpperCase() === code)) {
            currentRoom = parsed;
            handleServerMessage({ type: 'room_joined', playerId: myPlayerId, room: currentRoom });
            return;
          }
        } catch (_) {}
      }

      const settings = payload.settings || {
        game_mode: 'feria',
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
        patio_stones: generatePatioStonesLocal(
          initStage === 'hoyita',
          0,
          90,
          generatePatioMarblesLocal(initStage === 'hoyita')
        ),
        history: [],
        podium: [],
        awards: []
      };
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
      currentRoom.patio_stones = generatePatioStonesLocal(
        currentRoom.active_stage === 'hoyita',
        0,
        90,
        currentRoom.patio_targets
      );
      currentRoom.players.forEach((p, i) => {
        p.score = 0;
        p.marbles_captured = 0;
        p.is_cazador = false;
        p.bonus_shot_pending = false;
        const deg = (i * (360 / currentRoom.players.length) + 90);
        p.seat_angle = deg;
        const rad = (deg * Math.PI) / 180;
        p.shooter_x = Math.round(500 + 415 * Math.cos(rad));
        p.shooter_y = Math.round(500 + 415 * Math.sin(rad));
      });
      refreshOfflineTurnDeadline(currentRoom);
      saveCurrentRoomLocally();
      handleServerMessage({ type: 'game_started', room: currentRoom });
      if (currentRoom.players[0] && currentRoom.players[0].is_bot) {
        setTimeout(() => {
          if (currentRoom && currentRoom.state === 'playing' && !isAnimatingShot) {
            executeOfflineShot(
              0.5 + Math.random() * 0.42,
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 0.5
            );
          }
        }, 750);
      }
    } else if (payload.type === 'set_seat_angle') {
      const p = currentRoom.players.find((pl) => pl.id === myPlayerId) || currentRoom.players[currentRoom.current_turn_idx];
      if (p) {
        const deg = ((Number(payload.seatAngle) % 360) + 360) % 360;
        p.seat_angle = deg;
        const rad = (deg * Math.PI) / 180;
        p.shooter_x = Math.round(500 + 415 * Math.cos(rad));
        p.shooter_y = Math.round(500 + 415 * Math.sin(rad));
        saveCurrentRoomLocally();
        handleServerMessage({ type: 'room_updated', room: currentRoom });
      }
    } else if (payload.type === 'shoot_marble') {
      executeOfflineShot(
        payload.power ?? 0.72,
        payload.angle ?? 0,
        payload.spin ?? 0,
        payload.seatAngle
      );
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
    } else if (payload.type === 'update_settings' && payload.settings) {
      if (currentRoom.state === 'playing') {
        const safeSettings = Object.assign({}, payload.settings);
        delete safeSettings.game_mode;
        currentRoom.settings = Object.assign({}, currentRoom.settings, safeSettings);
      } else {
        currentRoom.settings = Object.assign({}, currentRoom.settings, payload.settings);
        currentRoom.active_stage = stageForRoundLocal(currentRoom.settings.game_mode, 1);
        currentRoom.feria_occupied_holes = [];
        currentRoom.patio_targets = generatePatioMarblesLocal(currentRoom.active_stage === 'hoyita');
        currentRoom.patio_stones = generatePatioStonesLocal(
          currentRoom.active_stage === 'hoyita',
          0,
          90,
          currentRoom.patio_targets
        );
      }
      refreshOfflineTurnDeadline(currentRoom);
      handleServerMessage({ type: 'room_updated', room: currentRoom });
    } else if (payload.type === 'switch_stage' && payload.stage) {
      if (currentRoom.state === 'playing') {
        return; // Changing game mode mid-match is not allowed
      }
      currentRoom.settings.game_mode = payload.stage;
      currentRoom.active_stage = payload.stage;
      currentRoom.feria_occupied_holes = [];
      currentRoom.patio_targets = generatePatioMarblesLocal(payload.stage === 'hoyita');
      currentRoom.patio_stones = generatePatioStonesLocal(
        payload.stage === 'hoyita',
        currentRoom.shot_counter || 0,
        90,
        currentRoom.patio_targets
      );
      refreshOfflineTurnDeadline(currentRoom);
      saveCurrentRoomLocally();
      handleServerMessage({ type: 'room_updated', room: currentRoom });
      checkAndTriggerBotShot();
    } else if (payload.type === 'play_again') {
      currentRoom.state = 'lobby';
      currentRoom.current_turn_idx = 0;
      currentRoom.round_number = 1;
      currentRoom.shot_counter = 0;
      currentRoom.last_shot = null;
      currentRoom.turn_deadline_epoch = null;
      currentRoom.feria_occupied_holes = [];
      currentRoom.winner_id = null;
      currentRoom.victory_reason_es = null;
      currentRoom.victory_reason_en = null;
      currentRoom.podium = [];
      currentRoom.awards = [];
      currentRoom.players.forEach((p) => {
        p.score = 0;
        p.marbles_captured = 0;
        p.is_cazador = false;
        p.bonus_shot_pending = false;
        p.combo_count = 0;
      });
      currentRoom.active_stage = stageForRoundLocal(currentRoom.settings.game_mode, 1);
      currentRoom.patio_targets = generatePatioMarblesLocal(currentRoom.active_stage === 'hoyita');
      currentRoom.patio_stones = generatePatioStonesLocal(
        currentRoom.active_stage === 'hoyita',
        0,
        90,
        currentRoom.patio_targets
      );
      saveCurrentRoomLocally();
      handleServerMessage({ type: 'room_reset', room: currentRoom });
    }
  }

  function refreshOfflineTurnDeadline(room) {
    if (!room) return;
    const secs = Number(room.settings && room.settings.turn_timer_seconds) || 0;
    if (room.state === 'playing' && secs > 0) {
      room.turn_deadline_epoch = Math.floor(Date.now() / 1000) + secs;
    } else {
      room.turn_deadline_epoch = null;
    }
  }

  function executeOfflineShot(power, angle, spin, customSeatAngle) {
    const baseRoom = pendingRoomAfterAnim || currentRoom;
    if (!baseRoom || baseRoom.state !== 'playing') return;
    const nextRoom = JSON.parse(JSON.stringify(baseRoom));
    const turnIdx = nextRoom.current_turn_idx;
    const p = nextRoom.players[turnIdx];
    if (!p) return;

    nextRoom.shot_counter++;
    const stage = stageForRoundLocal(nextRoom.settings.game_mode, nextRoom.round_number);
    nextRoom.active_stage = stage;
    const wasGolden = p.bonus_shot_pending;
    let outcome;
    const defaultSeatDeg = (p.seat_angle != null && Number.isFinite(p.seat_angle))
      ? p.seat_angle
      : turnIdx * (360 / Math.max(1, nextRoom.players.length)) + 90;
    let seatDeg =
      typeof customSeatAngle === 'number' && Number.isFinite(customSeatAngle)
        ? ((customSeatAngle % 360) + 360) % 360
        : (p.id === myPlayerId ? patioSeatAngle : defaultSeatDeg);

    if (stage === 'feria') {
      const occIds = nextRoom.feria_occupied_holes.map((h) => h.hole_id);
      const sim = simulateFeriaShotLocal(
        power,
        angle,
        spin,
        occIds,
        wasGolden && nextRoom.settings.combo_multiplier,
        nextRoom.settings.bonus_shot_rule
      );
      nextRoom.feria_occupied_holes.push({
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
        shot_number: nextRoom.shot_counter,
        round_number: nextRoom.round_number,
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
      p.seat_angle = seatDeg;
      const rivals = nextRoom.players
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
        nextRoom.patio_targets,
        rivals,
        nextRoom.settings.bonus_shot_rule && !wasGolden,
        nextRoom.patio_stones
      );
      rivals.forEach((rv) => {
        const rp = nextRoom.players.find((pl) => pl.id === rv.id);
        if (rp) {
          rp.shooter_x = rv.x;
          rp.shooter_y = rv.y;
        }
      });
      p.shooter_x = sim.shooter_final_x;
      p.shooter_y = sim.shooter_final_y;
      if (sim.encholada_hoyita) p.is_cazador = true;

      let totalPts = sim.points_scored;
      let headlineEs = sim.headline_es;
      let headlineEn = sim.headline_en;

      const remainingActive = nextRoom.patio_targets.filter((m) => m.active).length;
      if (remainingActive <= 4) {
        const phase = nextRoom.shot_counter * 53;
        nextRoom.patio_targets = generatePatioMarblesLocal(stage === 'hoyita', phase);
        if (sim.captured_ids.length > 0) {
          totalPts += 15;
          headlineEs += ' • 🌊 ¡Nueva tanda (+15)!';
          headlineEn += ' • 🌊 New wave (+15)!';
        }
      }

      p.score += totalPts;
      p.marbles_captured += sim.captured_ids.length + (sim.encholada_hoyita ? 1 : 0);
      p.bonus_shot_pending = sim.earned_bonus_shot;
      p.stats.best_shot_points = Math.max(p.stats.best_shot_points, totalPts);

      outcome = {
        shot_number: nextRoom.shot_counter,
        round_number: nextRoom.round_number,
        stage,
        player_id: p.id,
        player_name: p.name,
        player_avatar: p.avatar,
        player_color: p.color,
        points_scored: totalPts,
        new_total_score: p.score,
        earned_bonus_shot: sim.earned_bonus_shot,
        was_golden_marble: wasGolden,
        headline_es: headlineEs,
        headline_en: headlineEn,
        dicho_es: sim.dicho_es,
        dicho_en: sim.dicho_en,
        feria_sim: null,
        patio_sim: sim
      };
    }

    nextRoom.history.unshift({
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

    if (
      nextRoom.settings.win_condition === 'target' &&
      p.score >= nextRoom.settings.target_score
    ) {
      nextRoom.state = 'finished';
      const ranked = [...nextRoom.players].sort((a, b) => b.score - a.score);
      nextRoom.podium = ranked.slice(0, 3).map((pl, idx) => ({
        place: idx + 1,
        player_id: pl.id,
        name: pl.name,
        avatar: pl.avatar,
        color: pl.color,
        score: pl.score,
        marbles_captured: pl.marbles_captured
      }));
      nextRoom.victory_reason_es = `¡${ranked[0].name} alcanzó la meta con ${ranked[0].score} puntos!`;
      nextRoom.victory_reason_en = `${ranked[0].name} reached the target with ${ranked[0].score} points!`;
    } else if (!outcome.earned_bonus_shot) {
      const nextIdx = (nextRoom.current_turn_idx + 1) % nextRoom.players.length;
      if (nextIdx === 0) {
        if (
          nextRoom.settings.win_condition === 'rounds' &&
          nextRoom.round_number >= nextRoom.settings.max_rounds
        ) {
          nextRoom.state = 'finished';
          const ranked = [...nextRoom.players].sort((a, b) => b.score - a.score);
          nextRoom.podium = ranked.slice(0, 3).map((pl, idx) => ({
            place: idx + 1,
            player_id: pl.id,
            name: pl.name,
            avatar: pl.avatar,
            color: pl.color,
            score: pl.score,
            marbles_captured: pl.marbles_captured
          }));
          nextRoom.victory_reason_es = `¡Campeón tras ${nextRoom.settings.max_rounds} rondas con ${ranked[0].score} puntos!`;
          nextRoom.victory_reason_en = `Champion after ${nextRoom.settings.max_rounds} rounds with ${ranked[0].score} points!`;
          nextRoom.awards = [
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
          nextRoom.round_number++;
          if (nextRoom.feria_occupied_holes.length >= 14) {
            nextRoom.feria_occupied_holes = [];
          }
        }
      }
      nextRoom.current_turn_idx = nextIdx;
    }

    if (nextRoom.active_stage !== 'feria') {
      const nextP = nextRoom.players[nextRoom.current_turn_idx];
      const defaultNextDeg = nextRoom.current_turn_idx * (360 / Math.max(1, nextRoom.players.length)) + 90;
      const nextSeatDeg = outcome.earned_bonus_shot
        ? seatDeg
        : (nextP && nextP.seat_angle != null ? nextP.seat_angle : defaultNextDeg);
      nextRoom.patio_stones = generatePatioStonesLocal(
        nextRoom.active_stage === 'hoyita',
        nextRoom.shot_counter,
        nextSeatDeg,
        nextRoom.patio_targets
      );
    }

    refreshOfflineTurnDeadline(nextRoom);
    saveCurrentRoomLocally();
    handleServerMessage({ type: 'shot_result', outcome, room: nextRoom });
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

  let pendingWsMessages = [];

  function connectWebSocket(onOpenCallback) {
    if (useOfflineEngine) {
      if (onOpenCallback) onOpenCallback();
      return;
    }

    if (onOpenCallback) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        onOpenCallback();
        return;
      }
      pendingWsMessages.push(onOpenCallback);
    }

    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${proto}//${window.location.host}/ws`);

      ws.addEventListener('open', () => {
        const queued = [...pendingWsMessages];
        pendingWsMessages = [];
        queued.forEach((cb) => {
          try {
            cb();
          } catch (e) {
            console.error(e);
          }
        });
      });

      ws.addEventListener('message', (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          handleServerMessage(msg);
        } catch (_) {}
      });

      ws.addEventListener('close', () => {
        // If we are in an active room, try reconnecting automatically after a brief delay
        if (currentRoom && myPlayerId && !useOfflineEngine) {
          setTimeout(() => {
            if (currentRoom && myPlayerId) {
              connectWebSocket(() => {
                sendWs({
                  type: 'join_room',
                  roomCode: currentRoom.code,
                  playerName: getPlayerName(),
                  avatar: selectedAvatar,
                  color: selectedColor,
                  playerId: myPlayerId
                });
              });
            }
          }, 1200);
        }
      });

      ws.addEventListener('error', () => {
        useOfflineEngine = true;
        const queued = [...pendingWsMessages];
        pendingWsMessages = [];
        queued.forEach((cb) => {
          try { cb(); } catch (e) { console.error(e); }
        });
      });
    } catch (_) {
      useOfflineEngine = true;
      const queued = [...pendingWsMessages];
      pendingWsMessages = [];
      queued.forEach((cb) => {
        try { cb(); } catch (e) { console.error(e); }
      });
    }
  }

  function sendWs(payload) {
    if (useOfflineEngine) {
      handleOfflineCommand(payload);
      return;
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(payload));
      } catch (_) {
        connectWebSocket(() => sendWs(payload));
      }
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

  let pendingRoomAfterAnim = null;
  let pendingShotQueue = [];

  function handleServerMessage(msg) {
    if (msg.room && msg.room.settings) {
      msg.room.active_stage = stageForRoundLocal(msg.room.settings.game_mode, msg.room.round_number || 1);
    }

    switch (msg.type) {
      case 'room_joined': {
        isAutoReconnecting = false;
        hideReconnectingOverlay();
        myPlayerId = msg.playerId;
        currentRoom = msg.room;
        pendingRoomAfterAnim = null;
        pendingShotQueue = [];
        saveCurrentRoomLocally();
        try {
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, '', `?room=${encodeURIComponent(currentRoom.code)}#pid=${encodeURIComponent(myPlayerId)}`);
          } else {
            window.location.hash = `room=${encodeURIComponent(currentRoom.code)}&pid=${encodeURIComponent(myPlayerId)}`;
          }
        } catch (_) {
          try {
            window.location.hash = `room=${encodeURIComponent(currentRoom.code)}&pid=${encodeURIComponent(myPlayerId)}`;
          } catch (_) {}
        }
        renderRoomState();
        break;
      }

      case 'room_updated': {
        if (!isAnimatingShot) {
          currentRoom = msg.room;
          saveCurrentRoomLocally();
          renderRoomState();
          checkAndTriggerBotShot();
        } else {
          pendingRoomAfterAnim = msg.room;
          if (currentRoom && msg.room && msg.room.settings) {
            currentRoom.settings = msg.room.settings;
            currentRoom.turn_deadline_epoch = msg.room.turn_deadline_epoch;
            renderGameHUD();
          }
        }
        break;
      }

      case 'game_started': {
        currentRoom = msg.room;
        pendingRoomAfterAnim = null;
        pendingShotQueue = [];
        isAnimatingShot = false;
        activeAnim = null;
        saveCurrentRoomLocally();
        document.getElementById('modal-victory').classList.add('hidden');
        renderRoomState();
        showToast(lang === 'en' ? '🔮 The arena is open! Aim and shoot!' : '🔮 ¡Se abrió el ruedo! Apunta y tira tu canica.');
        checkAndTriggerBotShot();
        break;
      }

      case 'shot_result': {
        if (isAnimatingShot) {
          pendingShotQueue.push(msg);
          return;
        }
        pendingRoomAfterAnim = msg.room;
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
        if (botShotPendingTimer) {
          clearTimeout(botShotPendingTimer);
          botShotPendingTimer = null;
          botShotTargetId = null;
        }
        currentRoom = msg.room;
        pendingRoomAfterAnim = null;
        pendingShotQueue = [];
        isAnimatingShot = false;
        activeAnim = null;
        saveCurrentRoomLocally();
        document.getElementById('modal-victory').classList.add('hidden');
        renderRoomState();
        break;
      }

      case 'error': {
        hideReconnectingOverlay();
        if (isAutoReconnecting && currentRoom) {
          useOfflineEngine = true;
          isAutoReconnecting = false;
          renderRoomState();
          showToast(lang === 'en' ? '🎮 Continuing match offline' : '🎮 Continuando partida en modo local');
          break;
        }
        showToast(`⚠️ ${msg.message}`);
        isAutoReconnecting = false;
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
      feria: lang === 'en' ? '🎡 Fairground Pinboard' : '🎡 Canicas de la Feria',
      circulo: lang === 'en' ? '⭕ El Círculo (Knockout Ring)' : '⭕ Patio: El Círculo',
      hoyita: lang === 'en' ? '🕳️ La Hoyita (Center Pit)' : '🕳️ Patio: La Hoyita'
    };

    const pills = [
      modeNames[s.game_mode] || modeNames.feria,
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
    const canManageLobby = isHost || useOfflineEngine;
    document.getElementById('host-bot-controls').classList.toggle('hidden', !canManageLobby);
    document.getElementById('btn-start-game').classList.toggle('hidden', !canManageLobby);
    document.getElementById('lobby-wait-msg').classList.toggle('hidden', canManageLobby);

    const lobbyModeSection = document.getElementById('host-lobby-mode-section');
    if (lobbyModeSection) {
      lobbyModeSection.classList.toggle('hidden', !canManageLobby);
    }
    const activeMode = s.game_mode || 'feria';
    document.querySelectorAll('.lobby-mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === activeMode);
    });

    const activeTimer = Number(s.turn_timer_seconds) || 0;
    document.querySelectorAll('.lobby-timer-btn').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.timer) === activeTimer);
    });
  }

  function renderGameHUD() {
    document.getElementById('game-room-badge').textContent = currentRoom.code;
    const s = currentRoom.settings;
    if (!currentRoom.active_stage) {
      currentRoom.active_stage = stageForRoundLocal(s.game_mode, currentRoom.round_number || 1);
    }
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

    // Mid-match stage switching is locked; switcher remains hidden during gameplay
    const switcher = document.getElementById('host-stage-switcher');
    if (switcher) {
      switcher.classList.add('hidden');
      switcher.style.display = 'none';
    }

    const me = currentRoom.players.find((p) => p.id === myPlayerId);
    const isHost = Boolean(me && me.is_host);
    const backToSalaBtn = document.getElementById('btn-back-to-sala');
    if (backToSalaBtn) {
      backToSalaBtn.classList.toggle('hidden', !isHost && !useOfflineEngine);
    }

    const activeTimer = Number(s.turn_timer_seconds) || 0;
    const gameTimerSelect = document.getElementById('game-timer-select');
    if (gameTimerSelect) {
      gameTimerSelect.disabled = false;
      const optNone = gameTimerSelect.querySelector('option[value="0"]');
      if (optNone) {
        optNone.textContent = lang === 'en' ? '∞ Manual' : '∞ Manual';
      }
      if (Number(gameTimerSelect.value) !== activeTimer) {
        gameTimerSelect.value = String(activeTimer);
      }
    }

    const timerDisp = document.getElementById('timer-display');
    if (timerDisp) {
      if (activeTimer <= 0 || !currentRoom.turn_deadline_epoch || currentRoom.state !== 'playing') {
        timerDisp.textContent = '∞';
      } else {
        const nowSec = Math.floor(Date.now() / 1000);
        const rem = Math.max(0, currentRoom.turn_deadline_epoch - nowSec);
        timerDisp.textContent = `${rem}s`;
      }
    }

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

    if (activePlayer && currentRoom.state === 'playing') {
      if (lastTurnPlayerId !== activePlayer.id) {
        lastTurnPlayerId = activePlayer.id;
        if (isMyTurn) {
          if (typeof activePlayer.seat_angle === 'number' && Number.isFinite(activePlayer.seat_angle)) {
            patioSeatAngle = activePlayer.seat_angle;
          } else {
            const total = (currentRoom.players || []).length || 1;
            patioSeatAngle = currentRoom.current_turn_idx * (360 / total) + 90;
          }
          updateSeatPosLabel();
        }
      }
    }

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

    const patioSeatCtrl = document.getElementById('patio-seat-control');
    if (patioSeatCtrl) {
      patioSeatCtrl.classList.toggle('hidden', currentRoom.active_stage === 'feria');
      updateSeatPosLabel();
    }

    const shootBtn = document.getElementById('btn-shoot');
    shootBtn.disabled = !isMyTurn || isAnimatingShot;
    const quickShootBtn = document.getElementById('btn-canvas-shoot');
    if (quickShootBtn) {
      quickShootBtn.disabled = !isMyTurn || isAnimatingShot;
    }
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
        speed: 1.15,
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
        speed: 0.85,
        playedCollisions
      };
    } else {
      finishShotAnimation(outcome);
    }
  }

  let botShotPendingTimer = null;
  let botShotTargetId = null;

  function checkAndTriggerBotShot() {
    if (!currentRoom || currentRoom.state !== 'playing' || isAnimatingShot) {
      return;
    }
    const currP = currentRoom.players[currentRoom.current_turn_idx];
    if (!currP || !currP.is_bot) {
      if (botShotPendingTimer) {
        clearTimeout(botShotPendingTimer);
        botShotPendingTimer = null;
        botShotTargetId = null;
      }
      return;
    }

    if (botShotTargetId === currP.id && botShotPendingTimer) {
      return;
    }

    botShotTargetId = currP.id;
    if (botShotPendingTimer) {
      clearTimeout(botShotPendingTimer);
    }

    // Natural bot reaction delay (650-750ms) before shooting
    botShotPendingTimer = setTimeout(() => {
      botShotPendingTimer = null;
      botShotTargetId = null;
      if (currentRoom && currentRoom.state === 'playing' && !isAnimatingShot) {
        const p = currentRoom.players[currentRoom.current_turn_idx];
        if (p && p.is_bot) {
          if (useOfflineEngine) {
            const pwr = 0.52 + Math.random() * 0.38;
            const ang = (Math.random() - 0.5) * 0.36;
            const spn = (Math.random() - 0.5) * 0.4;
            executeOfflineShot(pwr, ang, spn);
          } else {
            if (ws && ws.readyState === WebSocket.OPEN) {
              sendWs({ type: 'bot_ping', roomCode: currentRoom.code });
            } else {
              useOfflineEngine = true;
              const pwr = 0.52 + Math.random() * 0.38;
              const ang = (Math.random() - 0.5) * 0.36;
              const spn = (Math.random() - 0.5) * 0.4;
              executeOfflineShot(pwr, ang, spn);
            }
          }
        }
      }
    }, 700);
  }

  function finishShotAnimation(outcome) {
    isAnimatingShot = false;
    activeAnim = null;
    if (pendingRoomAfterAnim) {
      currentRoom = pendingRoomAfterAnim;
      pendingRoomAfterAnim = null;
    }
    saveCurrentRoomLocally();

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

    window.canicasAudio.speakOutcomeAnnouncement(outcome, headline, dicho, lang);
    renderGameHUD();

    if (pendingShotQueue.length > 0) {
      const nextMsg = pendingShotQueue.shift();
      setTimeout(() => {
        handleServerMessage(nextMsg);
      }, 450);
      return;
    }

    if (currentRoom && currentRoom.state === 'finished') {
      setTimeout(() => showVictoryModal(), 900);
      return;
    }

    if (currentRoom && currentRoom.state === 'playing') {
      checkAndTriggerBotShot();
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

  let followCamMode = window.safeStorage.getItem('canicas_follow_cam') === 'off' ? 'off' : 'auto';
  let camZoom = 1.0;
  let camX = 500;
  let camY = 650;

  function updateCameraFollowLabel() {
    const btn = document.getElementById('btn-camera-follow');
    const lbl = document.getElementById('camera-follow-label');
    if (!btn || !lbl) return;
    if (followCamMode === 'auto') {
      lbl.textContent = lang === 'en' ? 'Zoom: Follow' : 'Zoom: Auto';
      btn.classList.remove('off');
    } else {
      lbl.textContent = lang === 'en' ? 'Zoom: Fixed' : 'Zoom: Fijo';
      btn.classList.add('off');
    }
  }

  function drawFeriaPinboard() {
    const scaleY = 1150 / 1300;
    const useFollowCam = followCamMode !== 'off';

    let animMarbleX = null;
    let animMarbleY = null;
    if (activeAnim && activeAnim.kind === 'feria') {
      const sim = activeAnim.sim;
      const previewStep = Math.min(sim.path.length - 1, activeAnim.stepFloat + activeAnim.speed);
      const pIdx = Math.min(sim.path.length - 1, Math.floor(previewStep));
      const pNext = Math.min(sim.path.length - 1, pIdx + 1);
      const pFrac = previewStep - pIdx;
      animMarbleX = sim.path[pIdx].x + (sim.path[pNext].x - sim.path[pIdx].x) * pFrac;
      animMarbleY = sim.path[pIdx].y + (sim.path[pNext].y - sim.path[pIdx].y) * pFrac;
    }

    let targetZoom = 1.0;
    let targetX = 500;
    let targetY = 650;
    if (
      useFollowCam &&
      activeAnim &&
      activeAnim.kind === 'feria' &&
      animMarbleX !== null &&
      activeAnim.stepFloat >= 8 &&
      activeAnim.stepFloat < activeAnim.sim.path.length - 2
    ) {
      targetZoom = 1.75;
      targetX = animMarbleX;
      targetY = animMarbleY + 30;
    }

    camZoom += (targetZoom - camZoom) * 0.14;
    camX += (targetX - camX) * 0.14;
    camY += (targetY - camY) * 0.14;
    if (Math.abs(camZoom - 1.0) < 0.005) {
      camZoom = 1.0;
      camX = 500;
      camY = 650;
    }

    const halfW = 500 / camZoom;
    const halfH = 650 / camZoom;
    const clampedCamX = Math.max(halfW, Math.min(1000 - halfW, camX));
    const clampedCamY = Math.max(halfH, Math.min(1300 - halfH, camY));

    ctx.save();
    ctx.scale(1, scaleY);
    if (camZoom > 1.005) {
      ctx.translate(500, 650);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-clampedCamX, -clampedCamY);
    }

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
      ctx.lineTo(previewEntryX + aimAngle * 24 + shotSpin * 28, 212);
      ctx.stroke();
      ctx.restore();
    }

    const occupiedMap = new Map();
    if (currentRoom.feria_occupied_holes) {
      currentRoom.feria_occupied_holes.forEach((oh) => {
        occupiedMap.set(oh.hole_id, oh);
      });
    }

    // Solid wooden bottom ramp wedges between the 5 bottom collector holes (#16..#20)
    [233.5, 390.0, 546.5, 702.5].forEach((divX) => {
      ctx.beginPath();
      ctx.moveTo(divX, 1005);
      ctx.lineTo(divX - 38, 1090);
      ctx.lineTo(divX + 38, 1090);
      ctx.closePath();
      ctx.fillStyle = '#b45309';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fde047';
      ctx.stroke();
    });

    // Left and right bottom corner funnel ramps
    [
      [104, 1005, 104, 1090, 126, 1090],
      [832, 1005, 832, 1090, 810, 1090]
    ].forEach(([x0, y0, x1, y1, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.fillStyle = '#b45309';
      ctx.fill();
    });

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
      if (
        occ &&
        (!activeAnim ||
          activeAnim.kind !== 'feria' ||
          activeAnim.sim.hole.id !== h.id ||
          activeAnim.stepFloat >= activeAnim.sim.path.length - 2)
      ) {
        drawGlassMarble(
          ctx,
          h.x,
          h.y,
          h.radius * 0.66,
          occ.color,
          MARBLE_SKINS[skinIdx].id,
          0.4,
          false,
          false
        );
        ctx.fillStyle = '#fde047';
        ctx.font = '900 13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          currentRoom.settings.combo_multiplier ? `${h.points} (x2)` : `${h.points}`,
          h.x,
          h.y - h.radius - 10
        );
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
          const sx = 500 + (hit.x - clampedCamX) * camZoom;
          const sy = (650 + (hit.y - clampedCamY) * camZoom) * scaleY;
          if (hit.nail_id >= 1000) {
            window.canicasAudio.playGlassClack(hit.intensity, false);
            spawnSparks(sx, sy, '#38bdf8', 10);
          } else {
            window.canicasAudio.playPinTing(hit.intensity, hit.y / 1200);
            spawnSparks(sx, sy, '#fde047', 6);
          }
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
      ctx.fillText('🕳️ HOYITA (+45)', 500, 554);
    }

    // Draw dynamic courtyard stones ("Piedritas del Patio") that block straight paths and re-randomize every shot
    const stones =
      currentRoom.patio_stones && currentRoom.patio_stones.length
        ? currentRoom.patio_stones
        : generatePatioStonesLocal(
            isHoyita,
            currentRoom.shot_counter || 0,
            90,
            currentRoom.patio_targets
          );
    stones.forEach((st) => {
      const sr = st.radius || st.r || 16;
      ctx.beginPath();
      ctx.arc(st.x + 2, st.y + 3, sr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
      ctx.fill();

      const sGrad = ctx.createRadialGradient(st.x - 3, st.y - 3, 2, st.x, st.y, sr);
      sGrad.addColorStop(0, '#d6d3d1');
      sGrad.addColorStop(0.55, '#78716c');
      sGrad.addColorStop(1, '#292524');
      ctx.beginPath();
      ctx.arc(st.x, st.y, sr, 0, Math.PI * 2);
      ctx.fillStyle = sGrad;
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#fde047';
      ctx.stroke();
    });

    const skinId = MARBLE_SKINS[skinIdx].id;
    const totalPlayers = Math.max(1, currentRoom.players.length);
    const turnIdx = currentRoom.current_turn_idx;
    const activePlayer = currentRoom.players[turnIdx];

    if (activePlayer && activePlayer.is_cazador) {
      ctx.save();
      ctx.fillStyle = 'rgba(185, 28, 28, 0.88)';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.fillRect(210, 18, 580, 34);
      ctx.strokeRect(210, 18, 580, 34);
      ctx.fillStyle = '#fef08a';
      ctx.font = '900 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        lang === 'en'
          ? '🔥 HUNTER ACTIVE: Ring Marbles Worth 2x Points! (Aim at Marbles)'
          : '🔥 MODO CAZADOR ACTIVO: ¡Sacar canicas del ruedo vale PUNTOS DOBLES (x2)!',
        500,
        40
      );
      ctx.restore();
    }

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
              col.kind === 'rival' ? '#ef4444' : col.kind === 'stone' ? '#fde047' : '#e0f2fe',
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
            ctx.fillText(
              activePlayer && activePlayer.is_cazador ? '👑 60 (x2)' : '👑 30',
              t.x,
              t.y - t.radius - 6
            );
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
        const isMyTurn = activePlayer.id === myPlayerId;
        const seatDeg = isMyTurn
          ? patioSeatAngle
          : turnIdx * (360 / totalPlayers) + 90;
        const seatRad = (seatDeg * Math.PI) / 180;
        const sx = 500 + 415 * Math.cos(seatRad);
        const sy = 500 + 415 * Math.sin(seatRad);

        const inwardAngle = Math.atan2(500 - sy, 500 - sx);
        const aimRad = inwardAngle + ((aimAngle * 42) * Math.PI) / 180;
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
        ctx.fillText(
          isMyTurn
            ? lang === 'en'
              ? `◀ 🏃 ${activePlayer.name} (${Math.round(seatDeg)}°) ▶`
              : `◀ 🏃 ${activePlayer.name} (${Math.round(seatDeg)}°) ▶`
            : `🎯 ${activePlayer.name}`,
          sx,
          sy + 34
        );
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
    if (isDraggingCanvas) {
      ctx.save();
      let bannerTxt;
      if (isDraggingRingPos) {
        bannerTxt =
          lang === 'en'
            ? `🏃 Ring Position: ${Math.round(patioSeatAngle)}° • Release to set position!`
            : `🏃 Posición en la Raya: ${Math.round(patioSeatAngle)}° • ¡Suelta para colocarte aquí!`;
      } else {
        const pct = Math.round(shotPower * 100);
        const deg = Math.round(aimAngle * 42);
        const dirTxt = deg === 0 ? '0°' : deg > 0 ? `+${deg}°` : `${deg}°`;
        bannerTxt =
          lang === 'en'
            ? `⚡ ${pct}% (${dirTxt}) • RELEASE TO SHOOT!`
            : `⚡ ${pct}% (${dirTxt}) • ¡SUELTA PARA TIRAR!`;
      }
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.fillRect(190, 1020, 620, 56);
      ctx.strokeRect(190, 1020, 620, 56);
      ctx.fillStyle = '#fde047';
      ctx.font = '900 20px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(bannerTxt, 500, 1055);
      ctx.restore();
    }
  }

  // ==========================================================================
  // 6. USER CONTROLS, SLINGSHOT DRAG & EVENT LISTENERS
  // ==========================================================================

  function updateSeatPosLabel() {
    const deg = Math.round(((patioSeatAngle % 360) + 360) % 360);
    const label = document.getElementById('seat-pos-val-label');
    const slider = document.getElementById('input-seat-pos');
    if (slider) {
      slider.value = String(deg);
    }
    if (label) {
      let compass = '';
      if (deg >= 45 && deg < 135) compass = lang === 'en' ? 'South ' : 'Sur ';
      else if (deg >= 135 && deg < 225) compass = lang === 'en' ? 'West ' : 'Oeste ';
      else if (deg >= 225 && deg < 315) compass = lang === 'en' ? 'North ' : 'Norte ';
      else compass = lang === 'en' ? 'East ' : 'Este ';
      label.textContent = `${compass}(${deg}°)`;
    }
    document.querySelectorAll('.seat-preset-btn[data-seat]').forEach((btn) => {
      btn.classList.toggle('active', Math.abs(Number(btn.dataset.seat) - deg) <= 8);
    });
  }

  let seatAngleSendTimeout = null;
  function syncSeatAngleToServer() {
    if (!currentRoom || currentRoom.state !== 'playing') return;
    sendWs({
      type: 'set_seat_angle',
      roomCode: currentRoom.code,
      seatAngle: patioSeatAngle
    });
  }

  function setPatioSeatAngle(deg, keepAim = false) {
    patioSeatAngle = ((Number(deg) % 360) + 360) % 360;
    if (currentRoom && currentRoom.players) {
      const p = currentRoom.players.find((pl) => pl.id === myPlayerId) || currentRoom.players[currentRoom.current_turn_idx];
      if (p) {
        p.seat_angle = patioSeatAngle;
        const rad = (patioSeatAngle * Math.PI) / 180;
        p.shooter_x = Math.round(500 + 415 * Math.cos(rad));
        p.shooter_y = Math.round(500 + 415 * Math.sin(rad));
      }
      saveCurrentRoomLocally();
    }
    if (!keepAim) {
      aimAngle = 0;
      const angleInput = document.getElementById('input-angle');
      if (angleInput) angleInput.value = '0';
      updateAngleLabel();
    }
    updateSeatPosLabel();
    clearTimeout(seatAngleSendTimeout);
    seatAngleSendTimeout = setTimeout(syncSeatAngleToServer, 50);
  }

  function aimPatioFromCanvasPoint(pt) {
    // Convert canvas point (1000x1300) into courtyard coordinates where courtyard center is (500, 500) with offsetY = 75
    const cx = pt.x;
    const cy = pt.y - 75;
    const seatRad = (patioSeatAngle * Math.PI) / 180;
    const sx = 500 + 415 * Math.cos(seatRad);
    const sy = 500 + 415 * Math.sin(seatRad);

    const inwardAngle = Math.atan2(500 - sy, 500 - sx);
    const targetAngle = Math.atan2(cy - sy, cx - sx);
    const diffDeg = (((targetAngle - inwardAngle) * 180) / Math.PI + 540) % 360 - 180;

    aimAngle = Math.max(-1.0, Math.min(1.0, diffDeg / 42));
    const angleInput = document.getElementById('input-angle');
    if (angleInput) angleInput.value = String(Math.round(aimAngle * 100));
    updateAngleLabel();

    const distFromShooter = Math.hypot(cx - sx, cy - sy);
    setPower(Math.max(0.18, Math.min(1.0, (distFromShooter - 110) / 300)));
  }

  function updateAngleLabel() {
    const deg = Math.round(aimAngle * 42);
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
      spin: shotSpin,
      seatAngle: patioSeatAngle
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

  let dragMaxDist = 0;

  canvas.addEventListener('pointerdown', (ev) => {
    if (!currentRoom || currentRoom.state !== 'playing' || isAnimatingShot) return;
    const activePlayer = currentRoom.players[currentRoom.current_turn_idx];
    if (!activePlayer || activePlayer.id !== myPlayerId) return;

    window.canicasAudio.ensureContext();
    isDraggingCanvas = true;
    dragMaxDist = 0;
    dragStartPt = getCanvasCoords(ev);

    // In Patio mode, touching near the outer shooting ring (R=415 around (500, 575)) lets you walk around the ring!
    if (currentRoom.active_stage !== 'feria') {
      const distFromCourtyardCenter = Math.hypot(dragStartPt.x - 500, dragStartPt.y - 575);
      if (distFromCourtyardCenter >= 325) {
        isDraggingRingPos = true;
        const newDeg = (Math.atan2(dragStartPt.y - 575, dragStartPt.x - 500) * 180) / Math.PI;
        setPatioSeatAngle(newDeg);
      } else {
        isDraggingRingPos = false;
        aimPatioFromCanvasPoint(dragStartPt);
      }
    } else {
      isDraggingRingPos = false;
    }

    try {
      canvas.setPointerCapture(ev.pointerId);
    } catch (_) {}
  });

  canvas.addEventListener('pointermove', (ev) => {
    if (!isDraggingCanvas || !dragStartPt) return;
    const pt = getCanvasCoords(ev);
    const dx = pt.x - dragStartPt.x;
    const dy = pt.y - dragStartPt.y;
    const dist = Math.hypot(dx, dy);
    dragMaxDist = Math.max(dragMaxDist, dist);

    if (currentRoom && currentRoom.active_stage !== 'feria') {
      if (isDraggingRingPos) {
        const newDeg = (Math.atan2(pt.y - 575, pt.x - 500) * 180) / Math.PI;
        setPatioSeatAngle(newDeg);
      } else {
        aimPatioFromCanvasPoint(pt);
      }
      return;
    }

    aimAngle = Math.max(-1.0, Math.min(1.0, dx / 220));
    document.getElementById('input-angle').value = String(Math.round(aimAngle * 100));
    updateAngleLabel();

    if (dist > 12) {
      setPower(Math.min(1.0, 0.25 + dist / 320));
    }
  });

  function finishCanvasTouch() {
    if (!isDraggingCanvas) return;
    const startPt = dragStartPt;
    const wasRingDrag = isDraggingRingPos;
    isDraggingCanvas = false;
    isDraggingRingPos = false;
    dragStartPt = null;

    if (wasRingDrag) {
      dragMaxDist = 0;
      clearTimeout(seatAngleSendTimeout);
      syncSeatAngleToServer();
      return;
    }

    // Shoot when releasing a drag gesture OR when tapping directly on the plunger / shooter marble in Feria
    const isFeria = !currentRoom || currentRoom.active_stage === 'feria';
    const tappedPlunger = isFeria && startPt && startPt.x >= 830 && startPt.y >= 820;
    const tappedBottomLaunch = isFeria && startPt && startPt.y >= 860;
    if (dragMaxDist >= 14 || tappedPlunger || tappedBottomLaunch) {
      triggerShoot();
    }
    dragMaxDist = 0;
  }

  canvas.addEventListener('pointerup', finishCanvasTouch);
  canvas.addEventListener('pointercancel', () => {
    isDraggingCanvas = false;
    isDraggingRingPos = false;
    dragStartPt = null;
    dragMaxDist = 0;
  });

  const inputSeatPos = document.getElementById('input-seat-pos');
  if (inputSeatPos) {
    inputSeatPos.addEventListener('input', (ev) => {
      setPatioSeatAngle(Number(ev.target.value));
    });
  }

  const btnSeatCcw = document.getElementById('btn-seat-ccw');
  if (btnSeatCcw) {
    btnSeatCcw.addEventListener('click', () => {
      setPatioSeatAngle(patioSeatAngle - 15);
    });
  }

  const btnSeatCw = document.getElementById('btn-seat-cw');
  if (btnSeatCw) {
    btnSeatCw.addEventListener('click', () => {
      setPatioSeatAngle(patioSeatAngle + 15);
    });
  }

  document.querySelectorAll('.seat-preset-btn[data-seat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setPatioSeatAngle(Number(btn.dataset.seat));
    });
  });

  const btnSeatAimRey = document.getElementById('btn-seat-aim-rey');
  if (btnSeatAimRey) {
    btnSeatAimRey.addEventListener('click', () => {
      if (!currentRoom || !currentRoom.patio_targets) return;
      const activeTargets = currentRoom.patio_targets.filter((m) => m.active);
      if (activeTargets.length === 0) return;
      const rey =
        activeTargets.find((m) => m.kind === 'rey') ||
        activeTargets.sort((a, b) => b.points - a.points)[0];

      const dx = rey.x - 500;
      const dy = rey.y - 500;
      const distFromCenter = Math.hypot(dx, dy);
      reyAngleToggle = !reyAngleToggle;

      const baseDeg =
        distFromCenter < 6
          ? 90
          : ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
      const candidateSeatDegs = reyAngleToggle
        ? [
            (baseDeg + 42) % 360,
            (baseDeg + 318) % 360,
            (baseDeg + 75) % 360,
            (baseDeg + 285) % 360,
            baseDeg
          ]
        : [
            baseDeg,
            (baseDeg + 36) % 360,
            (baseDeg + 324) % 360,
            (baseDeg + 68) % 360,
            (baseDeg + 292) % 360
          ];

      const stones =
        currentRoom.patio_stones && currentRoom.patio_stones.length
          ? currentRoom.patio_stones
          : [];

      let chosenSeatDeg = candidateSeatDegs[0];
      for (const candDeg of candidateSeatDegs) {
        const sRad = (candDeg * Math.PI) / 180;
        const sx = 500 + 415 * Math.cos(sRad);
        const sy = 500 + 415 * Math.sin(sRad);
        const inAng = Math.atan2(500 - sy, 500 - sx);
        const tAng = Math.atan2(rey.y - sy, rey.x - sx);
        const dDeg = (((tAng - inAng) * 180) / Math.PI + 540) % 360 - 180;
        if (Math.abs(dDeg) > 41) continue;

        // Check if any stone blocks the straight line from (sx, sy) to (rey.x, rey.y)
        const segLen = Math.hypot(rey.x - sx, rey.y - sy);
        const ux = (rey.x - sx) / Math.max(1, segLen);
        const uy = (rey.y - sy) / Math.max(1, segLen);
        const blocked = stones.some((st) => {
          const sr = (st.radius || st.r || 16) + 17.5;
          const proj = (st.x - sx) * ux + (st.y - sy) * uy;
          if (proj <= 0 || proj >= segLen) return false;
          const perp = Math.abs((st.x - sx) * -uy + (st.y - sy) * ux);
          return perp < sr;
        });
        if (!blocked) {
          chosenSeatDeg = candDeg;
          break;
        }
      }

      setPatioSeatAngle(chosenSeatDeg, true);
      const seatRad = (chosenSeatDeg * Math.PI) / 180;
      const sx = 500 + 415 * Math.cos(seatRad);
      const sy = 500 + 415 * Math.sin(seatRad);
      const inwardAngle = Math.atan2(500 - sy, 500 - sx);
      const targetAngle = Math.atan2(rey.y - sy, rey.x - sx);
      const diffDeg = (((targetAngle - inwardAngle) * 180) / Math.PI + 540) % 360 - 180;
      aimAngle = Math.max(-1.0, Math.min(1.0, diffDeg / 42));
      document.getElementById('input-angle').value = String(Math.round(aimAngle * 100));
      updateAngleLabel();
      showToast(
        lang === 'en'
          ? `👑 Lined up on ${rey.kind === 'rey' ? 'Bolón Rey' : 'target'} (clear lane)!`
          : `👑 ¡Alineado al ${rey.kind === 'rey' ? 'Bolón Rey' : 'objetivo'} libre de piedras!`
      );
    });
  }

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
  const btnCanvasShoot = document.getElementById('btn-canvas-shoot');
  let holdTriggered = false;

  function startChargeHold(btnEl) {
    if (!btnEl || btnEl.disabled) return;
    window.canicasAudio.ensureContext();
    holdTriggered = false;
    let dir = 1;
    if (chargeInterval) clearInterval(chargeInterval);
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
  }

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

  btnShoot.addEventListener('pointerdown', () => startChargeHold(btnShoot));
  btnShoot.addEventListener('pointerup', stopChargeAndFire);
  if (btnCanvasShoot) {
    btnCanvasShoot.addEventListener('pointerdown', () => startChargeHold(btnCanvasShoot));
    btnCanvasShoot.addEventListener('pointerup', stopChargeAndFire);
  }

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
    const chosenMode = document.getElementById('select-mode').value;
    const themeSelect = document.getElementById('select-arena-theme');
    const settings = {
      game_mode: chosenMode,
      win_condition: document.getElementById('select-win-cond').value,
      max_rounds: Number(document.getElementById('select-max-rounds').value),
      target_score: Number(document.getElementById('select-target-score').value),
      turn_timer_seconds: Number(document.getElementById('select-timer').value),
      bonus_shot_rule: document.getElementById('chk-bonus-shot').checked,
      combo_multiplier: document.getElementById('chk-combo-mult').checked,
      ponche_steal: document.getElementById('chk-ponche-steal').checked,
      arena_theme: themeSelect ? themeSelect.value : chosenMode === 'feria' ? 'feria' : 'patio'
    };
    sendWs({
      type: 'create_room',
      playerName: getPlayerName(),
      avatar: selectedAvatar,
      color: selectedColor,
      settings
    });
  });

  function launchQuickPlay(mode) {
    window.canicasAudio.ensureContext();
    const settings = {
      game_mode: mode,
      win_condition: 'rounds',
      max_rounds: 5,
      target_score: 250,
      turn_timer_seconds: 0,
      bonus_shot_rule: true,
      combo_multiplier: true,
      ponche_steal: true,
      arena_theme: mode === 'feria' ? 'feria' : 'patio'
    };
    useOfflineEngine = true;
    handleOfflineCommand({
      type: 'create_room',
      roomCode: 'CANICAS',
      playerName: getPlayerName(),
      avatar: selectedAvatar,
      color: selectedColor,
      settings
    });
    handleOfflineCommand({ type: 'start_game' });
    showToast(
      mode === 'feria'
        ? (lang === 'en' ? '🎡 Gran Feria de Canicas loaded!' : '🎡 ¡Gran Feria de Canicas lista!')
        : mode === 'circulo'
        ? (lang === 'en' ? '⭕ El Círculo loaded!' : '⭕ ¡El Círculo listo!')
        : (lang === 'en' ? '🕳️ La Hoyita loaded!' : '🕳️ ¡La Hoyita lista!')
    );
  }

  const bqFeria = document.getElementById('btn-quick-feria');
  if (bqFeria) bqFeria.addEventListener('click', () => launchQuickPlay('feria'));
  const bqCirculo = document.getElementById('btn-quick-circulo');
  if (bqCirculo) bqCirculo.addEventListener('click', () => launchQuickPlay('circulo'));
  const bqHoyita = document.getElementById('btn-quick-hoyita');
  if (bqHoyita) bqHoyita.addEventListener('click', () => launchQuickPlay('hoyita'));

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
    isAutoReconnecting = false;
    hideReconnectingOverlay();
    if (currentRoom && !useOfflineEngine) {
      sendWs({ type: 'leave_room', roomCode: currentRoom.code });
    }
    window.safeStorage.removeItem('canicas_room_code');
    window.safeStorage.removeItem('canicas_offline_room');
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        window.location.hash = '';
      }
    } catch (_) {
      try { window.location.hash = ''; } catch (_) {}
    }
    currentRoom = null;
    switchScreen(screenHome);
  }

  document.getElementById('btn-leave-lobby').addEventListener('click', leaveCurrentRoom);
  document.getElementById('btn-leave-game').addEventListener('click', leaveCurrentRoom);

  const btnBackToSala = document.getElementById('btn-back-to-sala');
  if (btnBackToSala) {
    btnBackToSala.addEventListener('click', () => {
      if (currentRoom) {
        if (useOfflineEngine) {
          handleOfflineCommand({ type: 'play_again' });
        } else {
          sendWs({ type: 'play_again', roomCode: currentRoom.code });
        }
        showToast(
          lang === 'en'
            ? '🏠 Returned to the Sala. Pick a game mode to start!'
            : '🏠 De vuelta en la Sala. Elige el tipo de juego para comenzar.'
        );
      }
    });
  }

  document.querySelectorAll('.lobby-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!currentRoom) return;
      const mode = btn.dataset.mode;
      const updatedSettings = Object.assign({}, currentRoom.settings, { game_mode: mode });
      const homeSelect = document.getElementById('select-mode');
      if (homeSelect) homeSelect.value = mode;
      sendWs({
        type: 'update_settings',
        roomCode: currentRoom.code,
        settings: updatedSettings
      });
      const modeLabels = {
        feria: lang === 'en' ? '🎡 Fairground Pinboard' : '🎡 Canicas de la Feria',
        circulo: lang === 'en' ? '⭕ El Círculo (Ring)' : '⭕ Patio: El Círculo',
        hoyita: lang === 'en' ? '🕳️ La Hoyita (Pit)' : '🕳️ Patio: La Hoyita'
      };
      showToast(
        lang === 'en'
          ? `🎪 Mode set to: ${modeLabels[mode] || mode}`
          : `🎪 Modo cambiado a: ${modeLabels[mode] || mode}`
      );
    });
  });

  const TIMER_PRESETS = [0, 15, 25, 40];

  function setTurnTimerSeconds(seconds) {
    const cleanSec = TIMER_PRESETS.includes(Number(seconds)) ? Number(seconds) : 0;
    const homeTimerSelect = document.getElementById('select-timer');
    if (homeTimerSelect) {
      homeTimerSelect.value = String(cleanSec);
    }
    const gameTimerSelect = document.getElementById('game-timer-select');
    if (gameTimerSelect) {
      gameTimerSelect.value = String(cleanSec);
    }

    if (!currentRoom) return;

    const updatedSettings = Object.assign({}, currentRoom.settings, {
      turn_timer_seconds: cleanSec
    });
    currentRoom.settings = updatedSettings;
    refreshOfflineTurnDeadline(currentRoom);
    if (pendingRoomAfterAnim && pendingRoomAfterAnim.settings) {
      pendingRoomAfterAnim.settings = Object.assign({}, pendingRoomAfterAnim.settings, {
        turn_timer_seconds: cleanSec
      });
      refreshOfflineTurnDeadline(pendingRoomAfterAnim);
    }

    if (currentRoom.state === 'lobby') {
      renderLobby();
    } else {
      renderGameHUD();
    }

    sendWs({
      type: 'update_settings',
      roomCode: currentRoom.code,
      settings: updatedSettings
    });

    const label =
      cleanSec > 0
        ? `${cleanSec}s`
        : lang === 'en'
          ? 'No limit (∞)'
          : 'Sin límite (∞)';
    showToast(
      lang === 'en'
        ? `⏱️ Turn timer: ${label}`
        : `⏱️ Tiempo por turno: ${label}`
    );
  }

  const gameTimerSelectEl = document.getElementById('game-timer-select');
  if (gameTimerSelectEl) {
    gameTimerSelectEl.addEventListener('change', (e) => {
      setTurnTimerSeconds(Number(e.target.value));
    });
  }

  const btnCycleTimer = document.getElementById('btn-cycle-timer');
  if (btnCycleTimer) {
    btnCycleTimer.addEventListener('click', () => {
      const curr = currentRoom && currentRoom.settings
        ? Number(currentRoom.settings.turn_timer_seconds) || 0
        : 0;
      const idx = TIMER_PRESETS.indexOf(curr);
      const nextSec = TIMER_PRESETS[(idx + 1) % TIMER_PRESETS.length];
      setTurnTimerSeconds(nextSec);
    });
  }

  document.querySelectorAll('.lobby-timer-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setTurnTimerSeconds(Number(btn.dataset.timer));
    });
  });

  document.querySelectorAll('.stage-switch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!currentRoom) return;
      if (currentRoom.state === 'playing') {
        showToast(
          lang === 'en'
            ? '⚠️ You cannot change the game mode during a match. Return to the Sala to change it.'
            : '⚠️ No puedes cambiar el tipo de juego a mitad de la partida. Vuelve a la Sala para cambiarlo.'
        );
        return;
      }
      const targetStage = btn.dataset.stage;
      if (useOfflineEngine) {
        handleOfflineCommand({
          type: 'switch_stage',
          roomCode: currentRoom.code,
          stage: targetStage
        });
      } else {
        sendWs({
          type: 'switch_stage',
          roomCode: currentRoom.code,
          stage: targetStage
        });
      }
      showToast(
        targetStage === 'feria'
          ? (lang === 'en' ? '🎡 Switched to Fairground Board' : '🎡 Cambiado a Feria de Clavos')
          : targetStage === 'circulo'
          ? (lang === 'en' ? '⭕ Switched to El Círculo' : '⭕ Cambiado a Patio: El Círculo')
          : (lang === 'en' ? '🕳️ Switched to La Hoyita' : '🕳️ Cambiado a Patio: La Hoyita')
      );
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
    const winner = currentRoom.players.find((p) => p.id === currentRoom.winner_id);
    const winnerName = winner ? winner.name : '';
    window.canicasAudio.speakVictory(winnerName, lang);

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
    // 1. Continuous bot watchdog: guarantee bots never get stuck or delayed!
    checkAndTriggerBotShot();

    const disp = document.getElementById('timer-display');
    if (
      !currentRoom ||
      currentRoom.state !== 'playing' ||
      !currentRoom.settings ||
      Number(currentRoom.settings.turn_timer_seconds) <= 0 ||
      !currentRoom.turn_deadline_epoch
    ) {
      if (disp) disp.textContent = '∞';
      return;
    }
    const nowSec = Math.floor(Date.now() / 1000);
    const rem = Math.max(0, currentRoom.turn_deadline_epoch - nowSec);
    if (disp) disp.textContent = `${rem}s`;

    // 2. Strict timeout trigger: if time expires, force shot immediately!
    if (rem === 0 && !isAnimatingShot) {
      const currP = currentRoom.players[currentRoom.current_turn_idx];
      const defaultSeatDeg = (currP && currP.seat_angle != null && Number.isFinite(currP.seat_angle))
        ? currP.seat_angle
        : currentRoom.current_turn_idx * (360 / Math.max(1, currentRoom.players.length)) + 90;
      const seat = (currP && currP.id === myPlayerId) ? patioSeatAngle : defaultSeatDeg;

      if (useOfflineEngine) {
        executeOfflineShot(0.68, (Math.random() - 0.5) * 0.1, 0, seat);
      } else {
        if (ws && ws.readyState === WebSocket.OPEN) {
          sendWs({ type: 'force_timeout', roomCode: currentRoom.code });
        } else {
          // If disconnected from backend, seamlessly continue offline without freezing
          useOfflineEngine = true;
          executeOfflineShot(0.68, (Math.random() - 0.5) * 0.1, 0, seat);
        }
      }
    }
  }, 400);

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  let isAutoReconnecting = false;

  function showReconnectingOverlay(roomCode) {
    const el = document.getElementById('reconnecting-overlay');
    if (el) {
      const title = document.getElementById('reconnecting-title');
      if (title) {
        title.textContent = lang === 'en'
          ? `Reconnecting to room ${roomCode}...`
          : `Reconectando a la sala ${roomCode}...`;
      }
      el.classList.remove('hidden');
    }
  }

  function hideReconnectingOverlay() {
    const el = document.getElementById('reconnecting-overlay');
    if (el) {
      el.classList.add('hidden');
    }
  }

  function checkAutoJoinOrResume() {
    let urlRoom = '';
    let hashRoom = '';
    let hashPid = '';

    try {
      const params = new URLSearchParams(window.location.search);
      urlRoom = (params.get('room') || '').trim().toUpperCase();
    } catch (_) {}

    try {
      if (window.location.hash) {
        const h = window.location.hash.replace(/^#/, '');
        const matchRoom = h.match(/(?:^|[&?])room=([A-Za-z0-9]+)/i);
        const matchPid = h.match(/(?:^|[&?])pid=([A-Za-z0-9_]+)/i);
        if (matchRoom) hashRoom = matchRoom[1].toUpperCase();
        if (matchPid) hashPid = matchPid[1];
        if (!hashRoom && /^[A-Za-z0-9]{6}$/.test(h)) {
          hashRoom = h.toUpperCase();
        }
      }
    } catch (_) {}

    const savedRoom = (window.safeStorage.getItem('canicas_room_code') || '').trim().toUpperCase();
    const targetRoom = urlRoom || hashRoom || savedRoom;
    const targetPid = myPlayerId || hashPid || window.safeStorage.getItem('canicas_player_id');

    // 1. Instantly restore saved room so page refresh NEVER kicks the player out!
    const savedOffline = window.safeStorage.getItem('canicas_offline_room');
    let restoredFromSaved = false;
    if (savedOffline) {
      try {
        const parsed = JSON.parse(savedOffline);
        if (parsed && parsed.code && (!targetRoom || parsed.code.toUpperCase() === targetRoom.toUpperCase())) {
          currentRoom = parsed;
          myPlayerId = myPlayerId || targetPid || (currentRoom.players[0] && currentRoom.players[0].id) || 'p_local_1';
          renderRoomState();
          restoredFromSaved = true;
          if (useOfflineEngine && currentRoom.state === 'playing') {
            const currP = currentRoom.players[currentRoom.current_turn_idx];
            if (currP && currP.is_bot && !isAnimatingShot) {
              setTimeout(() => {
                if (currentRoom && currentRoom.state === 'playing' && !isAnimatingShot) {
                  executeOfflineShot(
                    0.5 + Math.random() * 0.42,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                  );
                }
              }, 750);
            }
          }
        }
      } catch (_) {}
    }

    const isStandalone = window.location.protocol === 'file:' || !window.location.host;
    if (isStandalone) {
      useOfflineEngine = true;
    }

    // 2. Automatically sync with server over WebSocket if targetRoom is known!
    if (targetRoom && !isStandalone) {
      if (!restoredFromSaved) {
        isAutoReconnecting = true;
        showReconnectingOverlay(targetRoom);
      }
      sendWs({
        type: 'join_room',
        roomCode: targetRoom,
        playerName: getPlayerName(),
        avatar: selectedAvatar,
        color: selectedColor,
        playerId: targetPid || undefined
      });
    }
  }

  const btnCameraFollow = document.getElementById('btn-camera-follow');
  if (btnCameraFollow) {
    btnCameraFollow.addEventListener('click', () => {
      followCamMode = followCamMode === 'auto' ? 'off' : 'auto';
      window.safeStorage.setItem('canicas_follow_cam', followCamMode);
      updateCameraFollowLabel();
    });
  }

  if ('caches' in window) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((k) => {
          if (k !== 'canicas-mexicanas-v18') {
            caches.delete(k).catch(() => {});
          }
        });
      })
      .catch(() => {});
  }
  if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    navigator.serviceWorker
      .register('/sw.js?v=18')
      .then((reg) => {
        reg.update().catch(() => {});
      })
      .catch(() => {});
  }

  initProfileUI();
  updateCameraFollowLabel();
  applyTranslations();
  checkAutoJoinOrResume();
  requestAnimationFrame(renderArenaCanvas);
})();
