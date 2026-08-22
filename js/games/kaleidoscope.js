/* ============================================================
   Bloom Zoo — Kaleidoscope (Plus)
   Hosted by Ziggy. Tap anywhere on the canvas to add a coloured
   dot — the kaleidoscope mirrors it across 8-way symmetry, so
   every tap turns into a burst of pattern. Change palette, clear,
   and save whenever you're happy.
   ============================================================ */
(function () {
  'use strict';

  const PALETTES = [
    { id: 'rainbow', label: 'Rainbow', hues: [345, 25, 55, 130, 210, 280] },
    { id: 'ocean',   label: 'Ocean',   hues: [170, 190, 210, 230] },
    { id: 'sunset',  label: 'Sunset',  hues: [10, 25, 45, 300] },
    { id: 'forest',  label: 'Forest',  hues: [80, 120, 150, 170] }
  ];
  const MIN_TAPS = 6;

  function mountKaleido(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    let taps = 0;
    let paletteIdx = 0;
    let ctx, W, H;
    let raf;
    const dots = []; // { x, y, hue, size, life }

    shell.stage.innerHTML = `
      <p class="pz-instructions">Tap the circle to add colour — every tap makes a burst of pattern!</p>
      <div class="kd-wrap" id="kdWrap"><canvas id="kdCanvas" width="480" height="480"></canvas></div>
      <div class="fg-tools">
        <div class="cust-row-label">Palette</div>
        <div class="cust-swatches" id="kdPalettes"></div>
        <button class="btn btn-ghost pz-undo" id="kdClear" type="button">🧹 Clear</button>
        <div class="fg-count" id="kdCount">Taps: 0</div>
      </div>
      <button class="btn btn-xl btn-grape cust-done kd-done" type="button" disabled>🌀 Save my mandala!</button>`;

    const canvas = shell.stage.querySelector('#kdCanvas');
    ctx = canvas.getContext('2d');
    W = canvas.width; H = canvas.height;
    const countEl = shell.stage.querySelector('#kdCount');
    const doneBtn = shell.stage.querySelector('.kd-done');
    shell.setDots(0, MIN_TAPS);

    // Palette chips
    const pWrap = shell.stage.querySelector('#kdPalettes');
    PALETTES.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'cust-swatch' + (i === paletteIdx ? ' active' : '');
      btn.title = p.label;
      btn.innerHTML = p.hues.map((h) => `<span style="display:inline-block;width:8px;height:20px;background:hsl(${h} 70% 55%)"></span>`).join('');
      btn.addEventListener('click', () => {
        paletteIdx = i;
        SKAudio.play('pop');
        pWrap.querySelectorAll('.cust-swatch').forEach((b, j) => b.classList.toggle('active', j === i));
      });
      pWrap.appendChild(btn);
    });

    function addDot(clientX, clientY) {
      const r = canvas.getBoundingClientRect();
      const x = (clientX - r.left) * (W / r.width);
      const y = (clientY - r.top) * (H / r.height);
      const hue = PALETTES[paletteIdx].hues[Math.floor(Math.random() * PALETTES[paletteIdx].hues.length)];
      const size = 6 + Math.random() * 12;
      dots.push({ x, y, hue, size });
      SKAudio.play('pop');
      taps++;
      countEl.textContent = `Taps: ${taps}`;
      shell.setDots(Math.min(taps, MIN_TAPS), MIN_TAPS);
      if (taps >= MIN_TAPS) doneBtn.disabled = false;
    }
    canvas.addEventListener('pointerdown', (e) => addDot(e.clientX, e.clientY));

    shell.stage.querySelector('#kdClear').addEventListener('click', () => {
      dots.length = 0; taps = 0;
      countEl.textContent = 'Taps: 0';
      shell.setDots(0, MIN_TAPS);
      doneBtn.disabled = true;
      SKAudio.play('pop');
    });

    doneBtn.addEventListener('click', () => {
      SKAudio.play('star');
      SKPlay.confettiFromEl(canvas, { count: 40 });
      setTimeout(() => {
        SKPlay.celebrate(root, gameDef, level, 3, 3, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
      }, 500);
    });

    function draw() {
      // deep-space backdrop
      const grad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W / 1.4);
      grad.addColorStop(0, '#1A0F3A'); grad.addColorStop(1, '#050518');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // outer circle mask
      ctx.save();
      ctx.beginPath(); ctx.arc(W / 2, H / 2, Math.min(W, H) / 2 - 6, 0, Math.PI * 2); ctx.clip();
      // draw dots reflected 8-way
      const cx = W / 2, cy = H / 2;
      dots.forEach((d) => {
        const dx = d.x - cx, dy = d.y - cy;
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          const cs = Math.cos(ang), sn = Math.sin(ang);
          const rx = cx + dx * cs - dy * sn;
          const ry = cy + dx * sn + dy * cs;
          ctx.fillStyle = `hsl(${d.hue} 80% 60%)`;
          ctx.beginPath(); ctx.arc(rx, ry, d.size, 0, Math.PI * 2); ctx.fill();
          // and the mirror flip
          const mx = cx + dx * cs + dy * sn;
          const my = cy + dx * sn - dy * cs;
          ctx.fillStyle = `hsla(${d.hue} 80% 70% / .6)`;
          ctx.beginPath(); ctx.arc(mx, my, d.size * 0.7, 0, Math.PI * 2); ctx.fill();
        }
      });
      // centre highlight
      ctx.fillStyle = 'rgba(255,255,255,.6)';
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // outer ring
      ctx.strokeStyle = '#B7C4D6'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(W / 2, H / 2, Math.min(W, H) / 2 - 6, 0, Math.PI * 2); ctx.stroke();
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return { destroy() { if (raf) cancelAnimationFrame(raf); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'kaleidoscope',
    title: 'Kaleidoscope',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'ziggy',
    color: 'grape',
    icon: '🌀',
    blurb: 'Tap to spin a mandala of colour — every dot mirrors 8 ways!',
    premium: true,
    mount(root, ctx) { return mountKaleido(root, this, ctx.level); }
  });
})();
