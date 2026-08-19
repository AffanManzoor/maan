/* ============================================================
   Bloom Zoo — Fish Tank (Plus)
   Hosted by Bolt. Fill an aquarium with wiggly fish and cute
   coral. Pick a water colour. Kid-safe: no goal, no timer,
   celebrate whenever you're happy with it.
   ============================================================ */
(function () {
  'use strict';

  const WATERS = [
    { value: 'sky',    label: 'Sky',   top: '#BFE4FF', bot: '#4EA8FF' },
    { value: 'teal',   label: 'Teal',  top: '#5EE7C7', bot: '#2FD8A0' },
    { value: 'twilit', label: 'Sunset',top: '#F4C1D0', bot: '#9B6BFF' }
  ];
  const FISH_COLORS = ['#FF6F7D', '#FFC93C', '#4EA8FF', '#2FD8A0', '#F4C1D0', '#9B6BFF', '#FF9D45'];
  const BRUSHES = [
    { value: 'fish',    label: '🐠 Fish' },
    { value: 'coral',   label: '🪸 Coral' },
    { value: 'bubble',  label: '🫧 Bubbles' }
  ];
  const MAX_ITEMS = 22;

  function defaultState() { return { water: 'sky', brush: 'fish', items: [] }; }

  function fishSVG(x, y, color, flip) {
    const dir = flip ? -1 : 1;
    return `<g transform="translate(${x} ${y}) scale(${dir} 1)">
      <path d="M-16 0 Q-6 -10 8 -8 Q22 -6 24 0 Q22 6 8 8 Q-6 10 -16 0 Z" fill="${color}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>
      <path d="M-20 -8 L-14 0 L-20 8 Z" fill="${color}" opacity="0.85"/>
      <path d="M6 -10 L2 -4 L10 -4 Z" fill="${color}" opacity="0.85"/>
      <circle cx="16" cy="-2" r="2.4" fill="#fff"/>
      <circle cx="17" cy="-2" r="1.4" fill="#2A2438"/>
      <path d="M-6 -4 Q0 -2 6 -4" stroke="rgba(0,0,0,.25)" stroke-width="1" fill="none"/>
    </g>`;
  }
  function coralSVG(x, y, color) {
    return `<g transform="translate(${x} ${y})">
      <path d="M-2 0 Q-8 -10 -14 -12 Q-6 -14 -4 -22 Q0 -14 4 -22 Q6 -14 14 -12 Q8 -10 2 0 Z" fill="${color}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>
      <path d="M-16 0 Q-14 -6 -20 -8" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M16 0 Q14 -6 20 -8" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>`;
  }
  function bubbleSVG(x, y) {
    return `<g transform="translate(${x} ${y})">
      <circle cx="0" cy="0" r="6" fill="rgba(255,255,255,.6)" stroke="rgba(255,255,255,.9)" stroke-width="1"/>
      <circle cx="-2" cy="-2" r="2" fill="rgba(255,255,255,.9)"/>
      <circle cx="12" cy="6" r="4" fill="rgba(255,255,255,.6)"/>
      <circle cx="-10" cy="8" r="3" fill="rgba(255,255,255,.5)"/>
    </g>`;
  }

  function mountFishTank(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const state = defaultState();

    function render() {
      shell.stage.innerHTML = `
        <p class="pz-instructions">Tap inside the tank to add fish, coral and bubbles!</p>
        <div class="ft-tank" id="ftTank"></div>
        <div class="fg-tools">
          <div class="cust-row-label">Brush</div>
          <div class="cust-swatches" id="ftBrushes"></div>
          <button class="btn btn-ghost pz-undo" id="ftUndo" type="button">↺ Undo</button>
          <button class="btn btn-ghost pz-undo" id="ftWater" type="button">💧 Change water</button>
          <div class="fg-count">${state.items.length} of ${MAX_ITEMS} in tank</div>
        </div>
        <button class="btn btn-xl btn-sky cust-done ft-done" type="button">🐠 Show it off!</button>`;

      const w = WATERS.find((x) => x.value === state.water) || WATERS[0];
      const items = state.items.map((it) => {
        if (it.kind === 'fish') return fishSVG(it.x, it.y, it.color, it.flip);
        if (it.kind === 'coral') return coralSVG(it.x, it.y, it.color);
        return bubbleSVG(it.x, it.y);
      }).join('');

      shell.stage.querySelector('#ftTank').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="Your fish tank" style="cursor:crosshair">
        <defs><linearGradient id="ftW${state.water}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${w.top}"/><stop offset="1" stop-color="${w.bot}"/></linearGradient></defs>
        <rect x="10" y="10" width="380" height="270" rx="10" fill="url(#ftW${state.water})" stroke="#2A2438" stroke-width="4"/>
        <!-- caustic light shimmers -->
        <path d="M40 40 Q100 30 160 40 T280 40" stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none"/>
        <path d="M60 60 Q120 52 180 60 T300 60" stroke="rgba(255,255,255,.25)" stroke-width="2" fill="none"/>
        <!-- sandy floor -->
        <path d="M10 240 Q100 220 200 236 T390 232 L390 280 L10 280 Z" fill="#E6C68A"/>
        <circle cx="60" cy="248" r="6" fill="#B7C4D6"/><circle cx="130" cy="256" r="8" fill="#B7C4D6"/><circle cx="330" cy="252" r="5" fill="#B7C4D6"/>
        <!-- seaweed at back -->
        <path d="M40 240 Q34 210 42 190 Q50 168 40 148" stroke="#2FAB70" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M360 240 Q368 214 358 194 Q350 174 362 156" stroke="#2FAB70" stroke-width="6" fill="none" stroke-linecap="round"/>
        ${items}
        <!-- top rim highlight -->
        <rect x="10" y="10" width="380" height="6" rx="3" fill="rgba(255,255,255,.5)"/>
      </svg>`;

      const bSw = shell.stage.querySelector('#ftBrushes');
      BRUSHES.forEach((b) => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'cust-swatch' + (state.brush === b.value ? ' active' : '');
        btn.title = b.label;
        btn.innerHTML = `<span class="cust-swatch-emoji" style="font-size:.85rem;">${b.label}</span>`;
        btn.addEventListener('click', () => { state.brush = b.value; SKAudio.play('pop'); render(); });
        bSw.appendChild(btn);
      });

      const svg = shell.stage.querySelector('#ftTank svg');
      svg.addEventListener('click', (e) => {
        if (state.items.length >= MAX_ITEMS) return;
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 400;
        const y = ((e.clientY - rect.top) / rect.height) * 300;
        if (x < 24 || x > 376 || y < 24 || y > 260) return;
        const color = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
        const flip = Math.random() < 0.5;
        // corals want to sit on the floor
        const py = state.brush === 'coral' ? Math.max(220, Math.min(238, y)) : y;
        state.items.push({ kind: state.brush, x, y: py, color, flip });
        SKAudio.play('pop');
        render();
      });

      shell.stage.querySelector('#ftUndo').addEventListener('click', () => { if (state.items.length) { state.items.pop(); SKAudio.play('pop'); render(); } });
      shell.stage.querySelector('#ftWater').addEventListener('click', () => {
        const idx = WATERS.findIndex((x) => x.value === state.water);
        state.water = WATERS[(idx + 1) % WATERS.length].value;
        SKAudio.play('pop'); render();
      });
      shell.stage.querySelector('.ft-done').addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.confettiFromEl(shell.stage.querySelector('#ftTank'), { count: 30 });
        setTimeout(() => {
          SKPlay.celebrate(root, gameDef, level, 3, 3, { onReplay() { Object.assign(state, defaultState()); render(); } });
        }, 500);
      });
    }
    render();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'fishtank',
    title: 'Fish Tank',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'bolt',
    color: 'sky',
    icon: '🐠',
    blurb: 'Design your own aquarium with wiggly fish and colourful coral!',
    premium: true,
    mount(root, ctx) { return mountFishTank(root, this, ctx.level); }
  });
})();
