/* ============================================================
   Bloom Zoo — Balloon Ride (Plus)
   Hosted by Pip. Fly a hot-air balloon left and right through the
   clouds and catch the little gifts that drift up on the breeze.
   Kid-safe: no lives, no game-over — missed gifts just float past.
   ============================================================ */
(function () {
  'use strict';

  const CFG = {
    1: { needed: 8,  spawnEvery: 900,  fall: 1.4 },
    2: { needed: 12, spawnEvery: 760,  fall: 1.9 },
    3: { needed: 16, spawnEvery: 620,  fall: 2.4 }
  };
  const GIFT_HUES = [345, 30, 60, 130, 210, 280];

  function mountBR(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let raf, spawnTimer, cleanup = () => {};

    shell.stage.innerHTML = `
      <p class="rr-instructions">Drag left and right to steer your balloon into the gifts!</p>
      <div class="rr-wrap" id="brWrap"><canvas id="brCanvas" width="480" height="480"></canvas></div>`;
    const canvas = shell.stage.querySelector('#brCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let caught = 0;
    const balloon = { x: W / 2, y: H - 80, w: 62, h: 84 };
    const gifts = [];
    const clouds = Array.from({ length: 6 }, () => ({
      x: Math.random() * W, y: Math.random() * H * 0.7,
      r: 22 + Math.random() * 20, spd: 0.3 + Math.random() * 0.4
    }));
    shell.setDots(0, cfg.needed);

    let dragging = false;
    function moveBalloon(clientX) {
      const r = canvas.getBoundingClientRect();
      balloon.x = Math.max(balloon.w / 2, Math.min(W - balloon.w / 2, (clientX - r.left) * (W / r.width)));
    }
    const onDown = (e) => { dragging = true; moveBalloon(e.clientX); };
    const onMove = (e) => { if (dragging) moveBalloon(e.clientX); };
    const onUp = () => { dragging = false; };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    function spawnGift() {
      const size = 22 + Math.random() * 8;
      gifts.push({
        x: size + Math.random() * (W - size * 2),
        y: -size - 10,
        size,
        hue: GIFT_HUES[Math.floor(Math.random() * GIFT_HUES.length)],
        wob: Math.random() * Math.PI * 2
      });
    }
    spawnTimer = setInterval(spawnGift, cfg.spawnEvery);
    spawnGift();

    function drawBalloon() {
      const x = balloon.x, y = balloon.y;
      // basket
      ctx.fillStyle = '#8B5E34'; ctx.strokeStyle = '#5C3A1A'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(x - 20, y + 14, 40, 24); ctx.fill(); ctx.stroke();
      // basket weave
      ctx.strokeStyle = 'rgba(0,0,0,.25)';
      for (let i = -18; i <= 18; i += 8) { ctx.beginPath(); ctx.moveTo(x + i, y + 14); ctx.lineTo(x + i, y + 38); ctx.stroke(); }
      // ropes
      ctx.strokeStyle = '#5C3A1A'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x - 20, y + 14); ctx.lineTo(x - 26, y - 16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 20, y + 14); ctx.lineTo(x + 26, y - 16); ctx.stroke();
      // balloon body — vertical striped panels (a full-circle wedge for
      // each stripe from the balloon's centre so the whole envelope is
      // covered, not just one half).
      const stripes = ['#FF6F7D', '#FFC93C', '#4EA8FF', '#2FD8A0'];
      const cxB = x, cyB = y - 16, rB = 30;
      for (let s = 0; s < stripes.length; s++) {
        ctx.fillStyle = stripes[s];
        ctx.beginPath();
        ctx.moveTo(cxB, cyB);
        const a0 = -Math.PI / 2 + (s / stripes.length) * Math.PI * 2;
        const a1 = -Math.PI / 2 + ((s + 1) / stripes.length) * Math.PI * 2;
        ctx.arc(cxB, cyB, rB, a0, a1);
        ctx.closePath(); ctx.fill();
      }
      // subtle highlight blob (top-left)
      ctx.fillStyle = 'rgba(255,255,255,.25)';
      ctx.beginPath(); ctx.ellipse(cxB - 10, cyB - 10, 12, 7, -0.5, 0, Math.PI * 2); ctx.fill();
      // balloon outline + neck
      ctx.strokeStyle = '#2A2438'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cxB, cyB, rB, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FF9D45';
      ctx.beginPath(); ctx.moveTo(x - 8, y + 14); ctx.lineTo(x + 8, y + 14); ctx.lineTo(x + 4, y + 8); ctx.lineTo(x - 4, y + 8); ctx.closePath(); ctx.fill();
    }

    let t = 0;
    function step() {
      t += 0.05;
      // sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#BFE4FF'); grad.addColorStop(1, '#E4F2FF');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // sun (top right)
      ctx.fillStyle = 'rgba(255,201,60,.9)';
      ctx.beginPath(); ctx.arc(W - 60, 60, 26, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,201,60,.5)'; ctx.lineWidth = 3;
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(W - 60 + Math.cos(ang) * 34, 60 + Math.sin(ang) * 34);
        ctx.lineTo(W - 60 + Math.cos(ang) * 44, 60 + Math.sin(ang) * 44);
        ctx.stroke();
      }
      // ambient clouds
      for (const c of clouds) {
        c.x -= c.spd; if (c.x < -c.r * 3) { c.x = W + c.r; c.y = Math.random() * H * 0.6; c.r = 22 + Math.random() * 20; }
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x - c.r * 0.6, c.y + 4, c.r * 0.7, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 0.6, c.y + 4, c.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      // gifts
      for (let i = gifts.length - 1; i >= 0; i--) {
        const g = gifts[i];
        g.wob += 0.05; g.x += Math.sin(g.wob) * 0.6;
        g.y += cfg.fall;
        // draw gift box
        ctx.save(); ctx.translate(g.x, g.y);
        ctx.fillStyle = `hsl(${g.hue} 70% 55%)`;
        ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(-g.size / 2, -g.size / 2, g.size, g.size); ctx.fill(); ctx.stroke();
        ctx.fillStyle = `hsl(${(g.hue + 60) % 360} 80% 70%)`;
        ctx.fillRect(-g.size / 2, -3, g.size, 6); ctx.fillRect(-3, -g.size / 2, 6, g.size);
        // bow
        ctx.beginPath(); ctx.arc(-4, -g.size / 2 - 2, 4, 0, Math.PI * 2); ctx.arc(4, -g.size / 2 - 2, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        // catch check — collide with basket area
        const dx = g.x - balloon.x, dy = g.y - (balloon.y + 26);
        if (Math.abs(dx) < balloon.w / 2 && Math.abs(dy) < 20) {
          gifts.splice(i, 1);
          caught++;
          shell.setDots(caught, cfg.needed);
          SKAudio.play('star');
          SKPlay.confettiFromEl(canvas, { count: 12 });
          if (caught >= cfg.needed) {
            clearInterval(spawnTimer);
            setTimeout(() => {
              SKPlay.celebrate(root, gameDef, level, cfg.needed, cfg.needed, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
            }, 400);
          }
          continue;
        }
        if (g.y > H + g.size + 10) gifts.splice(i, 1);
      }
      drawBalloon();
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
    id: 'balloonride',
    title: 'Balloon Ride',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'pip',
    color: 'sun',
    icon: '🎈',
    blurb: 'Steer a hot-air balloon through the clouds and catch the gifts!',
    premium: true,
    mount(root, ctx) { return mountBR(root, this, ctx.level); }
  });
})();
