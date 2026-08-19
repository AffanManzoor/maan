/* ============================================================
   Bloom Zoo — Sticker Studio (Plus)
   Hosted by Pip. A real sticker book, Lingo-Kids style: pick a
   scene backdrop, then tap stickers from the tray to add them,
   drag placed stickers to move them, tap to remove. Save when
   the scene is just right — always 3 stars.
   ============================================================ */
(function () {
  'use strict';

  // Sticker sets — Unicode emoji so they render everywhere the browser
  // has a colour-emoji font. Grouped by scene so each backdrop offers
  // its own thematic set of things to add.
  const SCENES = [
    {
      id: 'meadow',
      label: '🌳 Enchanted Meadow',
      stickers: ['🧚', '🦋', '🐝', '🌻', '🌷', '🐇', '🦔', '🍄', '🌸', '🌈', '🦉', '🐿️', '⭐', '☀️'],
      bg: `<defs>
        <linearGradient id="ssbgMeadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE4FF"/><stop offset="1" stop-color="#E4F2FF"/></linearGradient>
      </defs>
      <rect width="500" height="330" fill="url(#ssbgMeadow)"/>
      <circle cx="430" cy="60" r="30" fill="#FFC93C" opacity="0.85"/>
      <ellipse cx="80" cy="60" rx="26" ry="12" fill="#fff" opacity=".9"/>
      <ellipse cx="98" cy="66" rx="18" ry="8" fill="#fff" opacity=".9"/>
      <ellipse cx="360" cy="46" rx="22" ry="10" fill="#fff" opacity=".9"/>
      <path d="M0 200 Q120 186 250 200 T500 196 L500 330 L0 330 Z" fill="#3DDC97"/>
      <path d="M0 240 Q120 226 250 240 T500 236 L500 330 L0 330 Z" fill="#2FAB70"/>
      <g stroke="#2FAB70" stroke-width="2"><line x1="60" y1="230" x2="60" y2="215"/><line x1="160" y1="228" x2="160" y2="216"/><line x1="260" y1="232" x2="260" y2="218"/><line x1="380" y1="228" x2="380" y2="216"/></g>`
    },
    {
      id: 'ocean',
      label: '🌊 Ocean Adventure',
      stickers: ['🐠', '🐡', '🐙', '🐳', '🦀', '🦑', '🐚', '⭐', '🦈', '🐢', '🌴', '🏝️', '☀️', '🐬'],
      bg: `<defs>
        <linearGradient id="ssbgOcean" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE4FF"/><stop offset="1" stop-color="#2A7EE0"/></linearGradient>
      </defs>
      <rect width="500" height="330" fill="url(#ssbgOcean)"/>
      <circle cx="80" cy="52" r="28" fill="#FFC93C" opacity="0.9"/>
      <path d="M0 80 Q100 66 200 80 T400 76 T500 84 L500 100 Q400 92 300 100 T100 100 T0 96 Z" fill="rgba(255,255,255,.35)"/>
      <path d="M0 260 Q100 240 200 258 T400 254 T500 260 L500 330 L0 330 Z" fill="#E6C68A"/>
      <path d="M40 262 Q34 232 42 214 Q50 194 40 176" stroke="#2FAB70" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M460 260 Q468 234 458 216 Q450 196 462 178" stroke="#2FAB70" stroke-width="6" fill="none" stroke-linecap="round"/>`
    },
    {
      id: 'space',
      label: '🚀 Outer Space',
      stickers: ['🚀', '🛸', '👽', '🪐', '⭐', '☄️', '🌙', '☀️', '🌠', '🌌', '👨‍🚀', '🌍', '🌟', '✨'],
      bg: `<defs>
        <linearGradient id="ssbgSpace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1444"/><stop offset="1" stop-color="#5B3A9E"/></linearGradient>
      </defs>
      <rect width="500" height="330" fill="url(#ssbgSpace)"/>
      <g fill="#fff">
        <circle cx="30" cy="24" r="1.1"/><circle cx="82" cy="16" r="0.8"/><circle cx="140" cy="32" r="1.2"/>
        <circle cx="220" cy="14" r="0.9"/><circle cx="300" cy="20" r="1"/><circle cx="380" cy="10" r="1.2"/>
        <circle cx="450" cy="32" r="1.1"/><circle cx="60" cy="90" r="0.9"/><circle cx="200" cy="80" r="1.1"/>
        <circle cx="410" cy="88" r="1"/><circle cx="340" cy="120" r="0.9"/><circle cx="90" cy="180" r="1.1"/>
        <circle cx="470" cy="200" r="1"/><circle cx="30" cy="240" r="1.1"/><circle cx="380" cy="256" r="1"/>
      </g>
      <path d="M0 300 Q80 280 160 296 T340 292 T500 288 L500 330 L0 330 Z" fill="#0D1030"/>`
    },
    {
      id: 'castle',
      label: '🏰 Fairy Castle',
      stickers: ['🏰', '🧚', '🦄', '👑', '🐉', '🌈', '⭐', '💎', '🌸', '🌷', '🎠', '🐰', '🍭', '🕊️'],
      bg: `<defs>
        <linearGradient id="ssbgCastle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4C1D0"/><stop offset="1" stop-color="#F9E7F1"/></linearGradient>
      </defs>
      <rect width="500" height="330" fill="url(#ssbgCastle)"/>
      <ellipse cx="80" cy="60" rx="30" ry="14" fill="#fff" opacity=".9"/>
      <ellipse cx="380" cy="80" rx="30" ry="14" fill="#fff" opacity=".9"/>
      <path d="M0 240 Q120 220 250 236 T500 230 L500 330 L0 330 Z" fill="#B8DE7A"/>
      <path d="M0 270 Q120 256 250 272 T500 266 L500 330 L0 330 Z" fill="#9BC960"/>
      <!-- distant castle silhouette -->
      <g transform="translate(340 176)" opacity="0.85">
        <rect x="10" y="10" width="12" height="48" fill="#9B6BFF"/>
        <rect x="34" y="0" width="16" height="58" fill="#9B6BFF"/>
        <rect x="62" y="14" width="12" height="44" fill="#9B6BFF"/>
        <polygon points="4,10 16,-2 28,10" fill="#FF6F7D"/>
        <polygon points="28,0 42,-12 56,0" fill="#FF6F7D"/>
        <polygon points="56,14 68,4 80,14" fill="#FF6F7D"/>
      </g>`
    }
  ];

  const STICKER_SIZE = 60;
  const MIN_TO_SAVE = 3;

  function defaultState() { return { sceneId: 'meadow', placed: [] }; }

  function mountSticker(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const state = defaultState();
    let sceneEl = null;
    let dragging = null; // { id, offsetX, offsetY }
    let uid = 0;

    function scene() { return SCENES.find((s) => s.id === state.sceneId) || SCENES[0]; }

    function render() {
      const sc = scene();
      shell.stage.innerHTML = `
        <p class="pz-instructions">Pick a scene, tap stickers to add them, then drag them wherever you like!</p>
        <div class="ss-scene-picker" id="ssPicker"></div>
        <div class="ss-scene" id="ssScene"></div>
        <div class="ss-tray-wrap"><div class="ss-tray-label">Sticker tray — tap to add:</div><div class="ss-tray" id="ssTray"></div></div>
        <div class="fg-tools">
          <button class="btn btn-ghost pz-undo" id="ssUndo" type="button">↺ Undo last</button>
          <button class="btn btn-ghost pz-undo" id="ssClear" type="button">🧹 Clear all</button>
          <div class="fg-count">${state.placed.length} sticker${state.placed.length === 1 ? '' : 's'} added</div>
        </div>
        <button class="btn btn-xl btn-grape cust-done ss-done" type="button" ${state.placed.length < MIN_TO_SAVE ? 'disabled' : ''}>🎨 Save my scene!</button>`;

      // Scene picker chips
      const picker = shell.stage.querySelector('#ssPicker');
      SCENES.forEach((s) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ss-scene-chip' + (state.sceneId === s.id ? ' active' : '');
        btn.textContent = s.label;
        btn.addEventListener('click', () => {
          if (state.sceneId === s.id) return;
          state.sceneId = s.id;
          SKAudio.play('pop');
          render();
        });
        picker.appendChild(btn);
      });

      // Scene canvas — HTML overlay on top of the SVG backdrop so we can
      // absolutely-position emoji stickers on top of it.
      sceneEl = shell.stage.querySelector('#ssScene');
      sceneEl.innerHTML = `
        <svg class="ss-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 330" role="img" aria-label="${sc.label}">
          ${sc.bg}
        </svg>
        <div class="ss-placed" id="ssPlaced"></div>`;

      const placedHost = sceneEl.querySelector('#ssPlaced');
      state.placed.forEach((p) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'ss-placed-sticker';
        el.style.left = p.x + '%';
        el.style.top  = p.y + '%';
        el.style.transform = `translate(-50%,-50%) rotate(${p.rot}deg) scale(${p.scale})`;
        el.dataset.id = p.id;
        el.textContent = p.emoji;
        el.title = 'Drag to move · tap twice to remove';
        placedHost.appendChild(el);
      });

      // Tray
      const tray = shell.stage.querySelector('#ssTray');
      sc.stickers.forEach((emoji) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ss-tray-sticker';
        btn.textContent = emoji;
        btn.addEventListener('click', () => addSticker(emoji));
        tray.appendChild(btn);
      });

      shell.stage.querySelector('#ssUndo').addEventListener('click', () => {
        if (!state.placed.length) return;
        state.placed.pop(); SKAudio.play('pop'); render();
      });
      shell.stage.querySelector('#ssClear').addEventListener('click', () => {
        if (!state.placed.length) return;
        state.placed.length = 0; SKAudio.play('pop'); render();
      });
      shell.stage.querySelector('.ss-done').addEventListener('click', () => {
        SKAudio.play('star');
        SKPlay.confettiFromEl(sceneEl, { count: 40 });
        setTimeout(() => {
          SKPlay.celebrate(root, gameDef, level, 3, 3, {
            onReplay() { Object.assign(state, defaultState()); render(); }
          });
        }, 500);
      });

      wirePlaced(placedHost);
    }

    function addSticker(emoji) {
      if (state.placed.length >= 40) { SK.toast('That is a LOT of stickers already! 🎉'); return; }
      // seed position near the middle with a bit of scatter so re-taps don't
      // stack them all on the same pixel
      const i = state.placed.length;
      const x = 50 + ((i * 17) % 40) - 20;
      const y = 50 + ((i * 23) % 30) - 15;
      state.placed.push({
        id: ++uid, emoji, x, y,
        rot: (i * 37) % 22 - 11,
        scale: 1
      });
      SKAudio.play('pop');
      render();
    }

    function wirePlaced(host) {
      // pointer events on any child sticker — drag to move, quick tap to
      // remove. We compute deltas in the host's local coordinate space
      // so the sticker follows the finger exactly.
      let downAt = 0, downX = 0, downY = 0;
      host.addEventListener('pointerdown', (e) => {
        const el = e.target.closest('.ss-placed-sticker');
        if (!el) return;
        const id = Number(el.dataset.id);
        const p = state.placed.find((x) => x.id === id);
        if (!p) return;
        const rect = host.getBoundingClientRect();
        dragging = {
          id, hostRect: rect, offX: 0, offY: 0,
          startX: e.clientX, startY: e.clientY, el
        };
        downAt = Date.now(); downX = e.clientX; downY = e.clientY;
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging');
      });
      host.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const p = state.placed.find((x) => x.id === dragging.id);
        if (!p) return;
        const r = dragging.hostRect;
        p.x = Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100));
        p.y = Math.max(4, Math.min(96, ((e.clientY - r.top) / r.height) * 100));
        dragging.el.style.left = p.x + '%';
        dragging.el.style.top  = p.y + '%';
      });
      host.addEventListener('pointerup', (e) => {
        if (!dragging) return;
        dragging.el.classList.remove('dragging');
        // quick-tap detection — small movement + short duration = remove
        const dt = Date.now() - downAt;
        const dx = Math.abs(e.clientX - downX), dy = Math.abs(e.clientY - downY);
        if (dt < 220 && dx < 6 && dy < 6) {
          const id = dragging.id;
          state.placed = state.placed.filter((x) => x.id !== id);
          SKAudio.play('pop');
          dragging = null;
          render();
          return;
        }
        dragging = null;
        // no full re-render on drop; just refresh the count text
        const cnt = shell.stage.querySelector('.fg-count');
        if (cnt) cnt.textContent = `${state.placed.length} sticker${state.placed.length === 1 ? '' : 's'} added`;
      });
      host.addEventListener('pointercancel', () => {
        if (dragging && dragging.el) dragging.el.classList.remove('dragging');
        dragging = null;
      });
    }

    render();
    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'stickerstudio',
    title: 'Sticker Studio',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'pip',
    color: 'grape',
    icon: '🎨',
    blurb: 'Pick a scene and stick, drag and swap stickers to make your own picture!',
    premium: true,
    mount(root, ctx) { return mountSticker(root, this, ctx.level); }
  });
})();
