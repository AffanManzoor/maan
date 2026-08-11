/* ============================================================
   SuperKids — Jigsaw Friends
   Hosted by Pip the Fox. Subject: puzzle.
   Rebuilds a portrait of a random SuperKids character from
   drag-or-tap pieces sliced via CSS background-position.
   ============================================================ */
(function () {
  'use strict';
  const CANVAS = 308;

  function svgDataURI(svgString) { return 'data:image/svg+xml,' + encodeURIComponent(svgString); }

  function buildRound(level) {
    let cols, rows;
    if (level === 1) { cols = 2; rows = 2; }
    else if (level === 2) { cols = 3; rows = 2; }
    else { cols = 3; rows = 3; }
    const charId = SK.pickOne(SKChar.CHARACTERS).id;
    const svg = SKChar.render(charId, { size: CANVAS, pose: 'idle', instance: 'jig' + SK.uid() });
    const uri = svgDataURI(svg);
    const pieceW = CANVAS / cols, pieceH = CANVAS / rows;
    const pieces = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pieces.push({ id: 'p' + r + '_' + c + '_' + SK.uid(), row: r, col: c, bgX: -(c * pieceW), bgY: -(r * pieceH) });
      }
    }
    return { charId, uri, cols, rows, pieceW, pieceH, pieces };
  }

  function mountJigsaw(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    shell.stage.innerHTML = `
      <p class="sort-instructions" id="jigLine">Rebuild the picture!</p>
      <div class="jig-board-wrap">
        <div class="jig-board" id="jigBoard"></div>
        <div class="jig-tray" id="jigTray"></div>
      </div>`;
    const boardEl = shell.stage.querySelector('#jigBoard');
    const trayEl = shell.stage.querySelector('#jigTray');
    const lineEl = shell.stage.querySelector('#jigLine');

    let data, placed, total, correctFirstTry, firstTryMap, selectedEl;
    let activeEl = null, startX = 0, startY = 0, offX = 0, offY = 0, dragging = false;

    function startRound() {
      data = buildRound(level);
      total = data.pieces.length;
      placed = 0; correctFirstTry = 0; selectedEl = null;
      firstTryMap = {};
      data.pieces.forEach((p) => { firstTryMap[p.id] = true; });
      shell.setDots(0, total);
      lineEl.textContent = `Rebuild ${SKChar.get(data.charId).name}! Drag each piece into place.`;

      boardEl.classList.remove('jig-complete');
      boardEl.style.width = CANVAS + 'px'; boardEl.style.height = CANVAS + 'px';
      boardEl.style.gridTemplateColumns = `repeat(${data.cols}, 1fr)`;
      boardEl.style.gridTemplateRows = `repeat(${data.rows}, 1fr)`;
      boardEl.innerHTML = data.pieces.map((p) => `
        <div class="jig-slot" data-row="${p.row}" data-col="${p.col}">
          <div class="jig-hint" style="background-image:url('${data.uri}');background-size:${CANVAS}px ${CANVAS}px;background-position:${p.bgX}px ${p.bgY}px;"></div>
        </div>`).join('');

      const trayPieces = SK.shuffle(data.pieces.slice());
      trayEl.innerHTML = trayPieces.map((p) => `
        <div class="jig-piece" id="${p.id}" data-row="${p.row}" data-col="${p.col}"
             style="width:${data.pieceW}px;height:${data.pieceH}px;background-image:url('${data.uri}');background-size:${CANVAS}px ${CANVAS}px;background-position:${p.bgX}px ${p.bgY}px;"></div>`).join('');
    }

    function selectItem(el) {
      if (selectedEl) selectedEl.classList.remove('selected');
      if (selectedEl === el) { selectedEl = null; return; }
      selectedEl = el; el.classList.add('selected');
      SKAudio.play('pop');
    }
    function springBack(el) {
      el.classList.remove('is-dragging');
      el.style.position = ''; el.style.left = ''; el.style.top = ''; el.style.zIndex = ''; el.style.transform = ''; el.style.transition = '';
    }
    function findSlotAt(x, y) {
      let found = null;
      boardEl.querySelectorAll('.jig-slot').forEach((s) => {
        const br = s.getBoundingClientRect();
        if (x >= br.left && x <= br.right && y >= br.top && y <= br.bottom) found = s;
      });
      return found;
    }

    function tryPlace(el, slot) {
      const correct = el.dataset.row === slot.dataset.row && el.dataset.col === slot.dataset.col;
      if (correct) {
        el.classList.remove('is-dragging');
        const br = slot.getBoundingClientRect();
        const r0 = el.getBoundingClientRect();
        el.style.position = 'fixed'; el.style.zIndex = 999;
        el.style.left = r0.left + 'px'; el.style.top = r0.top + 'px';
        el.style.transition = 'all .3s cubic-bezier(.34,1.56,.64,1)';
        requestAnimationFrame(() => {
          el.style.left = br.left + 'px'; el.style.top = br.top + 'px';
          el.style.width = br.width + 'px'; el.style.height = br.height + 'px';
        });
        SKAudio.play('place');
        SKPlay.confettiFromEl(slot, { count: 10, power: 6 });
        shell.cheer();
        el.classList.add('placed');
        if (firstTryMap[el.id]) correctFirstTry++;
        placed++;
        shell.setDots(placed, total);
        setTimeout(() => {
          el.style.position = 'absolute'; el.style.left = '0'; el.style.top = '0'; el.style.zIndex = '';
          el.style.transition = ''; el.style.width = '100%'; el.style.height = '100%';
          slot.appendChild(el);
          if (placed >= total) {
            boardEl.classList.add('jig-complete');
            setTimeout(finish, 500);
          }
        }, 300);
      } else {
        firstTryMap[el.id] = false;
        SKAudio.play('wrong'); shell.oops();
        el.classList.add('shake-no');
        setTimeout(() => { el.classList.remove('shake-no'); springBack(el); }, 420);
      }
    }

    function onPointerMove(e) {
      if (!activeEl) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!dragging && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        dragging = true;
        const r = activeEl.getBoundingClientRect();
        activeEl.classList.add('is-dragging');
        activeEl.style.position = 'fixed';
        activeEl.style.left = r.left + 'px'; activeEl.style.top = r.top + 'px';
        activeEl.style.zIndex = 999;
      }
      if (dragging) {
        activeEl.style.left = (e.clientX - offX) + 'px';
        activeEl.style.top = (e.clientY - offY) + 'px';
        const overSlot = findSlotAt(e.clientX, e.clientY);
        boardEl.querySelectorAll('.jig-slot').forEach((s) => s.classList.toggle('hover', s === overSlot));
      }
    }
    function onPointerUp() {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      const el = activeEl; activeEl = null;
      if (!el) return;
      boardEl.querySelectorAll('.jig-slot').forEach((s) => s.classList.remove('hover'));
      if (!dragging) { selectItem(el); return; }
      dragging = false;
      const r = el.getBoundingClientRect();
      const targetSlot = findSlotAt(r.left + r.width / 2, r.top + r.height / 2);
      if (targetSlot) tryPlace(el, targetSlot); else springBack(el);
    }
    function onPointerDown(e) {
      const el = e.target.closest('.jig-piece');
      if (!el || el.classList.contains('placed')) return;
      activeEl = el;
      const r = el.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      offX = e.clientX - r.left; offY = e.clientY - r.top;
      dragging = false;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    trayEl.addEventListener('pointerdown', onPointerDown);
    boardEl.addEventListener('click', (e) => {
      const slot = e.target.closest('.jig-slot');
      if (!slot || !selectedEl) return;
      const el = selectedEl; selectedEl = null; el.classList.remove('selected');
      tryPlace(el, slot);
    });

    function finish() {
      SKPlay.celebrate(root, gameDef, level, correctFirstTry, total, { onReplay: startRound });
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
    id: 'jigsaw',
    title: 'Jigsaw Friends',
    subject: 'puzzle',
    subjectLabel: 'Puzzles',
    buddy: 'pip',
    color: 'sky',
    icon: '🧩',
    blurb: 'Piece together a picture of your favorite friend!',
    mount(root, ctx) { return mountJigsaw(root, this, ctx.level); }
  });
})();
