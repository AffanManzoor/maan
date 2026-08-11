/* ============================================================
   SuperKids — Shape Sorter
   Hosted by Pip the Fox. Subject: puzzle.
   Drag (pointer events) OR tap-to-select then tap-a-bin.
   ============================================================ */
(function () {
  'use strict';

  function buildRound(level) {
    const mode = level === 1 ? 'shape' : SK.pickOne(['shape', 'color']);
    let binCount, itemCount;
    if (level === 1) { binCount = 2; itemCount = 6; }
    else if (level === 2) { binCount = 3; itemCount = 8; }
    else { binCount = 4; itemCount = 10; }

    let cats, catRender;
    if (mode === 'color') {
      const colors = SK.pickN(SK.COLORS, binCount);
      cats = colors.map((c) => c.n);
      catRender = (cat) => SK.shapeSVG('circle', SK.COLORS.find((c) => c.n === cat).v, 44);
    } else {
      const pool = level === 1 ? SK.SHAPES.slice(0, 4) : SK.SHAPES.slice(0, 7);
      cats = SK.pickN(pool, binCount);
      catRender = (cat) => SK.shapeSVG(cat, '#8B7FB8', 44);
    }

    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const cat = cats[i % cats.length];
      let visual;
      if (mode === 'color') {
        const shape = SK.pickOne(SK.SHAPES.slice(0, 8));
        visual = SK.shapeSVG(shape, SK.COLORS.find((c) => c.n === cat).v, 52);
      } else {
        const color = SK.pickOne(SK.COLORS).v;
        visual = SK.shapeSVG(cat, color, 52);
      }
      items.push({ id: 'it' + i + '_' + SK.uid(), cat, visual });
    }
    return { mode, cats, catRender, items: SK.shuffle(items) };
  }

  function mountSorter(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    let data, remaining, correctFirstTry, firstTryMap, selectedEl;
    let activeEl = null, startX = 0, startY = 0, offX = 0, offY = 0, dragging = false;

    shell.stage.innerHTML = `
      <p class="sort-instructions">Drag or tap each shape into the matching bin!</p>
      <div class="sort-tray" id="sortTray"></div>
      <div class="sort-bins" id="sortBins"></div>`;
    const tray = shell.stage.querySelector('#sortTray');
    const binsWrap = shell.stage.querySelector('#sortBins');

    function startRound() {
      data = buildRound(level);
      remaining = data.items.length;
      correctFirstTry = 0;
      selectedEl = null;
      firstTryMap = {};
      data.items.forEach((it) => { firstTryMap[it.id] = true; });
      shell.setDots(0, data.items.length);

      binsWrap.innerHTML = data.cats.map((cat) => `
        <div class="sort-bin" data-cat="${cat}">
          <div class="bin-ico">${data.catRender(cat)}</div>
          <div class="bin-label">${cat}</div>
          <div class="bin-count">0</div>
        </div>`).join('');

      tray.innerHTML = data.items.map((it) => `<div class="sort-item" id="${it.id}" data-cat="${it.cat}">${it.visual}</div>`).join('');
    }

    function selectItem(el) {
      if (selectedEl) selectedEl.classList.remove('selected');
      if (selectedEl === el) { selectedEl = null; return; }
      selectedEl = el; el.classList.add('selected');
      SKAudio.play('pop');
    }

    function springBack(el) {
      el.classList.remove('is-dragging');
      el.style.position = ''; el.style.left = ''; el.style.top = ''; el.style.width = ''; el.style.zIndex = ''; el.style.transform = ''; el.style.transition = '';
    }

    function tryPlace(el, bin) {
      const correct = el.dataset.cat === bin.dataset.cat;
      if (correct) {
        el.classList.remove('is-dragging');
        const br = bin.getBoundingClientRect();
        const r0 = el.getBoundingClientRect();
        el.style.position = 'fixed'; el.style.zIndex = 999;
        el.style.left = r0.left + 'px'; el.style.top = r0.top + 'px';
        el.style.transition = 'all .35s cubic-bezier(.34,1.56,.64,1)';
        requestAnimationFrame(() => {
          el.style.left = (br.left + br.width / 2 - 24) + 'px';
          el.style.top = (br.top + br.height / 2 - 24) + 'px';
          el.style.transform = 'scale(.3)'; el.style.opacity = '0';
        });
        SKAudio.play('place');
        SKPlay.confettiFromEl(bin, { count: 14, power: 7 });
        shell.cheer();
        const countEl = bin.querySelector('.bin-count');
        countEl.textContent = String(parseInt(countEl.textContent, 10) + 1);
        bin.classList.add('bin-pop'); setTimeout(() => bin.classList.remove('bin-pop'), 350);
        el.classList.add('placed');
        if (firstTryMap[el.id]) correctFirstTry++;
        remaining--;
        shell.setDots(data.items.length - remaining, data.items.length);
        setTimeout(() => { el.remove(); if (remaining <= 0) finish(); }, 360);
      } else {
        firstTryMap[el.id] = false;
        SKAudio.play('wrong'); shell.oops();
        el.classList.add('shake-no');
        setTimeout(() => { el.classList.remove('shake-no'); springBack(el); }, 420);
      }
    }

    function findBinAt(x, y) {
      let found = null;
      binsWrap.querySelectorAll('.sort-bin').forEach((b) => {
        const br = b.getBoundingClientRect();
        if (x >= br.left && x <= br.right && y >= br.top && y <= br.bottom) found = b;
      });
      return found;
    }

    function onPointerMove(e) {
      if (!activeEl) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!dragging && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        dragging = true;
        const r = activeEl.getBoundingClientRect();
        activeEl.classList.add('is-dragging');
        activeEl.style.width = r.width + 'px';
        activeEl.style.position = 'fixed';
        activeEl.style.left = r.left + 'px';
        activeEl.style.top = r.top + 'px';
        activeEl.style.zIndex = 999;
      }
      if (dragging) {
        activeEl.style.left = (e.clientX - offX) + 'px';
        activeEl.style.top = (e.clientY - offY) + 'px';
        const overBin = findBinAt(e.clientX, e.clientY);
        binsWrap.querySelectorAll('.sort-bin').forEach((b) => b.classList.toggle('hover', b === overBin));
      }
    }
    function onPointerUp(e) {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      const el = activeEl; activeEl = null;
      if (!el) return;
      binsWrap.querySelectorAll('.sort-bin').forEach((b) => b.classList.remove('hover'));
      if (!dragging) { selectItem(el); return; }
      dragging = false;
      const r = el.getBoundingClientRect();
      const targetBin = findBinAt(r.left + r.width / 2, r.top + r.height / 2);
      if (targetBin) tryPlace(el, targetBin); else springBack(el);
    }
    function onPointerDown(e) {
      const el = e.target.closest('.sort-item');
      if (!el || el.classList.contains('placed')) return;
      activeEl = el;
      const r = el.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      offX = e.clientX - r.left; offY = e.clientY - r.top;
      dragging = false;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    tray.addEventListener('pointerdown', onPointerDown);
    binsWrap.addEventListener('click', (e) => {
      const bin = e.target.closest('.sort-bin');
      if (!bin || !selectedEl) return;
      const el = selectedEl; selectedEl = null; el.classList.remove('selected');
      tryPlace(el, bin);
    });

    function finish() {
      SKPlay.celebrate(root, gameDef, level, correctFirstTry, data.items.length, { onReplay: startRound });
    }

    startRound();
    return {
      destroy() {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      }
    };
  }

  registerGame({
    id: 'sorting',
    title: 'Shape Sorter',
    subject: 'puzzle',
    subjectLabel: 'Puzzles',
    buddy: 'pip',
    color: 'coral',
    icon: '🧺',
    blurb: 'Sort shapes and colors into the right bins!',
    mount(root, ctx) { return mountSorter(root, this, ctx.level); }
  });
})();
