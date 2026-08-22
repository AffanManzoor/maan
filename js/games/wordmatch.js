/* ============================================================
   Bloom Zoo — Word Match (Free — reading)
   Hosted by Luna. Look at the picture, tap the word that matches
   it. Simple 3-letter CVC words with kid-friendly emoji.
   Kid-safe: a wrong tap says "try again" and highlights hints,
   never ends the round.
   ============================================================ */
(function () {
  'use strict';

  // 3-letter CVC words with clear emoji picture cues.
  const WORDS = [
    { word: 'cat', pic: '🐱' }, { word: 'dog', pic: '🐶' },
    { word: 'hat', pic: '🎩' }, { word: 'sun', pic: '☀️' },
    { word: 'pig', pic: '🐷' }, { word: 'cow', pic: '🐄' },
    { word: 'bee', pic: '🐝' }, { word: 'bug', pic: '🐛' },
    { word: 'cup', pic: '☕' }, { word: 'box', pic: '📦' },
    { word: 'car', pic: '🚗' }, { word: 'bus', pic: '🚌' },
    { word: 'bat', pic: '🦇' }, { word: 'hen', pic: '🐔' }
  ];

  const CFG = {
    1: { rounds: 4, choices: 2 },
    2: { rounds: 5, choices: 3 },
    3: { rounds: 6, choices: 4 }
  };

  function mountWordMatch(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let round = 0, correct = 0;
    const pool = SK.shuffle(WORDS);

    function playRound() {
      if (round >= cfg.rounds) {
        SKPlay.celebrate(root, gameDef, level, correct, cfg.rounds, {
          onReplay: () => { location.hash = '#/game/' + gameDef.id; }
        });
        return;
      }
      const target = pool[round % pool.length];
      const distractors = SK.pickN(WORDS.filter((w) => w.word !== target.word), cfg.choices - 1);
      const choices = SK.shuffle([target, ...distractors]);

      shell.setDots(round, cfg.rounds);
      shell.stage.innerHTML = `
        <div class="wm-prompt">
          <div class="wm-pic">${target.pic}</div>
          <div class="wm-hint">Tap the word that says this picture</div>
        </div>
        <div class="wm-choices">${choices.map((c) => `<button class="wm-choice" data-word="${c.word}"><span class="wm-word">${c.word}</span></button>`).join('')}</div>`;

      // read the target word aloud once
      SKAudio.speak(target.word);

      shell.stage.querySelectorAll('.wm-choice').forEach((btn) => {
        btn.addEventListener('click', () => {
          const w = btn.dataset.word;
          SKAudio.speak(w);
          if (w === target.word) {
            btn.classList.add('right');
            SKAudio.play('star'); shell.cheer();
            SKPlay.confettiFromEl(btn, { count: 14 });
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
    id: 'wordmatch',
    title: 'Word Match',
    subject: 'letters',
    subjectLabel: 'Reading',
    buddy: 'luna',
    color: 'sun',
    icon: '🐱',
    blurb: 'See a picture, tap the little word that matches!',
    mount(root, ctx) { return mountWordMatch(root, this, ctx.level); }
  });
})();
