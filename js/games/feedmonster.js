/* ============================================================
   SuperKids — Feed the Monster
   Hosted by Ziggy. A cheerful monster asks for a specific color
   of food; drag the matching food to its mouth. Kid-safe: wrong
   food gets a giggle + gentle "try again", never a penalty.
   ============================================================ */
(function () {
  'use strict';

  const COLORS = [
    { key: 'red', label: 'red', hex: '#FF6F7D' },
    { key: 'blue', label: 'blue', hex: '#4EA8FF' },
    { key: 'yellow', label: 'yellow', hex: '#FFC93C' },
    { key: 'green', label: 'green', hex: '#3DDC97' },
    { key: 'purple', label: 'purple', hex: '#9B6BFF' },
    { key: 'orange', label: 'orange', hex: '#FF9D45' }
  ];
  const FOODS = [
    { icon: '🍎', color: 'red' }, { icon: '🍓', color: 'red' }, { icon: '🍒', color: 'red' },
    { icon: '🫐', color: 'blue' }, { icon: '🧊', color: 'blue' },
    { icon: '🍌', color: 'yellow' }, { icon: '🍋', color: 'yellow' }, { icon: '🌽', color: 'yellow' },
    { icon: '🥝', color: 'green' }, { icon: '🥒', color: 'green' }, { icon: '🥬', color: 'green' },
    { icon: '🍇', color: 'purple' }, { icon: '🍆', color: 'purple' },
    { icon: '🥕', color: 'orange' }, { icon: '🍑', color: 'orange' }, { icon: '🎃', color: 'orange' }
  ];

  const CFG = {
    1: { rounds: 4, choices: 3 },
    2: { rounds: 6, choices: 4 },
    3: { rounds: 8, choices: 6 }
  };

  function monsterSVG(color, mouthOpen) {
    const mouth = mouthOpen
      ? `<ellipse cx="100" cy="128" rx="34" ry="24" fill="#2B2145"/><path d="M74 128 Q100 108 126 128 L120 130 L108 118 L100 130 L92 118 L80 130 Z" fill="#fff"/>`
      : `<path d="M72 130 Q100 148 128 130" stroke="#2B2145" stroke-width="6" stroke-linecap="round" fill="none"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" role="img" aria-label="Hungry monster">
      <ellipse cx="100" cy="210" rx="70" ry="8" fill="#000" opacity=".15"/>
      <path d="M40 90 Q40 30 100 30 Q160 30 160 90 L160 170 Q100 210 40 170 Z" fill="${color}"/>
      <circle cx="46" cy="70" r="10" fill="${color}"/><circle cx="154" cy="70" r="10" fill="${color}"/>
      <circle cx="46" cy="70" r="4" fill="#2B2145"/><circle cx="154" cy="70" r="4" fill="#2B2145"/>
      <circle cx="76" cy="86" r="16" fill="#fff"/><circle cx="124" cy="86" r="16" fill="#fff"/>
      <circle cx="80" cy="90" r="8" fill="#2B2145"/><circle cx="128" cy="90" r="8" fill="#2B2145"/>
      <circle cx="82" cy="88" r="2" fill="#fff"/><circle cx="130" cy="88" r="2" fill="#fff"/>
      ${mouth}
      <path d="M74 176 Q100 182 126 176" stroke="rgba(0,0,0,.15)" stroke-width="2" fill="none"/>
    </svg>`;
  }

  function mountFM(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let round = 0, correct = 0, targetColor;
    let mouthOpen = false;

    shell.stage.innerHTML = `
      <div class="fm-header">
        <div class="fm-monster" id="fmMonster"></div>
        <p class="fm-request" id="fmRequest"></p>
        <button class="spk-btn fm-speak" type="button" aria-label="Read aloud">🔊</button>
      </div>
      <div class="fm-tray" id="fmTray"></div>`;
    const monsterHost = shell.stage.querySelector('#fmMonster');
    const requestEl = shell.stage.querySelector('#fmRequest');
    const tray = shell.stage.querySelector('#fmTray');
    shell.setDots(0, cfg.rounds);

    function drawMonster() {
      monsterHost.innerHTML = monsterSVG(targetColor.hex, mouthOpen);
    }
    function nextRound() {
      if (round >= cfg.rounds) {
        setTimeout(() => {
          SKPlay.celebrate(root, gameDef, level, cfg.rounds, cfg.rounds, {
            onReplay: () => { location.hash = '#/game/' + gameDef.id; }
          });
        }, 400);
        return;
      }
      targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const req = `I want a ${targetColor.label} snack, please!`;
      requestEl.textContent = req;
      SKAudio.speak(req);
      drawMonster();
      // pick foods: one guaranteed matching, rest random other colors
      const others = FOODS.filter((f) => f.color !== targetColor.key);
      const matches = FOODS.filter((f) => f.color === targetColor.key);
      const picks = [matches[Math.floor(Math.random() * matches.length)]];
      while (picks.length < cfg.choices) {
        const cand = others[Math.floor(Math.random() * others.length)];
        if (!picks.includes(cand)) picks.push(cand);
      }
      // shuffle
      for (let i = picks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [picks[i], picks[j]] = [picks[j], picks[i]];
      }
      tray.innerHTML = '';
      picks.forEach((food) => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'fm-food'; btn.textContent = food.icon;
        btn.addEventListener('click', () => {
          if (food.color === targetColor.key) {
            correct++; round++;
            mouthOpen = true; drawMonster();
            SKAudio.play('correct'); shell.cheer();
            shell.setDots(round, cfg.rounds);
            SKPlay.confettiFromEl(monsterHost, { count: 14, power: 7 });
            btn.classList.add('gone');
            setTimeout(() => { mouthOpen = false; drawMonster(); nextRound(); }, 900);
          } else {
            SKAudio.play('wrong'); shell.oops && shell.oops();
            btn.classList.add('shake');
            setTimeout(() => btn.classList.remove('shake'), 400);
          }
        });
        tray.appendChild(btn);
      });
    }
    shell.stage.querySelector('.fm-speak').addEventListener('click', () => SKAudio.speak(requestEl.textContent));
    nextRound();

    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'feedmonster',
    title: 'Feed the Monster',
    subject: 'creative',
    subjectLabel: 'Colors',
    buddy: 'ziggy',
    color: 'coral',
    icon: '👾',
    blurb: 'Give the friendly monster the color of snack it asks for!',
    mount(root, ctx) { return mountFM(root, this, ctx.level); }
  });
})();
