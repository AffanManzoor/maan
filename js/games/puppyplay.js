/* ============================================================
   Bloom Zoo — Puppy Playtime (Plus)
   Hosted by Pip. A little puppy asks for a specific toy — ball,
   stick, bone, frisbee, teddy or rope. Pick the right one to
   make the puppy wiggle with joy. Kid-safe: a wrong tap gently
   shakes and asks again.
   ============================================================ */
(function () {
  'use strict';

  const TOYS = [
    { id: 'ball',    label: 'ball',    emoji: '🎾' },
    { id: 'bone',    label: 'bone',    emoji: '🦴' },
    { id: 'stick',   label: 'stick',   emoji: '🪵' },
    { id: 'frisbee', label: 'frisbee', emoji: '🥏' },
    { id: 'teddy',   label: 'teddy',   emoji: '🧸' },
    { id: 'rope',    label: 'rope',    emoji: '🪢' }
  ];

  const CFG = {
    1: { rounds: 4, choices: 2 },
    2: { rounds: 5, choices: 3 },
    3: { rounds: 6, choices: 4 }
  };

  function mountPP(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let round = 0, correct = 0;

    function playRound() {
      if (round >= cfg.rounds) {
        SKPlay.celebrate(root, gameDef, level, correct, cfg.rounds, {
          onReplay: () => { location.hash = '#/game/' + gameDef.id; }
        });
        return;
      }
      const target = TOYS[Math.floor(Math.random() * TOYS.length)];
      const distractors = SK.pickN(TOYS.filter((t) => t.id !== target.id), cfg.choices - 1);
      const choices = SK.shuffle([target, ...distractors]);

      shell.setDots(round, cfg.rounds);
      shell.stage.innerHTML = `
        <div class="pp-scene">
          <div class="pp-puppy" id="ppPuppy">🐶</div>
          <div class="pp-speech">I want my ${target.label}, please! 🐾</div>
        </div>
        <div class="pp-toys">${choices.map((c) => `<button class="pp-toy" data-id="${c.id}"><span class="pp-emoji">${c.emoji}</span><span class="pp-label">${c.label}</span></button>`).join('')}</div>`;

      SKAudio.speak(`Please bring me the ${target.label}!`);
      const puppy = shell.stage.querySelector('#ppPuppy');

      shell.stage.querySelectorAll('.pp-toy').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (id === target.id) {
            btn.classList.add('right');
            puppy.classList.add('wiggle');
            SKAudio.play('star'); shell.cheer();
            SKPlay.confettiFromEl(puppy, { count: 20 });
            correct++;
            round++;
            setTimeout(playRound, 900);
          } else {
            btn.classList.add('wrong');
            SKAudio.play('oops'); shell.oops();
            setTimeout(() => btn.classList.remove('wrong'), 500);
          }
        });
      });
    }
    playRound();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'puppyplay',
    title: 'Puppy Playtime',
    subject: 'creative',
    subjectLabel: 'Matching',
    buddy: 'pip',
    color: 'coral',
    icon: '🐕',
    blurb: 'Pick the toy the puppy is asking for — bone, ball or teddy!',
    premium: true,
    mount(root, ctx) { return mountPP(root, this, ctx.level); }
  });
})();
