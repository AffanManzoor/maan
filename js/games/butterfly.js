/* ============================================================
   SuperKids — Butterfly Catcher
   Hosted by Luna. Drag a net across the meadow to catch each
   fluttering butterfly. Kid-safe: no time limit, no penalties.
   ============================================================ */
(function () {
  'use strict';

  const COLORS = ['#FF6F7D', '#4EA8FF', '#FFC93C', '#9B6BFF', '#FF9D45', '#3DDC97'];
  const CFG = {
    1: { count: 5,  wobble: 24 },
    2: { count: 8,  wobble: 34 },
    3: { count: 11, wobble: 44 }
  };

  function butterflySVG(color) {
    return `<svg viewBox="0 0 60 44" width="100%" height="100%" aria-hidden="true">
      <ellipse cx="18" cy="16" rx="14" ry="10" fill="${color}"/>
      <ellipse cx="42" cy="16" rx="14" ry="10" fill="${color}"/>
      <ellipse cx="20" cy="30" rx="10" ry="8" fill="${color}" opacity=".9"/>
      <ellipse cx="40" cy="30" rx="10" ry="8" fill="${color}" opacity=".9"/>
      <ellipse cx="16" cy="16" rx="4" ry="3" fill="#fff" opacity=".5"/>
      <ellipse cx="44" cy="16" rx="4" ry="3" fill="#fff" opacity=".5"/>
      <rect x="28" y="10" width="4" height="26" rx="2" fill="#2B2145"/>
      <line x1="30" y1="8" x2="26" y2="2" stroke="#2B2145" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="30" y1="8" x2="34" y2="2" stroke="#2B2145" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;
  }
  function netSVG() {
    return `<svg viewBox="0 0 80 100" width="100%" height="100%" aria-hidden="true">
      <line x1="40" y1="100" x2="60" y2="40" stroke="#7A5230" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="42" cy="34" rx="30" ry="24" fill="rgba(255,255,255,.35)" stroke="#7A5230" stroke-width="3"/>
      <path d="M18 34 h48 M22 22 h40 M22 46 h40 M42 12 v48 M30 15 v40 M54 15 v40" stroke="#7A5230" stroke-width="1" opacity=".6"/>
    </svg>`;
  }

  function mountBF(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let caught = 0;

    shell.stage.innerHTML = `
      <p class="bf-instructions">Drag the net around to catch every butterfly!</p>
      <div class="bf-stage" id="bfStage"></div>`;
    const stage = shell.stage.querySelector('#bfStage');
    shell.setDots(0, cfg.count);

    const butterflies = [];
    for (let i = 0; i < cfg.count; i++) {
      const el = document.createElement('div');
      el.className = 'bf-butterfly';
      el.innerHTML = butterflySVG(COLORS[i % COLORS.length]);
      const leftPct = 8 + Math.random() * 82;
      const topPct = 10 + Math.random() * 70;
      el.style.left = leftPct + '%';
      el.style.top = topPct + '%';
      el.style.animationDuration = (2 + Math.random() * 1.5) + 's';
      el.style.setProperty('--wobble', cfg.wobble + 'px');
      stage.appendChild(el);
      butterflies.push({ el, alive: true });
    }

    const net = document.createElement('div');
    net.className = 'bf-net';
    net.innerHTML = netSVG();
    stage.appendChild(net);
    net.style.left = '50%'; net.style.top = '50%';

    let dragging = false;
    function moveNet(clientX, clientY) {
      const r = stage.getBoundingClientRect();
      const xPct = Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100));
      const yPct = Math.min(94, Math.max(6, ((clientY - r.top) / r.height) * 100));
      net.style.left = xPct + '%'; net.style.top = yPct + '%';
      // check collisions
      const nr = net.getBoundingClientRect();
      const ncx = nr.left + nr.width / 2, ncy = nr.top + nr.height * 0.34;
      butterflies.forEach((b) => {
        if (!b.alive) return;
        const br = b.el.getBoundingClientRect();
        const bcx = br.left + br.width / 2, bcy = br.top + br.height / 2;
        const dx = ncx - bcx, dy = ncy - bcy;
        if (Math.sqrt(dx * dx + dy * dy) < 40) {
          b.alive = false; caught++;
          b.el.classList.add('caught');
          SKAudio.play('star');
          SKPlay.confettiFromEl(b.el, { count: 8, power: 5 });
          setTimeout(() => b.el.remove(), 350);
          shell.setDots(caught, cfg.count);
          if (caught >= cfg.count) {
            cleanup();
            setTimeout(() => {
              SKPlay.celebrate(root, gameDef, level, cfg.count, cfg.count, {
                onReplay: () => { location.hash = '#/game/' + gameDef.id; }
              });
            }, 350);
          }
        }
      });
    }
    const onDown = (e) => { dragging = true; moveNet(e.clientX, e.clientY); };
    const onMove = (e) => { if (dragging) moveNet(e.clientX, e.clientY); };
    const onUp = () => { dragging = false; };
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    function cleanup() {
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }

    return { destroy() { cleanup(); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'butterfly',
    title: 'Butterfly Net',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'luna',
    color: 'grape',
    icon: '🦋',
    blurb: 'Drag your net to catch all the fluttering butterflies!',
    mount(root, ctx) { return mountBF(root, this, ctx.level); }
  });
})();
