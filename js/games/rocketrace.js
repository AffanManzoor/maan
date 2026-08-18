/* ============================================================
   Bloom Zoo — Rocket Race (Plus)
   Hosted by Bolt. Steer a little rocket up through cloud gaps —
   tap left/right sides of the screen (or drag) to move.
   Kid-safe: no game-over, clouds are soft & you can drift through.
   ============================================================ */
(function () {
  'use strict';

  const CFG = {
    1: { needed: 6,  scrollSpeed: 1.8, spawnEvery: 900 },
    2: { needed: 9,  scrollSpeed: 2.5, spawnEvery: 750 },
    3: { needed: 12, scrollSpeed: 3.2, spawnEvery: 620 }
  };

  function mountRR(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let raf, spawnTimer, cleanup = () => {};

    shell.stage.innerHTML = `
      <p class="rr-instructions">Drag to steer the rocket and fly through the sky!</p>
      <div class="rr-wrap" id="rrWrap"><canvas id="rrCanvas" width="480" height="480"></canvas></div>`;
    const canvas = shell.stage.querySelector('#rrCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let passed = 0;
    const rocket = { x: W / 2, y: H - 90, w: 54, h: 62 };
    const rings = []; // ring { x, y, width, passed }
    const clouds = [];
    const stars = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.3, ph: Math.random() * Math.PI * 2 }));
    shell.setDots(0, cfg.needed);

    let dragging = false;
    function moveRocket(clientX) {
      const r = canvas.getBoundingClientRect();
      const rel = (clientX - r.left) * (W / r.width);
      rocket.x = Math.max(rocket.w / 2, Math.min(W - rocket.w / 2, rel));
    }
    const onDown = (e) => { dragging = true; moveRocket(e.clientX); };
    const onMove = (e) => { if (dragging) moveRocket(e.clientX); };
    const onUp = () => { dragging = false; };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    function spawnRing() {
      // rings are horizontal bars with a gap — fly the rocket through the gap
      const gapWidth = 140;
      const gapCenter = 60 + Math.random() * (W - 120);
      rings.push({ y: -20, gapCenter, gapWidth, passed: false, hue: Math.floor(Math.random() * 360) });
      // little decorative clouds around
      clouds.push({ x: Math.random() * W, y: -30, r: 20 + Math.random() * 24 });
    }
    spawnTimer = setInterval(spawnRing, cfg.spawnEvery);
    spawnRing();

    function drawRocket() {
      const x = rocket.x, y = rocket.y, w = rocket.w, h = rocket.h;
      // flame flicker
      ctx.fillStyle = '#FFC93C';
      ctx.beginPath(); ctx.moveTo(x - 10, y + h / 2); ctx.lineTo(x + 10, y + h / 2);
      ctx.lineTo(x + (Math.random() * 3 - 1.5), y + h / 2 + 22 + Math.random() * 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FF6F7D';
      ctx.beginPath(); ctx.moveTo(x - 6, y + h / 2); ctx.lineTo(x + 6, y + h / 2);
      ctx.lineTo(x + (Math.random() * 2 - 1), y + h / 2 + 14); ctx.closePath(); ctx.fill();
      // body
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#B7C4D6'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - w / 3, y - h / 2 + 20);
      ctx.quadraticCurveTo(x, y - h / 2 - 6, x + w / 3, y - h / 2 + 20);
      ctx.lineTo(x + w / 3, y + h / 2 - 6);
      ctx.lineTo(x - w / 3, y + h / 2 - 6);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // window
      ctx.fillStyle = '#4EA8FF'; ctx.beginPath(); ctx.arc(x, y - 6, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#BFE4FF'; ctx.beginPath(); ctx.arc(x - 3, y - 8, 3, 0, Math.PI * 2); ctx.fill();
      // fins
      ctx.fillStyle = '#FF6F7D';
      ctx.beginPath(); ctx.moveTo(x - w / 3, y + h / 2 - 6); ctx.lineTo(x - w / 2 - 4, y + h / 2); ctx.lineTo(x - w / 3, y + h / 2 - 18); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + w / 3, y + h / 2 - 6); ctx.lineTo(x + w / 2 + 4, y + h / 2); ctx.lineTo(x + w / 3, y + h / 2 - 18); ctx.closePath(); ctx.fill();
    }

    let t = 0;
    function step() {
      t += 0.05;
      // sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#4EA8FF'); grad.addColorStop(1, '#BFE4FF');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // background stars twinkle
      stars.forEach((s) => {
        const a = 0.3 + 0.3 * Math.sin(t * 2 + s.ph);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        s.y += cfg.scrollSpeed * 0.3; if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
      });
      // clouds
      for (let i = clouds.length - 1; i >= 0; i--) {
        const c = clouds[i]; c.y += cfg.scrollSpeed * 0.6;
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x - c.r * 0.6, c.y + 4, c.r * 0.75, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 0.6, c.y + 4, c.r * 0.75, 0, Math.PI * 2);
        ctx.fill();
        if (c.y > H + 40) clouds.splice(i, 1);
      }
      // rings — flying rainbow rings the rocket passes through
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.y += cfg.scrollSpeed;
        // Draw ring as two rounded bars at either side of the gap
        ctx.lineWidth = 14; ctx.strokeStyle = `hsl(${r.hue} 80% 60%)`; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, r.y); ctx.lineTo(r.gapCenter - r.gapWidth / 2, r.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(r.gapCenter + r.gapWidth / 2, r.y); ctx.lineTo(W, r.y);
        ctx.stroke();
        // dashed connectors implying the "ring"
        ctx.setLineDash([4, 6]); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(r.gapCenter, r.y, r.gapWidth / 2 + 2, 0, Math.PI, true);
        ctx.stroke();
        ctx.setLineDash([]);

        // check pass — rocket crosses ring's y line and is within the gap
        if (!r.passed && r.y >= rocket.y - 6 && r.y <= rocket.y + 6) {
          if (rocket.x >= r.gapCenter - r.gapWidth / 2 && rocket.x <= r.gapCenter + r.gapWidth / 2) {
            r.passed = true;
            passed++;
            shell.setDots(passed, cfg.needed);
            SKAudio.play('star');
            SKPlay.confettiFromEl(canvas, { count: 12, power: 7 });
            if (passed >= cfg.needed) {
              clearInterval(spawnTimer);
              setTimeout(() => {
                SKPlay.celebrate(root, gameDef, level, cfg.needed, cfg.needed, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
              }, 400);
            }
          }
        }
        if (r.y > H + 20) rings.splice(i, 1);
      }
      drawRocket();
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
    id: 'rocketrace',
    title: 'Rocket Race',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'bolt',
    color: 'sky',
    icon: '🚀',
    blurb: 'Fly a rocket through rainbow rings in the big blue sky!',
    premium: true,
    mount(root, ctx) { return mountRR(root, this, ctx.level); }
  });
})();
