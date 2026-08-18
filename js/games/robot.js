/* ============================================================
   Bloom Zoo — Robot Builder (Plus)
   Hosted by Ziggy. Creative: choose a body colour, eyes, arms
   and antenna to build a friendly robot. Always awards 3 stars.
   ============================================================ */
(function () {
  'use strict';

  const BODY_COLORS = [
    { value: '#FF6F7D', label: 'Coral' },
    { value: '#4EA8FF', label: 'Sky' },
    { value: '#FFC93C', label: 'Sun' },
    { value: '#9B6BFF', label: 'Grape' },
    { value: '#2FD8A0', label: 'Mint' },
    { value: '#B7C4D6', label: 'Silver' }
  ];
  const EYES = [
    { value: 'round', label: 'Round eyes' },
    { value: 'big', label: 'Big eyes' },
    { value: 'sleepy', label: 'Sleepy' },
    { value: 'happy', label: 'Happy' },
    { value: 'star', label: 'Star eyes' }
  ];
  const ARMS = [
    { value: 'claw', label: 'Claws' },
    { value: 'hand', label: 'Hands' },
    { value: 'pincer', label: 'Pincers' },
    { value: 'thruster', label: 'Thrusters' }
  ];
  const HATS = [
    { value: 'none', label: 'No antenna', icon: '·' },
    { value: 'single', label: 'One antenna', icon: '📡' },
    { value: 'double', label: 'Two antennas', icon: '🪖' },
    { value: 'cap', label: 'Cap', icon: '🧢' },
    { value: 'crown', label: 'Crown', icon: '👑' }
  ];

  function defaultState() { return { body: BODY_COLORS[0].value, eyes: 'round', arms: 'hand', hat: 'single' }; }

  function eyesSVG(kind, cx) {
    if (kind === 'round')  return `<g fill="#2A2438"><circle cx="${cx - 10}" cy="0" r="4"/><circle cx="${cx + 10}" cy="0" r="4"/></g>`;
    if (kind === 'big')    return `<g><circle cx="${cx - 12}" cy="0" r="7" fill="#fff" stroke="#2A2438" stroke-width="1.5"/><circle cx="${cx + 12}" cy="0" r="7" fill="#fff" stroke="#2A2438" stroke-width="1.5"/><circle cx="${cx - 12}" cy="1" r="3.4" fill="#2A2438"/><circle cx="${cx + 12}" cy="1" r="3.4" fill="#2A2438"/></g>`;
    if (kind === 'sleepy') return `<g stroke="#2A2438" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M${cx - 15} 0 Q${cx - 10} 4 ${cx - 5} 0"/><path d="M${cx + 5} 0 Q${cx + 10} 4 ${cx + 15} 0"/></g>`;
    if (kind === 'happy')  return `<g stroke="#2A2438" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M${cx - 15} 2 Q${cx - 10} -4 ${cx - 5} 2"/><path d="M${cx + 5} 2 Q${cx + 10} -4 ${cx + 15} 2"/></g>`;
    // star
    return `<g fill="#FFC93C" stroke="#F0A100" stroke-width="1">
      <polygon points="${cx - 10},-6 ${cx - 8},-1 ${cx - 3},-1 ${cx - 7},2 ${cx - 5},7 ${cx - 10},4 ${cx - 15},7 ${cx - 13},2 ${cx - 17},-1 ${cx - 12},-1"/>
      <polygon points="${cx + 10},-6 ${cx + 12},-1 ${cx + 17},-1 ${cx + 13},2 ${cx + 15},7 ${cx + 10},4 ${cx + 5},7 ${cx + 7},2 ${cx + 3},-1 ${cx + 8},-1"/>
    </g>`;
  }

  function armSVG(kind, side, y, bodyColor) {
    const dir = side === 'left' ? -1 : 1;
    const x0 = 100 + dir * 42;
    if (kind === 'claw') {
      return `<g stroke="#B7C4D6" stroke-width="6" fill="none" stroke-linecap="round">
        <line x1="${x0}" y1="${y}" x2="${x0 + dir * 22}" y2="${y + 6}"/>
        <path d="M${x0 + dir * 22} ${y + 6} l${dir * 6} -8 M${x0 + dir * 22} ${y + 6} l${dir * 6} 8" stroke="${bodyColor}" stroke-width="4"/>
      </g>`;
    }
    if (kind === 'hand') {
      return `<g><line x1="${x0}" y1="${y}" x2="${x0 + dir * 22}" y2="${y + 6}" stroke="#B7C4D6" stroke-width="6" stroke-linecap="round"/>
        <circle cx="${x0 + dir * 24}" cy="${y + 8}" r="7" fill="${bodyColor}" stroke="#2A2438" stroke-width="1.5"/></g>`;
    }
    if (kind === 'pincer') {
      return `<g stroke="#B7C4D6" stroke-width="6" fill="none" stroke-linecap="round">
        <line x1="${x0}" y1="${y}" x2="${x0 + dir * 20}" y2="${y + 8}"/>
        <path d="M${x0 + dir * 20} ${y + 4} q${dir * 12} 6 ${dir * 4} 12 M${x0 + dir * 20} ${y + 12} q${dir * 12} -6 ${dir * 4} -12" stroke="${bodyColor}" stroke-width="4"/>
      </g>`;
    }
    // thruster
    return `<g><line x1="${x0}" y1="${y}" x2="${x0 + dir * 18}" y2="${y + 6}" stroke="#B7C4D6" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="${x0 + dir * 22}" cy="${y + 8}" rx="6" ry="9" fill="${bodyColor}" stroke="#2A2438" stroke-width="1"/>
      <ellipse cx="${x0 + dir * 22}" cy="${y + 20}" rx="4" ry="8" fill="#FF9D45" opacity="0.85"/>
    </g>`;
  }

  function hatSVG(kind) {
    if (kind === 'single') return `<g><line x1="100" y1="42" x2="100" y2="18" stroke="#B7C4D6" stroke-width="3.5" stroke-linecap="round"/><circle cx="100" cy="14" r="6" fill="#FFC93C" stroke="#F0A100" stroke-width="1.5"/></g>`;
    if (kind === 'double') return `<g stroke="#B7C4D6" stroke-width="3.5" stroke-linecap="round"><line x1="88" y1="42" x2="82" y2="20"/><line x1="112" y1="42" x2="118" y2="20"/><circle cx="82" cy="16" r="5" fill="#FF6F7D" stroke="#2A2438" stroke-width="1"/><circle cx="118" cy="16" r="5" fill="#2FD8A0" stroke="#2A2438" stroke-width="1"/></g>`;
    if (kind === 'cap')   return `<g><path d="M62 44 Q100 20 138 44 Z" fill="#4EA8FF" stroke="#2A2438" stroke-width="1.5"/><path d="M138 44 l16 8 l-16 -2 Z" fill="#4EA8FF" stroke="#2A2438" stroke-width="1.5"/></g>`;
    if (kind === 'crown') return `<g><path d="M65 44 L70 24 L84 40 L100 20 L116 40 L130 24 L135 44 Z" fill="#FFC93C" stroke="#F0A100" stroke-width="1.5" stroke-linejoin="round"/><circle cx="100" cy="24" r="3" fill="#FF6F7D"/></g>`;
    return '';
  }

  function robotSVG(state) {
    const bc = state.body;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" role="img" aria-label="Your robot">
      <!-- shadow -->
      <ellipse cx="100" cy="220" rx="50" ry="6" fill="rgba(0,0,0,.15)"/>
      <!-- neck -->
      <rect x="94" y="72" width="12" height="12" fill="#B7C4D6"/>
      <!-- body -->
      <rect x="55" y="84" width="90" height="100" rx="12" fill="${bc}" stroke="#2A2438" stroke-width="1.5"/>
      <rect x="70" y="98" width="60" height="30" rx="4" fill="rgba(0,0,0,.15)"/>
      <circle cx="80" cy="150" r="4" fill="#FFC93C"/>
      <circle cx="100" cy="150" r="4" fill="#FF6F7D"/>
      <circle cx="120" cy="150" r="4" fill="#2FD8A0"/>
      <!-- legs -->
      <rect x="70" y="184" width="18" height="30" fill="#B7C4D6" stroke="#2A2438" stroke-width="1"/>
      <rect x="112" y="184" width="18" height="30" fill="#B7C4D6" stroke="#2A2438" stroke-width="1"/>
      <rect x="66" y="212" width="26" height="6" rx="2" fill="${bc}"/>
      <rect x="108" y="212" width="26" height="6" rx="2" fill="${bc}"/>
      <!-- arms -->
      <g transform="translate(0 120)">${armSVG(state.arms, 'left', 0, bc)}${armSVG(state.arms, 'right', 0, bc)}</g>
      <!-- head -->
      <rect x="62" y="30" width="76" height="46" rx="10" fill="${bc}" stroke="#2A2438" stroke-width="1.5"/>
      <!-- eyes -->
      <g transform="translate(0 56)">${eyesSVG(state.eyes, 100)}</g>
      <!-- mouth -->
      <rect x="82" y="66" width="36" height="4" rx="2" fill="#2A2438"/>
      <!-- hat -->
      ${hatSVG(state.hat)}
    </svg>`;
  }

  function mountRobot(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const state = defaultState();

    function addRow(catsWrap, label, key, options, renderOpt) {
      const row = document.createElement('div');
      row.className = 'cust-row';
      row.innerHTML = `<div class="cust-row-label">${label}</div>`;
      const sw = document.createElement('div');
      sw.className = 'cust-swatches';
      options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cust-swatch' + (state[key] === opt.value ? ' active' : '');
        btn.title = opt.label;
        btn.innerHTML = renderOpt(opt);
        btn.addEventListener('click', () => {
          if (state[key] === opt.value) return;
          state[key] = opt.value; SKAudio.play('pop'); render();
        });
        sw.appendChild(btn);
      });
      row.appendChild(sw);
      catsWrap.appendChild(row);
    }

    function render() {
      shell.stage.innerHTML = `
        <p class="pz-instructions">Pick a color, eyes, arms and a hat — meet your one-of-a-kind robot friend!</p>
        <div class="robot-preview" id="robotPreview"></div>
        <div class="cust-categories" id="robotCats"></div>
        <button class="btn btn-xl btn-mint cust-done robot-done" type="button">🤖 Power on!</button>`;
      shell.stage.querySelector('#robotPreview').innerHTML = robotSVG(state);
      shell.setDots(1, 1);
      const catsWrap = shell.stage.querySelector('#robotCats');

      addRow(catsWrap, 'Color', 'body', BODY_COLORS, (o) => `<span class="cust-swatch-color" style="background:${o.value}"></span>`);
      addRow(catsWrap, 'Eyes', 'eyes', EYES, (o) => `<span class="cust-swatch-emoji" style="font-size:1rem;">${o.label.split(' ')[0]}</span>`);
      addRow(catsWrap, 'Arms', 'arms', ARMS, (o) => `<span class="cust-swatch-emoji" style="font-size:.9rem;">${o.label}</span>`);
      addRow(catsWrap, 'Hat', 'hat', HATS, (o) => `<span class="cust-swatch-emoji">${o.icon}</span>`);

      shell.stage.querySelector('.robot-done').addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.confettiFromEl(shell.stage.querySelector('#robotPreview'), { count: 26 });
        setTimeout(() => {
          SKPlay.celebrate(root, gameDef, level, 3, 3, {
            onReplay() { Object.assign(state, defaultState()); render(); }
          });
        }, 500);
      });
    }
    render();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'robot',
    title: 'Robot Builder',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'ziggy',
    color: 'mint',
    icon: '🤖',
    blurb: 'Build your very own friendly robot from head to toe!',
    premium: true,
    mount(root, ctx) { return mountRobot(root, this, ctx.level); }
  });
})();
