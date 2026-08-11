/* ============================================================
   SuperKids — Super Star Exam
   Hosted by Luna the Owl. Subject: mixed review.
   Pulls random questions from every other game's question bank
   and awards a printable certificate on a great score.
   ============================================================ */
(function () {
  'use strict';

  function genQuestion(level, idx) {
    const bank = window.SKQBank || {};
    const keys = Object.keys(bank);
    const key = keys.length ? SK.pickOne(keys) : null;
    if (key) return bank[key](level, idx);
    return { promptHTML: 'Great job!', choices: [{ html: '⭐', correct: true }] };
  }

  function showCertificate(root, level, correct, total) {
    const s = SK.getState();
    const buddy = SKChar.get(s.buddy || 'luna');
    const pct = total ? Math.round((correct / total) * 100) : 100;
    const levelName = level === 3 ? 'Super Star' : level === 2 ? 'Big Star' : 'Little Star';
    const overlay = document.createElement('div');
    overlay.className = 'cert-overlay';
    overlay.innerHTML = `
      <div class="cert-card">
        <button class="btn-round cert-close" type="button" aria-label="Close">✕</button>
        <div class="cert-inner">
          <div class="cert-brand">⭐ SuperKids ⭐</div>
          <h2 class="cert-title">Certificate of Awesomeness</h2>
          <p class="cert-line">This certifies that</p>
          <div class="cert-name">${s.name || 'Friend'}</div>
          <p class="cert-line">completed the <b>${levelName} Exam</b> with a score of</p>
          <div class="cert-score">${correct} / ${total} (${pct}%)</div>
          <div class="cert-buddy">${SKChar.render(buddy.id, { size: 90, pose: 'cheer' })}<span>${buddy.name} is so proud of you!</span></div>
          <div class="cert-date">${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div class="cert-actions">
          <button class="btn btn-sun btn-xl cert-print" type="button">🖨️ Print Certificate</button>
        </div>
      </div>`;
    root.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    overlay.querySelector('.cert-close').addEventListener('click', () => overlay.remove());
    overlay.querySelector('.cert-print').addEventListener('click', () => window.print());
  }

  registerGame({
    id: 'exam',
    title: 'Super Star Exam',
    subject: 'mixed',
    subjectLabel: 'Exam',
    buddy: 'luna',
    color: 'sun',
    icon: '🎓',
    blurb: 'A mixed challenge to show off everything you know!',
    mount(root, ctx) {
      const gameDef = this;
      return SKPlay.runQuiz(root, gameDef, ctx.level, {
        totalQuestions: 12,
        generateQuestion: genQuestion,
        onComplete(correct, total) { SK.recordExam(correct, total); },
        extraButton(correct, total) {
          if (total && correct / total >= 0.7) {
            return { label: '🎓 View Certificate', onClick: () => showCertificate(root, ctx.level, correct, total) };
          }
          return null;
        }
      });
    }
  });
})();
