/* ============================================================
   Bloom Zoo — Drum Kit (Plus)
   Hosted by Ziggy. A little kit — snare, kick, tom, high-hat,
   crash — that plays a real drum tone on each tap. Kid-safe:
   no wrong notes, no goal — press "That was a groove!" when
   you're done playing.
   ============================================================ */
(function () {
  'use strict';

  // Each drum: { id, label, hint, kind: 'membrane'|'metal', tone: Hz }
  const DRUMS = [
    { id: 'kick',  label: 'Kick',   hint: '🥁',  kind: 'membrane', tone: 65,  color: '#FF6F7D', size: 130 },
    { id: 'snare', label: 'Snare',  hint: '🪘',  kind: 'membrane', tone: 220, color: '#FFC93C', size: 100 },
    { id: 'tom',   label: 'Tom',    hint: '🎵',  kind: 'membrane', tone: 140, color: '#4EA8FF', size: 108 },
    { id: 'hihat', label: 'Hi-Hat', hint: '✨',  kind: 'metal',    tone: 900, color: '#B7C4D6', size: 84  },
    { id: 'crash', label: 'Crash',  hint: '💥',  kind: 'metal',    tone: 1400,color: '#F4C1D0', size: 116 }
  ];
  const MIN_HITS = 8;

  function playDrumTone(drum) {
    try {
      const audio = SKAudio.getContext ? SKAudio.getContext() : null;
      if (audio && drum.kind === 'membrane') {
        // a soft thump — sine drop + short envelope
        const o = audio.createOscillator();
        const g = audio.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(drum.tone * 3, audio.currentTime);
        o.frequency.exponentialRampToValueAtTime(drum.tone, audio.currentTime + 0.09);
        g.gain.setValueAtTime(0.001, audio.currentTime);
        g.gain.exponentialRampToValueAtTime(0.5, audio.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.32);
        o.connect(g).connect(audio.destination);
        o.start(); o.stop(audio.currentTime + 0.35);
        return;
      }
      if (audio && drum.kind === 'metal') {
        // a shimmery cymbal — filtered noise burst
        const dur = drum.id === 'crash' ? 0.55 : 0.18;
        const buf = audio.createBuffer(1, audio.sampleRate * dur, audio.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
        const src = audio.createBufferSource(); src.buffer = buf;
        const hp = audio.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = drum.tone;
        const g = audio.createGain(); g.gain.value = 0.28;
        src.connect(hp).connect(g).connect(audio.destination);
        src.start();
        return;
      }
    } catch (e) { /* fall through to shared click */ }
    SKAudio.play('click');
  }

  function drumSVG(drum) {
    const s = drum.size;
    const cx = s / 2, cy = s / 2 + 6;
    if (drum.kind === 'metal') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s + 20}" role="img" aria-label="${drum.label}">
        <ellipse cx="${cx}" cy="${cy + s / 3}" rx="${s / 2 - 6}" ry="6" fill="rgba(0,0,0,.2)"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${s / 2 - 4}" ry="${s / 6}" fill="${drum.color}" stroke="#5C6473" stroke-width="2"/>
        <ellipse cx="${cx}" cy="${cy - 4}" rx="${s / 2 - 10}" ry="${s / 8}" fill="rgba(255,255,255,.35)"/>
        <line x1="${cx}" y1="${cy + s / 8}" x2="${cx}" y2="${cy + s / 3}" stroke="#5C6473" stroke-width="3"/>
      </svg>`;
    }
    // membrane drum: cylinder + top head
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s + 20}" role="img" aria-label="${drum.label}">
      <ellipse cx="${cx}" cy="${cy + s / 2 + 4}" rx="${s / 2 - 4}" ry="8" fill="rgba(0,0,0,.2)"/>
      <rect x="8" y="${cy}" width="${s - 16}" height="${s / 2}" fill="${drum.color}" stroke="#2A2438" stroke-width="2"/>
      <rect x="8" y="${cy}" width="${s - 16}" height="6" fill="#F4E3C6"/>
      <rect x="8" y="${cy + s / 2 - 6}" width="${s - 16}" height="6" fill="#F4E3C6"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${s / 2 - 8}" ry="${s / 5}" fill="#F4E3C6" stroke="#2A2438" stroke-width="2"/>
      <ellipse cx="${cx - 8}" cy="${cy - 4}" rx="${s / 6}" ry="${s / 14}" fill="rgba(255,255,255,.5)"/>
    </svg>`;
  }

  function mountDrumKit(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    let hits = 0;

    function render() {
      shell.stage.innerHTML = `
        <p class="pz-instructions">Tap the drums to play a beat — every one makes a different sound!</p>
        <div class="dk-kit" id="dkKit"></div>
        <div class="fg-count" id="dkCount">Beats: 0</div>
        <button class="btn btn-xl btn-coral cust-done dk-done" type="button" disabled>🥁 That was a groove!</button>`;
      shell.setDots(0, MIN_HITS);
      const kit = shell.stage.querySelector('#dkKit');
      const countEl = shell.stage.querySelector('#dkCount');
      const doneBtn = shell.stage.querySelector('.dk-done');

      DRUMS.forEach((d) => {
        const el = document.createElement('button');
        el.type = 'button'; el.className = 'dk-drum dk-' + d.id;
        el.innerHTML = drumSVG(d) + `<div class="dk-label">${d.hint} ${d.label}</div>`;
        el.addEventListener('click', () => {
          el.classList.add('hit');
          setTimeout(() => el.classList.remove('hit'), 220);
          playDrumTone(d);
          hits++;
          countEl.textContent = `Beats: ${hits}`;
          shell.setDots(Math.min(hits, MIN_HITS), MIN_HITS);
          if (hits >= MIN_HITS) doneBtn.disabled = false;
        });
        kit.appendChild(el);
      });

      doneBtn.addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.celebrate(root, gameDef, level, 3, 3, { onReplay: () => { hits = 0; render(); } });
      });
    }
    render();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'drumkit',
    title: 'Drum Kit',
    subject: 'creative',
    subjectLabel: 'Music',
    buddy: 'ziggy',
    color: 'coral',
    icon: '🥁',
    blurb: 'Tap the drums to make your very own groove — no wrong notes!',
    premium: true,
    mount(root, ctx) { return mountDrumKit(root, this, ctx.level); }
  });
})();
