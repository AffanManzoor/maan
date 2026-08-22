/* ============================================================
   Bloom Zoo — Sound It Out (Free — reading)
   Hosted by Luna. See a picture. Watch the letters appear one
   at a time and hear each letter sound. Then hear them blended
   together as a word. Tap "I read it!" to celebrate.
   ============================================================ */
(function () {
  'use strict';

  // CVC words that most kid-safe TTS voices sound out reasonably. We
  // spell out each individual letter with SKAudio.speak using a friendly
  // pause between letters, then say the whole blended word.
  const WORDS = [
    { word: 'cat', pic: '🐱' }, { word: 'dog', pic: '🐶' },
    { word: 'hat', pic: '🎩' }, { word: 'sun', pic: '☀️' },
    { word: 'pig', pic: '🐷' }, { word: 'bee', pic: '🐝' },
    { word: 'cup', pic: '☕' }, { word: 'box', pic: '📦' },
    { word: 'car', pic: '🚗' }, { word: 'bat', pic: '🦇' },
    { word: 'hen', pic: '🐔' }, { word: 'bug', pic: '🐛' }
  ];

  const CFG = {
    1: { rounds: 3, speed: 850 },
    2: { rounds: 4, speed: 700 },
    3: { rounds: 5, speed: 600 }
  };

  // Phonetic letter names for TTS. Real phonemes are hard to synthesize
  // cleanly with speechSynthesis, so we speak clear letter names —
  // "cee, ay, tee" — which is how most letter-sound apps for early
  // readers work in practice. Then we speak the whole word.
  function speakLetter(ch) {
    // Speak the letter name; add a trailing punctuation so voices
    // pause naturally between letters.
    SKAudio.speak(ch.toUpperCase() + '.');
  }

  function mountSoundOut(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let round = 0, correct = 0;
    const pool = SK.shuffle(WORDS);
    let stepTimers = [];

    function clearTimers() { stepTimers.forEach(clearTimeout); stepTimers = []; }

    function playRound() {
      clearTimers();
      if (round >= cfg.rounds) {
        SKPlay.celebrate(root, gameDef, level, cfg.rounds, cfg.rounds, {
          onReplay: () => { location.hash = '#/game/' + gameDef.id; }
        });
        return;
      }
      const target = pool[round % pool.length];
      shell.setDots(round, cfg.rounds);
      const letters = target.word.split('');
      shell.stage.innerHTML = `
        <div class="so-wrap">
          <div class="so-pic">${target.pic}</div>
          <div class="so-slots">${letters.map((_, i) => `<span class="so-slot" data-i="${i}"></span>`).join('')}</div>
          <p class="so-hint" id="soHint">Listen…</p>
          <div class="so-actions">
            <button class="btn btn-sm btn-ghost so-again" type="button">🔁 Sound it again</button>
            <button class="btn btn-xl btn-sun so-got" type="button" disabled>👍 I read it!</button>
          </div>
        </div>`;

      const slots = shell.stage.querySelectorAll('.so-slot');
      const hintEl = shell.stage.querySelector('#soHint');
      const gotBtn = shell.stage.querySelector('.so-got');

      function playSequence() {
        clearTimers();
        slots.forEach((s) => { s.textContent = ''; s.classList.remove('lit'); });
        gotBtn.disabled = true;
        hintEl.textContent = 'Listen…';
        letters.forEach((ch, i) => {
          stepTimers.push(setTimeout(() => {
            slots[i].textContent = ch;
            slots[i].classList.add('lit');
            speakLetter(ch);
          }, i * cfg.speed + 200));
        });
        stepTimers.push(setTimeout(() => {
          hintEl.textContent = 'Now put it all together: ' + target.word + '!';
          SKAudio.speak(target.word);
          gotBtn.disabled = false;
        }, letters.length * cfg.speed + 500));
      }

      shell.stage.querySelector('.so-again').addEventListener('click', () => {
        SKAudio.play('click');
        playSequence();
      });
      gotBtn.addEventListener('click', () => {
        SKAudio.play('star'); shell.cheer();
        SKPlay.confettiFromEl(shell.stage.querySelector('.so-pic'), { count: 20 });
        correct++;
        round++;
        setTimeout(playRound, 800);
      });

      playSequence();
    }
    playRound();
    return { destroy() { clearTimers(); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'soundout',
    title: 'Sound It Out',
    subject: 'letters',
    subjectLabel: 'Reading',
    buddy: 'luna',
    color: 'coral',
    icon: '🔤',
    blurb: 'Watch the letters pop up one by one and sound out the word!',
    mount(root, ctx) { return mountSoundOut(root, this, ctx.level); }
  });
})();
