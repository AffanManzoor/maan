/* ============================================================
   Bloom Zoo — Sushi Chef (Plus)
   Hosted by Luna. Creative: build a sushi roll with a wrap, rice,
   fillings and toppings. Always awards 3 stars.
   ============================================================ */
(function () {
  'use strict';

  const WRAPS = [
    { value: '#2A2438', label: 'Seaweed', name: 'nori' },
    { value: '#F4C1D0', label: 'Pink soy', name: 'pink' },
    { value: '#F5E6B8', label: 'Egg wrap', name: 'egg' }
  ];
  const RICES = [
    { value: '#FFFFFF', label: 'White rice' },
    { value: '#E8D6A5', label: 'Brown rice' },
    { value: '#D6E9FF', label: 'Blue rice ✨' }
  ];
  const FILLINGS = [
    { value: 'salmon', label: 'Salmon', color: '#FF8560' },
    { value: 'tuna', label: 'Tuna', color: '#D9425A' },
    { value: 'avocado', label: 'Avocado', color: '#B8DE7A' },
    { value: 'cucumber', label: 'Cucumber', color: '#3DDC97' },
    { value: 'shrimp', label: 'Shrimp', color: '#FFB08A' },
    { value: 'cheese', label: 'Cream cheese', color: '#FFF7DB' },
    { value: 'crab', label: 'Crab', color: '#FF7B7B' },
    { value: 'mango', label: 'Mango', color: '#FFC93C' }
  ];
  const TOPPERS = [
    { value: 'none', label: 'No topping', icon: '·' },
    { value: 'sesame', label: 'Sesame', icon: '·⋅·' },
    { value: 'roe', label: 'Roe', icon: 'ooo' },
    { value: 'mayo', label: 'Spicy mayo', icon: '≈' }
  ];
  const GOAL_PIECES = 3;

  function defaultState() { return { wrap: WRAPS[0].value, rice: RICES[0].value, fillings: [], topper: 'sesame' }; }

  function pieceSVG(state) {
    const cx = 50, cy = 50, R = 42;
    const fill = state.fillings;
    const wrap = state.wrap;
    const rice = state.rice;
    // The wrap is a ring around the outside; rice fills the middle;
    // fillings are colored ellipses stacked inside.
    let inner = '';
    if (fill.length === 0) {
      inner = `<circle cx="${cx}" cy="${cy}" r="${R - 12}" fill="${rice}"/>`;
    } else {
      // arrange fillings as small horizontal ellipses in the centre
      const bandH = Math.max(8, Math.min(20, (R - 10) / fill.length));
      inner = `<circle cx="${cx}" cy="${cy}" r="${R - 8}" fill="${rice}"/>`;
      fill.forEach((f, i) => {
        const y = cy - ((fill.length - 1) / 2) * bandH + i * bandH;
        inner += `<ellipse cx="${cx}" cy="${y}" rx="${R - 16}" ry="${bandH * 0.5}" fill="${f.color}" stroke="rgba(0,0,0,.08)" stroke-width="1"/>`;
      });
    }
    // topper on top
    let top = '';
    if (state.topper === 'sesame') {
      top = `<g fill="#3A2400"><circle cx="${cx - 8}" cy="${cy - R + 10}" r="1.4"/><circle cx="${cx}" cy="${cy - R + 8}" r="1.4"/><circle cx="${cx + 8}" cy="${cy - R + 10}" r="1.4"/></g>`;
    } else if (state.topper === 'roe') {
      top = `<g fill="#FF8560"><circle cx="${cx - 10}" cy="${cy - R + 10}" r="2.6"/><circle cx="${cx - 3}" cy="${cy - R + 6}" r="2.6"/><circle cx="${cx + 4}" cy="${cy - R + 8}" r="2.6"/><circle cx="${cx + 11}" cy="${cy - R + 12}" r="2.6"/></g>`;
    } else if (state.topper === 'mayo') {
      top = `<path d="M${cx - 12} ${cy - R + 8} Q${cx - 4} ${cy - R + 14} ${cx + 2} ${cy - R + 8} T${cx + 12} ${cy - R + 10}" stroke="#FF9D45" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }
    return `<g>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="${wrap}" stroke="#00000018" stroke-width="1"/>
      ${inner}
      ${top}
    </g>`;
  }

  function mountSushi(root, gameDef, level) {
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
          state[key] = opt.value;
          SKAudio.play('pop');
          render();
        });
        sw.appendChild(btn);
      });
      row.appendChild(sw);
      catsWrap.appendChild(row);
    }

    function render() {
      shell.stage.innerHTML = `
        <p class="pz-instructions">Wrap it, fill it, dress it — make the yummiest sushi in the sea!</p>
        <div class="sushi-tray" id="sushiTray"></div>
        <div class="cust-categories" id="sushiCats"></div>
        <button class="btn btn-xl btn-coral cust-done sushi-done" type="button" ${state.fillings.length < 1 ? 'disabled' : ''}>🍣 Serve it!</button>`;

      const tray = shell.stage.querySelector('#sushiTray');
      const catsWrap = shell.stage.querySelector('#sushiCats');
      shell.setDots(state.fillings.length, GOAL_PIECES);

      // Show three identical sushi pieces on a bamboo mat. Each piece SVG
      // is 100x100 with the sushi centered at (50, 50) and radius 42, so
      // pieces need at least 92px horizontal room. We give them 105px
      // spacing and start the first one at x=8 so nothing clips.
      const piece = pieceSVG(state);
      tray.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 130" role="img" aria-label="Your sushi">
        <rect x="4" y="90" width="332" height="34" rx="6" fill="#DFC58A" stroke="#8B5E34"/>
        <g stroke="#B49459" stroke-width="1">${Array.from({length: 22}, (_, i) => `<line x1="${16 + i * 15}" y1="90" x2="${16 + i * 15}" y2="124"/>`).join('')}</g>
        <g transform="translate(15 5)">${piece}</g>
        <g transform="translate(120 5)">${piece}</g>
        <g transform="translate(225 5)">${piece}</g>
      </svg>`;

      addRow(catsWrap, 'Wrap', 'wrap', WRAPS, (o) => `<span class="cust-swatch-color" style="background:${o.value};border:1.5px solid rgba(0,0,0,.2)"></span>`);
      addRow(catsWrap, 'Rice', 'rice', RICES, (o) => `<span class="cust-swatch-color" style="background:${o.value};border:1.5px solid rgba(0,0,0,.2)"></span>`);

      const fRow = document.createElement('div');
      fRow.className = 'cust-row';
      fRow.innerHTML = `<div class="cust-row-label">Fillings (${state.fillings.length})</div>`;
      const fSw = document.createElement('div');
      fSw.className = 'cust-swatches';
      FILLINGS.forEach((f) => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'cust-swatch'; btn.title = f.label;
        btn.innerHTML = `<span class="cust-swatch-emoji" style="color:${f.color};font-size:1.6rem;">●</span>`;
        btn.addEventListener('click', () => {
          if (state.fillings.length >= 6) return;
          state.fillings.push(f); SKAudio.play('pop'); render();
        });
        fSw.appendChild(btn);
      });
      fRow.appendChild(fSw);
      catsWrap.appendChild(fRow);

      const undoBtn = document.createElement('button');
      undoBtn.type = 'button'; undoBtn.className = 'btn btn-ghost pz-undo'; undoBtn.textContent = '↺ Take a filling out';
      undoBtn.addEventListener('click', () => {
        if (!state.fillings.length) return;
        state.fillings.pop(); SKAudio.play('pop'); render();
      });
      catsWrap.appendChild(undoBtn);

      addRow(catsWrap, 'Topping', 'topper', TOPPERS, (o) => `<span class="cust-swatch-emoji">${o.icon}</span>`);

      shell.stage.querySelector('.sushi-done').addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.confettiFromEl(tray, { count: 20 });
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
    id: 'sushi',
    title: 'Sushi Chef',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'luna',
    color: 'sun',
    icon: '🍣',
    blurb: 'Wrap, fill and top your very own sushi rolls!',
    premium: true,
    mount(root, ctx) { return mountSushi(root, this, ctx.level); }
  });
})();
