/* ============================================================
   Bloom Zoo — Bee Path (Plus)
   Hosted by Luna. Drag the bee from flower to flower in the right
   order — 1, 2, 3, … — visiting each one in turn. Kid-safe: if
   you touch the wrong flower you get a gentle bounce back to the
   last one; nothing breaks the round.
   ============================================================ */
(function () {
  'use strict';

  const CFG = {
    1: { flowers: 4 },
    2: { flowers: 6 },
    3: { flowers: 8 }
  };

  function mountBP(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let raf;
    const W = 500, H = 380;

    shell.stage.innerHTML = `
      <p class="pz-instructions">Drag the bee to each flower in order — 1, 2, 3, and more!</p>
      <div class="bp-wrap" id="bpWrap"><svg id="bpSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 380" role="img" aria-label="Bee path"></svg></div>`;

    const svg = shell.stage.querySelector('#bpSvg');
    // Layout flowers on a jittered ring so they never overlap.
    const flowers = [];
    const R = Math.min(W, H) / 2 - 60;
    for (let i = 0; i < cfg.flowers; i++) {
      const a = (i / cfg.flowers) * Math.PI * 2 + Math.random() * 0.3 - 0.15;
      flowers.push({
        n: i + 1,
        x: W / 2 + Math.cos(a) * R * (0.7 + Math.random() * 0.2),
        y: H / 2 + Math.sin(a) * R * (0.55 + Math.random() * 0.2),
        color: `hsl(${(i * 47) % 360} 75% 60%)`,
        visited: false
      });
    }
    // Shuffle their number labels so the visit order is not the ring order
    const nums = SK.shuffle(flowers.map((_, i) => i + 1));
    flowers.forEach((f, i) => (f.n = nums[i]));

    let bee = { x: W / 2, y: H / 2 };
    // start at flower 1
    const first = flowers.find((f) => f.n === 1);
    bee.x = first.x; bee.y = first.y; first.visited = true;
    let visited = 1;
    shell.setDots(1, cfg.flowers);

    function render() {
      // meadow bg + path so-far + flowers + bee
      let path = '';
      const order = flowers.slice().sort((a, b) => a.n - b.n);
      order.forEach((f, i) => {
        if (!f.visited) return;
        if (i === 0) path += `M${f.x} ${f.y}`;
        else path += ` L${f.x} ${f.y}`;
      });
      svg.innerHTML = `
        <defs><linearGradient id="bpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4F2FF"/><stop offset="1" stop-color="#FFF6DC"/></linearGradient></defs>
        <rect width="${W}" height="${H}" fill="url(#bpSky)"/>
        <path d="M0 250 Q${W / 2} 232 ${W} 250 L${W} ${H} L0 ${H} Z" fill="#B8DE7A"/>
        <path d="M0 290 Q${W / 2} 274 ${W} 292 L${W} ${H} L0 ${H} Z" fill="#9BC960"/>
        <path d="${path}" stroke="#FFC93C" stroke-width="4" fill="none" stroke-dasharray="6 6" stroke-linecap="round"/>
        ${flowers.map((f) => `
          <g class="bp-flower${f.visited ? ' visited' : ''}" data-n="${f.n}" style="cursor:pointer">
            <line x1="${f.x}" y1="${f.y + 8}" x2="${f.x}" y2="${f.y + 34}" stroke="#2FAB70" stroke-width="3"/>
            <circle cx="${f.x - 10}" cy="${f.y - 2}" r="10" fill="${f.color}"/>
            <circle cx="${f.x + 10}" cy="${f.y - 2}" r="10" fill="${f.color}"/>
            <circle cx="${f.x}" cy="${f.y - 12}" r="10" fill="${f.color}"/>
            <circle cx="${f.x}" cy="${f.y + 8}" r="10" fill="${f.color}"/>
            <circle cx="${f.x}" cy="${f.y}" r="8" fill="${f.visited ? '#3DDC97' : '#FFC93C'}" stroke="#F0A100" stroke-width="1"/>
            <text x="${f.x}" y="${f.y + 4}" text-anchor="middle" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="12" fill="#2A2438">${f.n}</text>
          </g>`).join('')}
        <g class="bp-bee" transform="translate(${bee.x} ${bee.y})">
          <ellipse cx="-8" cy="-8" rx="10" ry="7" fill="rgba(255,255,255,.85)"/>
          <ellipse cx="8" cy="-8" rx="10" ry="7" fill="rgba(255,255,255,.85)"/>
          <ellipse cx="0" cy="0" rx="10" ry="8" fill="#FFC93C" stroke="#2A2438" stroke-width="1.5"/>
          <rect x="-8" y="-3" width="6" height="6" fill="#2A2438"/>
          <rect x="2" y="-3" width="6" height="6" fill="#2A2438"/>
          <circle cx="-6" cy="-4" r="1.6" fill="#2A2438"/>
          <circle cx="-4" cy="-6" r="1" fill="#fff"/>
        </g>`;

      // Click / tap a flower to try to visit it — that way phone users
      // don't have to drag with pinpoint accuracy.
      svg.querySelectorAll('.bp-flower').forEach((el) => {
        el.addEventListener('click', () => tryVisit(Number(el.getAttribute('data-n'))));
      });
    }

    function tryVisit(n) {
      if (n === visited + 1) {
        const f = flowers.find((x) => x.n === n);
        f.visited = true;
        bee.x = f.x; bee.y = f.y;
        visited++;
        shell.setDots(visited, cfg.flowers);
        SKAudio.play('star'); shell.cheer();
        SKPlay.confettiFromEl(svg, { count: 10 });
        if (visited >= cfg.flowers) {
          setTimeout(() => {
            SKPlay.celebrate(root, gameDef, level, cfg.flowers, cfg.flowers, { onReplay: () => { location.hash = '#/game/' + gameDef.id; } });
          }, 500);
        } else {
          render();
        }
      } else if (n === visited) {
        // tapped the current flower — ignore
      } else {
        SKAudio.play('oops'); shell.oops();
        SK.toast(`Look for flower number ${visited + 1}! 💛`);
      }
    }

    render();
    return { destroy() { if (raf) cancelAnimationFrame(raf); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'beepath',
    title: 'Bee Path',
    subject: 'creative',
    subjectLabel: 'Puzzle',
    buddy: 'luna',
    color: 'sun',
    icon: '🐝',
    blurb: 'Buzz the bee from flower 1 to 2 to 3 — visit them all in order!',
    premium: true,
    mount(root, ctx) { return mountBP(root, this, ctx.level); }
  });
})();
