/* ============================================================
   SuperKids — Balloon Pop
   Hosted by Pip. Balloons drift up from the bottom of the sky —
   tap them to pop them. Kid-safe: nothing bad happens if a
   balloon escapes, another one just floats in.
   ============================================================ */
(function () {
  'use strict';

  const COLORS = ['#FF6F7D', '#4EA8FF', '#FFC93C', '#3DDC97', '#9B6BFF', '#FF9D45', '#FF8FB1'];
  const CFG = {
    1: { needed: 10, spawnEvery: 900, speedMul: 1.0 },
    2: { needed: 15, spawnEvery: 700, speedMul: 1.25 },
    3: { needed: 20, spawnEvery: 560, speedMul: 1.55 }
  };

  function balloonSVG(color) {
    return `<svg viewBox="0 0 60 80" width="100%" height="100%" aria-hidden="true">
      <ellipse cx="30" cy="30" rx="24" ry="28" fill="${color}"/>
      <ellipse cx="22" cy="20" rx="6" ry="8" fill="#fff" opacity=".45"/>
      <polygon points="27,58 33,58 30,62" fill="${color}"/>
      <path d="M30 62 Q34 70 30 78 Q26 70 30 62 Z" stroke="#7A6E9C" stroke-width="1.5" fill="none"/>
    </svg>`;
  }

  function mountBP(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let spawnTimer, cleanup = () => {};
    let popped = 0;

    shell.stage.innerHTML = `
      <p class="bp-instructions">Tap the balloons to pop them!</p>
      <div class="bp-wrap" id="bpWrap"></div>`;
    const stage = shell.stage.querySelector('#bpWrap');
    shell.setDots(0, cfg.needed);

    function spawn() {
      if (popped >= cfg.needed) return;
      const el = document.createElement('div');
      el.className = 'balloon';
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.innerHTML = balloonSVG(color);
      const leftPct = 4 + Math.random() * 86;
      const dur = (7 + Math.random() * 4) / cfg.speedMul;
      const sway = 20 + Math.random() * 30;
      el.style.left = leftPct + '%';
      el.style.setProperty('--sway', sway + 'px');
      el.style.animationDuration = dur + 's';
      let popping = false;
      el.addEventListener('click', () => {
        if (popping) return; popping = true;
        popped++;
        shell.setDots(popped, cfg.needed);
        SKAudio.play('pop');
        SKPlay.confettiFromEl(el, { count: 12, power: 6, colors: [color, '#fff', '#FFE58A'] });
        el.classList.add('pop');
        setTimeout(() => el.remove(), 350);
        if (popped >= cfg.needed) {
          if (spawnTimer) clearInterval(spawnTimer);
          setTimeout(() => {
            SKPlay.celebrate(root, gameDef, level, cfg.needed, cfg.needed, {
              onReplay: () => { location.hash = '#/game/' + gameDef.id; }
            });
          }, 400);
        }
      });
      el.addEventListener('animationend', (ev) => {
        if (ev.animationName === 'balloonRise') el.remove();
      });
      stage.appendChild(el);
    }
    spawnTimer = setInterval(spawn, cfg.spawnEvery);
    for (let i = 0; i < 3; i++) setTimeout(spawn, i * 250);

    cleanup = () => { if (spawnTimer) clearInterval(spawnTimer); };

    return { destroy() { cleanup(); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'balloonpop',
    title: 'Balloon Pop',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'pip',
    color: 'coral',
    icon: '🎈',
    blurb: 'Pop the floating balloons — tap them before they fly away!',
    mount(root, ctx) { return mountBP(root, this, ctx.level); }
  });
})();
