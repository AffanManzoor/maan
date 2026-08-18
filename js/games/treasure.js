/* ============================================================
   Bloom Zoo — Treasure Dig (Plus)
   Hosted by Pip. Brush sand off the ground to reveal a hidden
   gem — every dig uncovers a new colour/shape. Kid-safe: no
   pressure, no timer, always awards 3 stars.
   ============================================================ */
(function () {
  'use strict';

  const GEMS = [
    { name: 'Ruby',    fill: '#FF6F7D', accent: '#B93540', shape: 'diamond' },
    { name: 'Emerald', fill: '#2FD8A0', accent: '#16884E', shape: 'oval' },
    { name: 'Sapphire',fill: '#4EA8FF', accent: '#2A7EE0', shape: 'diamond' },
    { name: 'Topaz',   fill: '#FFC93C', accent: '#F0A100', shape: 'heart' },
    { name: 'Amethyst',fill: '#9B6BFF', accent: '#7748E0', shape: 'diamond' },
    { name: 'Opal',    fill: '#F4C1D0', accent: '#B7C4D6', shape: 'oval' }
  ];

  const NEED_LEVELS = { 1: 1, 2: 2, 3: 3 }; // how many gems to dig up

  function gemSVG(g) {
    const cx = 200, cy = 160;
    if (g.shape === 'diamond') {
      return `<g>
        <polygon points="${cx},${cy - 60} ${cx + 55},${cy - 10} ${cx},${cy + 68} ${cx - 55},${cy - 10}" fill="${g.fill}" stroke="${g.accent}" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="${cx},${cy - 60} ${cx + 30},${cy - 20} ${cx - 30},${cy - 20}" fill="rgba(255,255,255,.35)"/>
        <polygon points="${cx - 55},${cy - 10} ${cx},${cy - 10} ${cx - 30},${cy - 20}" fill="rgba(255,255,255,.18)"/>
        <line x1="${cx - 55}" y1="${cy - 10}" x2="${cx + 55}" y2="${cy - 10}" stroke="${g.accent}" stroke-width="2"/>
      </g>`;
    }
    if (g.shape === 'oval') {
      return `<g>
        <ellipse cx="${cx}" cy="${cy}" rx="58" ry="46" fill="${g.fill}" stroke="${g.accent}" stroke-width="3"/>
        <ellipse cx="${cx - 18}" cy="${cy - 18}" rx="22" ry="14" fill="rgba(255,255,255,.45)" transform="rotate(-30 ${cx - 18} ${cy - 18})"/>
      </g>`;
    }
    // heart
    return `<g>
      <path d="M${cx} ${cy + 46}
        C${cx - 60} ${cy + 10}, ${cx - 60} ${cy - 40}, ${cx - 22} ${cy - 40}
        C${cx - 10} ${cy - 40}, ${cx} ${cy - 26}, ${cx} ${cy - 16}
        C${cx} ${cy - 26}, ${cx + 10} ${cy - 40}, ${cx + 22} ${cy - 40}
        C${cx + 60} ${cy - 40}, ${cx + 60} ${cy + 10}, ${cx} ${cy + 46} Z"
        fill="${g.fill}" stroke="${g.accent}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${cx - 26} ${cy - 20} Q${cx - 14} ${cy - 30} ${cx - 6} ${cy - 22}" stroke="rgba(255,255,255,.55)" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`;
  }

  function mountTreasure(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const needed = NEED_LEVELS[level] || 1;
    let dug = 0;
    let currentGem = null;
    let currentCanvas = null;
    let currentCleanup = null;

    function pickGem() {
      // never repeat the previous gem
      const pool = GEMS.filter((g) => g !== currentGem);
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function stageRound() {
      currentGem = pickGem();
      shell.stage.innerHTML = `
        <p class="pz-instructions">Brush the sand with your finger to find the hidden gem!</p>
        <div class="td-scene" id="tdScene">
          <svg class="td-gem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" aria-label="Hidden gem">
            <rect x="0" y="0" width="400" height="320" fill="#FFF6DC"/>
            <ellipse cx="200" cy="260" rx="130" ry="14" fill="rgba(0,0,0,.12)"/>
            ${gemSVG(currentGem)}
          </svg>
          <canvas class="td-sand" width="400" height="320" id="tdSand"></canvas>
        </div>
        <div class="td-status" id="tdStatus">Gem <b>${dug + 1}</b> of <b>${needed}</b></div>`;
      shell.setDots(dug, needed);

      const scene = shell.stage.querySelector('#tdScene');
      const canvas = shell.stage.querySelector('#tdSand');
      currentCanvas = canvas;
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;

      // Sand fill (warm tan gradient plus flecks)
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#E6C68A');
      grad.addColorStop(1, '#C39858');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // little pebbles
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = `rgba(60,40,20,${0.05 + Math.random() * 0.1})`;
        ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 3 + 0.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'destination-out';

      const total = W * H;
      let cleared = 0;
      let dragging = false;

      function brushAt(clientX, clientY) {
        const r = canvas.getBoundingClientRect();
        const x = (clientX - r.left) * (W / r.width);
        const y = (clientY - r.top) * (H / r.height);
        const radius = 32;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
        cleared += Math.PI * radius * radius * 0.5; // approximate (overlaps counted less)
        const pct = Math.min(1, cleared / (total * 0.55));
        if (pct >= 1) roundComplete();
      }
      const onDown = (e) => { dragging = true; brushAt(e.clientX, e.clientY); SKAudio.play('pop'); };
      const onMove = (e) => { if (dragging) brushAt(e.clientX, e.clientY); };
      const onUp = () => { dragging = false; };
      canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      currentCleanup = () => {
        canvas.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      let done = false;
      function roundComplete() {
        if (done) return; done = true;
        dug++;
        SKAudio.play('star');
        SKPlay.confettiFromEl(scene, { count: 22 });
        SK.toast(`You found ${currentGem.name}! ✨`);
        shell.setDots(dug, needed);
        if (dug >= needed) {
          setTimeout(() => {
            SKPlay.celebrate(root, gameDef, level, 3, 3, {
              onReplay() { dug = 0; stageRound(); }
            });
          }, 900);
        } else {
          setTimeout(() => { if (currentCleanup) currentCleanup(); stageRound(); }, 1100);
        }
      }
    }

    stageRound();
    return { destroy() {
      if (currentCleanup) currentCleanup();
      SKAudio.stopSpeak();
    } };
  }

  registerGame({
    id: 'treasure',
    title: 'Treasure Dig',
    subject: 'creative',
    subjectLabel: 'Discovery',
    buddy: 'pip',
    color: 'coral',
    icon: '💎',
    blurb: 'Brush away the sand to uncover shiny hidden gems!',
    premium: true,
    mount(root, ctx) { return mountTreasure(root, this, ctx.level); }
  });
})();
