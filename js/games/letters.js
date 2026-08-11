/* ============================================================
   SuperKids — Alphabet Zoo
   Hosted by Luna the Owl. Subject: letters (phonics).
   ============================================================ */
(function () {
  'use strict';
  const PHONICS = [
    { l: 'A', w: 'Apple', e: '🍎' }, { l: 'B', w: 'Ball', e: '⚽' }, { l: 'C', w: 'Cat', e: '🐱' }, { l: 'D', w: 'Dog', e: '🐶' },
    { l: 'E', w: 'Elephant', e: '🐘' }, { l: 'F', w: 'Fish', e: '🐟' }, { l: 'G', w: 'Grapes', e: '🍇' }, { l: 'H', w: 'Hat', e: '🎩' },
    { l: 'I', w: 'Ice cream', e: '🍦' }, { l: 'J', w: 'Juice', e: '🧃' }, { l: 'K', w: 'Kite', e: '🪁' }, { l: 'L', w: 'Lion', e: '🦁' },
    { l: 'M', w: 'Moon', e: '🌙' }, { l: 'N', w: 'Nest', e: '🪺' }, { l: 'O', w: 'Orange', e: '🍊' }, { l: 'P', w: 'Pig', e: '🐷' },
    { l: 'Q', w: 'Queen', e: '👑' }, { l: 'R', w: 'Rabbit', e: '🐰' }, { l: 'S', w: 'Sun', e: '☀️' }, { l: 'T', w: 'Turtle', e: '🐢' },
    { l: 'U', w: 'Umbrella', e: '☂️' }, { l: 'V', w: 'Van', e: '🚐' }, { l: 'W', w: 'Watermelon', e: '🍉' }, { l: 'X', w: 'X-ray', e: '🩻' },
    { l: 'Y', w: 'Yo-yo', e: '🪀' }, { l: 'Z', w: 'Zebra', e: '🦓' }
  ];

  function genQuestion(level) {
    const pool = level === 1 ? PHONICS.slice(0, 12) : PHONICS;
    const item = SK.pickOne(pool);
    const choiceCount = level === 3 ? 4 : 3;
    const set = new Set([item.l]);
    let guard = 0;
    while (set.size < choiceCount && guard < 40) { guard++; set.add(SK.pickOne(pool).l); }
    const choices = SK.shuffle([...set]).map((l) => ({ html: `<span class="choice-letter">${l}</span>`, correct: l === item.l }));

    if (level === 1) {
      return {
        promptHTML: `<span class="big-emoji">${item.e}</span><div>Which letter matches?</div>`,
        promptSpeak: 'Which letter matches?',
        choices,
        layout: 'row3'
      };
    }
    return {
      promptHTML: `<span class="big-emoji">${item.e}</span><div>What letter does <b>${item.w}</b> start with?</div>`,
      promptSpeak: `What letter does ${item.w} start with?`,
      choices,
      layout: choiceCount === 3 ? 'row3' : 'row4'
    };
  }

  window.SKQBank = window.SKQBank || {};
  window.SKQBank.letters = genQuestion;

  registerGame({
    id: 'letters',
    title: 'Alphabet Zoo',
    subject: 'letters',
    subjectLabel: 'Letters',
    buddy: 'luna',
    color: 'grape',
    icon: '🔤',
    blurb: 'Match letters and sounds with Luna!',
    questionsPerRound: 8,
    mount(root, ctx) {
      return SKPlay.runQuiz(root, this, ctx.level, { totalQuestions: 8, generateQuestion: genQuestion });
    }
  });
})();
