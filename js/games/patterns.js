/* ============================================================
   SuperKids — Pattern Party
   Hosted by Bolt the Robot. Subject: shapes (sequencing/logic).
   ============================================================ */
(function () {
  'use strict';
  const P_EMOJI = ['🔵', '🟡', '🟢', '🔺', '⭐', '🟣', '🟥', '🍀'];

  function genQuestion(level) {
    let patternDef, showLen;
    if (level === 1) { patternDef = ['A', 'B']; showLen = 5; }
    else if (level === 2) { patternDef = SK.pickOne([['A', 'B', 'C'], ['A', 'A', 'B']]); showLen = 6; }
    else { patternDef = SK.pickOne([['A', 'B', 'B'], ['A', 'A', 'B', 'B'], ['A', 'B', 'C', 'A']]); showLen = 8; }

    const symCount = new Set(patternDef).size;
    const chosenEmoji = SK.pickN(P_EMOJI, symCount);
    const symbols = {};
    ['A', 'B', 'C'].slice(0, symCount).forEach((k, i) => { symbols[k] = chosenEmoji[i]; });

    let seq = [];
    while (seq.length < showLen + 1) seq = seq.concat(patternDef);
    const seqLetters = seq.slice(0, showLen);
    const nextLetter = seq[showLen];
    const shownEmoji = seqLetters.map((l) => symbols[l]);
    const answerEmoji = symbols[nextLetter];

    const choiceCount = level === 1 ? 3 : (level === 2 ? 3 : 4);
    const usedEmoji = Object.values(symbols);
    const wrongPool = P_EMOJI.filter((e) => !usedEmoji.includes(e));
    const wrongs = SK.pickN(wrongPool, choiceCount - 1);
    const allChoices = SK.shuffle([answerEmoji, ...wrongs]);

    return {
      promptHTML: `<div class="pattern-seq">${shownEmoji.map((e) => `<span>${e}</span>`).join('')}<span class="pattern-blank">?</span></div>`,
      promptSpeak: 'What comes next in the pattern?',
      choices: allChoices.map((e) => ({ html: `<span class="choice-emoji">${e}</span>`, correct: e === answerEmoji })),
      layout: choiceCount === 3 ? 'row3' : 'row4'
    };
  }

  window.SKQBank = window.SKQBank || {};
  window.SKQBank.patterns = genQuestion;

  registerGame({
    id: 'patterns',
    title: 'Pattern Party',
    subject: 'shapes',
    subjectLabel: 'Patterns',
    buddy: 'bolt',
    color: 'grape',
    icon: '🧵',
    blurb: 'Figure out what comes next!',
    questionsPerRound: 8,
    mount(root, ctx) {
      return SKPlay.runQuiz(root, this, ctx.level, { totalQuestions: 8, generateQuestion: genQuestion });
    }
  });
})();
