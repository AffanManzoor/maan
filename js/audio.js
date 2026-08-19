/* ============================================================
   SuperKids — audio.js
   Zero-asset sound design: WebAudio synthesized SFX + speech
   synthesis for "read aloud" support. No external files needed.
   ============================================================ */
(function (global) {
  'use strict';

  let actx = null;
  function ctx() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) actx = new AC();
    }
    return actx;
  }

  function unlock() {
    const c = ctx();
    if (c && c.state === 'suspended') c.resume();
  }
  ['pointerdown', 'touchstart', 'keydown'].forEach((ev) =>
    document.addEventListener(ev, unlock, { once: true, passive: true })
  );

  function soundOn() {
    const s = global.SK && SK.getState();
    return !s || (s.settings && s.settings.sound !== false);
  }

  function tone(freq, start, dur, opts) {
    const c = ctx();
    if (!c) return;
    opts = opts || {};
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    if (opts.glideTo) osc.frequency.exponentialRampToValueAtTime(opts.glideTo, start + dur);
    const vol = opts.vol != null ? opts.vol : 0.18;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(vol, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  function noiseBurst(start, dur, vol) {
    const c = ctx();
    if (!c) return;
    const bufferSize = Math.floor(c.sampleRate * dur);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const gain = c.createGain();
    gain.gain.setValueAtTime(vol || 0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(gain).connect(c.destination);
    src.start(start);
  }

  const SFX = {
    click() {
      const c = ctx(); if (!c) return;
      const t = c.currentTime;
      tone(520, t, 0.06, { type: 'triangle', vol: 0.12 });
    },
    pop() {
      const c = ctx(); if (!c) return;
      const t = c.currentTime;
      tone(300, t, 0.09, { type: 'sine', glideTo: 520, vol: 0.16 });
    },
    correct() {
      const c = ctx(); if (!c) return;
      const t = c.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, t + i * 0.075, 0.16, { type: 'triangle', vol: 0.16 }));
    },
    wrong() {
      const c = ctx(); if (!c) return;
      const t = c.currentTime;
      tone(220, t, 0.16, { type: 'sine', glideTo: 160, vol: 0.14 });
      tone(196, t + 0.13, 0.18, { type: 'sine', glideTo: 140, vol: 0.12 });
    },
    star() {
      const c = ctx(); if (!c) return;
      const t = c.currentTime;
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, t + i * 0.05, 0.22, { type: 'sine', vol: 0.13 }));
    },
    fanfare() {
      const c = ctx(); if (!c) return;
      const t = c.currentTime;
      const seq = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      seq.forEach((f, i) => tone(f, t + i * 0.14, 0.24, { type: 'triangle', vol: 0.15 }));
    },
    whoosh() {
      const t = ctx() ? ctx().currentTime : 0;
      noiseBurst(t, 0.25, 0.06);
    },
    flip() {
      const c = ctx(); if (!c) return;
      const t = c.currentTime;
      tone(440, t, 0.05, { type: 'square', vol: 0.06 });
    },
    place() {
      const c = ctx(); if (!c) return;
      const t = c.currentTime;
      tone(392, t, 0.07, { type: 'sine', vol: 0.14 });
      tone(587, t + 0.06, 0.09, { type: 'sine', vol: 0.12 });
    }
  };

  function play(name) {
    if (!soundOn()) return;
    try { (SFX[name] || function () {})(); } catch (e) { /* ignore audio errors */ }
  }

  /* ---------- speech synthesis (read aloud) ---------- */
  let voiceCache = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return null;
    if (voiceCache) return voiceCache;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;
    // Prefer soft, warm British English voices — they're the easiest for young
    // kids to parse across accents, and the enhanced/premium variants sound the
    // most natural. Falls back to any English if a GB voice isn't available.
    const isGB = (v) => /en-GB/i.test(v.lang);
    const isPremium = (v) => /enhanced|premium|neural|natural|online|wavenet/i.test(v.name);
    const isSoftFemale = (v) => /female|kate|serena|sonia|libby|amy|emma|martha|hazel|susan|jenny|aria|nova|abbi|olivia|isla/i.test(v.name);
    const isNamedGB = (v) => isGB(v) && /kate|serena|sonia|libby|amy|emma|martha|hazel|susan|abbi|olivia|isla|daniel|arthur|ryan|thomas|google uk english/i.test(v.name);
    const preferred =
      voices.find((v) => isGB(v) && isSoftFemale(v) && isPremium(v)) ||  // best case: soft British female, premium
      voices.find((v) => isGB(v) && isSoftFemale(v)) ||                  // soft British female (any quality)
      voices.find((v) => isNamedGB(v) && isPremium(v)) ||                // known British voice, premium
      voices.find(isNamedGB) ||                                          // known British voice by name
      voices.find((v) => isGB(v) && isPremium(v)) ||                     // any premium British voice
      voices.find(isGB) ||                                               // any British voice
      voices.find((v) => /en-US/i.test(v.lang) && isSoftFemale(v)) ||   // US female fallback
      voices.find((v) => /^en/i.test(v.lang)) ||                         // any English at all
      voices[0];
    voiceCache = preferred;
    return preferred;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => { voiceCache = null; };
  }

  function speak(text) {
    const s = global.SK && SK.getState();
    if (s && s.settings && s.settings.voice === false) return;
    if (!('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = 0.82;
      u.pitch = 1.25;
      u.volume = 0.92;
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  function stopSpeak() {
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }

  global.SKAudio = { play, speak, stopSpeak, getContext: () => (soundOn() ? ctx() : null) };
})(window);
