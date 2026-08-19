/* ============================================================
   Bloom Zoo — Cupcake Bakery (Plus)
   Hosted by Luna. Creative: choose a wrapper, frosting swirl and
   sprinkles/toppers to make the yummiest cupcake. Bake, celebrate,
   3 stars every time.
   ============================================================ */
(function () {
  'use strict';

  const WRAPPERS = [
    { value: '#FF6F7D', label: 'Pink' },
    { value: '#4EA8FF', label: 'Blue' },
    { value: '#FFC93C', label: 'Yellow' },
    { value: '#9B6BFF', label: 'Purple' },
    { value: '#2FD8A0', label: 'Mint' }
  ];
  const FROSTINGS = [
    { value: '#FFECC5', label: 'Vanilla' },
    { value: '#8B5E34', label: 'Chocolate' },
    { value: '#F4C1D0', label: 'Strawberry' },
    { value: '#BFE4FF', label: 'Blueberry' },
    { value: '#B8DE7A', label: 'Matcha' }
  ];
  const TOPPINGS = [
    { value: 'sprinkles', label: 'Sprinkles' },
    { value: 'star',      label: 'Star' },
    { value: 'heart',     label: 'Heart' },
    { value: 'cherry',    label: 'Cherry' },
    { value: 'candy',     label: 'Candy' }
  ];

  function defaultState() { return { wrapper: WRAPPERS[0].value, frosting: FROSTINGS[0].value, toppings: [] }; }

  function topperSVG(kind, cx, cy) {
    if (kind === 'sprinkles') {
      const COLORS = ['#FF6F7D', '#4EA8FF', '#FFC93C', '#2FD8A0', '#9B6BFF'];
      let s = '';
      for (let i = 0; i < 18; i++) {
        const ang = (i / 18) * Math.PI * 2;
        const r = 6 + (i % 3) * 4;
        const x = cx + Math.cos(ang) * (24 + (i % 4) * 6);
        const y = cy + Math.sin(ang) * (10 + (i % 4) * 4) - 8;
        s += `<rect x="${x - 3}" y="${y - 1}" width="6" height="2" rx="1" fill="${COLORS[i % COLORS.length]}" transform="rotate(${Math.floor(i * 20)} ${x} ${y})"/>`;
      }
      return s;
    }
    if (kind === 'star') return `<polygon points="${cx},${cy - 20} ${cx + 6},${cy - 6} ${cx + 20},${cy - 6} ${cx + 8},${cy + 2} ${cx + 12},${cy + 16} ${cx},${cy + 8} ${cx - 12},${cy + 16} ${cx - 8},${cy + 2} ${cx - 20},${cy - 6} ${cx - 6},${cy - 6}" fill="#FFC93C" stroke="#F0A100" stroke-width="1.5"/>`;
    if (kind === 'heart') return `<path d="M${cx} ${cy + 14} C${cx - 20} ${cy - 4}, ${cx - 20} ${cy - 22}, ${cx - 8} ${cy - 22} C${cx - 4} ${cy - 22}, ${cx} ${cy - 16}, ${cx} ${cy - 12} C${cx} ${cy - 16}, ${cx + 4} ${cy - 22}, ${cx + 8} ${cy - 22} C${cx + 20} ${cy - 22}, ${cx + 20} ${cy - 4}, ${cx} ${cy + 14} Z" fill="#FF6F7D" stroke="#B93540" stroke-width="1.5" stroke-linejoin="round"/>`;
    if (kind === 'cherry') return `<g><path d="M${cx - 4} ${cy - 14} Q${cx - 10} ${cy - 22} ${cx + 6} ${cy - 20}" stroke="#7A5230" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="${cx - 4}" cy="${cy - 4}" r="9" fill="#FF6F7D" stroke="#B93540" stroke-width="1.5"/><ellipse cx="${cx - 7}" cy="${cy - 7}" rx="2.5" ry="1.5" fill="rgba(255,255,255,.7)"/></g>`;
    return `<g><circle cx="${cx}" cy="${cy}" r="10" fill="#FFF" stroke="#FF6F7D" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="4" fill="#FF6F7D"/></g>`;
  }

  function cupcakeSVG(state) {
    const cx = 120, cy = 200;
    // wrapper: trapezoid with vertical fluting
    const flutes = Array.from({length: 9}, (_, i) => `<line x1="${cx - 60 + i * 15}" y1="${cy - 44}" x2="${cx - 60 + i * 15 + 6}" y2="${cy + 44}" stroke="rgba(0,0,0,.15)" stroke-width="1"/>`).join('');
    // frosting: 3 stacked swirl blobs
    const f = state.frosting;
    const swirl = `
      <ellipse cx="${cx}" cy="${cy - 60}" rx="70" ry="24" fill="${f}"/>
      <ellipse cx="${cx - 6}" cy="${cy - 82}" rx="56" ry="20" fill="${f}"/>
      <ellipse cx="${cx + 4}" cy="${cy - 102}" rx="42" ry="16" fill="${f}"/>
      <ellipse cx="${cx - 2}" cy="${cy - 118}" rx="26" ry="12" fill="${f}"/>
      <ellipse cx="${cx}" cy="${cy - 130}" rx="12" ry="10" fill="${f}"/>
      <!-- shine -->
      <ellipse cx="${cx - 24}" cy="${cy - 92}" rx="12" ry="5" fill="rgba(255,255,255,.35)" transform="rotate(-20 ${cx - 24} ${cy - 92})"/>`;
    // toppings positioned around the top-most part of the frosting
    let tops = '';
    state.toppings.forEach((t, i) => {
      if (t === 'sprinkles') { tops += topperSVG('sprinkles', cx, cy - 80); return; }
      const ang = (i * 1.31) % (Math.PI * 2);
      const px = cx + Math.cos(ang) * 22 - 8 * (i % 2);
      const py = cy - 100 + Math.sin(ang) * 12;
      tops += topperSVG(t, px, py);
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 260" role="img" aria-label="Your cupcake">
      <ellipse cx="${cx}" cy="${cy + 60}" rx="80" ry="10" fill="rgba(0,0,0,.15)"/>
      <path d="M${cx - 66} ${cy - 44} L${cx + 66} ${cy - 44} L${cx + 56} ${cy + 44} L${cx - 56} ${cy + 44} Z" fill="${state.wrapper}" stroke="#2A2438" stroke-width="1.5" stroke-linejoin="round"/>
      ${flutes}
      ${swirl}
      ${tops}
    </svg>`;
  }

  function mountCupcake(root, gameDef, level) {
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
        <p class="pz-instructions">Pick a wrapper, swirl on frosting, then top it with something sweet!</p>
        <div class="pz-preview" id="cupPreview"></div>
        <div class="cust-categories" id="cupCats"></div>
        <button class="btn btn-xl btn-coral cust-done cup-done" type="button">🧁 Ta-da!</button>`;
      shell.stage.querySelector('#cupPreview').innerHTML = cupcakeSVG(state);
      shell.setDots(1, 1);
      const catsWrap = shell.stage.querySelector('#cupCats');

      addRow(catsWrap, 'Wrapper', 'wrapper', WRAPPERS, (o) => `<span class="cust-swatch-color" style="background:${o.value}"></span>`);
      addRow(catsWrap, 'Frosting', 'frosting', FROSTINGS, (o) => `<span class="cust-swatch-color" style="background:${o.value};border:1.5px solid rgba(0,0,0,.15)"></span>`);

      const tRow = document.createElement('div');
      tRow.className = 'cust-row';
      tRow.innerHTML = `<div class="cust-row-label">Toppings (${state.toppings.length})</div>`;
      const tSw = document.createElement('div'); tSw.className = 'cust-swatches';
      TOPPINGS.forEach((t) => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'cust-swatch'; btn.title = t.label;
        btn.innerHTML = `<span class="cust-swatch-emoji" style="font-size:.85rem;">${t.label}</span>`;
        btn.addEventListener('click', () => {
          if (state.toppings.length >= 5) return;
          state.toppings.push(t.value); SKAudio.play('pop'); render();
        });
        tSw.appendChild(btn);
      });
      tRow.appendChild(tSw);
      catsWrap.appendChild(tRow);

      const undoBtn = document.createElement('button');
      undoBtn.type = 'button'; undoBtn.className = 'btn btn-ghost pz-undo'; undoBtn.textContent = '↺ Take a topping off';
      undoBtn.addEventListener('click', () => { if (state.toppings.length) { state.toppings.pop(); SKAudio.play('pop'); render(); } });
      catsWrap.appendChild(undoBtn);

      shell.stage.querySelector('.cup-done').addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.confettiFromEl(shell.stage.querySelector('#cupPreview'), { count: 28 });
        setTimeout(() => {
          SKPlay.celebrate(root, gameDef, level, 3, 3, { onReplay() { Object.assign(state, defaultState()); render(); } });
        }, 500);
      });
    }
    render();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'cupcake',
    title: 'Cupcake Bakery',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'luna',
    color: 'coral',
    icon: '🧁',
    blurb: 'Wrap, frost and top the yummiest cupcake in the bakery!',
    premium: true,
    mount(root, ctx) { return mountCupcake(root, this, ctx.level); }
  });
})();
