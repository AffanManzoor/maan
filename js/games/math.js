/* ============================================================
   SuperKids — Number Friends (addition & subtraction)
   Hosted by Ziggy the Lion. Subject: math.
   ============================================================ */
(function () {
  'use strict';
  const OBJ = ['🍎', '⭐', '🎈', '🐟', '🌸', '🚗', '🍪', '🐝'];

  function emojiRow(n, emoji) {
    let s = '';
    for (let i = 0; i < n; i++) s += `<span class="obj-ico">${emoji}</span>`;
    return `<div class="obj-row">${s}</div>`;
  }

  function genQuestion(level) {
    let a, b, op;
    if (level === 1) {
      a = SK.randInt(1, 5); b = SK.randInt(1, 5); op = '+';
    } else if (level === 2) {
      op = Math.random() < 0.5 ? '+' : '-';
      a = SK.randInt(2, 10); b = SK.randInt(1, 10);
      if (op === '-' && b > a) { const t = a; a = b; b = t; }
    } else {
      op = Math.random() < 0.5 ? '+' : '-';
      a = SK.randInt(5, 20); b = SK.randInt(1, 15);
      if (op === '-' && b > a) { const t = a; a = b; b = t; }
    }
    const ans = op === '+' ? a + b : a - b;
    const choiceCount = level === 3 ? 4 : 3;
    const set = new Set([ans]);
    let guard = 0;
    while (set.size < choiceCount && guard < 40) {
      guard++;
      const delta = SK.pickOne([-3, -2, -1, 1, 2, 3]);
      const v = ans + delta;
      if (v >= 0) set.add(v);
    }
    const choices = SK.shuffle([...set]).map((v) => ({ html: `<span class="choice-num">${v}</span>`, correct: v === ans }));
    const emoji = SK.pickOne(OBJ);
    const visualHTML = level === 1 ? `${emojiRow(a, emoji)}<div class="obj-op">${op}</div>${emojiRow(b, emoji)}` : '';
    return {
      promptHTML: `<span class="big-eq">${a} <b>${op}</b> ${b} = ?</span>`,
      promptSpeak: `${a} ${op === '+' ? 'plus' : 'minus'} ${b}, equals what?`,
      visualHTML,
      choices,
      layout: choiceCount === 3 ? 'row3' : 'row4'
    };
  }

  window.SKQBank = window.SKQBank || {};
  window.SKQBank.math = genQuestion;

  registerGame({
    id: 'addition',
    title: 'Number Friends',
    subject: 'math',
    subjectLabel: 'Maths',
    buddy: 'ziggy',
    color: 'sun',
    icon: '➕',
    blurb: 'Add and subtract with Ziggy the lion!',
    questionsPerRound: 8,
    mount(root, ctx) {
      return SKPlay.runQuiz(root, this, ctx.level, { totalQuestions: 8, generateQuestion: genQuestion });
    }
  });
})();
