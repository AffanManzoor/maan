/* ============================================================
   SuperKids — Memory Match
   Hosted by Luna the Owl. Subject: letters.
   Classic flip-card pairs; Super level mixes in Aa/Bb letters.
   ============================================================ */
(function () {
  'use strict';
  const EMOJI_BANK = ['🐶', '🐱', '🐰', '🦁', '🐸', '🐼', '🦊', '🐨', '🍎', '🍌', '🍓', '🍉', '⚽', '🎈', '🚗', '🚀', '🌈', '⭐', '🌸', '🎵', '🧸', '🍪'];

  function buildRound(level) {
    let pairCount, cols;
    if (level === 1) { pairCount = 3; cols = 3; }
    else if (level === 2) { pairCount = 6; cols = 4; }
    else { pairCount = 8; cols = 4; }

    let faces;
    if (level === 3 && Math.random() < 0.6) {
      const letters = SK.pickN('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), pairCount);
      faces = letters.map((l) => ({ a: { t: l, cls: 'card-letter' }, b: { t: l.toLowerCase(), cls: 'card-letter' } }));
    } else {
      const chosen = SK.pickN(EMOJI_BANK, pairCount);
      faces = chosen.map((e) => ({ a: { t: e, cls: 'card-emoji' }, b: { t: e, cls: 'card-emoji' } }));
    }
    let cards = [];
    faces.forEach((f, i) => {
      cards.push({ id: 'c' + i + 'a_' + SK.uid(), pair: i, t: f.a.t, cls: f.a.cls });
      cards.push({ id: 'c' + i + 'b_' + SK.uid(), pair: i, t: f.b.t, cls: f.b.cls });
    });
    cards = SK.shuffle(cards);
    return { pairCount, cols, cards };
  }

  function mountMemory(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    shell.stage.innerHTML = `<p class="sort-instructions">Flip two cards to find a matching pair!</p><div class="mem-grid" id="memGrid"></div>`;
    const gridEl = shell.stage.querySelector('#memGrid');

    let data, pairsFound, attempts, flipped, busy;

    function startRound() {
      data = buildRound(level);
      pairsFound = 0; attempts = 0; flipped = []; busy = false;
      shell.setDots(0, data.pairCount);
      gridEl.style.gridTemplateColumns = `repeat(${data.cols}, 1fr)`;
      gridEl.innerHTML = data.cards.map((c) => `
        <button type="button" class="mem-card" id="${c.id}" data-pair="${c.pair}">
          <span class="mem-inner">
            <span class="mem-back"></span>
            <span class="mem-front ${c.cls}">${c.t}</span>
          </span>
        </button>`).join('');
      gridEl.querySelectorAll('.mem-card').forEach((card) => card.addEventListener('click', () => onFlip(card)));
    }

    function onFlip(card) {
      if (busy || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      SKAudio.play('flip');
      card.classList.add('flipped');
      flipped.push(card);
      if (flipped.length === 2) {
        busy = true;
        attempts++;
        const [c1, c2] = flipped;
        const isMatch = c1.dataset.pair === c2.dataset.pair;
        if (isMatch) {
          setTimeout(() => {
            c1.classList.add('matched'); c2.classList.add('matched');
            SKAudio.play('correct'); shell.cheer();
            SKPlay.confettiFromEl(c2, { count: 16, power: 7 });
            pairsFound++;
            shell.setDots(pairsFound, data.pairCount);
            flipped = []; busy = false;
            if (pairsFound >= data.pairCount) setTimeout(finish, 500);
          }, 350);
        } else {
          shell.oops();
          setTimeout(() => { c1.classList.add('shake-no'); c2.classList.add('shake-no'); SKAudio.play('wrong'); }, 250);
          setTimeout(() => {
            c1.classList.remove('flipped', 'shake-no'); c2.classList.remove('flipped', 'shake-no');
            flipped = []; busy = false;
          }, 950);
        }
      }
    }

    function finish() {
      const attemptsFinal = Math.max(attempts, data.pairCount);
      SKPlay.celebrate(root, gameDef, level, data.pairCount, attemptsFinal, { onReplay: startRound });
    }

    startRound();
    return { destroy() {} };
  }

  registerGame({
    id: 'memory',
    title: 'Memory Match',
    subject: 'letters',
    subjectLabel: 'Memory',
    buddy: 'luna',
    color: 'coral',
    icon: '🧠',
    blurb: 'Flip cards and find the matching pairs!',
    mount(root, ctx) { return mountMemory(root, this, ctx.level); }
  });
})();
