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

    // Laid out in tidy rows (upright, evenly spaced, never overlapping)
    // rather than scattered — much easier for a small child to count
    // accurately than a jumbled, rotated cluster.
    let items = [];
    for (let i = 0; i < n; i++) items.push(obj);
    for (let i = 0; i < dn; i++) items.push(distractorObj);
    items = SK.shuffle(items);

    const visualHTML = `<div class="count-field">${items.map((e) => `<span class="count-ico">${e}</span>`).join('')}</div>`;

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
