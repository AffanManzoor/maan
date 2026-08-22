/* ============================================================
   Bloom Zoo — Trampoline (Plus)
   Hosted by Ziggy. Tap the trampoline to make the little animal
   bounce higher and higher. Every big bounce sparks confetti.
   Kid-safe: no timer, no fail — just bouncy fun. "Take a bow"
   celebrates whenever you're ready.
   ============================================================ */
(function () {
  'use strict';

  const ANIMALS = ['🐰', '🐻', '🐨', '🐸', '🦊', '🐼', '🐷', '🐵'];
  const MIN_BOUNCES = 6;

  function mountTramp(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    let raf, cleanup = () => {};

    shell.stage.innerHTML = `
      <p class="pz-instructions">Tap the trampoline to bounce — try for BIG bounces!</p>
      <div class="rr-wrap" id="tpWrap"><canvas id="tpCanvas" width="500" height="480"></canvas></div>
      <div class="fg-tools">
        <button class="btn btn-ghost pz-undo" id="tpSwap" type="button">🔁 Swap animal</button>
        <div class="fg-count" id="tpCount">Bounces: 0</div>
      </div>
      <button class="btn btn-xl btn-mint cust-done tp-done" type="button" disabled>🎉 Take a bow!</button>`;
    const canvas = shell.stage.querySelector('#tpCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const countEl = shell.stage.querySelector('#tpCount');
    const doneBtn = shell.stage.querySelector('.tp-done');

    let animalIdx = 0;
    // trampoline bar
    const tramp = { x: W / 2, y: H - 90, w: 220, h: 14 };
    // animal state — position, velocity, sitting-on-tramp flag
    let ay = tramp.y - 40, avy = 0;
    let ax = tramp.x; let arot = 0, arotv = 0;
    let bounces = 0;
    let squish = 0;
    shell.setDots(0, MIN_BOUNCES);

    function tap(e) {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * (W / r.width);
      const y = (e.clientY - r.top) * (H / r.height);
      // A tap on/near the trampoline bar sends the animal up. Anywhere
      // is fine — kids can tap anywhere on the trampoline area.
      const onTramp = Math.abs(y - tramp.y) < 80 && Math.abs(x - tramp.x) < tramp.w / 2 + 30;
      if (!onTramp) return;
      // Give a big boost if the animal is at or near the trampoline
      const strength = 12 + Math.min(6, ay < tramp.y - 200 ? 2 : (tramp.y - ay) * 0.03);
      avy = -strength;
      squish = 8;
      arotv = (Math.random() * 0.14 - 0.07);
      bounces++;
      countEl.textContent = `Bounces: ${bounces}`;
      shell.setDots(Math.min(bounces, MIN_BOUNCES), MIN_BOUNCES);
      if (bounces >= MIN_BOUNCES) doneBtn.disabled = false;
      SKAudio.play('pop');
      // At every 5 bounces, confetti burst for extra delight
      if (bounces % 3 === 0) SKPlay.confettiFromEl(canvas, { count: 18 });
    }
    canvas.addEventListener('pointerdown', tap);

    shell.stage.querySelector('#tpSwap').addEventListener('click', () => {
      animalIdx = (animalIdx + 1) % ANIMALS.length;
      SKAudio.play('pop');
    });
    doneBtn.addEventListener('click', () => {
      SKAudio.play('star');
      SKPlay.confettiFromEl(canvas, { count: 40 });
      setTimeout(() => {
        SKPlay.celebrate(root, gameDef, level, 3, 3, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
      }, 500);
    });

    ctx.font = '54px system-ui, "Apple Color Emoji", "Segoe UI Emoji"';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    function step() {
      // sky
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#BFE4FF'); grad.addColorStop(1, '#F4C1D0');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      // sun + clouds
      ctx.fillStyle = 'rgba(255,201,60,.9)';
      ctx.beginPath(); ctx.arc(60, 60, 24, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      [[160, 80], [340, 100], [430, 60]].forEach(([cx, cy]) => {
        ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.arc(cx - 16, cy + 4, 14, 0, Math.PI * 2);
        ctx.arc(cx + 16, cy + 4, 14, 0, Math.PI * 2); ctx.fill();
      });
      // grass
      ctx.fillStyle = '#2FAB70';
      ctx.fillRect(0, H - 30, W, 30);

      // physics
      avy += 0.55; ay += avy;
      ax += 0;   // stays centered
      arot += arotv;
      if (squish > 0) squish -= 0.6;
      // land on trampoline (bounce)
      if (ay >= tramp.y - 20 && avy > 0) {
        ay = tramp.y - 20;
        // small natural bounce so the animal wobbles at rest
        if (Math.abs(avy) > 2) { avy = -avy * 0.5; }
        else avy = 0;
      }

      // trampoline stand
      ctx.strokeStyle = '#5C6473'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(tramp.x - 90, tramp.y + tramp.h + 4); ctx.lineTo(tramp.x - 60, H - 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tramp.x + 90, tramp.y + tramp.h + 4); ctx.lineTo(tramp.x + 60, H - 30); ctx.stroke();
      // trampoline bed — a squishy ellipse when hit
      const stretch = Math.max(0, squish);
      ctx.fillStyle = '#2A2438';
      ctx.beginPath();
      ctx.ellipse(tramp.x, tramp.y + stretch, tramp.w / 2, tramp.h + stretch * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5C6473';
      ctx.beginPath();
      ctx.ellipse(tramp.x, tramp.y - 2 + stretch, tramp.w / 2 - 6, tramp.h * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // animal
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(arot);
      ctx.fillText(ANIMALS[animalIdx], 0, 0);
      ctx.restore();

      // little sparkles when high
      if (ay < 120) {
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = `hsla(${(Date.now() / 5 + i * 60) % 360} 80% 70% / .6)`;
          ctx.beginPath();
          ctx.arc(ax + (i * 20 - 30), ay + 30 + i * 6, 2 + (i % 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    cleanup = () => {
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', tap);
    };
    return { destroy() { cleanup(); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'trampoline',
    title: 'Trampoline',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'ziggy',
    color: 'mint',
    icon: '🎪',
    blurb: 'Tap the trampoline and bounce the little animal higher and higher!',
    premium: true,
    mount(root, ctx) { return mountTramp(root, this, ctx.level); }
  });
})();
