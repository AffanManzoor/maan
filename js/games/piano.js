/* ============================================================
   SuperKids — Piano Pals
   Hosted by Pip. Rainbow piano keys — free-play at Level 1,
   simple echo-me sequences at Levels 2 and 3. Creative mode:
   always awards 3 stars once the child has "played the song".
   ============================================================ */
(function () {
  'use strict';

  const NOTES = [
    { name: 'C', freq: 261.63, color: '#FF6F7D', label: 'do' },
    { name: 'D', freq: 293.66, color: '#FF9D45', label: 're' },
    { name: 'E', freq: 329.63, color: '#FFC93C', label: 'mi' },
    { name: 'F', freq: 349.23, color: '#3DDC97', label: 'fa' },
    { name: 'G', freq: 392.00, color: '#4EA8FF', label: 'sol' },
    { name: 'A', freq: 440.00, color: '#9B6BFF', label: 'la' },
    { name: 'B', freq: 493.88, color: '#FF8FB1', label: 'ti' }
  ];

  // Simple tunes for higher levels (indices into NOTES)
  const TUNES = {
    2: [
      [0, 0, 4, 4, 5, 5, 4],       // Twinkle Twinkle (opening)
      [2, 1, 0, 1, 2, 2, 2]        // Mary had a little lamb
    ],
    3: [
      [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0],  // full Twinkle
      [4, 4, 4, 2, 4, 5, 5, 5, 2, 5, 4]            // Wheels on the bus fragment
    ]
  };

  function playNote(freq, dur) {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = SKAudio._ctx || (SKAudio._ctx = new AC());
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  function mountPiano(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const tune = level === 1 ? null : TUNES[level][Math.floor(Math.random() * TUNES[level].length)];
    let progressIdx = 0;
    let playedCount = 0;
    const FREEPLAY_GOAL = 8;
    const goal = tune ? tune.length : FREEPLAY_GOAL;

    const instrHTML = tune
      ? `Listen, then tap the same keys back — one note at a time!`
      : `Tap the colorful keys to make a song! Play any notes you like.`;
    shell.stage.innerHTML = `
      <p class="pn-instructions">${instrHTML}</p>
      ${tune ? `<button class="btn btn-sm btn-sky pn-listen" type="button">🔊 Listen again</button>` : ''}
      <div class="pn-piano" id="pnPiano"></div>
      <button class="btn btn-xl btn-coral cust-done pn-done" type="button" ${tune ? 'disabled' : ''}>${tune ? '⭐ Song complete!' : '🎵 All done!'}</button>`;
    const piano = shell.stage.querySelector('#pnPiano');
    shell.setDots(0, goal);

    NOTES.forEach((n, i) => {
      const key = document.createElement('button');
      key.type = 'button'; key.className = 'pn-key'; key.dataset.i = i;
      key.style.setProperty('--kcol', n.color);
      key.innerHTML = `<span class="pn-lbl">${n.label}</span>`;
      key.addEventListener('click', () => {
        playNote(n.freq, 0.45);
        key.classList.add('press');
        setTimeout(() => key.classList.remove('press'), 220);
        if (tune) {
          if (i === tune[progressIdx]) {
            progressIdx++;
            shell.setDots(progressIdx, goal);
            SKAudio.play('flip');
            if (progressIdx >= tune.length) {
              shell.stage.querySelector('.pn-done').disabled = false;
              shell.cheer();
            }
          } else {
            // gentle: replay the note they were meant to play
            shell.oops && shell.oops();
            setTimeout(() => playNote(NOTES[tune[progressIdx]].freq, 0.4), 300);
          }
        } else {
          playedCount = Math.min(FREEPLAY_GOAL, playedCount + 1);
          shell.setDots(playedCount, FREEPLAY_GOAL);
          if (playedCount >= FREEPLAY_GOAL) shell.stage.querySelector('.pn-done').disabled = false;
        }
      });
      piano.appendChild(key);
    });

    if (tune) {
      const playTune = () => {
        piano.querySelectorAll('.pn-key').forEach((k) => k.classList.add('listening'));
        tune.forEach((idx, k) => {
          setTimeout(() => {
            playNote(NOTES[idx].freq, 0.42);
            const el = piano.querySelector(`.pn-key[data-i="${idx}"]`);
            if (el) { el.classList.add('press'); setTimeout(() => el.classList.remove('press'), 220); }
            if (k === tune.length - 1) piano.querySelectorAll('.pn-key').forEach((kk) => kk.classList.remove('listening'));
          }, k * 500);
        });
      };
      shell.stage.querySelector('.pn-listen').addEventListener('click', playTune);
      setTimeout(playTune, 400);
    }

    shell.stage.querySelector('.pn-done').addEventListener('click', () => {
      SKAudio.play('star');
      SKPlay.celebrate(root, gameDef, level, 3, 3, {
        onReplay: () => { location.hash = '#/game/' + gameDef.id; }
      });
    });

    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'piano',
    title: 'Piano Pals',
    subject: 'creative',
    subjectLabel: 'Music',
    buddy: 'pip',
    color: 'sun',
    icon: '🎹',
    blurb: 'Tap the rainbow keys to play your very own song!',
    mount(root, ctx) { return mountPiano(root, this, ctx.level); }
  });
})();
