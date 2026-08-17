/* ============================================================
   SuperKids — shell.js
   Game registry, hash router, screen renderers (home, pick,
   map, stickers, parents) and the shared SKPlay toolkit that
   every game module builds on (topbar, quiz engine, celebration).
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- game registry ---------- */
  const SKGames = [];
  function registerGame(def) { SKGames.push(def); }

  /* ---------- brand mark: all 4 character faces, smiling together ---------- */
  function logoSVG(size) {
    return SKChar.renderLogo(size);
  }

  /* ---------- screen switching ---------- */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((el) => el.classList.toggle('screen-active', el.id === id));
  }

  /* ================= HOME ================= */
  function renderHome() {
    const m1 = document.getElementById('brandMark'), m2 = document.getElementById('brandMark2');
    if (m1 && !m1.dataset.done) { m1.innerHTML = logoSVG(40); m1.dataset.done = '1'; }
    if (m2 && !m2.dataset.done) { m2.innerHTML = logoSVG(40); m2.dataset.done = '1'; }

    const stage = document.getElementById('heroStage');
    if (stage && !stage.dataset.done) {
      stage.dataset.done = '1';
      stage.innerHTML = `
        <div class="stage-slot slot-back">${SKChar.render('luna', { size: 92, pose: 'idle' })}</div>
        <div class="stage-slot slot-left">${SKChar.render('pip', { size: 116, pose: 'idle' })}</div>
        <div class="stage-slot slot-right">${SKChar.render('bolt', { size: 116, pose: 'wave' })}</div>
        <div class="stage-slot slot-main">${SKChar.render('ziggy', { size: 188, pose: 'idle' })}</div>`;
    }

    const crew = document.getElementById('crewGrid');
    if (crew && !crew.dataset.done) {
      crew.dataset.done = '1';
      crew.innerHTML = SKChar.CHARACTERS.map((c) => `
        <div class="crew-card acc-${c.theme}">
          ${SKChar.render(c.id, { size: 128, pose: 'idle' })}
          <div class="crew-name">${c.name}</div>
          <div class="crew-role">${c.role}</div>
          <p class="crew-blurb">${c.blurb}</p>
        </div>`).join('');
    }

    const showcase = document.getElementById('showcase');
    if (showcase && !showcase.dataset.done && SKGames.length) {
      showcase.dataset.done = '1';
      const NEW_GAMES = new Set(['buildbear', 'buildsnowman', 'carwash', 'buildcake']);
      showcase.innerHTML = SKGames.map((g) => {
        const cover = window.SKCovers ? SKCovers.get(g.id) : null;
        const coverHTML = cover
          ? `<div class="g-cover">${cover}</div>`
          : `<div class="g-icon">${g.icon}</div>`;
        return `
        <div class="game-card acc-${g.color}" data-go="#/pick">
          ${NEW_GAMES.has(g.id) ? '<span class="new-ribbon" aria-label="New game">NEW!</span>' : ''}
          <div class="g-buddy">${SKChar.render(g.buddy, { size: 38, mode: 'face' })}</div>
          ${coverHTML}
          <div class="g-tag">${g.subjectLabel}</div>
          <div class="g-title">${g.title}</div>
          <p class="g-blurb">${g.blurb}</p>
        </div>`;
      }).join('');
    }
  }

  /* ================= PICK BUDDY ================= */
  let pickSelection = null;
  function renderPick() {
    const s = SK.getState();
    pickSelection = s.buddy || null;
    const grid = document.getElementById('pickGrid');
    grid.innerHTML = SKChar.CHARACTERS.map((c) => `
      <div class="pick-card acc-${c.theme} ${pickSelection === c.id ? 'picked' : ''}" data-buddy="${c.id}">
        ${SKChar.render(c.id, { size: 116, pose: 'idle' })}
        <div class="p-name">${c.name}</div>
        <div class="p-role">${c.role}</div>
      </div>`).join('');

    grid.querySelectorAll('.pick-card').forEach((card) => {
      card.addEventListener('click', () => {
        pickSelection = card.dataset.buddy;
        grid.querySelectorAll('.pick-card').forEach((c) => c.classList.remove('picked'));
        card.classList.add('picked');
        grid.querySelectorAll('.sk-char').forEach((svg) => SKChar.setPose(svg, 'idle'));
        SKChar.setPose(card.querySelector('.sk-char'), 'wave', 1500);
        SKAudio.play('pop');
        const c = SKChar.get(pickSelection);
        SKAudio.speak(c.name + '! ' + c.catchphrase);
        updatePickGoState();
      });
    });

    const nameInput = document.getElementById('kidName');
    nameInput.value = s.name || '';
    nameInput.oninput = updatePickGoState;
    nameInput.onkeydown = (e) => { if (e.key === 'Enter' && !document.getElementById('pickGo').disabled) document.getElementById('pickGo').click(); };
    updatePickGoState();

    document.getElementById('pickGo').onclick = () => {
      const name = nameInput.value.trim().slice(0, 12) || 'Friend';
      const st = SK.getState();
      st.name = name; st.buddy = pickSelection;
      SK.saveState();
      SKAudio.play('star');
      SK.toast(`Welcome, ${name}! 🎉`);
      go('#/map');
    };
  }
  function updatePickGoState() {
    const nameInput = document.getElementById('kidName');
    const btn = document.getElementById('pickGo');
    if (!nameInput || !btn) return;
    btn.disabled = !(pickSelection && nameInput.value.trim().length > 0);
  }

  /* ================= HUB / MAP ================= */
  function renderMap() {
    const s = SK.getState();
    const buddy = SKChar.get(s.buddy || 'ziggy');

    const hubMe = document.getElementById('hubMe');
    hubMe.innerHTML = SKChar.render(buddy.id, { size: 46, mode: 'face', pose: 'idle' }) + `<span>${s.name || 'Friend'}</span>`;
    hubMe.setAttribute('data-go', '#/pick');
    hubMe.style.cursor = 'pointer';

    document.getElementById('starCount').textContent = s.stars;
    document.getElementById('hubHello').textContent = `Hi ${s.name || 'friend'}! What shall we play, with ${buddy.name}?`;

    document.querySelectorAll('#levelSwitch button').forEach((b) => {
      b.classList.toggle('active', Number(b.dataset.level) === (s.level || 1));
      b.onclick = () => {
        const st = SK.getState();
        st.level = Number(b.dataset.level);
        SK.saveState();
        SKAudio.play('click');
        renderMap();
      };
    });

    const grid = document.getElementById('gameGrid');
    grid.innerHTML = SKGames.map((g) => {
      const p = s.progress[g.id];
      const starsTxt = p ? `⭐ ${p.starsEarned} stars earned` : 'Not played yet';
      const cover = window.SKCovers ? SKCovers.get(g.id) : null;
      const coverHTML = cover
        ? `<div class="t-cover">${cover}</div>`
        : `<div class="t-icon">${g.icon}</div>`;
      return `<div class="tile acc-${g.color}" data-go="#/game/${g.id}">
        <div class="t-buddy">${SKChar.render(g.buddy, { size: 40, mode: 'face' })}</div>
        ${coverHTML}
        <div class="t-title">${g.title}</div>
        <p class="t-blurb">${g.blurb}</p>
        <div class="t-stars">${starsTxt}</div>
      </div>`;
    }).join('');
  }

  /* ================= GAME MOUNT ================= */
  let currentGameDestroy = null;
  function mountGame(id) {
    const gameDef = SKGames.find((g) => g.id === id);
    const root = document.getElementById('gameRoot');
    if (!gameDef) {
      root.innerHTML = '<div style="padding:80px 20px;text-align:center;"><h2>Hmm, that game wandered off.</h2><button class="btn btn-sun btn-xl" data-go="#/map">Back to Map</button></div>';
      return;
    }
    root.innerHTML = '';
    const s = SK.getState();
    const level = s.level || 1;
    const handle = gameDef.mount(root, { level, buddyId: s.buddy || gameDef.buddy });
    currentGameDestroy = handle && handle.destroy;
  }

  /* ================= STICKER BOOK ================= */
  function renderStickerBook() {
    const s = SK.getState();
    document.getElementById('stickerSub').textContent = `${s.stickers.length} of ${SK.STICKERS.length} collected — keep playing to unlock more!`;
    document.getElementById('stickerGrid').innerHTML = SK.STICKERS.map((st) => {
      const on = s.stickers.includes(st.id);
      return `<div class="sticker ${on ? 'unlocked' : ''}">
        <div class="s-ico">${st.icon}</div>
        <div class="s-name">${on ? st.name : '???'}</div>
        <div class="s-desc">${on ? st.desc : 'Keep playing!'}</div>
      </div>`;
    }).join('');
  }

  /* ================= PARENTS ROOM ================= */
  function renderParents() {
    const s = SK.getState();
    const wrap = document.getElementById('parentsWrap');
    wrap.innerHTML = `
      <h1 class="big-title" style="text-align:left">Grown-ups Room</h1>
      <p class="big-sub" style="text-align:left">Peek at progress and tune the experience — no account needed.</p>

      <div class="p-block">
        <h3>Settings</h3>
        <div class="p-row"><span>🔊 Sound effects</span><button class="switch ${s.settings.sound ? 'on' : ''}" id="toggleSound" aria-label="Toggle sound"></button></div>
        <div class="p-row"><span>🗣️ Read questions aloud</span><button class="switch ${s.settings.voice ? 'on' : ''}" id="toggleVoice" aria-label="Toggle voice"></button></div>
      </div>

      <div class="p-block">
        <h3>Progress overview</h3>
        <p style="margin-bottom:10px;">Total stars: <b>${s.stars}</b> &nbsp;·&nbsp; Stickers: <b>${s.stickers.length}/${SK.STICKERS.length}</b></p>
        ${SKGames.map((g) => {
          const p = s.progress[g.id] || { plays: 0, bestPct: 0, starsEarned: 0 };
          return `<div class="p-game-row">
            <div class="pg-top"><span>${g.icon} ${g.title}</span><span>${p.plays} play${p.plays === 1 ? '' : 's'}</span></div>
            <div class="prog-bar"><span style="width:${Math.round((p.bestPct || 0) * 100)}%"></span></div>
          </div>`;
        }).join('')}
      </div>

      <div class="p-block">
        <h3>Super Star Exams taken</h3>
        ${s.exams.length ? s.exams.slice(-5).reverse().map((e) => `<div class="p-row"><span>${new Date(e.at).toLocaleDateString()}</span><span>${e.score}/${e.total}</span></div>`).join('') : '<p>No exams taken yet.</p>'}
      </div>

      <div class="p-block">
        <h3>Privacy &amp; safety</h3>
        <p>SuperKids has no ads, no accounts and no chat. Progress lives only in this browser's local storage — nothing is uploaded anywhere.</p>
        <button class="btn btn-ghost" id="resetBtn">Reset all progress</button>
      </div>`;

    wrap.querySelector('#toggleSound').addEventListener('click', (e) => {
      const st = SK.getState(); st.settings.sound = !st.settings.sound; SK.saveState();
      e.currentTarget.classList.toggle('on'); SKAudio.play('click');
    });
    wrap.querySelector('#toggleVoice').addEventListener('click', (e) => {
      const st = SK.getState(); st.settings.voice = !st.settings.voice; SK.saveState();
      e.currentTarget.classList.toggle('on');
      if (st.settings.voice) SKAudio.speak('Voice is on!');
    });
    wrap.querySelector('#resetBtn').addEventListener('click', () => {
      if (confirm('Reset all stars, stickers and progress? This cannot be undone.')) {
        SK.resetProgress(); SK.toast('Progress reset.'); renderParents();
      }
    });
  }

  /* ================= ROUTER ================= */
  function parseHash() {
    return (location.hash || '#/').replace(/^#\//, '').split('/').filter(Boolean);
  }
  function go(hash) { location.hash = hash; }

  function router() {
    if (document.getElementById('screen-game').classList.contains('screen-active') && currentGameDestroy) {
      try { currentGameDestroy(); } catch (e) { /* ignore */ }
      currentGameDestroy = null;
    }
    SKAudio.stopSpeak();

    const parts = parseHash();
    const s = SK.getState();
    const needsBuddy = !s.name || !s.buddy;
    if (needsBuddy && ['map', 'game', 'stickers'].includes(parts[0])) {
      location.hash = '#/pick';
      return;
    }
    window.scrollTo(0, 0);

    if (parts[0] === 'pick') { showScreen('screen-pick'); renderPick(); }
    else if (parts[0] === 'map') { showScreen('screen-map'); renderMap(); }
    else if (parts[0] === 'game' && parts[1]) { showScreen('screen-game'); mountGame(parts[1]); }
    else if (parts[0] === 'stickers') { showScreen('screen-stickers'); renderStickerBook(); }
    else if (parts[0] === 'parents') { showScreen('screen-parents'); renderParents(); }
    else { showScreen('screen-home'); renderHome(); }
  }
  window.addEventListener('hashchange', router);

  /* ---------- global delegated nav clicks ---------- */
  document.addEventListener('click', (e) => {
    const goEl = e.target.closest('[data-go]');
    if (goEl) { SKAudio.play('click'); go(goEl.getAttribute('data-go')); return; }
    const scrollEl = e.target.closest('[data-scroll]');
    if (scrollEl) {
      const target = document.querySelector(scrollEl.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ================= SKPlay toolkit (used by all games) ================= */
  const SKPlay = (function () {
    function exitToMap() { go('#/map'); }

    function mountShell(root, gameDef) {
      const s = SK.getState();
      root.innerHTML = `
        <div class="gp-wrap acc-${gameDef.color}">
          <div class="gp-top">
            <button class="btn-round gp-exit" type="button" title="Exit to map" aria-label="Exit to map">✕</button>
            <div class="gp-dots" id="gpDots"></div>
            <div class="gp-buddy" id="gpBuddy"></div>
          </div>
          <div class="gp-title">${gameDef.icon} ${gameDef.title}</div>
          <div class="gp-stage" id="gpStage"></div>
        </div>`;
      root.querySelector('.gp-exit').addEventListener('click', exitToMap);
      const buddyId = s.buddy || gameDef.buddy;
      root.querySelector('#gpBuddy').innerHTML = SKChar.render(buddyId, { size: 56, pose: 'idle' });
      const buddySvg = root.querySelector('#gpBuddy .sk-char');
      const dotsEl = root.querySelector('#gpDots');
      function setDots(i, total) {
        dotsEl.innerHTML = SK.range(1, total).map((n) => `<span class="gp-dot ${n <= i ? 'done' : ''} ${n === i + 1 ? 'now' : ''}"></span>`).join('');
      }
      return {
        stage: root.querySelector('#gpStage'),
        buddyId, buddySvg, setDots,
        cheer() { SKChar.setPose(buddySvg, 'cheer', 1100); },
        oops() { SKChar.setPose(buddySvg, 'oops', 800); },
        wave() { SKChar.setPose(buddySvg, 'wave', 1400); }
      };
    }

    function speakerButton(text) {
      const btn = document.createElement('button');
      btn.className = 'spk-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Read aloud'); btn.innerHTML = '🔊';
      btn.addEventListener('click', (e) => { e.stopPropagation(); SKAudio.play('click'); SKAudio.speak(text); });
      return btn;
    }

    function confettiFromEl(el, opts) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      SK.burst(r.left + r.width / 2, r.top + r.height / 2, opts);
    }

    function celebrate(root, gameDef, level, correct, total, opts) {
      opts = opts || {};
      const s = SK.getState();
      const result = SK.recordRound(gameDef.id, gameDef.subject, correct, total, level);
      SKAudio.play('fanfare');
      SK.fireworkRain({ count: 70 });
      const pct = total ? Math.round((correct / total) * 100) : 100;
      const buddyId = s.buddy || gameDef.buddy;
      const overlay = document.createElement('div');
      overlay.className = 'celebrate-overlay';
      overlay.innerHTML = `
        <div class="celebrate-card">
          <div class="cel-buddy">${SKChar.render(buddyId, { size: 148, pose: 'cheer' })}</div>
          <h2>Amazing, ${s.name || 'friend'}! 🎉</h2>
          <p class="cel-sub">You got ${correct} out of ${total} right (${pct}%)</p>
          <div class="cel-stars">${[1, 2, 3].map((n) => `<span class="cel-star ${n <= result.stars ? 'lit' : ''}" style="animation-delay:${n * 0.15}s">⭐</span>`).join('')}</div>
          ${result.unlocked.length ? `<div class="cel-unlock"><b>New sticker${result.unlocked.length > 1 ? 's' : ''} unlocked!</b><div class="cel-unlock-row">${result.unlocked.map((u) => `<span>${u.icon} ${u.name}</span>`).join('')}</div></div>` : ''}
          <div class="cel-actions">
            ${opts.extraButton ? `<button class="btn btn-grape btn-xl cel-extra" type="button">${opts.extraButton.label}</button>` : ''}
            <button class="btn btn-sun btn-xl cel-again" type="button">Play Again ▶</button>
            <button class="btn btn-ghost btn-xl cel-map" type="button">Back to Map</button>
          </div>
        </div>`;
      root.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('show'));
      overlay.querySelector('.cel-again').addEventListener('click', () => {
        overlay.remove();
        if (opts.onReplay) opts.onReplay(); else exitToMap();
      });
      overlay.querySelector('.cel-map').addEventListener('click', exitToMap);
      if (opts.extraButton) {
        overlay.querySelector('.cel-extra').addEventListener('click', () => opts.extraButton.onClick(result));
      }
    }

    function runQuiz(root, gameDef, level, opts) {
      const shell = mountShell(root, gameDef);
      const total = opts.totalQuestions || 8;
      let idx = 0, correct = 0, locked = false, firstTry = true;

      function showQuestion() {
        if (idx >= total) {
          if (opts.onComplete) { try { opts.onComplete(correct, total); } catch (e) { /* ignore */ } }
          const extra = opts.extraButton ? opts.extraButton(correct, total) : null;
          celebrate(root, gameDef, level, correct, total, {
            onReplay() { idx = 0; correct = 0; showQuestion(); },
            extraButton: extra || undefined
          });
          return;
        }
        locked = false; firstTry = true;
        const q = opts.generateQuestion(level, idx);
        shell.setDots(idx, total);
        shell.stage.innerHTML = `
          <div class="q-card">
            <div class="q-prompt-row"><div class="q-prompt">${q.promptHTML || q.promptText || ''}</div></div>
            ${q.visualHTML ? `<div class="q-visual">${q.visualHTML}</div>` : ''}
            <div class="q-choices ${q.layout ? 'layout-' + q.layout : ''}"></div>
          </div>`;
        const promptRow = shell.stage.querySelector('.q-prompt-row');
        promptRow.appendChild(speakerButton(q.promptSpeak || q.promptText || ''));
        if (opts.autoSpeak !== false) setTimeout(() => SKAudio.speak(q.promptSpeak || q.promptText || ''), 350);

        const choiceWrap = shell.stage.querySelector('.q-choices');
        q.choices.forEach((ch) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'choice-btn';
          btn.innerHTML = ch.html;
          btn.addEventListener('click', () => {
            if (locked) return;
            if (ch.correct) {
              locked = true;
              btn.classList.add('choice-correct');
              SKAudio.play('correct'); shell.cheer();
              confettiFromEl(btn, { count: 22, power: 9 });
              if (firstTry) correct++;
              setTimeout(() => { idx++; showQuestion(); }, 850);
            } else {
              btn.classList.add('choice-wrong'); btn.disabled = true;
              firstTry = false;
              SKAudio.play('wrong'); shell.oops();
              setTimeout(() => btn.classList.remove('choice-wrong'), 480);
            }
          });
          choiceWrap.appendChild(btn);
        });
      }
      showQuestion();
      return { destroy() { SKAudio.stopSpeak(); } };
    }

    /* ---------- customizer: preview + category swatches + Done ----------
       Powers the creative "build your own" games (bear, snowman, cake).
       Not graded — every finish is a full 3-star reward, since creative
       play shouldn't feel judged. opts:
         categories: [{ key, label, options:[{value,label,swatch|render}] }]
         renderPreview(state) -> svg/html string
         doneLabel: button text (default "All Done! ✨")
         beforeCelebrate(state, stageEl, proceed): optional; call proceed()
           when a custom pre-celebration sequence (e.g. cake's oven) finishes
         onDone(state): optional side-effect hook, fires before celebrate */
    function runCustomizer(root, gameDef, level, opts) {
      const shell = mountShell(root, gameDef);
      shell.setDots(0, 0);
      const state = {};
      opts.categories.forEach((cat) => { state[cat.key] = cat.default; });

      function render() {
        shell.stage.innerHTML = `
          <div class="cust-preview" id="custPreview">${opts.renderPreview(state)}</div>
          <div class="cust-categories" id="custCats"></div>
          <button class="btn btn-xl btn-sun cust-done" type="button">${opts.doneLabel || 'All Done! ✨'}</button>`;

        const catsWrap = shell.stage.querySelector('#custCats');
        opts.categories.forEach((cat) => {
          const row = document.createElement('div');
          row.className = 'cust-row';
          row.innerHTML = `<div class="cust-row-label">${cat.label}</div>`;
          const swatchWrap = document.createElement('div');
          swatchWrap.className = 'cust-swatches';
          cat.options.forEach((opt) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cust-swatch' + (state[cat.key] === opt.value ? ' active' : '');
            btn.setAttribute('aria-label', opt.label);
            btn.title = opt.label;
            btn.innerHTML = opt.render ? opt.render() : (opt.swatch ? `<span class="cust-swatch-color" style="background:${opt.swatch}"></span>` : `<span class="cust-swatch-emoji">${opt.icon || '·'}</span>`);
            btn.addEventListener('click', () => {
              if (state[cat.key] === opt.value) return;
              state[cat.key] = opt.value;
              SKAudio.play('pop');
              render();
            });
            swatchWrap.appendChild(btn);
          });
          row.appendChild(swatchWrap);
          catsWrap.appendChild(row);
        });

        shell.stage.querySelector('.cust-done').addEventListener('click', () => {
          SKAudio.play('star');
          if (opts.onDone) opts.onDone(state);
          const proceed = () => celebrate(root, gameDef, level, 3, 3, {
            onReplay() { opts.categories.forEach((cat) => { state[cat.key] = cat.default; }); render(); }
          });
          if (opts.beforeCelebrate) opts.beforeCelebrate(state, shell.stage, proceed);
          else proceed();
        });
      }

      render();
      return { destroy() { SKAudio.stopSpeak(); } };
    }

    return { mountShell, speakerButton, confettiFromEl, celebrate, runQuiz, runCustomizer, exitToMap };
  })();

  global.registerGame = registerGame;
  global.SKGames = SKGames;
  global.SKPlay = SKPlay;
  global.SKShell = { go, router };
})(window);
