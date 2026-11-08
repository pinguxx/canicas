// ============================================================================
// CANICAS MEXICANAS • WEB AUDIO SYNTHESIZER & VOICE LOCUTION (ZERO EXTERNAL FILES)
// ============================================================================

const safeStorage = (() => {
  const mem = {};

  function readWindowNameBag() {
    try {
      const raw = window.name;
      if (raw && typeof raw === 'string' && raw.indexOf('__canicas__=') !== -1) {
        const jsonPart = raw.slice(raw.indexOf('__canicas__=') + 12);
        return JSON.parse(jsonPart) || {};
      }
    } catch (_) {}
    return null;
  }

  function writeWindowNameBag(k, v) {
    try {
      let bag = readWindowNameBag() || {};
      if (v === null || v === undefined) {
        delete bag[k];
      } else {
        bag[k] = String(v);
      }
      window.name = '__canicas__=' + JSON.stringify(bag);
    } catch (_) {}
  }

  function readCookie(k) {
    try {
      if (typeof document !== 'undefined' && document.cookie) {
        const match = document.cookie.match(new RegExp('(?:^|; )' + encodeURIComponent(k) + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
      }
    } catch (_) {}
    return null;
  }

  function writeCookie(k, v) {
    try {
      if (typeof document !== 'undefined') {
        if (k === 'canicas_offline_room' || (v && String(v).length > 500)) {
          return;
        }
        const val = (v === null || v === undefined) ? '' : encodeURIComponent(String(v));
        const maxAge = (v === null || v === undefined) ? 'Max-Age=0;' : 'Max-Age=86400; SameSite=Lax; path=/';
        document.cookie = `${encodeURIComponent(k)}=${val}; ${maxAge}`;
      }
    } catch (_) {}
  }

  return {
    getItem(k) {
      try {
        const v = window.localStorage.getItem(k);
        if (v !== null && v !== undefined) return v;
      } catch (_) {}
      try {
        const v = window.sessionStorage.getItem(k);
        if (v !== null && v !== undefined) return v;
      } catch (_) {}
      const fromName = readWindowNameBag();
      if (fromName && Object.prototype.hasOwnProperty.call(fromName, k)) {
        return fromName[k];
      }
      const fromCookie = readCookie(k);
      if (fromCookie !== null && fromCookie !== undefined) {
        return fromCookie;
      }
      return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
    },
    setItem(k, v) {
      mem[k] = String(v);
      try { window.localStorage.setItem(k, String(v)); } catch (_) {}
      try { window.sessionStorage.setItem(k, String(v)); } catch (_) {}
      writeWindowNameBag(k, v);
      writeCookie(k, v);
    },
    removeItem(k) {
      delete mem[k];
      try { window.localStorage.removeItem(k); } catch (_) {}
      try { window.sessionStorage.removeItem(k); } catch (_) {}
      writeWindowNameBag(k, null);
      writeCookie(k, null);
    },
  };
})();
window.safeStorage = safeStorage;

class CanicasAudio {
  constructor() {
    this.ctx = null;
    this.muted = safeStorage.getItem('canicas_muted') === 'true';
    this.voiceEnabled = safeStorage.getItem('canicas_voice') !== 'false';
    this.voices = [];
    this.voicesChangedBound = false;
    this.lastSpokenTimestamp = 0;
    this.initVoices();
  }

  ensureContext() {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    safeStorage.setItem('canicas_muted', String(this.muted));
    if (this.muted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.muted;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    safeStorage.setItem('canicas_voice', String(this.voiceEnabled));
    if (!this.voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    return this.voiceEnabled;
  }

  playChargeTick(powerNormalized = 0.5) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260 + powerNormalized * 560, now);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Brass spring plunger launch for Canicas de la Feria
  playPlungerLaunch(power = 0.7) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140 + power * 80, now);
    osc.frequency.exponentialRampToValueAtTime(520 + power * 240, now + 0.16);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(680, now);
    filter.Q.setValueAtTime(3.2, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Crisp thumb flick ("uñita / huesito") for Canicas de Patio
  playThumbFlick(power = 0.75) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680 + power * 340, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.065);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  // Brass nail ("clavo") metallic chime when marble bounces on Feria board
  playPinTing(intensity = 0.6, rowFactor = 0.5) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 1280 + rowFactor * 640 + (Math.random() - 0.5) * 90;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.18, now + 0.065);

    const vol = Math.min(0.11, 0.035 + intensity * 0.075);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Crystalline glass-on-glass marble collision ("¡clack!")
  playGlassClack(intensity = 0.8, isRival = false) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Primary glass resonance ping
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    const f1 = isRival ? 2150 : 1840 + (Math.random() - 0.5) * 160;
    const f2 = f1 * 1.58;

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(f1, now);
    osc1.frequency.exponentialRampToValueAtTime(620, now + 0.048);
    osc2.frequency.setValueAtTime(f2, now);
    osc2.frequency.exponentialRampToValueAtTime(980, now + 0.036);

    const vol = Math.min(0.18, 0.06 + intensity * 0.12);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.06);
    osc2.stop(now + 0.06);
  }

  // Marble settling into a Feria hole or La Hoyita
  playHoleDrop(points = 20) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Wooden/earth cup plop
    const plop = ctx.createOscillator();
    const plopGain = ctx.createGain();
    plop.type = 'sine';
    plop.frequency.setValueAtTime(210, now);
    plop.frequency.exponentialRampToValueAtTime(85, now + 0.09);
    plopGain.gain.setValueAtTime(0.15, now);
    plopGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    plop.connect(plopGain);
    plopGain.connect(ctx.destination);
    plop.start(now);
    plop.stop(now + 0.11);

    // Score chime notes
    const notes =
      points >= 75
        ? [523.25, 659.25, 783.99, 1046.5]
        : points >= 50
          ? [440, 554.37, 659.25]
          : [392, 523.25];

    notes.forEach((freq, idx) => {
      const t = now + 0.06 + idx * 0.075;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.11, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.19);
    });
  }

  playJackpotFanfare() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.085;
      const dur = idx === notes.length - 1 ? 0.42 : 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  }

  playBlowSound() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.24;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(480, now);
    filter.frequency.exponentialRampToValueAtTime(1150, now + 0.18);
    filter.Q.setValueAtTime(2.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  playTableTapSound() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.09);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playVictoryFanfare() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const melody = [
      { f: 523.25, t: 0.0, d: 0.14 },
      { f: 659.25, t: 0.14, d: 0.14 },
      { f: 783.99, t: 0.28, d: 0.14 },
      { f: 1046.5, t: 0.42, d: 0.28 },
      { f: 783.99, t: 0.72, d: 0.14 },
      { f: 1046.5, t: 0.88, d: 0.52 }
    ];
    const now = ctx.currentTime;
    melody.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.16, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.02);
    });
  }

  initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        this.voices = v;
      }
      if (!this.voicesChangedBound) {
        this.voicesChangedBound = true;
        window.speechSynthesis.onvoiceschanged = () => {
          try {
            const updated = window.speechSynthesis.getVoices();
            if (updated && updated.length > 0) {
              this.voices = updated;
            }
          } catch (_) {}
        };
      }
    } catch (_) {}
  }

  getBestVoice(lang = 'es') {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const isEs = (lang || '').toLowerCase().startsWith('es');
    if (isEs) {
      // 1. Exact Mexican Spanish voices (es-MX or name containing Mexico/Mexican/Sabina/Dalia/Raul/Paulina/Jorge)
      const mxVoices = this.voices.filter((v) => {
        const code = (v.lang || '').replace('_', '-').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return code === 'es-mx' || name.includes('mexic') || name.includes('sabina') || name.includes('dalia') || name.includes('raul') || name.includes('paulina');
      });
      const mxNatural = mxVoices.find((v) => {
        const n = (v.name || '').toLowerCase();
        return n.includes('natural') || n.includes('google') || n.includes('neural') || n.includes('online');
      });
      if (mxNatural) return mxNatural;
      if (mxVoices.length > 0) return mxVoices[0];

      // 2. Latin American Spanish (es-US, es-419, Latin America)
      const latamVoices = this.voices.filter((v) => {
        const code = (v.lang || '').replace('_', '-').toLowerCase();
        return code === 'es-us' || code === 'es-419' || (code.startsWith('es-') && code !== 'es-es');
      });
      const latamNatural = latamVoices.find((v) => {
        const n = (v.name || '').toLowerCase();
        return n.includes('natural') || n.includes('google') || n.includes('neural') || n.includes('online');
      });
      if (latamNatural) return latamNatural;
      if (latamVoices.length > 0) return latamVoices[0];

      // 3. Any Spanish voice (es, es-ES, etc.)
      const esVoices = this.voices.filter((v) => (v.lang || '').toLowerCase().startsWith('es'));
      const esNatural = esVoices.find((v) => {
        const n = (v.name || '').toLowerCase();
        return n.includes('natural') || n.includes('google') || n.includes('neural') || n.includes('online');
      });
      if (esNatural) return esNatural;
      if (esVoices.length > 0) return esVoices[0];
    } else {
      // English voices
      const enVoices = this.voices.filter((v) => {
        const code = (v.lang || '').replace('_', '-').toLowerCase();
        return code === 'en-us' || code.startsWith('en');
      });
      const enNatural = enVoices.find((v) => {
        const n = (v.name || '').toLowerCase();
        return n.includes('natural') || n.includes('google') || n.includes('neural') || n.includes('jenny') || n.includes('guy') || n.includes('aria');
      });
      if (enNatural) return enNatural;
      if (enVoices.length > 0) return enVoices[0];
    }

    return null;
  }

  cleanSpokenText(text, lang = 'es') {
    if (!text) return '';
    let clean = String(text);

    // Strip bullet separators and secondary instruction badges (e.g. • ¡Saca canicas para Puntos x2!)
    clean = clean.replace(/•[^.!?]*(?:[.!?]|$)/g, ' ');
    clean = clean.replace(/[•·]/g, ' ');

    // Strip emoji and decorative icons
    clean = clean.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '');
    clean = clean.replace(/[«»"“”'‘’🔮👑💎🌟☀️🔥🌙🔔❤️🦜🎸🍉🌵🌶️🏺🌺🪙💀🤠🐸🎺🎯💥🕳️💨*~#_|]/g, ' ');

    // Strip parenthetical score annotations: (+10 pts), (2 canicas + 30 pts), (+25), etc.
    clean = clean.replace(/\(\s*[^)]*(?:pts|puntos|points|canicas|\+|\d)[^)]*\)/gi, ' ');
    clean = clean.replace(/\(\s*\)/g, ' ');

    // Strip loose score suffixes: +50 pts, +10 pts, +25, 50 pts
    clean = clean.replace(/\+\s*\d+\s*(?:pts|puntos|points)?/gi, ' ');
    clean = clean.replace(/\b\d+\s*(?:pts|puntos|points)\b/gi, ' ');

    // Replace multiplier notation "x2" with "doble" in Spanish or "double" in English
    clean = clean.replace(/\bx(\d+)\b/gi, (m, d) => (lang === 'es' ? (d === '2' ? 'doble' : `por ${d}`) : `times ${d}`));
    clean = clean.replace(/\b(\d+)x\b/gi, (m, d) => (lang === 'es' ? (d === '2' ? 'doble' : `por ${d}`) : `times ${d}`));

    // In Spanish, fix "1 canica" -> "una canica"
    if (lang === 'es') {
      clean = clean.replace(/\b1\s+canica\b/gi, 'una canica');
    }

    // Convert ALL-CAPS words (e.g. ¡CHIRAS PELAS Y PONCHE!, ¡ENCHOLADA EN LA HOYITA!)
    // into standard sentence case so TTS engines do not spell them out as acronyms
    clean = clean.replace(/([¡¿]?\s*)([A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ]{1,})*)/g, (match, prefix, words) => {
      const lower = words.toLowerCase();
      const capitalized = lower.charAt(0).toUpperCase() + lower.slice(1);
      return prefix + capitalized;
    });

    // Clean whitespace and punctuation
    clean = clean.replace(/\s+/g, ' ');
    clean = clean.replace(/([!?])\s*[.:,;]/g, '$1 ');
    clean = clean.replace(/[.:,;]\s*([!?])/g, ' $1');
    clean = clean.replace(/([!?,.])\1+/g, '$1');
    clean = clean.replace(/\s+([!?,.:;])/g, '$1');
    clean = clean.replace(/\s+/g, ' ');
    return clean.trim();
  }

  speakAnnouncement(arg1, arg2, arg3, arg4) {
    if (arg1 && typeof arg1 === 'object') {
      return this.speakOutcomeAnnouncement(arg1, arg2, arg3, arg4);
    }
    if (this.muted || !this.voiceEnabled) return;
    const lang = typeof arg3 === 'string' ? arg3 : 'es';
    let phrase = (arg1 || '').trim();
    this.speak(phrase, lang);
  }

  /**
   * Filter and speak only significant or sporadic highlights (avoiding constant chatter)
   * @param {Object} outcome - Result of the shot
   * @param {string} [headline] - Visual headline
   * @param {string} [dicho] - Visual saying
   * @param {string} [lang] - Language code ('es' | 'en')
   */
  speakOutcomeAnnouncement(outcome, headline, dicho, lang = 'es') {
    if (this.muted || !this.voiceEnabled || !outcome) return;

    const now = Date.now();
    const timeSinceLast = now - (this.lastSpokenTimestamp || 0);

    // Hard minimum cooldown between any announcements: at least 6 seconds
    if (timeSinceLast < 6000) {
      return;
    }

    const pts = Number(outcome.points_scored) || 0;
    const isEncholada = Boolean(outcome.patio_sim && outcome.patio_sim.encholada_hoyita);
    const hasPonchados = Boolean(
      outcome.patio_sim &&
      outcome.patio_sim.ponchados_player_ids &&
      outcome.patio_sim.ponchados_player_ids.length > 0
    );
    const capturedCount = (outcome.patio_sim && outcome.patio_sim.captured_ids)
      ? outcome.patio_sim.captured_ids.length
      : 0;

    let phrase = null;

    // =========================================================================
    // TIER 1: BIG HIGHLIGHTS ONLY (Celebratory, punchy fairground exclamations)
    // =========================================================================

    // 1. El Gallo de Oro (100 puntos - premio mayor)
    if (pts >= 100 || (outcome.feria_sim && outcome.feria_sim.hole && outcome.feria_sim.hole.points >= 100)) {
      phrase = lang === 'en' ? '¡Golden Rooster! Grand prize!' : '¡Al Gallo de Cien! ¡Premio mayor!';
    }
    // 2. Encholada en La Hoyita (direct hit into the center hole)
    else if (isEncholada) {
      phrase = lang === 'en' ? '¡Straight into the pit! Bullseye!' : '¡Directo a la hoyita! ¡Encholada!';
    }
    // 3. High-score jackpot (75 puntos - Corona Real / Estrella Azteca)
    else if (pts >= 75) {
      phrase = lang === 'en' ? '¡Master shot! Seventy-five points!' : '¡Tiro maestro! ¡Setenta y cinco puntos!';
    }
    // 4. Ponchado / Quema (eliminated rival marble)
    else if (hasPonchados) {
      phrase = lang === 'en' ? '¡Chiras pelas! Knockout strike!' : '¡Chiras pelas y quema!';
    }
    // 5. Multi-marble capture (2 or more in one shot)
    else if (capturedCount >= 2) {
      phrase = lang === 'en' ? '¡Double knockout! What a shot!' : '¡Chiras pelas! ¡Carambola doble!';
    }

    // =========================================================================
    // TIER 2: SPORADIC NOTABLE SHOTS (Occasional highlight, requires 14s cooldown + 40% chance)
    // =========================================================================
    else if (timeSinceLast >= 14000 && Math.random() < 0.40) {
      // Solid 50 pts hole (El Sol, El Diablo, La Luna)
      if (pts >= 50) {
        phrase = lang === 'en' ? '¡Fifty points on the board!' : '¡Cincuenta puntos al marcador!';
      }
      // Single marble knocked out from the ring
      else if (capturedCount === 1 && pts >= 25) {
        phrase = lang === 'en' ? '¡Clean shot in the ring!' : '¡Buena canica al ruedo!';
      }
    }

    // =========================================================================
    // TIER 3: MINOR / ROUTINE (0 pts, misses, 10, 20, 30 pts) -> COMPLETELY SILENT!
    // =========================================================================
    if (phrase) {
      this.speak(phrase, lang);
    }
  }

  speakVictory(winnerName, lang = 'es') {
    if (this.muted || !this.voiceEnabled) return;
    const phrase = lang === 'en'
      ? (winnerName ? `We have a Champion! Congratulations ${winnerName}!` : 'We have a Champion!')
      : (winnerName ? `¡Tenemos Campeón del Ruedo! ¡Felicidades ${winnerName}!` : '¡Tenemos Campeón del Ruedo!');
    this.speak(phrase, lang);
  }

  speak(text, lang = 'es') {
    if (this.muted || !this.voiceEnabled || !window.speechSynthesis || !text) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const clean = this.cleanSpokenText(text, lang);
      if (!clean) return;

      const utter = new SpeechSynthesisUtterance(clean);
      const voice = this.getBestVoice(lang);
      if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang || (lang === 'en' ? 'en-US' : 'es-MX');
      } else {
        utter.lang = lang === 'en' ? 'en-US' : 'es-MX';
      }

      // Natural, articulate Mexican fairground voice locution (0.88 tempo, natural pitch 1.0)
      utter.rate = 0.88;
      utter.pitch = 1.0;
      utter.volume = 1.0;

      this.lastSpokenTimestamp = Date.now();
      window.speechSynthesis.speak(utter);
    } catch (_) {
      // Ignore speech synthesis errors on restricted browsers
    }
  }
}

window.canicasAudio = new CanicasAudio();
