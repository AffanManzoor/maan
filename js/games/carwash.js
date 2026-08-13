/* ============================================================
   SuperKids — Car Wash
   Hosted by Ziggy the Lion. Subject: creative (not graded).
   Tap the dirt to clean the car, then paint it your favorite color.
   ============================================================ */
(function () {
  'use strict';

  const SPOTS = [
    { leftPct: 18, topPct: 58, size: 44, rot: -15 },
    { leftPct: 36, topPct: 54, size: 38, rot: 20 },
    { leftPct: 82, topPct: 58, size: 42, rot: 10 },
    { leftPct: 54, topPct: 56, size: 36, rot: -25 },
    { leftPct: 50, topPct: 23, size: 34, rot: 15 },
    { leftPct: 21, topPct: 72, size: 40, rot: -10 },
    { leftPct: 79, topPct: 72, size: 40, rot: 18 },
    { leftPct: 61, topPct: 60, size: 36, rot: -8 }
  ];
  const PAINT_COLORS = [
    { label: 'Red', value: '#FF5A5F' }, { label: 'Blue', value: '#4EA8FF' }, { label: 'Yellow', value: '#FFC93C' },
    { label: 'Green', value: '#2FD8A0' }, { label: 'Purple', value: '#9B6BFF' }, { label: 'Orange', value: '#FF9D45' }, { label: 'Pink', value: '#FF8FB1' }
  ];

  function carSVG(color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 180" role="img" aria-label="Your car" class="wash-car">
      <ellipse cx="140" cy="172" rx="118" ry="9" fill="#000" opacity="0.08"/>
      <path d="M70 90 Q90 40 140 40 Q190 40 210 90 Z" fill="${color}"/>
      <rect x="20" y="90" width="240" height="52" rx="22" fill="${color}"/>
      <path d="M80 88 Q94 50 138 48 L136 88 Z" fill="#BFE4FF"/>
      <path d="M142 48 Q186 50 200 88 L144 88 Z" fill="#BFE4FF"/>
      <rect x="137" y="46" width="6" height="42" fill="#2B2145"/>
      <circle cx="108" cy="68" r="5" fill="#2B2145"/><circle cx="106" cy="66" r="1.6" fill="#fff"/>
      <circle cx="172" cy="68" r="5" fill="#2B2145"/><circle cx="170" cy="66" r="1.6" fill="#fff"/>
      <rect x="18" y="122" width="244" height="14" rx="7" fill="#2B2145" opacity="0.85"/>
      <circle cx="252" cy="110" r="8" fill="#FFE58A"/>
      <circle cx="28" cy="110" r="6" fill="#FF6F7D"/>
      <path d="M112 112 Q140 122 168 112" stroke="#2B2145" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.7"/>
      <circle cx="78" cy="152" r="25" fill="#2B2145"/><circle cx="78" cy="152" r="11" fill="#D9D9E2"/>
      <circle cx="202" cy="152" r="25" fill="#2B2145"/><circle cx="202" cy="152" r="11" fill="#D9D9E2"/>
    </svg>`;
  }

  function blobSVG(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="18" cy="20" r="14" fill="#8B6B4A"/>
      <circle cx="28" cy="14" r="9" fill="#8B6B4A"/>
      <circle cx="10" cy="12" r="8" fill="#9C7C5A"/>
      <circle cx="24" cy="26" r="7" fill="#7A5A3A"/>
    </svg>`;
  }

  function mountWash(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    let spots, remaining, carColor;

    function startRound() {
      carColor = '#B7B7C2';
      const n = level === 1 ? 5 : (level === 2 ? 7 : 8);
      spots = SPOTS.slice(0, n).map((s, i) => Object.assign({ id: 'd' + i + '_' + SK.uid(), cleaned: false }, s));
      remaining = spots.length;
      shell.setDots(0, remaining);

      shell.stage.innerHTML = `
        <p class="wash-instructions">Tap the dirt to wash the car clean!</p>
        <p class="wash-progress" id="washProgress"></p>
        <div class="wash-stage" id="washStage"><div class="wash-shine" id="washShine"></div></div>
        <div id="washPaintSection"></div>`;

      renderCar();
      const stageEl = shell.stage.querySelector('#washStage');
      spots.forEach((s) => {
        const el = document.createElement('div');
        el.className = 'dirt-blob';
        el.id = s.id;
        el.style.left = s.leftPct + '%';
        el.style.top = s.topPct + '%';
        el.style.width = s.size + 'px';
        el.style.height = s.size + 'px';
        el.style.transform = `translate(-50%,-50%) rotate(${s.rot}deg)`;
        el.innerHTML = blobSVG(s.size);
        el.addEventListener('click', () => cleanSpot(s, el));
        stageEl.appendChild(el);
      });
      updateProgress();
    }

    function renderCar() {
      const stageEl = shell.stage.querySelector('#washStage');
      let wrap = stageEl.querySelector('.wash-car-svg');
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'wash-car-svg'; stageEl.insertBefore(wrap, stageEl.firstChild); }
      wrap.innerHTML = carSVG(carColor);
    }

    function updateProgress() {
      const done = spots.filter((s) => s.cleaned).length;
      shell.stage.querySelector('#washProgress').textContent = `${done} / ${spots.length} clean`;
    }

    function cleanSpot(s, el) {
      if (s.cleaned) return;
      s.cleaned = true;
      SKAudio.play('place');
      SKPlay.confettiFromEl(el, { count: 10, power: 6, colors: ['#9ED3FF', '#BFE4FF', '#ffffff'] });
      el.classList.add('cleaned');
      remaining--;
      updateProgress();
      shell.setDots(spots.length - remaining, spots.length);
      if (remaining <= 0) setTimeout(finishWashing, 450);
    }

    function finishWashing() {
      shell.stage.querySelector('#washShine').classList.add('on');
      SKAudio.play('correct');
      SKPlay.confettiFromEl(shell.stage.querySelector('#washStage'), { count: 40, power: 11 });
      shell.cheer();
      shell.stage.querySelector('.wash-instructions').textContent = 'All clean! Now pick a color to paint it!';
      renderPaintPicker();
    }

    function renderPaintPicker() {
      const section = shell.stage.querySelector('#washPaintSection');
      section.innerHTML = `<p class="wash-paint-prompt">🎨 Paint your car!</p>
        <div class="cust-categories"><div class="cust-row"><div class="cust-row-label">Paint Color</div><div class="cust-swatches" id="washSwatches"></div></div></div>
        <button class="btn btn-xl btn-mint wash-done" type="button">All Done! ✨</button>`;
      const sw = section.querySelector('#washSwatches');
      PAINT_COLORS.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cust-swatch' + (carColor === c.value ? ' active' : '');
        btn.title = c.label;
        btn.innerHTML = `<span class="cust-swatch-color" style="background:${c.value}"></span>`;
        btn.addEventListener('click', () => {
          carColor = c.value;
          SKAudio.play('pop');
          renderCar();
          sw.querySelectorAll('.cust-swatch').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
        });
        sw.appendChild(btn);
      });
      section.querySelector('.wash-done').addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.celebrate(root, gameDef, level, spots.length, spots.length, { onReplay: startRound });
      });
    }

    startRound();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'carwash',
    title: 'Car Wash',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'ziggy',
    color: 'mint',
    icon: '🚗',
    blurb: 'Scrub away the mud, then paint your car any color!',
    mount(root, ctx) { return mountWash(root, this, ctx.level); }
  });
})();
