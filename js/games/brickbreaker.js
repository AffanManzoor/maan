/* ============================================================
   SuperKids — Brick Breaker (Rainbow Bricks)
   Hosted by Bolt the Robot. Kid-safe: no game-over — the ball
   just respawns if it falls. Complete a level by clearing every
   brick. Big paddle, gentle physics, forgiving auto-nudge.
   ============================================================ */
(function () {
  'use strict';

  const BRICK_COLORS = ['#FF6F7D', '#FF9D45', '#FFC93C', '#3DDC97', '#4EA8FF', '#9B6BFF'];
  const CFG = {
    1: { rows: 2, cols: 6, paddle: 120, speed: 3.2, ball: 12 },
    2: { rows: 3, cols: 7, paddle: 100, speed: 3.8, ball: 12 },
    3: { rows: 4, cols: 8, paddle: 84,  speed: 4.4, ball: 11 }
  };

  function mountBB(root, gameDef, level) {
    const shell = SKPlay.mountShell(root, gameDef);
    const cfg = CFG[level] || CFG[1];
    let raf, cleanup = () => { if (raf) cancelAnimationFrame(raf); };

    shell.stage.innerHTML = `
      <p class="bb-instructions">Swipe left and right to bounce the ball and break all the bricks!</p>
      <div class="bb-wrap" id="bbWrap"><canvas id="bbCanvas" width="480" height="360"></canvas></div>`;
    const canvas = shell.stage.querySelector('#bbCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // build bricks
    const brickW = (W - 20 - (cfg.cols - 1) * 6) / cfg.cols;
    const brickH = 22;
    const bricks = [];
    for (let r = 0; r < cfg.rows; r++) {
      for (let c = 0; c < cfg.cols; c++) {
        bricks.push({
          x: 10 + c * (brickW + 6), y: 30 + r * (brickH + 6),
          w: brickW, h: brickH, color: BRICK_COLORS[r % BRICK_COLORS.length], alive: true
        });
      }
    }
    let remaining = bricks.length;
    shell.setDots(0, remaining);

    const paddle = { w: cfg.paddle, h: 14, x: W / 2 - cfg.paddle / 2, y: H - 24 };
    let ball = { x: W / 2, y: H - 60, dx: cfg.speed, dy: -cfg.speed, r: cfg.ball };

    function resetBall() {
      ball = { x: W / 2, y: H - 60, dx: (Math.random() > 0.5 ? 1 : -1) * cfg.speed, dy: -cfg.speed, r: cfg.ball };
    }

    // input: touch/mouse drag on the canvas moves paddle
    let dragging = false;
    function movePaddle(clientX) {
      const rect = canvas.getBoundingClientRect();
      const rel = (clientX - rect.left) * (W / rect.width);
      paddle.x = Math.max(0, Math.min(W - paddle.w, rel - paddle.w / 2));
    }
    const onDown = (e) => { dragging = true; movePaddle(e.clientX); };
    const onMove = (e) => { if (dragging) movePaddle(e.clientX); };
    const onUp = () => { dragging = false; };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    cleanup = () => {
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // background stripes
      ctx.fillStyle = '#EAF5FF'; ctx.fillRect(0, 0, W, H);
      // bricks
      bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(b.x, b.y, b.w, b.h, 6) : ctx.rect(b.x, b.y, b.w, b.h);
        ctx.fill();
      });
      // paddle
      ctx.fillStyle = '#2B2145';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 8) : ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.fill();
      // ball
      ctx.fillStyle = '#FFC93C';
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#F0A100'; ctx.lineWidth = 2; ctx.stroke();
    }

    function step() {
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.x < ball.r) { ball.x = ball.r; ball.dx *= -1; }
      if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.dx *= -1; }
      if (ball.y < ball.r) { ball.y = ball.r; ball.dy *= -1; }
      // paddle collision
      if (ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h &&
          ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.dy > 0) {
        ball.y = paddle.y - ball.r;
        const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.dx = hit * cfg.speed * 1.3;
        ball.dy = -Math.abs(ball.dy);
        SKAudio.play('pop');
      }
      // brick collisions
      bricks.forEach((b) => {
        if (!b.alive) return;
        if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
          b.alive = false;
          remaining--;
          shell.setDots(bricks.length - remaining, bricks.length);
          SKAudio.play('place');
          const overlapX = Math.min(Math.abs(ball.x - b.x), Math.abs(ball.x - (b.x + b.w)));
          const overlapY = Math.min(Math.abs(ball.y - b.y), Math.abs(ball.y - (b.y + b.h)));
          if (overlapX < overlapY) ball.dx *= -1; else ball.dy *= -1;
          SKPlay.confettiFromEl(canvas, { count: 8, power: 5, colors: [b.color, '#fff', '#FFE58A'] });
          if (remaining <= 0) {
            SKAudio.play('correct'); shell.cheer();
            setTimeout(() => {
              SKPlay.celebrate(root, gameDef, level, bricks.length, bricks.length, { onReplay: () => startAgain() });
            }, 400);
          }
        }
      });
      // ball falls off — kind respawn
      if (ball.y > H + 40) {
        resetBall();
      }
      draw();
      raf = requestAnimationFrame(step);
    }
    function startAgain() { location.hash = '#/game/' + gameDef.id; }
    raf = requestAnimationFrame(step);

    return { destroy() { cleanup(); SKAudio.stopSpeak(); } };
  }

  registerGame({
    id: 'brickbreaker',
    title: 'Rainbow Bricks',
    subject: 'creative',
    subjectLabel: 'Arcade',
    buddy: 'bolt',
    color: 'sky',
    icon: '🧱',
    blurb: 'Bounce the ball and smash all the rainbow bricks!',
    mount(root, ctx) { return mountBB(root, this, ctx.level); }
  });
})();
