/* ============================================================
   SuperKids — Bubble Wrap
   Hosted by Luna. A satisfying grid of bubbles — tap every one
   to pop it. Reach the target count to celebrate.
   ============================================================ */
(function () {
  'use strict';

  const CFG = {
    1: { cols: 5, rows: 4 },
    2: { cols: 6, rows: 5 },
    3: { cols: 7, rows: 6 }
  };
  const HUES = ['#9ED3FF', '#FFB8CC', '#FFE58A', '#9CF0D4', '#C9B3FF', '#FFD4B8'];

  function mountBW(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    const total = cfg.cols * cfg.rows;
    let popped = 0;

    shell.stage.innerHTML = `
      <p class="bw-instructions">Pop every bubble! Tap them one by one.</p>
      <div class="bw-grid" id="bwGrid" style="grid-template-columns:repeat(${cfg.cols},1fr);max-width:${Math.min(60 * cfg.cols, 420)}px;"></div>`;
    const grid = shell.stage.querySelector('#bwGrid');
    shell.setDots(0, total);

    for (let i = 0; i < total; i++) {
      const bubble = document.createElement('button');
      bubble.type = 'button';
      bubble.className = 'bw-bubble';
      const hue = HUES[i % HUES.length];
      bubble.style.setProperty('--bcol', hue);
      bubble.addEventListener('click', () => {
        if (bubble.classList.contains('popped')) return;
        bubble.classList.add('popped');
        popped++;
        SKAudio.play('pop');
        shell.setDots(popped, total);
        SKPlay.confettiFromEl(bubble, { count: 6, power: 5, colors: [hue, '#fff'] });
        if (popped >= total) {
          setTimeout(() => {
            SKPlay.celebrate(root, gameDef, level, total, total, {
              onReplay: () => { location.hash = '#/game/' + gameDef.id; }
            });
          }, 350);
        }
      });
      grid.appendChild(bubble);
    }

    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'bubblewrap',
    title: 'Bubble Wrap',
    subject: 'creative',
    subjectLabel: 'Sensory',
    buddy: 'luna',
    color: 'sky',
    icon: '🫧',
    blurb: 'The most satisfying game ever — pop every last bubble!',
    mount(root, ctx) { return mountBW(root, this, ctx.level); }
  });
})();
