/* ============================================================
   Bloom Zoo — Little Story (Free — reading)
   Hosted by Luna. A one-page 20-word story with tappable words.
   Tap any word to hear it. Tap "Read to me" for the whole story.
   Tap "I read it!" to celebrate.
   ============================================================ */
(function () {
  'use strict';

  // Exactly 20 words. Simple CVC-heavy vocabulary with recurring
  // words (a, the, hat, pig, cow, bee) so early readers can meet the
  // same words twice on one page.
  //
  //   A pig has a big red hat.  (7)
  //   A cow sees the hat.        (5)
  //   A bee sits on top of it!   (8)
  //                               = 20
  const STORY = [
    ['A', 'pig', 'has', 'a', 'big', 'red', 'hat.'],
    ['A', 'cow', 'sees', 'the', 'hat.'],
    ['A', 'bee', 'sits', 'on', 'top', 'of', 'it!']
  ];

  // Small emoji cues to sprinkle into the illustration.
  const SCENE = {
    pig: '🐷', cow: '🐄', bee: '🐝', hat: '🎩'
  };

  function mountLittleStory(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    // 3 progress dots — one for each line read.
    shell.setDots(0, 3);
    let readAloud = false;
    let read = 0;
    let doneTimer = null;

    // Build story markup — every word becomes a tappable span whose text
    // is spoken on tap. Punctuation stays glued to its word.
    const lines = STORY.map((line, li) => {
      const words = line.map((tok, wi) => {
        const speakable = tok.replace(/[.!,?]/g, '');
        return `<button class="ls-word" data-line="${li}" data-word="${speakable}" type="button">${tok}</button>`;
      }).join(' ');
      return `<p class="ls-line" data-line="${li}">${words}</p>`;
    }).join('');

    shell.stage.innerHTML = `
      <div class="ls-book">
        <div class="ls-cover">
          <span class="ls-emoji ls-e-pig">🐷</span>
          <span class="ls-emoji ls-e-hat">🎩</span>
          <span class="ls-emoji ls-e-cow">🐄</span>
          <span class="ls-emoji ls-e-bee">🐝</span>
        </div>
        <div class="ls-page">
          <h2 class="ls-title">The Pig's Red Hat</h2>
          ${lines}
          <p class="ls-hint">Tap any word to hear it. When you're done, tap <b>I read it!</b></p>
        </div>
        <div class="ls-actions">
          <button class="btn btn-xl btn-ghost ls-read" type="button">🔊 Read to me</button>
          <button class="btn btn-xl btn-sun ls-done" type="button">📖 I read it!</button>
        </div>
      </div>`;

    // Tap-to-speak each word
    shell.stage.querySelectorAll('.ls-word').forEach((w) => {
      w.addEventListener('click', () => {
        SKAudio.speak(w.dataset.word);
        w.classList.add('read');
        setTimeout(() => w.classList.remove('read'), 500);
      });
    });

    // Read the whole story aloud line by line, highlighting each line
    // as it's spoken. Progress dots tick to 1/3, 2/3, 3/3.
    shell.stage.querySelector('.ls-read').addEventListener('click', () => {
      if (readAloud) return;
      readAloud = true;
      SKAudio.play('click');
      read = 0;
      shell.setDots(0, 3);
      const lineEls = shell.stage.querySelectorAll('.ls-line');
      const readLine = (i) => {
        if (i >= STORY.length) {
          readAloud = false;
          shell.setDots(3, 3);
          shell.cheer();
          return;
        }
        lineEls.forEach((el) => el.classList.remove('reading'));
        lineEls[i].classList.add('reading');
        SKAudio.speak(STORY[i].map(w => w.replace(/[.!,?]/g, '')).join(' '));
        // Estimated 400ms per word — enough to let the utterance finish
        const dwell = 400 * STORY[i].length + 300;
        doneTimer = setTimeout(() => {
          shell.setDots(i + 1, 3);
          readLine(i + 1);
        }, dwell);
      };
      readLine(0);
    });

    shell.stage.querySelector('.ls-done').addEventListener('click', () => {
      SKAudio.play('star');
      SKPlay.confettiFromEl(shell.stage.querySelector('.ls-book'), { count: 32 });
      SKPlay.celebrate(root, gameDef, level, 3, 3, {
        onReplay: () => { location.hash = '#/game/' + gameDef.id; }
      });
    });

    return { destroy() { if (doneTimer) clearTimeout(doneTimer); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'littlestory',
    title: 'Little Story',
    subject: 'letters',
    subjectLabel: 'Reading',
    buddy: 'luna',
    color: 'mint',
    icon: '📖',
    blurb: 'Read a tiny 20-word story — tap any word to hear it out loud!',
    mount(root, ctx) { return mountLittleStory(root, this, ctx.level); }
  });
})();
