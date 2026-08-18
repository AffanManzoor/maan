/* ============================================================
   Bloom Zoo — Space Explorer (Plus)
   Hosted by Bolt. Drift an astronaut around a starry sky and
   collect the friendly planets that float by. Kid-safe: no lives,
   no game-over; missed planets just drift back off screen.
   ============================================================ */
(function () {
  'use strict';

  const CFG = {
    1: { needed: 6,  spawnEvery: 1000, fall: 1.5 },
    2: { needed: 10, spawnEvery: 800,  fall: 2.0 },
    3: { needed: 14, spawnEvery: 650,  fall: 2.6 }
  };

  const PLANETS = [
    { hue: 24,  label: 'orange' },
    { hue: 180, label: 'teal' },
    { hue: 300, label: 'pink' },
    { hue: 55,  label: 'yellow' },
    { hue: 210, label: 'blue' }
  ];

  function mountSpace(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let raf, spawnTimer, cleanup = () => {};

    shell.stage.innerHTML = `
      <p class="rr-instructions">Drag your astronaut across space and catch the little planets!</p>
      <div class="se-wrap" id="seWrap"><canvas id="seCanvas" width="480" height="480"></canvas></div>`;
    const canvas = shell.stage.querySelector('#seCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let caught = 0;
    const astro = { x: W / 2, y: H - 70, r: 28 };
    const planets = [];
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4, ph: Math.random() * Math.PI * 2
    }));
    shell.setDots(0, cfg.needed);

    let dragging = false;
    function moveAstro(clientX, clientY) {
      const r = canvas.getBoundingClientRect();
      astro.x = Math.max(astro.r, Math.min(W - astro.r, (clientX - r.left) * (W / r.width)));
      astro.y = Math.max(astro.r, Math.min(H - astro.r, (clientY - r.top) * (H / r.height)));
    }
    const onDown = (e) => { dragging = true; moveAstro(e.clientX, e.clientY); };
    const onMove = (e) => { if (dragging) moveAstro(e.clientX, e.clientY); };
    const onUp = () => { dragging = false; };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    function spawnPlanet() {
      const p = PLANETS[Math.floor(Math.random() * PLANETS.length)];
      const radius = 16 + Math.random() * 8;
      planets.push({
        x: radius + Math.random() * (W - radius * 2),
        y: -radius - 10,
        r: radius,
        hue: p.hue,
        rot: Math.random() * Math.PI * 2,
        dx: (Math.random() - 0.5) * 0.6,
        rings: Math.random() < 0.35
      });
    }
    spawnTimer = setInterval(spawnPlanet, cfg.spawnEvery);
    spawnPlanet();

    function drawAstro() {
      const x = astro.x, y = astro.y;
      // tether wobble
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 20, y + 40); ctx.stroke();
      ctx.setLineDash([]);
      // helmet backing
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#B7C4D6'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, astro.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // helmet visor
      ctx.fillStyle = '#2A2438'; ctx.beginPath();
      ctx.ellipse(x, y - 2, astro.r - 6, astro.r - 9, 0, 0, Math.PI * 2); ctx.fill();
      // visor reflection
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.ellipse(x - 6, y - 6, 5, 3, -0.4, 0, Math.PI * 2); ctx.fill();
      // helmet antenna
      ctx.strokeStyle = '#B7C4D6'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y - astro.r); ctx.lineTo(x, y - astro.r - 10); ctx.stroke();
      ctx.fillStyle = '#FF6F7D'; ctx.beginPath(); ctx.arc(x, y - astro.r - 12, 3, 0, Math.PI * 2); ctx.fill();
    }

    function drawPlanet(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // ring underneath (draw ellipse behind + in front)
      if (p.rings) {
        ctx.strokeStyle = `hsl(${p.hue} 70% 55%)`;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r * 1.55, p.r * 0.55, 0, 0, Math.PI * 2); ctx.stroke();
      }
      // main planet
      const grad = ctx.createRadialGradient(-p.r * 0.4, -p.r * 0.4, p.r * 0.2, 0, 0, p.r);
      grad.addColorStop(0, `hsl(${p.hue} 90% 80%)`);
      grad.addColorStop(1, `hsl(${p.hue} 70% 45%)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill();
      // little crater blob
      ctx.fillStyle = `hsla(${p.hue} 90% 25% / .4)`;
      ctx.beginPath(); ctx.arc(-p.r * 0.3, p.r * 0.1, p.r * 0.24, 0, Math.PI * 2); ctx.fill();
      // ring in front (half)
      if (p.rings) {
        ctx.strokeStyle = `hsl(${p.hue} 70% 55%)`;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r * 1.55, p.r * 0.55, 0, 0, Math.PI, false); ctx.stroke();
      }
      ctx.restore();
    }

    let t = 0;
    function step() {
      t += 0.05;
      // deep-space gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#0E1444');
      grad.addColorStop(1, '#5B3A9E');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // starfield twinkle
      stars.forEach((s) => {
        const a = 0.4 + 0.4 * Math.sin(t * 2 + s.ph);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      // planets
      for (let i = planets.length - 1; i >= 0; i--) {
        const p = planets[i];
        p.y += cfg.fall;
        p.x += p.dx;
        if (p.x < p.r || p.x > W - p.r) p.dx *= -1;
        p.rot += 0.02;
        drawPlanet(p);
        // catch check
        const dx = p.x - astro.x, dy = p.y - astro.y;
        if (Math.hypot(dx, dy) < p.r + astro.r - 8) {
          planets.splice(i, 1);
          caught++;
          shell.setDots(caught, cfg.needed);
          SKAudio.play('star');
          SKPlay.confettiFromEl(canvas, { count: 12 });
          if (caught >= cfg.needed) {
            clearInterval(spawnTimer);
            setTimeout(() => {
              SKPlay.celebrate(root, gameDef, level, cfg.needed, cfg.needed, {
                onReplay: () => { location.hash = '#/game/' + gameDef.id; }
              });
            }, 400);
          }
          continue;
        }
        if (p.y > H + p.r + 10) planets.splice(i, 1);
      }
      drawAstro();
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
    id: 'spaceexplorer',
    title: 'Space Explorer',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'bolt',
    color: 'grape',
    icon: '🪐',
    blurb: 'Float an astronaut through space and catch the little planets!',
    premium: true,
    mount(root, ctx) { return mountSpace(root, this, ctx.level); }
  });
})();
