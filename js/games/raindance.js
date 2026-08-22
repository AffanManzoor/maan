/* ============================================================
   Bloom Zoo — Rain Dance (Plus)
   Hosted by Bolt. Drag a colourful umbrella left and right to
   catch falling raindrops. Rainbow drops are bonus. Kid-safe:
   missed drops just splash into the puddle at the bottom.
   ============================================================ */
(function () {
  'use strict';

  const CFG = {
    1: { needed: 8,  spawnEvery: 800, fall: 1.6 },
    2: { needed: 12, spawnEvery: 650, fall: 2.1 },
    3: { needed: 16, spawnEvery: 550, fall: 2.6 }
  };
  const HUES = [200, 210, 220];

  function mountRD(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let raf, spawnTimer, cleanup = () => {};

    shell.stage.innerHTML = `
      <p class="rr-instructions">Drag the umbrella to catch the raindrops before they splash!</p>
      <div class="rr-wrap" id="rdWrap"><canvas id="rdCanvas" width="480" height="480"></canvas></div>`;
    const canvas = shell.stage.querySelector('#rdCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let caught = 0;
    const umb = { x: W / 2, y: H - 70, w: 90, h: 42 };
    const drops = [];  // { x, y, r, hue, rainbow }
    const splashes = []; // { x, y, r, life }
    shell.setDots(0, cfg.needed);

    let dragging = false;
    function moveUmb(clientX) {
      const r = canvas.getBoundingClientRect();
      umb.x = Math.max(umb.w / 2, Math.min(W - umb.w / 2, (clientX - r.left) * (W / r.width)));
    }
    const onDown = (e) => { dragging = true; moveUmb(e.clientX); };
    const onMove = (e) => { if (dragging) moveUmb(e.clientX); };
    const onUp = () => { dragging = false; };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    function spawnDrop() {
      const r = 7 + Math.random() * 3;
      const rainbow = Math.random() < 0.15;
      drops.push({
        x: r + Math.random() * (W - r * 2),
        y: -r - 4,
        r,
        hue: HUES[Math.floor(Math.random() * HUES.length)],
        rainbow,
        wob: Math.random() * Math.PI * 2
      });
    }
    spawnTimer = setInterval(spawnDrop, cfg.spawnEvery);
    for (let k = 0; k < 3; k++) spawnDrop();

    function drawUmbrella() {
      const x = umb.x, y = umb.y, w = umb.w, h = umb.h;
      // handle
      ctx.strokeStyle = '#8B5E34'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 60); ctx.stroke();
      ctx.beginPath(); ctx.arc(x - 8, y + 60, 8, 0, Math.PI, false); ctx.stroke();
      // panels
      const panels = ['#FF6F7D', '#FFC93C', '#4EA8FF', '#2FD8A0', '#9B6BFF'];
      for (let i = 0; i < panels.length; i++) {
        ctx.fillStyle = panels[i];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, w / 2, Math.PI + (i / panels.length) * Math.PI, Math.PI + ((i + 1) / panels.length) * Math.PI);
        ctx.closePath(); ctx.fill();
      }
      // rim outline
      ctx.strokeStyle = '#2A2438'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, w / 2, Math.PI, 0, false); ctx.stroke();
      // tip
      ctx.fillStyle = '#2A2438';
      ctx.beginPath(); ctx.arc(x, y - w / 2 - 2, 3, 0, Math.PI * 2); ctx.fill();
    }

    let t = 0;
    function step() {
      t += 0.05;
      // sky
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#B7CCE8'); grad.addColorStop(1, '#8FA6C4');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // clouds at top
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      [[80, 40], [180, 30], [320, 44], [400, 34]].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.arc(cx - 18, cy + 4, 16, 0, Math.PI * 2);
        ctx.arc(cx + 18, cy + 4, 16, 0, Math.PI * 2);
        ctx.fill();
      });
      // puddle at bottom
      ctx.fillStyle = 'rgba(78,168,255,.4)';
      ctx.fillRect(0, H - 20, W, 20);
      ctx.fillStyle = 'rgba(78,168,255,.6)';
      for (let i = 0; i < W; i += 20) {
        ctx.beginPath();
        ctx.arc(i + 10, H - 20 + Math.sin(t * 3 + i) * 2, 8, Math.PI, 0);
        ctx.fill();
      }

      // splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i]; s.life -= 0.06; s.r += 0.6;
        if (s.life <= 0) { splashes.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.strokeStyle = '#4EA8FF'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // drops
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += cfg.fall; d.wob += 0.1;
        d.x += Math.sin(d.wob) * 0.4;
        // draw
        ctx.fillStyle = d.rainbow ? `hsl(${(t * 60 + d.wob * 40) % 360} 85% 65%)` : `hsl(${d.hue} 70% 55%)`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.r * 1.4);
        ctx.quadraticCurveTo(d.x + d.r, d.y, d.x, d.y + d.r);
        ctx.quadraticCurveTo(d.x - d.r, d.y, d.x, d.y - d.r * 1.4);
        ctx.fill();

        // umbrella catch — top of umbrella arc
        if (d.y > umb.y - 6 && d.y < umb.y + 4 && Math.abs(d.x - umb.x) < umb.w / 2) {
          drops.splice(i, 1);
          caught++;
          shell.setDots(caught, cfg.needed);
          SKAudio.play('pop');
          if (d.rainbow) SKPlay.confettiFromEl(canvas, { count: 18 });
          if (caught >= cfg.needed) {
            clearInterval(spawnTimer);
            setTimeout(() => {
              SKPlay.celebrate(root, gameDef, level, cfg.needed, cfg.needed, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
            }, 400);
          }
          continue;
        }
        // hit ground
        if (d.y > H - 20) {
          splashes.push({ x: d.x, y: H - 18, r: 4, life: 1 });
          drops.splice(i, 1);
        }
      }
      drawUmbrella();
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
    id: 'raindance',
    title: 'Rain Dance',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'bolt',
    color: 'sky',
    icon: '☔',
    blurb: 'Steer a rainbow umbrella and catch the falling raindrops!',
    premium: true,
    mount(root, ctx) { return mountRD(root, this, ctx.level); }
  });
})();
