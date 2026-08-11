/* ============================================================
   SuperKids — Shape Detective
   Hosted by Bolt the Robot. Subject: shapes (form, color, sides).
   ============================================================ */
(function () {
  'use strict';

  function genQuestion(level) {
    const shapePool = level === 1 ? SK.SHAPES.slice(0, 5) : SK.SHAPES;
    const choiceCount = level === 3 ? 4 : 3;
    let qType = 'shape';
    if (level >= 2) qType = SK.pickOne(level === 3 ? ['shape', 'color', 'sides'] : ['shape', 'color']);

    if (qType === 'color') {
      const shape = SK.pickOne(shapePool);
      const answerColor = SK.pickOne(SK.COLORS);
      const others = SK.shuffle(SK.COLORS.filter((c) => c.n !== answerColor.n)).slice(0, choiceCount - 1);
      const all = SK.shuffle([answerColor, ...others]);
      return {
        promptHTML: `Which one is <b style="color:${answerColor.v}">${answerColor.n}</b>?`,
        promptSpeak: `Which one is ${answerColor.n}?`,
        choices: all.map((c) => ({ html: SK.shapeSVG(shape, c.v, 62), correct: c.n === answerColor.n })),
        layout: choiceCount === 3 ? 'row3' : 'row4'
      };
    }

    if (qType === 'sides') {
      const keys = Object.keys(SK.SIDES);
      const answerShape = SK.pickOne(keys);
      const n = SK.SIDES[answerShape];
      const color = SK.pickOne(SK.COLORS).v;
      const others = SK.shuffle(keys.filter((k) => k !== answerShape)).slice(0, choiceCount - 1);
      const all = SK.shuffle([answerShape, ...others]);
      return {
        promptHTML: `Which shape has <b>${n}</b> sides?`,
        promptSpeak: `Which shape has ${n} sides?`,
        choices: all.map((s) => ({ html: SK.shapeSVG(s, color, 62), correct: s === answerShape })),
        layout: choiceCount === 3 ? 'row3' : 'row4'
      };
    }

    const answerShape = SK.pickOne(shapePool);
    const color = SK.pickOne(SK.COLORS).v;
    const others = SK.shuffle(shapePool.filter((s) => s !== answerShape)).slice(0, choiceCount - 1);
    const all = SK.shuffle([answerShape, ...others]);
    return {
      promptHTML: `Which one is the <b>${answerShape}</b>?`,
      promptSpeak: `Which one is the ${answerShape}?`,
      choices: all.map((s) => ({ html: SK.shapeSVG(s, color, 62), correct: s === answerShape })),
      layout: choiceCount === 3 ? 'row3' : 'row4'
    };
  }

  window.SKQBank = window.SKQBank || {};
  window.SKQBank.shapes = genQuestion;

  registerGame({
    id: 'shapes',
    title: 'Shape Detective',
    subject: 'shapes',
    subjectLabel: 'Shapes',
    buddy: 'bolt',
    color: 'mint',
    icon: '🔺',
    blurb: 'Spot shapes and colors with Bolt!',
    questionsPerRound: 8,
    mount(root, ctx) {
      return SKPlay.runQuiz(root, this, ctx.level, { totalQuestions: 8, generateQuestion: genQuestion });
    }
  });
})();
