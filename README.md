# Bloom Zoo 🦁🦉🦊🤖

A playful learning-games website for little kids (ages 2–8), in the spirit of
Lingo Kids — built with plain HTML/CSS/JS, no build step, no dependencies,
no backend.

Four mascots — **Ziggy** the lion, **Luna** the owl, **Pip** the fox and
**Bolt** the robot — appear across the whole site and cheer the player on
in every game.

## What's inside

- **Landing page** — hero, meet-the-crew, game showcase, features, pricing preview
- **Buddy picker** → **game hub** (3 difficulty levels) → **sticker book** → **parents room**
- **9 games**: addition/subtraction, counting, shape sorting (drag-or-tap),
  jigsaw puzzles, phonics/alphabet, shape & color detective, memory match,
  pattern sequencing, and a mixed **Super Star Exam** with a printable
  certificate
- Every prompt is **read aloud** (SpeechSynthesis) so pre-readers can play
  solo; every sound effect is **synthesized** (WebAudio) — no audio/image
  assets to download
- Stars, sticker unlocks and progress are saved in `localStorage` only — no
  accounts, no ads, no tracking
- Installable as a PWA (`manifest.json` + `sw.js`) and playable offline

## Project structure

```
index.html              All screens (landing, pick buddy, hub, game player, stickers, parents room)
css/style.css            Design system: tokens, layout, landing page, hub, animations
css/games.css             Shared in-game UI: quiz cards, drag/drop, memory grid, celebration overlay
js/core.js                 State, stars/stickers, confetti engine, shape-drawing helpers
js/audio.js                 Synthesized sound effects + read-aloud (SpeechSynthesis)
js/characters.js              The 4 mascots as layered inline SVG, poses, and the logo badge
js/shell.js                    Router, screen renderers, and the shared SKPlay game toolkit
js/games/*.js                    One file per game, registered via registerGame({...})
js/app.js                         Boot: registers are done by then, starts the router
assets/                             Favicon, app icons, OG share image
manifest.json, sw.js                 PWA install + offline caching
.github/workflows/deploy.yml          Publishes to GitHub Pages on every push
```

## Running it locally

No build step — any static file server works:

```bash
npx http-server . -p 8080
# then open http://localhost:8080
```

## Adding a game

Each game is a self-contained file that calls `registerGame({...})` with an
`id`, `title`, `subject`, `buddy`, `color`, `icon`, `blurb`, and a `mount(root, ctx)`
function. Most games use the shared quiz engine:

```js
registerGame({
  id: 'myGame', title: 'My Game', subject: 'math', subjectLabel: 'Maths',
  buddy: 'ziggy', color: 'sun', icon: '➕', blurb: 'A short, fun description.',
  mount(root, ctx) {
    return SKPlay.runQuiz(root, this, ctx.level, {
      totalQuestions: 8,
      generateQuestion(level, idx) {
        return { promptHTML: '...', promptSpeak: '...', choices: [{ html: '...', correct: true }, ...] };
      }
    });
  }
});
```

Games with a custom interaction (drag/drop, flip-cards) call
`SKPlay.mountShell()` and `SKPlay.celebrate()` directly — see
`js/games/sorting.js`, `jigsaw.js` or `memory.js` for examples.

## Deployment

Pushing to `main` or `claude/kids-learning-games-site-7ot8tt` runs
`.github/workflows/deploy.yml`, which publishes the repository root to
GitHub Pages. No build step — the whole repo *is* the site.

## Privacy

No accounts, no ads, no analytics, no third-party trackers. All progress
lives in the browser's local storage on the child's own device.
