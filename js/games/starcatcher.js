/* ============================================================
   SuperKids — Star Catcher (Astronaut in Space)
   Hosted by Luna. Move the little rocket left/right to catch
   falling stars. Kid-safe: no game-over, no obstacles — just
   catch stars until you've filled the meter.
   ============================================================ */
(function () {
  'use strict';

  const CFG = {
    1: { needed: 8,  speed: 1.5, spawnEvery: 900 },
    2: { needed: 12, speed: 2.1, spawnEvery: 750 },
    3: { needed: 16, speed: 2.7, spawnEvery: 620 }
  };

  function mountSC(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let raf, spawnTimer, cleanup = () => {};

    shell.stage.innerHTML = `
      <p class="sc-instructions">Move the rocket to catch the falling stars!</p>
      <div class="sc-wrap" id="scWrap">
        <canvas id="scCanvas" width="480" height="420"></canvas>
      </div>`;
    const canvas = shell.stage.querySelector('#scCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let caught = 0;
    const rocket = { x: W / 2, y: H - 40, w: 60, h: 68 };
    const stars = [];
    let sparkles = [];
    shell.setDots(0, cfg.needed);

    let dragging = false;
    function moveRocket(clientX) {
      const rect = canvas.getBoundingClientRect();
      const rel = (clientX - rect.left) * (W / rect.width);
      rocket.x = Math.max(rocket.w / 2, Math.min(W - rocket.w / 2, rel));
    }
    const onDown = (e) => { dragging = true; moveRocket(e.clientX); };
    const onMove = (e) => { if (dragging) moveRocket(e.clientX); };
    const onUp = () => { dragging = false; };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    // background stars (twinkling backdrop)
    const bg = Array.from({ length: 40 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.5, ph: Math.random() * Math.PI * 2 }));

    function spawn() {
      stars.push({ x: 30 + Math.random() * (W - 60), y: -20, r: 14, rot: Math.random() * Math.PI * 2 });
    }
    spawnTimer = setInterval(spawn, cfg.spawnEvery);
    spawn(); // one right away

    function drawStar(cx, cy, r, color) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(0);
      ctx.fillStyle = color; ctx.strokeStyle = '#F0A100'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.45;
        const x = Math.cos(angle) * rad, y = Math.sin(angle) * rad;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    function drawRocket() {
      const x = rocket.x, y = rocket.y, w = rocket.w, h = rocket.h;
      // flame
      ctx.fillStyle = '#FFC93C';
      ctx.beginPath(); ctx.moveTo(x - 10, y + h / 2); ctx.lineTo(x + 10, y + h / 2);
      ctx.lineTo(x + (Math.random() * 4 - 2), y + h / 2 + 18 + Math.random() * 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FF6F7D';
      ctx.beginPath(); ctx.moveTo(x - 6, y + h / 2); ctx.lineTo(x + 6, y + h / 2);
      ctx.lineTo(x + (Math.random() * 3 - 1.5), y + h / 2 + 12); ctx.closePath(); ctx.fill();
      // body
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#CFE0EC'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - w / 3, y - h / 2 + 20);
      ctx.quadraticCurveTo(x, y - h / 2 - 6, x + w / 3, y - h / 2 + 20);
      ctx.lineTo(x + w / 3, y + h / 2 - 6);
      ctx.lineTo(x - w / 3, y + h / 2 - 6);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // window
      ctx.fillStyle = '#4EA8FF'; ctx.beginPath(); ctx.arc(x, y - 6, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#BFE4FF'; ctx.beginPath(); ctx.arc(x - 3, y - 8, 3, 0, Math.PI * 2); ctx.fill();
      // fins
      ctx.fillStyle = '#FF6F7D';
      ctx.beginPath(); ctx.moveTo(x - w / 3, y + h / 2 - 6); ctx.lineTo(x - w / 2 - 4, y + h / 2); ctx.lineTo(x - w / 3, y + h / 2 - 18); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + w / 3, y + h / 2 - 6); ctx.lineTo(x + w / 2 + 4, y + h / 2); ctx.lineTo(x + w / 3, y + h / 2 - 18); ctx.closePath(); ctx.fill();
    }

    let t = 0;
    function step() {
      t += 0.06;
      ctx.fillStyle = '#0a1030'; ctx.fillRect(0, 0, W, H);
      // background twinklers
      bg.forEach((s) => {
        const a = 0.5 + 0.5 * Math.sin(t * 2 + s.ph);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      // falling stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const st = stars[i]; st.y += cfg.speed + 0.05 * Math.sin(t + i); st.rot += 0.04;
        drawStar(st.x, st.y, st.r, '#FFC93C');
        // caught?
        const dx = st.x - rocket.x, dy = st.y - (rocket.y - 10);
        if (Math.abs(dx) < rocket.w / 2 + 6 && Math.abs(dy) < 28) {
          stars.splice(i, 1); caught++;
          shell.setDots(caught, cfg.needed);
          SKAudio.play('star');
          sparkles.push({ x: rocket.x, y: rocket.y - 10, life: 22, hue: 0 });
          if (caught >= cfg.needed) {
            clearInterval(spawnTimer);
            setTimeout(() => {
              SKPlay.celebrate(root, gameDef, level, cfg.needed, cfg.needed, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
            }, 300);
          }
        } else if (st.y > H + 30) {
          stars.splice(i, 1);
        }
      }
      // sparkle bursts
      sparkles = sparkles.filter((sp) => sp.life > 0);
      sparkles.forEach((sp) => {
        for (let a = 0; a < 6; a++) {
          const rad = (22 - sp.life) * 3;
          const ang = (Math.PI * 2 / 6) * a;
          ctx.fillStyle = `rgba(255,201,60,${sp.life / 22})`;
          ctx.beginPath(); ctx.arc(sp.x + Math.cos(ang) * rad, sp.y + Math.sin(ang) * rad, 3, 0, Math.PI * 2); ctx.fill();
        }
        sp.life--;
      });
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
    id: 'starcatcher',
    title: 'Star Catcher',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'luna',
    color: 'grape',
    icon: '🚀',
    blurb: 'Fly the rocket and catch shooting stars in outer space!',
    mount(root, ctx) { return mountSC(root, this, ctx.level); }
  });
})();
