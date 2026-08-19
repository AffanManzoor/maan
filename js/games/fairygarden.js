/* ============================================================
   Bloom Zoo — Fairy Garden (Plus)
   Hosted by Luna. Tap the meadow to plant flowers and add
   butterflies. Choose a sky (day/sunset/night) to change the
   whole mood. Kid-safe: no goal, no timer — press Save to
   celebrate. 3 stars every time.
   ============================================================ */
(function () {
  'use strict';

  const SKIES = [
    { value: 'day',    label: 'Day',    top: '#BFE4FF', bot: '#E4F2FF', accent: '#FFC93C' },
    { value: 'sunset', label: 'Sunset', top: '#FF8560', bot: '#FFC93C', accent: '#FF6F7D' },
    { value: 'night',  label: 'Night',  top: '#0E1444', bot: '#5B3A9E', accent: '#F4C1D0' }
  ];
  const FLOWER_COLORS = ['#FF6F7D', '#FFC93C', '#9B6BFF', '#4EA8FF', '#F4C1D0', '#FFFFFF'];
  const BRUSHES = [
    { value: 'flower',    label: '🌸 Flower' },
    { value: 'butterfly', label: '🦋 Butterfly' },
    { value: 'mushroom',  label: '🍄 Mushroom' }
  ];
  const MAX_ITEMS = 24;

  function defaultState() { return { sky: 'day', brush: 'flower', items: [] }; }

  function flowerSVG(x, y, color) {
    return `<g transform="translate(${x} ${y})">
      <line x1="0" y1="0" x2="0" y2="26" stroke="#2FAB70" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="6" cy="14" rx="6" ry="3" fill="#3DDC97"/>
      <circle cx="-8" cy="-2" r="7" fill="${color}"/>
      <circle cx="8" cy="-2" r="7" fill="${color}"/>
      <circle cx="0" cy="-10" r="7" fill="${color}"/>
      <circle cx="0" cy="4" r="7" fill="${color}"/>
      <circle cx="0" cy="-4" r="4" fill="#FFC93C"/>
    </g>`;
  }
  function butterflySVG(x, y, color) {
    return `<g transform="translate(${x} ${y})">
      <ellipse cx="-8" cy="-4" rx="8" ry="6" fill="${color}"/>
      <ellipse cx="8"  cy="-4" rx="8" ry="6" fill="${color}"/>
      <ellipse cx="-8" cy="6"  rx="6" ry="5" fill="${color}"/>
      <ellipse cx="8"  cy="6"  rx="6" ry="5" fill="${color}"/>
      <ellipse cx="0" cy="0" rx="2" ry="8" fill="#2A2438"/>
      <line x1="0" y1="-8" x2="-3" y2="-14" stroke="#2A2438" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="-8" x2="3"  y2="-14" stroke="#2A2438" stroke-width="1.5" stroke-linecap="round"/>
    </g>`;
  }
  function mushroomSVG(x, y) {
    return `<g transform="translate(${x} ${y})">
      <rect x="-5" y="0" width="10" height="14" fill="#F4E3C6" stroke="#8B5E34" stroke-width="1"/>
      <path d="M-16 0 Q0 -22 16 0 Z" fill="#FF6F7D" stroke="#B93540" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="-6" cy="-6" r="2" fill="#fff"/><circle cx="6" cy="-6" r="2" fill="#fff"/><circle cx="0" cy="-12" r="2.4" fill="#fff"/>
    </g>`;
  }

  function mountFairy(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const state = defaultState();

    function render() {
      shell.stage.innerHTML = `
        <p class="pz-instructions">Tap the meadow to plant flowers, butterflies and mushrooms — make it magic!</p>
        <div class="fg-scene" id="fgScene"></div>
        <div class="fg-tools">
          <div class="cust-row-label">Brush</div>
          <div class="cust-swatches" id="fgBrushes"></div>
          <button class="btn btn-ghost pz-undo" id="fgUndo" type="button">↺ Undo</button>
          <button class="btn btn-ghost pz-undo" id="fgSky"  type="button">🌤 Change sky</button>
          <div class="fg-count">${state.items.length} of ${MAX_ITEMS} planted</div>
        </div>
        <button class="btn btn-xl btn-mint cust-done fg-done" type="button">🌸 Save my garden!</button>`;

      const sky = SKIES.find((s) => s.value === state.sky) || SKIES[0];
      // stars for night sky
      let stars = '';
      if (state.sky === 'night') {
        for (let i = 0; i < 24; i++) {
          const sx = 20 + (i * 37) % 380;
          const sy = 10 + (i * 23) % 90;
          stars += `<circle cx="${sx}" cy="${sy}" r="${1 + (i % 3) * 0.4}" fill="#fff" opacity="${0.4 + (i % 4) * 0.15}"/>`;
        }
      }
      // sun / moon
      const orb = state.sky === 'night'
        ? `<circle cx="340" cy="60" r="26" fill="#F4C1D0"/><circle cx="330" cy="52" r="18" fill="${sky.bot}"/>`
        : `<circle cx="340" cy="60" r="26" fill="${sky.accent}" opacity="0.85"/>`;

      const items = state.items.map((it) => {
        if (it.kind === 'flower') return flowerSVG(it.x, it.y, it.color);
        if (it.kind === 'butterfly') return butterflySVG(it.x, it.y, it.color);
        return mushroomSVG(it.x, it.y);
      }).join('');

      shell.stage.querySelector('#fgScene').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" role="img" aria-label="Your fairy garden" style="cursor:crosshair">
        <defs><linearGradient id="fgSky${state.sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.top}"/><stop offset="1" stop-color="${sky.bot}"/></linearGradient></defs>
        <rect x="0" y="0" width="400" height="180" fill="url(#fgSky${state.sky})"/>
        ${stars}
        ${orb}
        <path d="M0 170 Q100 158 200 168 T400 170 L400 280 L0 280 Z" fill="#3DDC97"/>
        <path d="M0 200 Q100 190 200 202 T400 205 L400 280 L0 280 Z" fill="#2FAB70"/>
        ${items}
      </svg>`;

      // brush swatches
      const bSw = shell.stage.querySelector('#fgBrushes');
      BRUSHES.forEach((b) => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'cust-swatch' + (state.brush === b.value ? ' active' : '');
        btn.title = b.label;
        btn.innerHTML = `<span class="cust-swatch-emoji" style="font-size:.85rem;">${b.label}</span>`;
        btn.addEventListener('click', () => { state.brush = b.value; SKAudio.play('pop'); render(); });
        bSw.appendChild(btn);
      });

      // tap the scene to plant
      const svg = shell.stage.querySelector('#fgScene svg');
      svg.addEventListener('click', (e) => {
        if (state.items.length >= MAX_ITEMS) return;
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 400;
        const y = ((e.clientY - rect.top) / rect.height) * 280;
        // keep items in the meadow, not up in the sky
        if (y < 130) return;
        const color = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
        state.items.push({ kind: state.brush, x: Math.max(20, Math.min(380, x)), y: Math.max(140, Math.min(260, y)), color });
        SKAudio.play('pop');
        render();
      });

      shell.stage.querySelector('#fgUndo').addEventListener('click', () => { if (state.items.length) { state.items.pop(); SKAudio.play('pop'); render(); } });
      shell.stage.querySelector('#fgSky').addEventListener('click', () => {
        const idx = SKIES.findIndex((s) => s.value === state.sky);
        state.sky = SKIES[(idx + 1) % SKIES.length].value;
        SKAudio.play('pop'); render();
      });
      shell.stage.querySelector('.fg-done').addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.confettiFromEl(shell.stage.querySelector('#fgScene'), { count: 32 });
        setTimeout(() => {
          SKPlay.celebrate(root, gameDef, level, 3, 3, { onReplay() { Object.assign(state, defaultState()); render(); } });
        }, 500);
      });
    }
    render();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'fairygarden',
    title: 'Fairy Garden',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'luna',
    color: 'mint',
    icon: '🌸',
    blurb: 'Plant flowers, butterflies and mushrooms in your own fairy garden!',
    premium: true,
    mount(root, ctx) { return mountFairy(root, this, ctx.level); }
  });
})();
