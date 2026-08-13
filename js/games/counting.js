/* ============================================================
   SuperKids — Counting Meadow
   Hosted by Ziggy the Lion. Subject: math.
   ============================================================ */
(function () {
  'use strict';
  const OBJS = ['🍓', '⭐', '🐝', '🎈', '🐠', '🍄', '🦋', '🌼'];

  function genQuestion(level) {
    let n, choiceCount, dn = 0;
    if (level === 1) { n = SK.randInt(1, 5); choiceCount = 3; }
    else if (level === 2) { n = SK.randInt(3, 10); choiceCount = 3; }
    else { n = SK.randInt(6, 15); choiceCount = 4; if (Math.random() < 0.6) dn = SK.randInt(3, 8); }

    const obj = SK.pickOne(OBJS);
    let distractorObj = SK.pickOne(OBJS);
    while (distractorObj === obj) distractorObj = SK.pickOne(OBJS);

    // Bias placement toward the center of the field. With only a
    // handful of items a full-width random scatter can land them all
    // near one edge; the spread only widens out once there are enough
    // items that they actually need the room to stay countable.
    const total = n + dn;
    const spread = Math.min(1, 0.35 + total * 0.045);
    const rangeX = 38 * spread, rangeY = 33 * spread;
    function placement() {
      return { x: 50 + SK.rand(-rangeX, rangeX), y: 46 + SK.rand(-rangeY, rangeY), r: SK.rand(-18, 18) };
    }

    let items = [];
    for (let i = 0; i < n; i++) items.push(Object.assign({ e: obj }, placement()));
    for (let i = 0; i < dn; i++) items.push(Object.assign({ e: distractorObj }, placement()));
    items = SK.shuffle(items);

    const visualHTML = `<div class="count-field">${items.map((it) => `<span class="count-ico" style="left:${it.x}%;top:${it.y}%;transform:translate(-50%,-50%) rotate(${it.r.toFixed(1)}deg)">${it.e}</span>`).join('')}</div>`;

    const set = new Set([n]);
    let guard = 0;
    while (set.size < choiceCount && guard < 40) { guard++; const v = n + SK.pickOne([-3, -2, -1, 1, 2, 3]); if (v >= 1) set.add(v); }
    const choices = SK.shuffle([...set]).map((v) => ({ html: `<span class="choice-num">${v}</span>`, correct: v === n }));

    return {
      promptHTML: `How many <b>${obj}</b> can you count?`,
      promptSpeak: `How many can you count?`,
      visualHTML,
      choices,
      layout: choiceCount === 3 ? 'row3' : 'row4'
    };
  }

  window.SKQBank = window.SKQBank || {};
  window.SKQBank.counting = genQuestion;

  registerGame({
    id: 'counting',
    title: 'Counting Meadow',
    subject: 'math',
    subjectLabel: 'Maths',
    buddy: 'ziggy',
    color: 'sky',
    icon: '🔢',
    blurb: 'Count the busy critters in the meadow!',
    questionsPerRound: 8,
    mount(root, ctx) {
      return SKPlay.runQuiz(root, this, ctx.level, { totalQuestions: 8, generateQuestion: genQuestion });
    }
  });
})();
