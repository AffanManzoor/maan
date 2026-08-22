/* ============================================================
   Bloom Zoo — Fruit Chop (Plus)
   Hosted by Bolt. Drag across the screen to slice friendly fruit
   as it arcs up. Kid-safe: no bombs, no lives — missed fruit just
   drops off screen. Reach the target slice count to celebrate.
   ============================================================ */
(function () {
  'use strict';

  const CFG = {
    1: { needed: 8,  spawnEvery: 1000, maxAlive: 3 },
    2: { needed: 12, spawnEvery: 800,  maxAlive: 4 },
    3: { needed: 16, spawnEvery: 650,  maxAlive: 5 }
  };
  const FRUITS = [
    { emoji: '🍎', color: '#FF6F7D' }, { emoji: '🍊', color: '#FF9D45' },
    { emoji: '🍌', color: '#FFC93C' }, { emoji: '🍇', color: '#9B6BFF' },
    { emoji: '🍓', color: '#FF6F7D' }, { emoji: '🍉', color: '#2FD8A0' },
    { emoji: '🥝', color: '#B8DE7A' }, { emoji: '🍑', color: '#FFB08A' }
  ];

  function mountFC(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let raf, spawnTimer, cleanup = () => {};

    shell.stage.innerHTML = `
      <p class="rr-instructions">Drag your finger across the fruit to slice — no bombs, just yum!</p>
      <div class="rr-wrap" id="fcWrap"><canvas id="fcCanvas" width="500" height="500"></canvas></div>`;
    const canvas = shell.stage.querySelector('#fcCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let sliced = 0;
    const fruits = [];   // { x, y, vx, vy, rot, spin, emoji, color, r, sliced }
    const trail = [];    // { x, y, life }
    let lastPointer = null;
    let pointerDown = false;

    shell.setDots(0, cfg.needed);

    function spawnFruit() {
      if (fruits.filter((f) => !f.gone).length >= cfg.maxAlive) return;
      const f = FRUITS[Math.floor(Math.random() * FRUITS.length)];
      const fromLeft = Math.random() < 0.5;
      fruits.push({
        x: fromLeft ? 40 : W - 40,
        y: H + 20,
        vx: fromLeft ? 1.4 + Math.random() * 1.2 : -(1.4 + Math.random() * 1.2),
        vy: -(9 + Math.random() * 2),
        rot: 0, spin: (Math.random() - 0.5) * 0.15,
        emoji: f.emoji, color: f.color,
        r: 26, sliced: false, gone: false
      });
    }
    spawnTimer = setInterval(spawnFruit, cfg.spawnEvery);
    spawnFruit();

    function onDown(e) {
      pointerDown = true; lastPointer = mapPt(e);
    }
    function onMove(e) {
      if (!pointerDown) return;
      const p = mapPt(e);
      trail.push({ x: p.x, y: p.y, life: 1 });
      if (trail.length > 24) trail.shift();
      // detect slice on any fruit whose centre is within the segment
      if (lastPointer) {
        fruits.forEach((f) => {
          if (f.sliced) return;
          const d = pointSeg(f.x, f.y, lastPointer.x, lastPointer.y, p.x, p.y);
          if (d < f.r) {
            f.sliced = true; sliced++;
            shell.setDots(sliced, cfg.needed);
            SKAudio.play('pop');
            if (sliced >= cfg.needed) {
              clearInterval(spawnTimer);
              setTimeout(() => {
                SKPlay.celebrate(root, gameDef, level, cfg.needed, cfg.needed, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
              }, 450);
            }
          }
        });
      }
      lastPointer = p;
    }
    function onUp() { pointerDown = false; lastPointer = null; }
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    function mapPt(e) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    }
    function pointSeg(px, py, ax, ay, bx, by) {
      const dx = bx - ax, dy = by - ay;
      const l2 = dx * dx + dy * dy;
      if (l2 === 0) return Math.hypot(px - ax, py - ay);
      let t = ((px - ax) * dx + (py - ay) * dy) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
    }

    ctx.font = '46px system-ui, "Apple Color Emoji", "Segoe UI Emoji"';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    function step() {
      // sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#BFE4FF'); grad.addColorStop(1, '#F4C1D0');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // table / horizon
      ctx.fillStyle = 'rgba(255,255,255,.4)';
      ctx.fillRect(0, H - 30, W, 30);

      // slice trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i]; t.life -= 0.06;
        if (t.life <= 0) { trail.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, t.life);
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(t.x, t.y, 6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // fruit
      for (let i = fruits.length - 1; i >= 0; i--) {
        const f = fruits[i];
        f.vy += 0.28;              // gravity
        f.x += f.vx; f.y += f.vy; f.rot += f.spin;

        if (f.sliced && !f.gone) {
          // burst: draw 2 halves + juice splash
          const dx = Math.cos(f.rot) * 20, dy = Math.sin(f.rot) * 20;
          ctx.save(); ctx.translate(f.x, f.y);
          ctx.fillStyle = f.color;
          for (let k = 0; k < 10; k++) {
            const a = Math.random() * Math.PI * 2, r = Math.random() * 26;
            ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2.6, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
          ctx.fillText(f.emoji, f.x - dx, f.y - dy);
          ctx.fillText(f.emoji, f.x + dx, f.y + dy);
          if (f.y > H + 60 || f.y < -60) f.gone = true;
        } else {
          ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot);
          ctx.fillText(f.emoji, 0, 0);
          ctx.restore();
          if (f.y > H + 60) f.gone = true;
        }
      }
      // prune gone fruits
      for (let i = fruits.length - 1; i >= 0; i--) if (fruits[i].gone) fruits.splice(i, 1);

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    cleanup = () => {
      if (raf) cancelAnimationFrame(raf);
      if (spawnTimer) clearInterval(spawnTimer);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    return { destroy() { cleanup(); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'fruitchop',
    title: 'Fruit Chop',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'bolt',
    color: 'coral',
    icon: '🍓',
    blurb: 'Swipe across the falling fruit to slice — juicy!',
    premium: true,
    mount(root, ctx) { return mountFC(root, this, ctx.level); }
  });
})();
