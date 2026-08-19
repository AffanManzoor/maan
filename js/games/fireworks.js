/* ============================================================
   Bloom Zoo — Fireworks Show (Plus)
   Hosted by Bolt. Tap the night sky to launch fireworks — each
   tap fires a rocket that bursts into a shower of coloured sparks.
   Kid-safe: no goal, no timer — press "Grand finale!" when the
   sky is full to celebrate.
   ============================================================ */
(function () {
  'use strict';

  const HUE_POOL = [0, 30, 55, 130, 200, 260, 310];
  const MIN_LAUNCHES = 8;

  function mountFireworks(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    let raf, cleanup = () => {};
    let launches = 0;
    const rockets = [];   // { x, y, vy, hue }
    const sparks  = [];   // { x, y, vx, vy, life, hue }

    shell.stage.innerHTML = `
      <p class="rr-instructions">Tap the night sky to launch a firework — the more you tap, the bigger the show!</p>
      <div class="fw-wrap" id="fwWrap"><canvas id="fwCanvas" width="520" height="480"></canvas></div>
      <div class="fw-count" id="fwCount">Launches: 0</div>
      <button class="btn btn-xl btn-grape cust-done fw-done" type="button" disabled>🎆 Grand finale!</button>`;
    const canvas = shell.stage.querySelector('#fwCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const countEl = shell.stage.querySelector('#fwCount');
    const doneBtn = shell.stage.querySelector('.fw-done');
    shell.setDots(0, MIN_LAUNCHES);

    function launch(clientX, clientY) {
      const r = canvas.getBoundingClientRect();
      const x = (clientX - r.left) * (W / r.width);
      const targetY = (clientY - r.top) * (H / r.height);
      rockets.push({
        x, y: H - 4,
        tx: x, ty: Math.max(60, targetY),
        vy: -6 - Math.random() * 2,
        hue: HUE_POOL[Math.floor(Math.random() * HUE_POOL.length)]
      });
      SKAudio.play('whoosh');
      launches++;
      countEl.textContent = `Launches: ${launches}`;
      shell.setDots(Math.min(launches, MIN_LAUNCHES), MIN_LAUNCHES);
      if (launches >= MIN_LAUNCHES) doneBtn.disabled = false;
    }
    const onDown = (e) => launch(e.clientX, e.clientY);
    canvas.addEventListener('pointerdown', onDown);

    function burst(x, y, hue) {
      const count = 32 + Math.floor(Math.random() * 20);
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + Math.random() * 0.1;
        const spd = 2 + Math.random() * 3;
        sparks.push({
          x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 0.5,
          life: 1, hue: hue + (Math.random() * 40 - 20)
        });
      }
      SKAudio.play('star');
    }

    // background stars
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4, ph: Math.random() * Math.PI * 2
    }));

    let t = 0;
    function step() {
      t += 0.05;
      // deep-night sky
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#050B1E'); grad.addColorStop(1, '#2B2145');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // ground silhouette
      ctx.fillStyle = '#0D1030';
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, H - 40);
      ctx.quadraticCurveTo(W / 4, H - 60, W / 2, H - 44);
      ctx.quadraticCurveTo(3 * W / 4, H - 30, W, H - 50);
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      // twinkle
      for (const s of stars) {
        const a = 0.4 + 0.5 * Math.sin(t * 2 + s.ph);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }

      // rockets rising
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        // draw rocket trail (short comet)
        ctx.strokeStyle = `hsla(${r.hue} 90% 70% / .9)`;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y - r.vy * 3); ctx.stroke();
        // spark head
        ctx.fillStyle = `hsl(${r.hue} 95% 80%)`;
        ctx.beginPath(); ctx.arc(r.x, r.y, 3, 0, Math.PI * 2); ctx.fill();
        if (r.y <= r.ty) {
          burst(r.x, r.y, r.hue);
          rockets.splice(i, 1);
        }
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.vy += 0.05;    // gravity
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.014;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = `hsl(${p.hue} 90% 70%)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    doneBtn.addEventListener('click', () => {
      // grand finale — pop 5 automatic bursts across the sky
      for (let i = 0; i < 5; i++) {
        setTimeout(() => burst(80 + i * 90, 100 + (i % 2) * 40, HUE_POOL[i % HUE_POOL.length]), i * 180);
      }
      setTimeout(() => {
        SKPlay.celebrate(root, gameDef, level, 3, 3, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
      }, 1400);
    });

    cleanup = () => {
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
    };
    return { destroy() { cleanup(); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'fireworks',
    title: 'Fireworks Show',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'bolt',
    color: 'grape',
    icon: '🎆',
    blurb: 'Tap the night sky to launch the sparkliest firework show!',
    premium: true,
    mount(root, ctx) { return mountFireworks(root, this, ctx.level); }
  });
})();
