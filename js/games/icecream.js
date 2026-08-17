/* ============================================================
   SuperKids — Ice Cream Stacker
   Hosted by Pip. Tap scoop flavors to add them to a cone; each
   scoop wobbles onto the stack. Creative mode — always awards
   3 stars, complete when the goal number of scoops is reached.
   ============================================================ */
(function () {
  'use strict';

  const FLAVORS = [
    { label: 'Strawberry', color: '#FF8FB1' },
    { label: 'Vanilla', color: '#FFF3D6' },
    { label: 'Chocolate', color: '#8B5E34' },
    { label: 'Mint', color: '#9CF0D4' },
    { label: 'Blueberry', color: '#8FB3FF' },
    { label: 'Lemon', color: '#FFE58A' },
    { label: 'Bubblegum', color: '#D0A7FF' },
    { label: 'Rainbow', color: 'linear-gradient(180deg,#FF6F7D,#FFC93C,#3DDC97,#4EA8FF)' }
  ];
  const TOPPINGS = [
    { value: 'cherry', label: 'Cherry', icon: '🍒' },
    { value: 'sprinkle', label: 'Sprinkles', icon: '🎨' },
    { value: 'chocolate', label: 'Chocolate chip', icon: '🍫' },
    { value: 'star', label: 'Star', icon: '⭐' }
  ];
  const GOAL = { 1: 3, 2: 5, 3: 7 };

  function mountIC(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const goal = GOAL[level] || 3;
    const scoops = [];
    let topping = null;

    shell.stage.innerHTML = `
      <p class="ic-instructions">Tap a scoop to add it to your cone!</p>
      <div class="ic-preview" id="icPreview"></div>
      <div class="cust-categories" id="icCats"></div>
      <button class="btn btn-xl btn-coral cust-done" type="button" disabled>🍦 All done!</button>`;
    const preview = shell.stage.querySelector('#icPreview');
    const cats = shell.stage.querySelector('#icCats');

    // scoops row
    const row1 = document.createElement('div');
    row1.className = 'cust-row';
    row1.innerHTML = `<div class="cust-row-label">Add a scoop</div>`;
    const sw1 = document.createElement('div'); sw1.className = 'cust-swatches';
    FLAVORS.forEach((f) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'cust-swatch'; btn.title = f.label;
      btn.innerHTML = `<span class="cust-swatch-color" style="background:${f.color}"></span>`;
      btn.addEventListener('click', () => {
        if (scoops.length >= goal) return;
        scoops.push(f);
        SKAudio.play('pop');
        render();
        if (scoops.length >= goal) {
          shell.stage.querySelector('.cust-done').disabled = false;
          shell.setDots(scoops.length, goal);
        } else {
          shell.setDots(scoops.length, goal);
        }
      });
      sw1.appendChild(btn);
    });
    row1.appendChild(sw1);
    cats.appendChild(row1);

    // toppings row
    const row2 = document.createElement('div');
    row2.className = 'cust-row';
    row2.innerHTML = `<div class="cust-row-label">Topping</div>`;
    const sw2 = document.createElement('div'); sw2.className = 'cust-swatches';
    TOPPINGS.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'cust-swatch'; btn.title = t.label;
      btn.innerHTML = `<span class="cust-swatch-emoji">${t.icon}</span>`;
      btn.addEventListener('click', () => {
        topping = t;
        SKAudio.play('pop');
        sw2.querySelectorAll('.cust-swatch').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        render();
      });
      sw2.appendChild(btn);
    });
    row2.appendChild(sw2);
    cats.appendChild(row2);

    // undo row
    const undoBtn = document.createElement('button');
    undoBtn.type = 'button'; undoBtn.className = 'btn btn-ghost ic-undo'; undoBtn.textContent = '↺ Take a scoop off';
    undoBtn.addEventListener('click', () => {
      if (!scoops.length) return;
      scoops.pop(); SKAudio.play('pop');
      shell.stage.querySelector('.cust-done').disabled = scoops.length < goal;
      shell.setDots(scoops.length, goal);
      render();
    });
    cats.appendChild(undoBtn);

    function render() {
      // build the cone + stacked scoops as inline SVG
      const cx = 100, coneTop = 210 - scoops.length * 30;
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" role="img" aria-label="Your ice cream">
        <defs>
          <linearGradient id="cn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4C989"/><stop offset="1" stop-color="#B98D4B"/></linearGradient>
          <linearGradient id="rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF6F7D"/><stop offset=".33" stop-color="#FFC93C"/><stop offset=".66" stop-color="#3DDC97"/><stop offset="1" stop-color="#4EA8FF"/></linearGradient>
        </defs>
        <polygon points="60,210 140,210 100,255" fill="url(#cn)" stroke="#8B5E34" stroke-width="2"/>
        <g stroke="#8B5E34" stroke-width="1" opacity=".35"><line x1="70" y1="215" x2="100" y2="255"/><line x1="130" y1="215" x2="100" y2="255"/><line x1="85" y1="215" x2="115" y2="255"/><line x1="115" y1="215" x2="85" y2="255"/></g>`;
      scoops.forEach((f, i) => {
        const y = coneTop + i * 30 + 30;
        const fill = f.color.startsWith('linear') ? 'url(#rb)' : f.color;
        const sway = (i % 2 === 0 ? -1 : 1) * 2;
        svg += `<circle cx="${cx + sway}" cy="${y}" r="30" fill="${fill}" stroke="rgba(0,0,0,.08)" stroke-width="2"/>`;
        svg += `<ellipse cx="${cx - 8 + sway}" cy="${y - 10}" rx="7" ry="4" fill="#fff" opacity=".5"/>`;
      });
      if (scoops.length > 0 && topping) {
        const topY = coneTop + (scoops.length - 1) * 30 + 12;
        svg += `</svg><span class="ic-topper" style="left:50%;top:${(topY / 260 * 100).toFixed(1)}%;font-size:1.8rem;">${topping.icon}</span>`;
      } else {
        svg += `</svg>`;
      }
      preview.innerHTML = svg;
    }
    render();
    shell.setDots(0, goal);

    shell.stage.querySelector('.cust-done').addEventListener('click', () => {
      SKAudio.play('star');
      SKPlay.celebrate(root, gameDef, level, 3, 3, {
        onReplay: () => { scoops.length = 0; topping = null; render(); shell.setDots(0, goal); shell.stage.querySelector('.cust-done').disabled = true; }
      });
    });

    return { destroy() { SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'icecream',
    title: 'Ice Cream Stack',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'pip',
    color: 'coral',
    icon: '🍦',
    blurb: 'Stack up scoops of every flavor and top your ice cream!',
    mount(root, ctx) { return mountIC(root, this, ctx.level); }
  });
})();
