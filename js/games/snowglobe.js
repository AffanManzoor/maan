/* ============================================================
   Bloom Zoo — Snow Globe (Plus)
   Hosted by Pip. Build a tiny scene inside a snow globe: pick the
   centrepiece (tree, house, snowman, castle), the base colour and
   how much snow. Tap Shake to make it snow. Save to celebrate.
   ============================================================ */
(function () {
  'use strict';

  const CENTRES = [
    { value: 'tree',    label: 'Tree' },
    { value: 'house',   label: 'House' },
    { value: 'snowman', label: 'Snowman' },
    { value: 'castle',  label: 'Castle' }
  ];
  const BASES = [
    { value: '#8B5E34', label: 'Wood' },
    { value: '#9B6BFF', label: 'Purple' },
    { value: '#4EA8FF', label: 'Blue' },
    { value: '#FF6F7D', label: 'Coral' },
    { value: '#FFC93C', label: 'Gold' }
  ];
  const SNOW_LEVELS = [
    { value: 60,  label: 'A little' },
    { value: 140, label: 'Snowy' },
    { value: 260, label: 'Blizzard!' }
  ];

  function defaultState() { return { centre: 'tree', base: '#8B5E34', snowCount: 140 }; }

  function centreSVG(kind) {
    if (kind === 'house') {
      return `<g transform="translate(150 210)">
        <rect x="-40" y="0" width="80" height="60" fill="#F4C1D0" stroke="#2A2438" stroke-width="2"/>
        <polygon points="-50,0 0,-40 50,0" fill="#B93540" stroke="#2A2438" stroke-width="2" stroke-linejoin="round"/>
        <rect x="-10" y="24" width="20" height="36" fill="#8B5E34" stroke="#2A2438" stroke-width="1.5"/>
        <circle cx="4" cy="42" r="1.6" fill="#FFC93C"/>
        <rect x="-30" y="14" width="14" height="14" fill="#BFE4FF" stroke="#2A2438" stroke-width="1.2"/>
        <rect x="16" y="14" width="14" height="14" fill="#BFE4FF" stroke="#2A2438" stroke-width="1.2"/>
      </g>`;
    }
    if (kind === 'snowman') {
      return `<g transform="translate(150 200)">
        <circle cx="0" cy="60" r="34" fill="#fff" stroke="#B7C4D6" stroke-width="2"/>
        <circle cx="0" cy="14" r="24" fill="#fff" stroke="#B7C4D6" stroke-width="2"/>
        <circle cx="0" cy="-24" r="18" fill="#fff" stroke="#B7C4D6" stroke-width="2"/>
        <polygon points="-4,-24 -4,-22 8,-23" fill="#FF9D45"/>
        <circle cx="-6" cy="-28" r="1.8" fill="#2A2438"/>
        <circle cx="6" cy="-28" r="1.8" fill="#2A2438"/>
        <path d="M-6 -18 Q0 -14 6 -18" stroke="#2A2438" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <rect x="-16" y="-4" width="32" height="6" fill="#B93540"/>
        <rect x="14" y="-4" width="8" height="20" fill="#B93540"/>
        <circle cx="0" cy="12" r="2" fill="#2A2438"/><circle cx="0" cy="24" r="2" fill="#2A2438"/>
      </g>`;
    }
    if (kind === 'castle') {
      return `<g transform="translate(150 220)">
        <rect x="-40" y="0" width="80" height="50" fill="#B7C4D6" stroke="#2A2438" stroke-width="2"/>
        <rect x="-50" y="-8" width="16" height="58" fill="#9BAAC0" stroke="#2A2438" stroke-width="2"/>
        <rect x="34" y="-8" width="16" height="58" fill="#9BAAC0" stroke="#2A2438" stroke-width="2"/>
        <polygon points="-50,-8 -42,-24 -34,-8" fill="#B93540"/>
        <polygon points="34,-8 42,-24 50,-8" fill="#B93540"/>
        <path d="M-40 0 L-30 -10 L-20 0 L-10 -10 L0 0 L10 -10 L20 0 L30 -10 L40 0 Z" fill="#B7C4D6"/>
        <rect x="-10" y="18" width="20" height="32" fill="#5C6473" stroke="#2A2438" stroke-width="1.5"/>
        <circle cx="6" cy="34" r="1.6" fill="#FFC93C"/>
      </g>`;
    }
    // tree
    return `<g transform="translate(150 210)">
      <rect x="-8" y="30" width="16" height="30" fill="#8B5E34" stroke="#2A2438" stroke-width="1.5"/>
      <polygon points="-40,30 0,-60 40,30" fill="#2FAB70" stroke="#2A2438" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="-32,-10 0,-70 32,-10" fill="#3DDC97" stroke="#2A2438" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="-16" cy="-4" r="3" fill="#FF6F7D"/>
      <circle cx="14" cy="-24" r="3" fill="#FFC93C"/>
      <circle cx="0" cy="-58" r="4" fill="#FFC93C" stroke="#F0A100" stroke-width="1"/>
    </g>`;
  }

  function mountSnowGlobe(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const state = defaultState();
    let snow = [];
    let raf = null;
    let shakeUntil = 0;

    function makeSnow() {
      snow = [];
      for (let i = 0; i < state.snowCount; i++) {
        snow.push({
          x: 50 + Math.random() * 200,
          y: 40 + Math.random() * 200,
          r: 1.2 + Math.random() * 2,
          spd: 0.3 + Math.random() * 0.6,
          drift: Math.random() * Math.PI * 2
        });
      }
    }

    function addRow(host, label, key, options, renderOpt) {
      const row = document.createElement('div');
      row.className = 'cust-row';
      row.innerHTML = `<div class="cust-row-label">${label}</div>`;
      const sw = document.createElement('div'); sw.className = 'cust-swatches';
      options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cust-swatch' + (state[key] === opt.value ? ' active' : '');
        btn.title = opt.label; btn.innerHTML = renderOpt(opt);
        btn.addEventListener('click', () => {
          state[key] = opt.value; SKAudio.play('pop');
          if (key === 'snowCount') makeSnow();
          render();
        });
        sw.appendChild(btn);
      });
      row.appendChild(sw); host.appendChild(row);
    }

    function render() {
      shell.stage.innerHTML = `
        <p class="pz-instructions">Pick a scene, a base and how much snow — then shake!</p>
        <div class="sg-globe" id="sgGlobe"></div>
        <div class="cust-categories" id="sgCats"></div>
        <button class="btn btn-xl btn-sky cust-done sg-done" type="button">❄️ Save my globe!</button>`;
      shell.setDots(1, 1);
      const globe = shell.stage.querySelector('#sgGlobe');
      // Static SVG for the globe backdrop, then a canvas overlay for snow.
      globe.innerHTML = `
        <svg class="sg-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 340" role="img" aria-label="Your snow globe">
          <defs><radialGradient id="sgSky" cx="0.5" cy="0.35" r="0.7"><stop offset="0" stop-color="#F0F7FF"/><stop offset="1" stop-color="#BFE4FF"/></radialGradient></defs>
          <ellipse cx="150" cy="300" rx="130" ry="12" fill="rgba(0,0,0,.2)"/>
          <rect x="60" y="270" width="180" height="40" rx="6" fill="${state.base}" stroke="#2A2438" stroke-width="2"/>
          <rect x="80" y="264" width="140" height="10" rx="3" fill="${state.base}" stroke="#2A2438" stroke-width="2"/>
          <circle cx="150" cy="150" r="120" fill="url(#sgSky)" stroke="#2A2438" stroke-width="3"/>
          <!-- ground inside globe -->
          <path d="M40 250 Q150 220 260 250 L260 265 L40 265 Z" fill="#fff"/>
          ${centreSVG(state.centre)}
          <!-- shine highlight on glass -->
          <ellipse cx="110" cy="90" rx="30" ry="14" fill="rgba(255,255,255,.5)" transform="rotate(-30 110 90)"/>
        </svg>
        <canvas class="sg-snow" id="sgSnow" width="300" height="340"></canvas>
        <button class="btn btn-xl btn-grape sg-shake" type="button">🤲 Shake!</button>`;

      const cats = shell.stage.querySelector('#sgCats');
      addRow(cats, 'Scene',   'centre',    CENTRES,     (o) => `<span class="cust-swatch-emoji" style="font-size:.85rem;">${o.label}</span>`);
      addRow(cats, 'Base',    'base',      BASES,       (o) => `<span class="cust-swatch-color" style="background:${o.value}"></span>`);
      addRow(cats, 'Snow',    'snowCount', SNOW_LEVELS, (o) => `<span class="cust-swatch-emoji" style="font-size:.75rem;">${o.label}</span>`);

      shell.stage.querySelector('.sg-shake').addEventListener('click', () => {
        SKAudio.play('whoosh');
        shakeUntil = Date.now() + 1400;
        snow.forEach((s) => {
          s.spd = 1.4 + Math.random() * 1.4;
          s.drift = Math.random() * Math.PI * 2;
          s.y = 60 + Math.random() * 160;
        });
      });

      shell.stage.querySelector('.sg-done').addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.confettiFromEl(globe, { count: 28 });
        setTimeout(() => {
          SKPlay.celebrate(root, gameDef, level, 3, 3, { onReplay() { Object.assign(state, defaultState()); makeSnow(); render(); } });
        }, 500);
      });

      startSnowLoop();
    }

    function startSnowLoop() {
      if (raf) cancelAnimationFrame(raf);
      const canvas = shell.stage.querySelector('#sgSnow');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        // clip to globe circle
        ctx.save();
        ctx.beginPath(); ctx.arc(150, 150, 118, 0, Math.PI * 2); ctx.clip();
        const shaking = Date.now() < shakeUntil;
        for (const s of snow) {
          s.drift += 0.03;
          s.y += s.spd * (shaking ? 1.6 : 0.65);
          s.x += Math.sin(s.drift) * 0.4 * (shaking ? 2 : 1);
          if (s.y > 268) { s.y = 40; s.x = 50 + Math.random() * 200; }
          if (s.x < 40) s.x = 260; else if (s.x > 260) s.x = 40;
          ctx.fillStyle = 'rgba(255,255,255,.9)';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
        raf = requestAnimationFrame(draw);
      };
      draw();
    }
    makeSnow(); render();
    return { destroy() { if (raf) cancelAnimationFrame(raf); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'snowglobe',
    title: 'Snow Globe',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'pip',
    color: 'sky',
    icon: '❄️',
    blurb: 'Build a tiny scene inside a snow globe, then give it a shake!',
    premium: true,
    mount(root, ctx) { return mountSnowGlobe(root, this, ctx.level); }
  });
})();
