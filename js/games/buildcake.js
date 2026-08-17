/* ============================================================
   SuperKids — Build-a-Cake
   Hosted by Pip the Fox. Subject: creative (not graded).
   ============================================================ */
(function () {
  'use strict';

  const SHAPES = [
    { value: 'round', label: 'Round', icon: '⚪' },
    { value: 'square', label: 'Square', icon: '◼️' },
    { value: 'rectangle', label: 'Rectangle', icon: '▬' }
  ];
  const FROSTING = [
    { value: '#FFB8CC', label: 'Pink' },
    { value: '#9ED3FF', label: 'Blue' },
    { value: '#FFE58A', label: 'Yellow' },
    { value: '#9CF0D4', label: 'Mint' },
    { value: '#C9B3FF', label: 'Lavender' },
    { value: '#8B5E34', label: 'Chocolate' },
    { value: '#FFFFFF', label: 'Vanilla White' },
    { value: '#FFD4B8', label: 'Peach' }
  ];
  const LAYER_OPTS = [
    { value: 1, label: '1 Layer', icon: '1️⃣' },
    { value: 2, label: '2 Layers', icon: '2️⃣' },
    { value: 3, label: '3 Layers', icon: '3️⃣' }
  ];
  const TOPPERS = [
    { value: 'none', label: 'None', icon: '🚫' },
    { value: 'cherry', label: 'Cherry', icon: '🍒' },
    { value: 'flower', label: 'Flower', icon: '🌸' },
    { value: 'star', label: 'Star', icon: '⭐' },
    { value: 'crown', label: 'Crown', icon: '👑' },
    { value: 'confetti', label: 'Confetti', icon: '🎉' }
  ];
  const TOPPER_EMOJI = { cherry: '🍒', flower: '🌸', star: '⭐', crown: '👑', confetti: '🎉' };
  // per-shape tier sizes: rectangle is wider and shorter to read as a sheet cake
  const TIER_SIZES = {
    round:     [{ w: 74, h: 54 }, { w: 58, h: 46 }, { w: 44, h: 40 }],
    square:    [{ w: 74, h: 54 }, { w: 58, h: 46 }, { w: 44, h: 40 }],
    rectangle: [{ w: 92, h: 32 }, { w: 74, h: 28 }, { w: 56, h: 26 }]
  };

  function shadeColor(hex, amt) {
    const n = parseInt(hex.replace('#', ''), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.max(0, Math.round(r * (1 - amt)));
    g = Math.max(0, Math.round(g * (1 - amt)));
    b = Math.max(0, Math.round(b * (1 - amt)));
    return `rgb(${r},${g},${b})`;
  }

  function stackedBody(kind, color, layers) {
    const dark = shadeColor(color, 0.16);
    const sizes = (TIER_SIZES[kind] || TIER_SIZES.round).slice(0, layers);
    let bottom = 198;
    let body = `<ellipse cx="100" cy="202" rx="84" ry="10" fill="#FFFDF8" stroke="#EDE4D2" stroke-width="2"/>`;
    const tiers = [];
    sizes.forEach((sz) => {
      const y0 = bottom - sz.h;
      if (kind === 'round') {
        body += `<rect x="${100 - sz.w}" y="${y0}" width="${sz.w * 2}" height="${sz.h}" rx="${sz.w * 0.22}" fill="${color}" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>`;
        body += `<ellipse cx="100" cy="${y0}" rx="${sz.w}" ry="${sz.w * 0.17}" fill="${dark}"/>`;
      } else {
        body += `<rect x="${100 - sz.w}" y="${y0}" width="${sz.w * 2}" height="${sz.h}" rx="8" fill="${color}" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>`;
        body += `<rect x="${100 - sz.w}" y="${y0}" width="${sz.w * 2}" height="10" rx="4" fill="${dark}"/>`;
      }
      tiers.push({ y0, halfW: sz.w });
      bottom = y0 + 6;
    });
    tiers.reverse(); // topmost tier first, so candles/topper positioning reads top-down
    return { body, topY: tiers[0].y0, tiers };
  }

  function cakeBody(shape, color, layers) {
    return stackedBody(shape, color, layers);
  }

  // round-robins candles across tiers starting from the top, so a single candle sits on
  // top (classic look) and extra candles fill each lower tier in turn as the count grows
  function splitCandlesAcrossTiers(n, tierCount) {
    const out = new Array(tierCount).fill(0);
    for (let i = 0; i < n; i++) out[i % tierCount] += 1;
    return out;
  }

  function candleGroupHTML(count, topPct, tierHalfW) {
    if (count <= 0) return '';
    const spanPct = Math.min(tierHalfW * 0.82, count * 9);
    const startPct = 50 - spanPct / 2;
    let html = '';
    for (let i = 0; i < count; i++) {
      const leftPct = count === 1 ? 50 : startPct + (spanPct * (i / (count - 1)));
      html += `<span class="cust-acc" style="left:${leftPct}%;top:${Math.max(topPct, 10)}%;font-size:1.7rem;">🕯️</span>`;
    }
    return html;
  }

  function renderPreview(state) {
    const { body, topY, tiers } = cakeBody(state.shape, state.color, state.layers);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" role="img" aria-label="Your cake">${body}</svg>`;
    let overlay = '';
    const topPct = Math.max(4, (topY / 220) * 100);
    if (state.topper !== 'none') {
      overlay += `<span class="cust-acc" style="left:50%;top:${Math.max(topPct - 8, 4)}%;font-size:1.8rem;">${TOPPER_EMOJI[state.topper]}</span>`;
    }
    if (state.candles > 0) {
      const counts = splitCandlesAcrossTiers(state.candles, tiers.length);
      tiers.forEach((t, i) => {
        const pct = Math.max(4, (t.y0 / 220) * 100);
        overlay += candleGroupHTML(counts[i], pct, t.halfW);
      });
    }
    return svg + overlay;
  }

  function bakeSequence(done) {
    const overlay = document.createElement('div');
    overlay.className = 'oven-overlay';
    overlay.innerHTML = `<div class="oven-card">
      <span class="oven-emoji">🔥</span>
      <div class="oven-text">Baking your cake...</div>
      <div class="oven-bar"><span></span></div>
    </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    requestAnimationFrame(() => requestAnimationFrame(() => { overlay.querySelector('.oven-bar > span').style.width = '100%'; }));
    SKAudio.play('whoosh');
    setTimeout(() => {
      overlay.querySelector('.oven-emoji').textContent = '🎂';
      overlay.querySelector('.oven-text').textContent = 'Ta-da!';
      SKAudio.play('fanfare');
    }, 1500);
    setTimeout(() => { overlay.remove(); done(); }, 2100);
  }

  function defaultState() { return { shape: 'round', color: FROSTING[0].value, layers: 1, topper: 'none', candles: 0 }; }

  function mountCake(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const state = defaultState();

    function addRow(catsWrap, labelText, key, options, renderOpt) {
      const row = document.createElement('div');
      row.className = 'cust-row';
      row.innerHTML = `<div class="cust-row-label">${labelText}</div>`;
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
        <div class="cust-preview" id="cakePreview"></div>
        <div class="cust-categories" id="cakeCats"></div>
        <button class="btn btn-xl btn-coral cust-done" type="button">🎂 Bake it!</button>`;
      shell.stage.querySelector('#cakePreview').innerHTML = renderPreview(state);
      const catsWrap = shell.stage.querySelector('#cakeCats');

      addRow(catsWrap, 'Shape', 'shape', SHAPES, (o) => `<span class="cust-swatch-emoji">${o.icon}</span>`);
      addRow(catsWrap, 'Frosting Color', 'color', FROSTING, (o) => `<span class="cust-swatch-color" style="background:${o.value}"></span>`);
      addRow(catsWrap, 'Layers', 'layers', LAYER_OPTS, (o) => `<span class="cust-swatch-emoji">${o.icon}</span>`);
      addRow(catsWrap, 'Topper', 'topper', TOPPERS, (o) => `<span class="cust-swatch-emoji">${o.icon}</span>`);

      const candleRow = document.createElement('div');
      candleRow.className = 'cust-row';
      candleRow.innerHTML = `<div class="cust-row-label">Candles</div>
        <div class="cust-stepper">
          <button type="button" class="cand-minus" ${state.candles <= 0 ? 'disabled' : ''}>−</button>
          <span class="cust-stepper-value">${state.candles}</span>
          <button type="button" class="cand-plus" ${state.candles >= 10 ? 'disabled' : ''}>+</button>
        </div>`;
      candleRow.querySelector('.cand-minus').addEventListener('click', () => { if (state.candles > 0) { state.candles--; SKAudio.play('pop'); render(); } });
      candleRow.querySelector('.cand-plus').addEventListener('click', () => { if (state.candles < 10) { state.candles++; SKAudio.play('pop'); render(); } });
      catsWrap.appendChild(candleRow);

      shell.stage.querySelector('.cust-done').addEventListener('click', () => {
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
    id: 'buildcake',
    title: 'Build-a-Cake',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'pip',
    color: 'coral',
    icon: '🎂',
    blurb: 'Choose a shape, a color, and bake your own birthday cake!',
    mount(root, ctx) { return mountCake(root, this, ctx.level); }
  });
})();
