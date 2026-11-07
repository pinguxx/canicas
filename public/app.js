// ============================================================================
// CANICAS MEXICANAS 3D • CLIENT APPLICATION (FERIA DE CLAVOS & PATIO DE TIERRA)
// ============================================================================

(() => {
  const AVATARS = ['🔮', '🤠', '💀', '🌺', '🦅', '🥊', '🎭', '🌶️', '🎸', '👑'];
  const COLORS = [
    '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ef4444', '#f97316', '#14b8a6', '#eab308', '#18181b'
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
  let lang = localStorage.getItem('canicas_lang') || 'es';
  let selectedAvatar = localStorage.getItem('canicas_avatar') || AVATARS[0];
  let selectedColor = localStorage.getItem('canicas_color') || COLORS[0];
  let skinIdx = Math.max(0, MARBLE_SKINS.findIndex((s) => s.id === (localStorage.getItem('canicas_skin') || 'aguita')));
  let themeIdx = Math.max(0, ARENA_THEMES.findIndex((t) => t.id === (localStorage.getItem('canicas_theme') || 'feria')));

  let ws = null;
  let myPlayerId = localStorage.getItem('canicas_player_id') || null;
  let currentRoom = null;
  let arenaMeta = { feria_holes: [], feria_nails: [] };

  // Shot control state
  let aimAngle = 0.0; // -1.0 .. 1.0
  let shotSpin = 0.0; // -1.0 .. 1.0
  let shotPower = 0.72; // 0.10 .. 1.0
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

  // DOM Elements
  const screenHome = document.getElementById('screen-home');
  const screenLobby = document.getElementById('screen-lobby');
  const screenGame = document.getElementById('screen-game');

  const inputName = document.getElementById('input-name');
  const avatarPicker = document.getElementById('avatar-picker');
  const colorPicker = document.getElementById('color-picker');
  const previewCanvas = document.getElementById('profile-marble-preview');

  const canvas = document.getElementById('canicas-canvas');
  const ctx = canvas.getContext('2d');

  // Fetch Feria holes & nails metadata on startup
  fetch('/api/arenas')
    .then((r) => r.json())
    .then((data) => {
      if (data && data.arenas) {
        arenaMeta = data.arenas;
      }
    })
    .catch(() => {});

  // ==========================================================================
  // 1. INITIALIZATION & PROFILE PICKERS
  // ==========================================================================

  function initProfileUI() {
    inputName.value = localStorage.getItem('canicas_name') || '';
    inputName.addEventListener('input', () => {
      localStorage.setItem('canicas_name', inputName.value.trim());
    });

    avatarPicker.innerHTML = '';
    AVATARS.forEach((av) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `picker-item${av === selectedAvatar ? ' selected' : ''}`;
      btn.textContent = av;
      btn.addEventListener('click', () => {
        selectedAvatar = av;
        localStorage.setItem('canicas_avatar', av);
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
        localStorage.setItem('canicas_color', col);
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
    localStorage.setItem('canicas_skin', skin.id);
    localStorage.setItem('canicas_theme', theme.id);
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
  // 2. WEBSOCKET CONNECTION & PROTOCOL
  // ==========================================================================

  function connectWebSocket(onOpenCallback) {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      if (ws.readyState === WebSocket.OPEN && onOpenCallback) {
        onOpenCallback();
      }
      return;
    }

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

    ws.addEventListener('close', () => {
      setTimeout(() => {
        if (currentRoom && currentRoom.code) {
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
      }, 2000);
    });
  }

  function sendWs(payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    } else {
      connectWebSocket(() => {
        ws.send(JSON.stringify(payload));
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
        localStorage.setItem('canicas_player_id', myPlayerId);
        localStorage.setItem('canicas_room_code', currentRoom.code);
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

    // Update stage switcher buttons
    const me = currentRoom.players.find((p) => p.id === myPlayerId);
    const isHost = Boolean(me && me.is_host);
    const switcher = document.getElementById('host-stage-switcher');
    switcher.classList.toggle('hidden', !isHost);
    switcher.querySelectorAll('.stage-switch-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.stage === currentRoom.active_stage);
    });

    // Seats strip
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

    // Turn indicator & shoot button state
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
        speed: 0.72, // ~1.4 seconds for ~60 waypoints at 60fps
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

    // Update Outcome Banner & Play Landing Sound + Voice Dicho
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

    // 1. Drop shadow
    g.beginPath();
    g.arc(x + radius * 0.16, y + radius * 0.22, radius * 0.98, 0, Math.PI * 2);
    g.fillStyle = 'rgba(0, 0, 0, 0.42)';
    g.fill();

    // 2. Special Aura Rings (Canica de Oro or Cazador)
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

    // 3. Outer Glass Sphere Gradient
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
      // 'aguita' translucent glass
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(0.35, baseColor);
      grad.addColorStop(0.82, '#0f172a');
      grad.addColorStop(1, '#020617');
    }

    g.beginPath();
    g.arc(x, y, radius, 0, Math.PI * 2);
    g.fillStyle = grad;
    g.fill();

    // 4. Inner Swirl Ribbon (Cat's Eye / Trebol / Gold Vein)
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

    // 5. Crystalline Specular Highlights
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

    // Outer glass rim
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

    // Draw sparks & floating popups
    drawEffectsLayer();

    requestAnimationFrame(renderArenaCanvas);
  }

  // --------------------------------------------------------------------------
  // FERIA DE CLAVOS PINBOARD RENDERER (1000x1300 mapped to 1000x1150 canvas)
  // --------------------------------------------------------------------------
  function drawFeriaPinboard() {
    const scaleY = 1150 / 1300;
    ctx.save();
    ctx.scale(1, scaleY);

    // 1. Artisanal Wooden Cabinet Background
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

    // Outer Brass & Painted Wood Frame
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(46, 36, 908, 1218);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fde047';
    ctx.strokeRect(56, 46, 888, 1198);

    // Top Festive Arch Header
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

    // Right-Side Plunger Launch Channel (x = 865..945)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
    ctx.fillRect(868, 195, 74, 1020);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(868, 225);
    ctx.lineTo(868, 1215);
    ctx.stroke();

    // Aim trajectory preview arc when it's player's turn & not animating
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

    // 2. Render 20 Numbered Feria Holes (Hoyitos)
    const occupiedMap = new Map();
    if (currentRoom.feria_occupied_holes) {
      currentRoom.feria_occupied_holes.forEach((oh) => {
        occupiedMap.set(oh.hole_id, oh);
      });
    }

    arenaMeta.feria_holes.forEach((h) => {
      // Outer painted carnival ring
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius + 7, 0, Math.PI * 2);
      ctx.fillStyle = h.color;
      ctx.fill();

      // Inner dark wooden well
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#090d16';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#fde047';
      ctx.stroke();

      // Check if occupied by an earlier marble this round
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
        // Icon + Points inside hole
        ctx.font = '18px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(h.icon, h.x, h.y - 3);
        ctx.fillStyle = '#fef08a';
        ctx.font = '900 15px system-ui, sans-serif';
        ctx.fillText(`${h.points}`, h.x, h.y + 16);
      }

      // Hole title ribbon below
      ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
      ctx.font = '700 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lang === 'en' ? h.name_en : h.name_es, h.x, h.y + h.radius + 20);
    });

    // 3. Render 56 Brass Nails (Clavos de Latón)
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

    // 4. Render Spring Plunger (Resorte) & Active Marble
    const compression = isAnimatingShot ? 0.1 : shotPower * 70;
    const plungerY = 1135 + compression;

    // Coiled brass spring
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

      // Trigger pin hit sounds & sparks at matching step
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
      // Resting marble on plunger ready to launch
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

  // --------------------------------------------------------------------------
  // PATIO COURTYARD RENDERER (EL CÍRCULO / LA RUEDA & LA HOYITA)
  // --------------------------------------------------------------------------
  function drawPatioCourtyard(stage) {
    const isHoyita = stage === 'hoyita';
    const offsetY = 75; // Center 1000x1000 courtyard nicely inside 1000x1150 canvas

    ctx.save();
    // 1. Packed Terracotta Dirt Background
    const dirtGrad = ctx.createRadialGradient(500, 500 + offsetY, 60, 500, 500 + offsetY, 540);
    dirtGrad.addColorStop(0, '#5c3a21');
    dirtGrad.addColorStop(0.65, '#3d2414');
    dirtGrad.addColorStop(1, '#1f1108');
    ctx.fillStyle = dirtGrad;
    ctx.fillRect(25, 25, 950, 1100);

    // Courtyard Adobe Border
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#b45309';
    ctx.strokeRect(30, 30, 940, 1090);

    // Header Banner
    ctx.fillStyle = '#fde047';
    ctx.font = '900 25px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      isHoyita
        ? lang === 'en'
          ? '🕳️ PATIO DE TIERRA • LA HOYITA (EL POCHITO)'
          : '🕳️ PATIO DE TIERRA • LA HOYITA (EL POCHITO)'
        : lang === 'en'
          ? '⭕ PATIO DE TIERRA • EL CÍRCULO (LA RUEDA)'
          : '⭕ PATIO DE TIERRA • EL CÍRCULO (LA RUEDA)',
      500,
      72
    );

    ctx.translate(0, offsetY);

    // 2. Outer Shooting Line Circle (La Raya, R = 415)
    ctx.save();
    ctx.beginPath();
    ctx.arc(500, 500, 415, 0, Math.PI * 2);
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // 3. Inner Knockout Circle (El Círculo / La Rueda, R = 230)
    ctx.beginPath();
    ctx.arc(500, 500, 230, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fef3c7';
    ctx.stroke();

    // 4. Center Pit (La Hoyita at 500,500, R = 38) when in 'hoyita' mode
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
      // Animate multi-body marble paths
      const sim = activeAnim.sim;
      activeAnim.stepFloat += activeAnim.speed;
      const stepIdx = Math.floor(activeAnim.stepFloat);

      // Trigger glass collision sounds & dust sparks
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

      // Draw stationary target marbles not in sim.paths
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

      // Draw all animated marble paths
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
      // Static state: draw all active target marbles inside the circle
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

      // Draw rival players' shooters resting on the courtyard
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

      // Draw active player's shooter on outer perimeter + dotted aim trajectory
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

  // Direct Canvas Drag-to-Aim & Release
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

  // Angle slider & buttons
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

  // Spin presets
  document.querySelectorAll('.spin-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.spin-preset-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      shotSpin = Number(btn.dataset.spin);
    });
  });

  // Power presets
  document.querySelectorAll('.power-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.power-preset-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setPower(Number(btn.dataset.power));
    });
  });

  // Shoot button (tap or hold-to-charge)
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

  // Header controls
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
    localStorage.setItem('canicas_lang', lang);
    applyTranslations();
  });

  // Home tabs & win condition toggle
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

  // Create & Join Room buttons
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

  // Lobby actions
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
    if (currentRoom) {
      sendWs({ type: 'leave_room', roomCode: currentRoom.code });
    }
    localStorage.removeItem('canicas_room_code');
    currentRoom = null;
    switchScreen(screenHome);
  }

  document.getElementById('btn-leave-lobby').addEventListener('click', leaveCurrentRoom);
  document.getElementById('btn-leave-game').addEventListener('click', leaveCurrentRoom);

  // Host live stage switcher buttons
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

  // Nudge buttons
  document.getElementById('btn-blow').addEventListener('click', () => {
    if (currentRoom) sendWs({ type: 'nudge_arena', roomCode: currentRoom.code, kind: 'blow' });
  });

  document.getElementById('btn-table-tap').addEventListener('click', () => {
    if (currentRoom) sendWs({ type: 'nudge_arena', roomCode: currentRoom.code, kind: 'tap' });
  });

  // Banter chips
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

  // Modals: Rules & History
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

  // Check URL `?room=CODE` or saved session
  function checkAutoJoinOrResume() {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom) {
      document.getElementById('input-room-code').value = urlRoom.toUpperCase();
      document.getElementById('tab-join').click();
      return;
    }

    const savedRoom = localStorage.getItem('canicas_room_code');
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
        localStorage.removeItem('canicas_room_code');
        banner.classList.add('hidden');
      };
    }
  }

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  initProfileUI();
  applyTranslations();
  checkAutoJoinOrResume();
  requestAnimationFrame(renderArenaCanvas);
})();
