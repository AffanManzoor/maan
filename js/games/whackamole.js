/* ============================================================
   SuperKids — Critter Bop (whack-a-mole)
   Hosted by Ziggy. Cute critters pop up from holes — tap them
   to bop them back down. Kid-safe: no penalty for misses.
   ============================================================ */
(function () {
  'use strict';

  const CRITTERS = ['🦔', '🐹', '🐰', '🐿️', '🦊'];
  const CFG = {
    1: { needed: 10, holes: 6, popMs: 1400, gapMs: 700 },
    2: { needed: 14, holes: 9, popMs: 1100, gapMs: 500 },
    3: { needed: 18, holes: 9, popMs: 850,  gapMs: 350 }
  };

  function mountWM(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let bops = 0;
    let cycleTimer, hideTimer, cleanup = () => {};

    shell.stage.innerHTML = `
      <p class="wm-instructions">Tap the critters when they pop up!</p>
      <div class="wm-grid" id="wmGrid" style="grid-template-columns:repeat(${cfg.holes === 6 ? 3 : 3},1fr);"></div>`;
    const grid = shell.stage.querySelector('#wmGrid');
    for (let i = 0; i < cfg.holes; i++) {
      const cell = document.createElement('div');
      cell.className = 'wm-hole';
      cell.innerHTML = `<div class="wm-hill"></div><div class="wm-critter"></div>`;
      grid.appendChild(cell);
    }
    shell.setDots(0, cfg.needed);

    function popRandom() {
      if (bops >= cfg.needed) return;
      const holes = Array.from(grid.querySelectorAll('.wm-hole'));
      const idle = holes.filter((h) => !h.classList.contains('up'));
      if (!idle.length) { cycleTimer = setTimeout(popRandom, cfg.gapMs); return; }
      const cell = idle[Math.floor(Math.random() * idle.length)];
      const critter = CRITTERS[Math.floor(Math.random() * CRITTERS.length)];
      cell.querySelector('.wm-critter').textContent = critter;
      cell.classList.add('up');
      let bopped = false;
      const handler = () => {
        if (bopped) return; bopped = true;
        bops++; shell.setDots(bops, cfg.needed);
        SKAudio.play('pop');
        SKPlay.confettiFromEl(cell, { count: 10, power: 6 });
        cell.classList.remove('up');
        cell.classList.add('bopped');
        setTimeout(() => cell.classList.remove('bopped'), 400);
        if (bops >= cfg.needed) {
          if (cycleTimer) clearTimeout(cycleTimer);
          if (hideTimer) clearTimeout(hideTimer);
          setTimeout(() => {
            SKPlay.celebrate(root, gameDef, level, cfg.needed, cfg.needed, {
              onReplay: () => { location.hash = '#/game/' + gameDef.id; }
            });
          }, 400);
        }
      };
      cell.addEventListener('click', handler, { once: true });
      hideTimer = setTimeout(() => { cell.classList.remove('up'); }, cfg.popMs);
      cycleTimer = setTimeout(popRandom, cfg.gapMs);
    }
    cycleTimer = setTimeout(popRandom, 400);

    cleanup = () => {
      if (cycleTimer) clearTimeout(cycleTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };

    return { destroy() { cleanup(); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'whackamole',
    title: 'Critter Bop',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'ziggy',
    color: 'mint',
    icon: '🦔',
    blurb: 'Bop the little critters when they pop up from their holes!',
    mount(root, ctx) { return mountWM(root, this, ctx.level); }
  });
})();
