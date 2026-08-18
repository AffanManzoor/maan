/* ============================================================
   SuperKids — core.js
   State management, math/random helpers, confetti engine,
   sticker catalog, and small shared utilities.
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- random / array helpers ---------- */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const uid = () => Math.random().toString(36).slice(2, 10);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const pickOne = (arr) => arr[randInt(0, arr.length - 1)];
  function pickN(arr, n) {
    return shuffle(arr).slice(0, Math.min(n, arr.length));
  }
  function range(a, b) {
    const out = [];
    for (let i = a; i <= b; i++) out.push(i);
    return out;
  }

  /* ---------- state ---------- */
  const STORAGE_KEY = 'superkids_save_v1';

  function defaultState() {
    return {
      name: '',
      buddy: '',
      stars: 0,
      level: 1,
      stickers: [],
      progress: {},          // { [gameId]: { plays, bestPct, starsEarned } }
      subjectPlays: { math: 0, letters: 0, puzzle: 0, shapes: 0 },
      exams: [],              // { at, score, total }
      settings: { sound: true, voice: true },
      // "Bloom Zoo Plus" preview — a locally-flagged premium tier. Unlocks
      // the premium-only games and removes the free-tier daily play limit.
      // This is a MOCKUP: no real payment or server verification is involved.
      // See index.html / shell.js for the "Get Bloom Zoo Plus" flow.
      premium: false,
      // daily play-time tracking (free tier is capped at FREE_DAILY_LIMIT_MS)
      playToday: { date: '', ms: 0 },
      createdAt: Date.now()
    };
  }

  // Free-tier daily play cap: 30 minutes of active game time per day.
  // Premium removes it. Kept as a state helper so games can check + tick it.
  const FREE_DAILY_LIMIT_MS = 30 * 60 * 1000;
  function todayStamp() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function ensurePlayToday(state) {
    const today = todayStamp();
    if (!state.playToday || state.playToday.date !== today) {
      state.playToday = { date: today, ms: 0 };
    }
    return state.playToday;
  }
  function addPlayMs(ms) {
    const st = _state;
    ensurePlayToday(st);
    st.playToday.ms += ms;
    saveState();
  }
  function msPlayedToday() {
    const st = _state;
    return ensurePlayToday(st).ms;
  }
  function msPlayRemaining() {
    if (_state.premium) return Infinity;
    return Math.max(0, FREE_DAILY_LIMIT_MS - msPlayedToday());
  }
  function dailyLimitReached() {
    return !_state.premium && msPlayedToday() >= FREE_DAILY_LIMIT_MS;
  }
  function setPremium(on) {
    _state.premium = !!on;
    saveState();
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed, {
        settings: Object.assign({ sound: true, voice: true }, parsed.settings || {}),
        subjectPlays: Object.assign({ math: 0, letters: 0, puzzle: 0, shapes: 0 }, parsed.subjectPlays || {})
      });
    } catch (e) {
      return defaultState();
    }
  }

  let _state = loadState();
  const listeners = [];

  function getState() { return _state; }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_state)); } catch (e) { /* storage full/unavailable */ }
    listeners.forEach((fn) => { try { fn(_state); } catch (e) { /* ignore */ } });
  }

  function onStateChange(fn) { listeners.push(fn); }

  function resetProgress() {
    const keepName = _state.name, keepBuddy = _state.buddy;
    _state = defaultState();
    _state.name = keepName;
    _state.buddy = keepBuddy;
    saveState();
  }

  /* ---------- stickers ---------- */
  const STICKERS = [
    { id: 'star1', icon: '⭐', name: 'First Star', desc: 'Earn your very first star', need: (s) => s.stars >= 1 },
    { id: 'star2', icon: '🌟', name: 'Star Collector', desc: 'Collect 10 stars', need: (s) => s.stars >= 10 },
    { id: 'star3', icon: '🏅', name: 'Little Champion', desc: 'Collect 25 stars', need: (s) => s.stars >= 25 },
    { id: 'star4', icon: '🎖️', name: 'Big Champion', desc: 'Collect 50 stars', need: (s) => s.stars >= 50 },
    { id: 'star5', icon: '👑', name: 'Super Champion', desc: 'Collect 100 stars', need: (s) => s.stars >= 100 },
    { id: 'star6', icon: '💎', name: 'Legend Star', desc: 'Collect 200 stars', need: (s) => s.stars >= 200 },
    { id: 'ziggy1', icon: '🦁', name: "Ziggy's Pal", desc: 'Play 3 maths rounds', need: (s) => (s.subjectPlays.math || 0) >= 3 },
    { id: 'luna1', icon: '🦉', name: "Luna's Pal", desc: 'Play 3 letters rounds', need: (s) => (s.subjectPlays.letters || 0) >= 3 },
    { id: 'pip1', icon: '🦊', name: "Pip's Pal", desc: 'Play 3 puzzle rounds', need: (s) => (s.subjectPlays.puzzle || 0) >= 3 },
    { id: 'bolt1', icon: '🤖', name: "Bolt's Pal", desc: 'Play 3 shape rounds', need: (s) => (s.subjectPlays.shapes || 0) >= 3 },
    { id: 'puzzlepro', icon: '🧩', name: 'Puzzle Pro', desc: 'Finish a puzzle on Super level', need: (s) => Object.entries(s.progress || {}).some(([k, v]) => (k === 'jigsaw' || k === 'sorting') && v.bestLevel >= 3) },
    { id: 'examace', icon: '🎓', name: 'Exam Ace', desc: 'Score 100% on a Super Exam', need: (s) => (s.exams || []).some((e) => e.score === e.total) }
  ];

  function checkStickers() {
    const newly = [];
    STICKERS.forEach((st) => {
      if (!_state.stickers.includes(st.id) && st.need(_state)) {
        _state.stickers.push(st.id);
        newly.push(st);
      }
    });
    if (newly.length) saveState();
    return newly;
  }

  /* ---------- progress / stars ---------- */
  function recordRound(gameId, subject, correct, total, level) {
    const pct = total > 0 ? correct / total : 0;
    let stars = 1;
    if (pct >= 0.99) stars = 3;
    else if (pct >= 0.6) stars = 2;

    const p = _state.progress[gameId] || { plays: 0, bestPct: 0, starsEarned: 0, bestLevel: 0 };
    p.plays += 1;
    p.bestPct = Math.max(p.bestPct, pct);
    p.starsEarned += stars;
    p.bestLevel = Math.max(p.bestLevel || 0, level || 1);
    _state.progress[gameId] = p;

    if (subject && _state.subjectPlays.hasOwnProperty(subject)) {
      _state.subjectPlays[subject] += 1;
    }
    _state.stars += stars;
    saveState();
    const unlocked = checkStickers();
    return { stars, unlocked };
  }

  function recordExam(correct, total) {
    _state.exams.push({ at: Date.now(), score: correct, total });
    saveState();
  }

  /* ---------- confetti / particle engine ---------- */
  const canvas = () => document.getElementById('fxCanvas');
  let particles = [];
  let rafId = null;
  const PALETTE = ['#FF6B8B', '#FFC93C', '#3DDC97', '#4EA8FF', '#9B6BFF', '#FF9D45'];

  function resizeCanvas() {
    const c = canvas();
    if (!c) return;
    c.width = window.innerWidth * devicePixelRatio;
    c.height = window.innerHeight * devicePixelRatio;
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
  }
  window.addEventListener('resize', resizeCanvas);

  function burst(x, y, opts) {
    opts = opts || {};
    const count = opts.count || 40;
    const spread = opts.spread || 1;
    const power = opts.power || 12;
    for (let i = 0; i < count; i++) {
      const ang = rand(0, Math.PI * 2);
      const speed = rand(2, power) * spread;
      particles.push({
        x, y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed - power * 0.35,
        g: rand(0.28, 0.5),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.3, 0.3),
        size: rand(6, 13),
        color: opts.colors ? pickOne(opts.colors) : pickOne(PALETTE),
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
        life: 1,
        decay: rand(0.008, 0.016)
      });
    }
    if (!rafId) loop();
  }

  function fireworkRain(opts) {
    opts = opts || {};
    const w = window.innerWidth;
    const n = opts.count || 60;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(-40, -4),
        vx: rand(-1, 1),
        vy: rand(2, 5),
        g: 0.05,
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.2, 0.2),
        size: rand(6, 12),
        color: opts.colors ? pickOne(opts.colors) : pickOne(PALETTE),
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
        life: 1,
        decay: rand(0.003, 0.006)
      });
    }
    if (!rafId) loop();
  }

  function loop() {
    const c = canvas();
    if (!c) { rafId = null; particles = []; return; }
    const ctx = c.getContext('2d');
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= p.decay;
      ctx.save();
      ctx.globalAlpha = clamp(p.life, 0, 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 60);
    if (particles.length) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
      const ctx2 = c.getContext('2d');
      ctx2.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  /* ---------- shared shape drawing (used by Shape Detective + Shape Sorter) ---------- */
  const SHAPES = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'diamond', 'pentagon', 'hexagon', 'oval'];
  const COLORS = [
    { n: 'red', v: '#FF5A5F' }, { n: 'blue', v: '#4EA8FF' }, { n: 'yellow', v: '#FFC93C' }, { n: 'green', v: '#2FD8A0' },
    { n: 'purple', v: '#9B6BFF' }, { n: 'orange', v: '#FF9D45' }, { n: 'pink', v: '#FF8FB1' }
  ];
  const SIDES = { triangle: 3, square: 4, rectangle: 4, diamond: 4, pentagon: 5, hexagon: 6 };

  function polyPoints(cx, cy, rOuter, rInner, n, rotate) {
    rotate = rotate == null ? -Math.PI / 2 : rotate;
    const equal = rInner === rOuter;
    const total = equal ? n : n * 2;
    const pts = [];
    for (let i = 0; i < total; i++) {
      const r = equal ? rOuter : (i % 2 === 0 ? rOuter : rInner);
      const a = rotate + ((Math.PI * 2) / total) * i;
      pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  function shapeSVG(kind, color, size) {
    size = size || 72;
    let inner;
    switch (kind) {
      case 'circle': inner = `<circle cx="50" cy="50" r="42" fill="${color}"/>`; break;
      case 'square': inner = `<rect x="9" y="9" width="82" height="82" rx="12" fill="${color}"/>`; break;
      case 'triangle': inner = `<polygon points="50,6 94,90 6,90" fill="${color}"/>`; break;
      case 'rectangle': inner = `<rect x="3" y="24" width="94" height="52" rx="10" fill="${color}"/>`; break;
      case 'star': inner = `<polygon points="${polyPoints(50, 50, 44, 19, 5)}" fill="${color}"/>`; break;
      case 'heart': inner = `<path d="M50 90 C8 62 8 24 32 17 C44 13 50 27 50 27 C50 27 56 13 68 17 C92 24 92 62 50 90 Z" fill="${color}"/>`; break;
      case 'diamond': inner = `<polygon points="50,3 95,50 50,97 5,50" fill="${color}"/>`; break;
      case 'pentagon': inner = `<polygon points="${polyPoints(50, 50, 44, 44, 5)}" fill="${color}"/>`; break;
      case 'hexagon': inner = `<polygon points="${polyPoints(50, 50, 44, 44, 6, 0)}" fill="${color}"/>`; break;
      case 'oval': inner = `<ellipse cx="50" cy="50" rx="46" ry="30" fill="${color}"/>`; break;
      default: inner = `<circle cx="50" cy="50" r="42" fill="${color}"/>`;
    }
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" class="shape-ico">${inner}</svg>`;
  }

  /* ---------- toast ---------- */
  let toastTimer = null;
  function toast(msg, ms) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms || 2200);
  }

  /* ---------- expose ---------- */
  global.SK = {
    rand, randInt, clamp, uid, shuffle, pickOne, pickN, range,
    getState, saveState, onStateChange, resetProgress,
    STICKERS, checkStickers, recordRound, recordExam,
    burst, fireworkRain, resizeCanvas, toast,
    SHAPES, COLORS, SIDES, shapeSVG, polyPoints,
    // Bloom Zoo Plus preview helpers
    FREE_DAILY_LIMIT_MS, addPlayMs, msPlayedToday, msPlayRemaining, dailyLimitReached, setPremium
  };

  document.addEventListener('DOMContentLoaded', resizeCanvas);
})(window);
