/* ============================================================
   Bloom Zoo — Pizza Chef (Plus)
   Hosted by Pip. Creative: top a pizza with any ingredients you
   like. Bake in the oven and celebrate. Always awards 3 stars.
   ============================================================ */
(function () {
  'use strict';

  const SAUCES = [
    { value: '#E84D5E', label: 'Tomato' },
    { value: '#FFF3D6', label: 'White (cheese sauce)' },
    { value: '#3DDC97', label: 'Pesto' },
    { value: '#F0B76A', label: 'BBQ' }
  ];
  const CHEESES = [
    { value: 'none', label: 'No cheese', icon: '🚫' },
    { value: 'light', label: 'A little', icon: '🧀' },
    { value: 'heavy', label: 'Extra cheesy', icon: '🧀🧀' }
  ];
  const TOPPINGS = [
    { value: 'pepperoni', label: 'Pepperoni', color: '#B93540', kind: 'circle' },
    { value: 'mushroom', label: 'Mushroom', color: '#D6C4A6', kind: 'blob' },
    { value: 'olive', label: 'Olive', color: '#2B2145', kind: 'ring' },
    { value: 'pepper', label: 'Green pepper', color: '#3DDC97', kind: 'ring' },
    { value: 'pineapple', label: 'Pineapple', color: '#FFC93C', kind: 'square' },
    { value: 'basil', label: 'Basil', color: '#2FAB70', kind: 'leaf' },
    { value: 'sausage', label: 'Sausage', color: '#8B5E34', kind: 'blob' },
    { value: 'onion', label: 'Onion', color: '#E5D4EF', kind: 'ring' }
  ];
  const GOAL_TOPPINGS = 3;

  function toppingSVG(kind, color, cx, cy, r) {
    if (kind === 'circle') return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`;
    if (kind === 'ring') return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${Math.max(2, r * 0.5)}"/>`;
    if (kind === 'square') return `<rect x="${cx - r * 0.8}" y="${cy - r * 0.8}" width="${r * 1.6}" height="${r * 1.6}" rx="2" fill="${color}"/>`;
    if (kind === 'leaf') return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.1}" ry="${r * 0.55}" fill="${color}" transform="rotate(${Math.floor(Math.random() * 360)} ${cx} ${cy})"/>`;
    // blob
    return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.1}" ry="${r * 0.8}" fill="${color}" transform="rotate(${Math.floor(Math.random() * 90) - 45} ${cx} ${cy})"/>`;
  }

  function bakeSequence(done) {
    const overlay = document.createElement('div');
    overlay.className = 'oven-overlay';
    overlay.innerHTML = `<div class="oven-card">
      <span class="oven-emoji">🔥</span>
      <div class="oven-text">Baking your pizza...</div>
      <div class="oven-bar"><span></span></div>
    </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    requestAnimationFrame(() => requestAnimationFrame(() => { overlay.querySelector('.oven-bar > span').style.width = '100%'; }));
    SKAudio.play('whoosh');
    setTimeout(() => {
      overlay.querySelector('.oven-emoji').textContent = '🍕';
      overlay.querySelector('.oven-text').textContent = 'Buon appetito!';
      SKAudio.play('fanfare');
    }, 1500);
    setTimeout(() => { overlay.remove(); done(); }, 2100);
  }

  function defaultState() { return { sauce: SAUCES[0].value, cheese: 'light', toppings: [] }; }

  function mountPizza(root, gameDef, level) {
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
        <p class="pz-instructions">Top your pizza with sauce, cheese and yummy toppings, then bake!</p>
        <div class="pz-preview" id="pzPreview"></div>
        <div class="cust-categories" id="pzCats"></div>
        <button class="btn btn-xl btn-coral cust-done pz-done" type="button" ${state.toppings.length < 1 ? 'disabled' : ''}>🍕 Bake it!</button>`;
      const preview = shell.stage.querySelector('#pzPreview');
      const catsWrap = shell.stage.querySelector('#pzCats');
      shell.setDots(state.toppings.length, GOAL_TOPPINGS);

      // Build pizza SVG
      const cx = 100, cy = 100, R = 84;
      const sauce = state.sauce;
      const cheeseOverlay = state.cheese === 'none' ? '' :
        (state.cheese === 'light'
          ? `<circle cx="${cx}" cy="${cy}" r="${R - 8}" fill="#FFEFC0" opacity="0.7"/>`
          : `<circle cx="${cx}" cy="${cy}" r="${R - 4}" fill="#FFEDB4" opacity="0.9"/>`);
      let toppingsSvg = '';
      // deterministic-ish positions for each topping
      state.toppings.forEach((t, i) => {
        const seedX = ((i * 91 + 13) % 100) / 100;
        const seedY = ((i * 47 + 29) % 100) / 100;
        const angle = seedX * Math.PI * 2;
        const dist = 12 + (i * 13) % (R - 26);
        const tx = cx + Math.cos(angle) * dist;
        const ty = cy + Math.sin(angle) * dist;
        toppingsSvg += toppingSVG(t.kind, t.color, tx, ty, 8);
        // sprinkle a duplicate at slightly different position
        if (state.toppings.length <= 6) {
          const tx2 = cx + Math.cos(angle + 1.3) * (dist * 0.7 + 8);
          const ty2 = cy + Math.sin(angle + 1.3) * (dist * 0.7 + 8);
          toppingsSvg += toppingSVG(t.kind, t.color, tx2, ty2, 7);
        }
      });

      preview.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Your pizza">
        <circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="#F0B76A" stroke="#8B5E34" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="${sauce}"/>
        ${cheeseOverlay}
        ${toppingsSvg}
      </svg>`;

      addRow(catsWrap, 'Sauce', 'sauce', SAUCES, (o) => `<span class="cust-swatch-color" style="background:${o.value}"></span>`);
      addRow(catsWrap, 'Cheese', 'cheese', CHEESES, (o) => `<span class="cust-swatch-emoji">${o.icon}</span>`);

      // Toppings row (multi-select, tap to add up to a limit)
      const topRow = document.createElement('div');
      topRow.className = 'cust-row';
      topRow.innerHTML = `<div class="cust-row-label">Toppings (${state.toppings.length})</div>`;
      const topSw = document.createElement('div');
      topSw.className = 'cust-swatches';
      TOPPINGS.forEach((t) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cust-swatch';
        btn.title = t.label;
        btn.innerHTML = `<span class="cust-swatch-emoji" style="color:${t.color};font-size:1.4rem;">●</span>`;
        btn.addEventListener('click', () => {
          if (state.toppings.length >= 10) return;
          state.toppings.push(t);
          SKAudio.play('pop');
          render();
        });
        topSw.appendChild(btn);
      });
      topRow.appendChild(topSw);
      catsWrap.appendChild(topRow);

      const undoBtn = document.createElement('button');
      undoBtn.type = 'button'; undoBtn.className = 'btn btn-ghost pz-undo'; undoBtn.textContent = '↺ Take a topping off';
      undoBtn.addEventListener('click', () => {
        if (!state.toppings.length) return;
        state.toppings.pop(); SKAudio.play('pop'); render();
      });
      catsWrap.appendChild(undoBtn);

      shell.stage.querySelector('.pz-done').addEventListener('click', () => {
        SKAudio.play('star');
        bakeSequence(() => {
          SKPlay.celebrate(root, gameDef, level, 3, 3, {
            onReplay() { Object.assign(state, defaultState()); render(); }
          });
        });
      });
    }
    render();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'pizza',
    title: 'Pizza Chef',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'pip',
    color: 'coral',
    icon: '🍕',
    blurb: 'Top your pizza with the yummiest ingredients, then bake it!',
    premium: true,
    mount(root, ctx) { return mountPizza(root, this, ctx.level); }
  });
})();
