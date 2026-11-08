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

  speak(text, lang = 'es') {
    if (this.muted || !this.voiceEnabled || !window.speechSynthesis || !text) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[«»"🔮👑💎🌟☀️🔥🌙🔔❤️🦜🎸🍉🌵🌶️🏺🌺🪙💀🤠🐸🎺🎯💥🕳️💨]/g, '').trim();
      if (!clean) return;
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = lang === 'en' ? 'en-US' : 'es-MX';
      utter.rate = 1.04;
      utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    } catch (_) {
      // Ignore speech synthesis errors on restricted browsers
    }
  }
}

window.canicasAudio = new CanicasAudio();
