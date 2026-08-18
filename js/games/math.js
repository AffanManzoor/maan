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
    // Every number in every equation stays under 10 (a, b, and the answer are
    // all 0-9) so the number line never intimidates a small child. Difficulty
    // scales via the mix of + and -, and how many answer choices to pick from.
    let a, b, op;
    if (level === 1) {
      op = '+';
      // pick a first, then b so that a + b <= 9
      a = SK.randInt(1, 5);
      b = SK.randInt(1, 9 - a);
    } else if (level === 2) {
      op = Math.random() < 0.5 ? '+' : '-';
      if (op === '+') {
        a = SK.randInt(1, 8);
        b = SK.randInt(1, 9 - a);
      } else {
        a = SK.randInt(2, 9);
        b = SK.randInt(1, a);
      }
    } else {
      op = Math.random() < 0.5 ? '+' : '-';
      if (op === '+') {
        a = SK.randInt(1, 8);
        b = SK.randInt(1, 9 - a);
      } else {
        a = SK.randInt(2, 9);
        b = SK.randInt(1, a);
      }
    }
    const ans = op === '+' ? a + b : a - b;
    const choiceCount = level === 3 ? 4 : 3;
    const set = new Set([ans]);
    let guard = 0;
    while (set.size < choiceCount && guard < 40) {
      guard++;
      const delta = SK.pickOne([-3, -2, -1, 1, 2, 3]);
      const v = ans + delta;
      if (v >= 0 && v <= 9) set.add(v);
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
