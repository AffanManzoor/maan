/* ============================================================
   SuperKids — characters.js
   Four mascots built as layered, namespaced inline SVG so CSS
   can animate individual limbs (wave / cheer / wiggle / oops).
   No image assets — fully vector, crisp at any size.
   ============================================================ */
(function (global) {
  'use strict';

  const CHARACTERS = [
    {
      id: 'ziggy', name: 'Ziggy', species: 'Lion', role: 'Math Hero', subject: 'math',
      emoji: '🦁', theme: 'sun',
      colors: { base: '#FF9D45', dark: '#E8792A', light: '#FFD08A', belly: '#FFF3DC' },
      blurb: 'Ziggy loves counting stars and cracking number puzzles!',
      catchphrase: "Let's count together!"
    },
    {
      id: 'luna', name: 'Luna', species: 'Owl', role: 'Word Wizard', subject: 'letters',
      emoji: '🦉', theme: 'grape',
      colors: { base: '#9B6BFF', dark: '#7B4FE0', light: '#C9B3FF', belly: '#F3EEFF' },
      blurb: 'Luna hoots for letters, sounds and bedtime stories.',
      catchphrase: 'Ooh, I love words!'
    },
    {
      id: 'pip', name: 'Pip', species: 'Fox', role: 'Puzzle Master', subject: 'puzzle',
      emoji: '🦊', theme: 'coral',
      colors: { base: '#FF6F61', dark: '#E5503F', light: '#FFB3A6', belly: '#FFEDE9' },
      blurb: 'Pip is clever and quick — puzzles are Pip’s favorite!',
      catchphrase: 'Puzzle time, yay!'
    },
    {
      id: 'bolt', name: 'Bolt', species: 'Robot', role: 'Shape Star', subject: 'shapes',
      emoji: '🤖', theme: 'mint',
      colors: { base: '#2FD8A0', dark: '#1CAE80', light: '#9CF0D4', belly: '#E8FFF6' },
      blurb: 'Bolt beeps with joy for shapes, colors and patterns.',
      catchphrase: 'Beep boop, let’s play!'
    }
  ];

  function byId(id) { return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0]; }

  /* ---------- shared piece builders ---------- */
  function defsFor(inst, c) {
    return `<defs>
      <linearGradient id="bg-${inst}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c.colors.light}"/>
        <stop offset="1" stop-color="${c.colors.base}"/>
      </linearGradient>
      <radialGradient id="hg-${inst}" cx="35%" cy="28%" r="78%">
        <stop offset="0" stop-color="${c.colors.light}"/>
        <stop offset="55%" stop-color="${c.colors.base}"/>
        <stop offset="100%" stop-color="${c.colors.dark}"/>
      </radialGradient>
      <filter id="ds-${inst}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1B1140" flood-opacity="0.22"/>
      </filter>
    </defs>`;
  }

  function legsOval(c) {
    return `<g class="sk-legs">
      <ellipse class="sk-leg sk-leg-l" cx="76" cy="206" rx="17" ry="13" fill="${c.colors.dark}"/>
      <ellipse class="sk-leg sk-leg-r" cx="124" cy="206" rx="17" ry="13" fill="${c.colors.dark}"/>
    </g>`;
  }
  function legsBlock(c) {
    return `<g class="sk-legs">
      <rect class="sk-leg sk-leg-l" x="67" y="196" width="22" height="24" rx="9" fill="${c.colors.dark}"/>
      <rect class="sk-leg sk-leg-r" x="111" y="196" width="22" height="24" rx="9" fill="${c.colors.dark}"/>
    </g>`;
  }

  function armsCapsule(c) {
    return `<g class="sk-arm sk-arm-l"><rect x="37" y="136" width="26" height="60" rx="13" fill="${c.colors.base}"/></g>
            <g class="sk-arm sk-arm-r"><rect x="137" y="136" width="26" height="60" rx="13" fill="${c.colors.base}"/></g>`;
  }
  function armsRobot(c) {
    const one = (x) => `<rect x="${x}" y="136" width="26" height="58" rx="10" fill="${c.colors.base}"/><circle cx="${x + 13}" cy="140" r="7" fill="${c.colors.dark}"/>`;
    return `<g class="sk-arm sk-arm-l">${one(37)}</g><g class="sk-arm sk-arm-r">${one(137)}</g>`;
  }

  function torso(inst, c) {
    return `<ellipse cx="100" cy="165" rx="47" ry="41" fill="url(#bg-${inst})"/>
            <ellipse cx="100" cy="177" rx="27" ry="22" fill="${c.colors.belly}" opacity="0.92"/>`;
  }

  function headCircle(inst) { return `<circle cx="100" cy="80" r="63" fill="url(#hg-${inst})"/>`; }
  function headSquare(inst) { return `<rect x="40" y="24" width="120" height="104" rx="34" fill="url(#hg-${inst})"/>`; }

  function eyesStd(cy) {
    cy = cy || 83;
    return `<g class="sk-eyes">
      <g><ellipse cx="79" cy="${cy}" rx="16" ry="19" fill="#fff"/><circle cx="80" cy="${cy + 5}" r="7.6" fill="#2B2145"/><circle cx="76" cy="${cy - 3}" r="2.6" fill="#fff"/></g>
      <g><ellipse cx="121" cy="${cy}" rx="16" ry="19" fill="#fff"/><circle cx="122" cy="${cy + 5}" r="7.6" fill="#2B2145"/><circle cx="118" cy="${cy - 3}" r="2.6" fill="#fff"/></g>
    </g>`;
  }
  function blush(cy) {
    cy = cy || 102;
    return `<g class="sk-blush" opacity="0.5">
      <ellipse cx="56" cy="${cy}" rx="11" ry="6.5" fill="#FF88A0"/>
      <ellipse cx="144" cy="${cy}" rx="11" ry="6.5" fill="#FF88A0"/>
    </g>`;
  }
  function smile(cy, w) {
    cy = cy || 109; w = w || 13;
    return `<path class="sk-mouth" d="M ${100 - w} ${cy} Q 100 ${cy + 13} ${100 + w} ${cy}" fill="none" stroke="#2B2145" stroke-width="5" stroke-linecap="round"/>`;
  }

  /* ---------- species builders ---------- */
  function buildZiggy(inst, c) {
    let mane = '';
    const n = 12;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 / n) * i;
      const mx = 100 + Math.cos(a) * 69, my = 78 + Math.sin(a) * 69;
      const rot = (a * 180 / Math.PI) + 90;
      mane += `<ellipse cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" rx="16" ry="12" fill="${i % 2 === 0 ? c.colors.dark : c.colors.base}" transform="rotate(${rot.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)})"/>`;
    }
    return `${defsFor(inst, c)}
      <g class="sk-mane">${mane}</g>
      ${legsOval(c)}
      ${torso(inst, c)}
      <path d="M92 182 L100 172 L108 182 L100 190 Z" fill="${c.colors.light}"/>
      ${armsCapsule(c)}
      ${headCircle(inst)}
      <path d="M100 20 L108 34 L92 34 Z" fill="${c.colors.base}"/>
      <circle cx="65" cy="45" r="15" fill="${c.colors.base}"/><circle cx="65" cy="46" r="7" fill="${c.colors.belly}"/>
      <circle cx="135" cy="45" r="15" fill="${c.colors.base}"/><circle cx="135" cy="46" r="7" fill="${c.colors.belly}"/>
      <ellipse cx="100" cy="100" rx="24" ry="17" fill="${c.colors.belly}"/>
      ${eyesStd(84)}
      ${blush(103)}
      <ellipse cx="100" cy="93" rx="5.4" ry="3.8" fill="#2B2145"/>
      ${smile(111, 13)}`;
  }

  function buildLuna(inst, c) {
    const wing = (side) => {
      const f = side === 'l' ? -1 : 1;
      const cx = 100 + f * 68;
      return `<path d="M ${cx} 148 C ${cx + f * 32} 138 ${cx + f * 36} 190 ${cx + f * 6} 212 C ${cx - f * 10} 196 ${cx - f * 6} 164 ${cx} 148 Z" fill="${c.colors.base}"/>
              <path d="M ${cx} 165 q ${f * 11} 13 0 28" fill="none" stroke="${c.colors.dark}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>`;
    };
    return `${defsFor(inst, c)}
      ${legsOval(c)}
      ${torso(inst, c)}
      <path d="M100 158 l9 14 h-18 z" fill="${c.colors.light}" opacity="0.8"/>
      <g class="sk-arm sk-arm-l" style="transform-box:fill-box;transform-origin:80% 15%;">${wing('l')}</g>
      <g class="sk-arm sk-arm-r" style="transform-box:fill-box;transform-origin:20% 15%;">${wing('r')}</g>
      ${headCircle(inst)}
      <path d="M70 30 L58 6 L83 24 Z" fill="${c.colors.base}"/>
      <path d="M130 30 L142 6 L117 24 Z" fill="${c.colors.base}"/>
      <circle cx="79" cy="83" r="25" fill="#fff"/>
      <circle cx="121" cy="83" r="25" fill="#fff"/>
      <circle cx="79" cy="83" r="25" fill="none" stroke="${c.colors.dark}" stroke-width="5"/>
      <circle cx="121" cy="83" r="25" fill="none" stroke="${c.colors.dark}" stroke-width="5"/>
      <circle cx="80" cy="87" r="8.6" fill="#2B2145"/><circle cx="76" cy="80" r="2.8" fill="#fff"/>
      <circle cx="122" cy="87" r="8.6" fill="#2B2145"/><circle cx="118" cy="80" r="2.8" fill="#fff"/>
      ${blush(107)}
      <path d="M93 97 L107 97 L100 110 Z" fill="#FFB100"/>`;
  }

  function buildPip(inst, c) {
    return `${defsFor(inst, c)}
      <g class="sk-tail" style="transform-box:fill-box;transform-origin:10% 95%;">
        <path d="M136 180 C176 179 198 145 183 106 C209 130 205 175 168 193 C157 199 143 194 136 180 Z" fill="${c.colors.base}"/>
        <circle cx="188" cy="118" r="12" fill="#fff"/>
      </g>
      ${legsOval(c)}
      ${torso(inst, c)}
      ${armsCapsule(c)}
      ${headCircle(inst)}
      <path d="M62 40 L48 0 L89 26 Z" fill="${c.colors.base}"/>
      <path d="M68 33 L60 10 L83 26 Z" fill="${c.colors.light}"/>
      <path d="M138 40 L152 0 L111 26 Z" fill="${c.colors.base}"/>
      <path d="M132 33 L140 10 L117 26 Z" fill="${c.colors.light}"/>
      <ellipse cx="100" cy="101" rx="23" ry="17" fill="#fff"/>
      ${eyesStd(82)}
      ${blush(100)}
      <ellipse cx="100" cy="94" rx="5.6" ry="4" fill="#2B2145"/>
      ${smile(113, 12)}`;
  }

  function buildBolt(inst, c) {
    return `${defsFor(inst, c)}
      ${legsBlock(c)}
      ${torso(inst, c)}
      <circle cx="100" cy="174" r="15" fill="${c.colors.light}"/>
      <circle cx="91" cy="174" r="4" fill="#fff"/>
      <path d="M100 166 L105 174 L100 182 L95 174 Z" fill="${c.colors.dark}"/>
      <circle cx="109" cy="174" r="4" fill="${c.colors.dark}"/>
      ${armsRobot(c)}
      ${headSquare(inst)}
      <circle cx="40" cy="76" r="8" fill="${c.colors.dark}"/><circle cx="160" cy="76" r="8" fill="${c.colors.dark}"/>
      <rect x="60" y="48" width="80" height="58" rx="20" fill="#241A44"/>
      <g class="sk-eyes">
        <rect x="74" y="68" width="20" height="14" rx="7" fill="${c.colors.light}"/>
        <rect x="106" y="68" width="20" height="14" rx="7" fill="${c.colors.light}"/>
      </g>
      <rect x="87" y="89" width="26" height="7" rx="3.5" fill="${c.colors.light}" opacity="0.9"/>
      ${blush(102)}
      <line x1="100" y1="24" x2="100" y2="6" stroke="${c.colors.dark}" stroke-width="5" stroke-linecap="round"/>
      <circle class="sk-antenna" cx="100" cy="6" r="8" fill="${c.colors.light}"/>`;
  }

  const BUILDERS = { ziggy: buildZiggy, luna: buildLuna, pip: buildPip, bolt: buildBolt };

  /* ---------- public render ---------- */
  function render(id, opts) {
    opts = opts || {};
    const c = byId(id);
    const inst = opts.instance || 'c' + Math.random().toString(36).slice(2, 9);
    const pose = opts.pose || 'idle';
    const size = opts.size || 140;
    const mode = opts.mode || 'full';
    const viewBox = mode === 'face' ? '18 4 164 156' : '0 0 200 220';
    const build = BUILDERS[c.id] || buildZiggy;
    const extraClass = opts.className ? ' ' + opts.className : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" class="sk-char pose-${pose}${extraClass}" data-char="${c.id}" viewBox="${viewBox}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${c.name} the ${c.species}" style="filter:url(#ds-${inst}); overflow:visible;">${build(inst, c)}</svg>`;
  }

  /* ---------- logo: a badge of all 4 faces, smiling together ---------- */
  let _logoTmp = null;
  function renderLogo(size, opts) {
    opts = opts || {};
    size = size || 64;
    const order = ['ziggy', 'luna', 'pip', 'bolt'];
    const r = 24;
    const positions = [
      { cx: 34, cy: 34 }, { cx: 86, cy: 34 },
      { cx: 34, cy: 86 }, { cx: 86, cy: 86 }
    ];
    if (!_logoTmp) _logoTmp = document.createElement('div');
    let faces = '';
    order.forEach((id, i) => {
      const c = byId(id);
      const inst = 'logo' + i + Math.random().toString(36).slice(2, 8);
      const svgStr = render(id, { size: 160, mode: 'face', pose: 'idle', instance: inst });
      _logoTmp.innerHTML = svgStr;
      const inner = _logoTmp.firstElementChild ? _logoTmp.firstElementChild.innerHTML : '';
      const p = positions[i];
      faces += `
        <clipPath id="clip-${inst}"><circle cx="${p.cx}" cy="${p.cy}" r="${r}"/></clipPath>
        <g clip-path="url(#clip-${inst})">
          <circle cx="${p.cx}" cy="${p.cy}" r="${r}" fill="${c.colors.belly}"/>
          <svg x="${p.cx - r}" y="${p.cy - r}" width="${r * 2}" height="${r * 2}" viewBox="18 4 164 156" preserveAspectRatio="xMidYMid slice">${inner}</svg>
        </g>
        <circle cx="${p.cx}" cy="${p.cy}" r="${r}" fill="none" stroke="${c.colors.base}" stroke-width="4.5"/>`;
    });
    const bg = opts.transparent ? '' : `<rect x="2" y="2" width="116" height="116" rx="30" fill="#FFFFFF"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" class="sk-logo" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="SuperKids — Ziggy, Luna, Pip and Bolt">${bg}${faces}</svg>`;
  }

  function setPose(svgEl, pose, revertMs) {
    if (!svgEl) return;
    ['idle', 'cheer', 'wave', 'oops', 'think'].forEach((p) => svgEl.classList.remove('pose-' + p));
    svgEl.classList.add('pose-' + pose);
    if (revertMs) {
      clearTimeout(svgEl._skPoseTimer);
      svgEl._skPoseTimer = setTimeout(() => {
        svgEl.classList.remove('pose-' + pose);
        svgEl.classList.add('pose-idle');
      }, revertMs);
    }
  }

  global.SKChar = { CHARACTERS, get: byId, render, renderLogo, setPose };
})(window);
