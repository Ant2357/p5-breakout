export default class Renderer {

  /**
   * @param {p5} p
   */
  constructor(p) {
    this.p = p;
  }

  /**
   * ゲーム全体を描画する
   *
   * @param {GameState} state
   * @param {Paddle} paddle
   */
  draw(state, paddle) {
    const p = this.p;

    this.drawBackground();
    this.drawHUD(state);
    this.drawBricks(state.bricks);
    this.drawPaddle(paddle);
    this.drawBalls(state.balls);

    if (state.title) {
      this.drawTitle();
    }

    if (state.gameOver || state.cleared) {
      this.drawResult(state);
    }
  }

  drawBackground() {
    const p = this.p;

    p.background(15, 23, 42);

    p.noStroke();
    p.fill(30, 41, 59);
    p.rect(0, 0, p.width, p.height);
  }

  drawHUD(state) {
    const p = this.p;

    p.fill(148, 163, 184);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(18);
    p.text(`SCORE: ${state.score}`, 20, 18);
    p.text(`LIVES: ${state.lives}`, 20, 42);
    p.text(
      "クリックでボール発射 / Rでリスタート",
      20,
      p.height - 32
    );
  }

  drawBricks(bricks) {
    const p = this.p;

    for (const brick of bricks) {
      if (brick.hit) {
        continue;
      }

      p.noStroke();
      p.fill(brick.color);
      p.rect(
        brick.x,
        brick.y,
        brick.w,
        brick.h,
        6
      );
    }
  }

  drawPaddle(paddle) {
    const p = this.p;

    p.noStroke();
    p.fill(226, 232, 240);
    p.rectMode(p.CENTER);
    p.rect(
      paddle.x,
      paddle.y,
      paddle.w,
      paddle.h,
      8
    );
    p.rectMode(p.CORNER);
  }

  drawBalls(balls) {
    const p = this.p;

    p.noStroke();
    p.fill(250);

    for (const ball of balls) {
      p.circle(
        ball.x,
        ball.y,
        ball.radius * 2
      );
    }
  }

  drawTitle() {
    const p = this.p;

    p.fill(0, 0, 0, 120);
    p.rect(0, 0, p.width, p.height);
    p.fill(255);
    p.textAlign(
      p.CENTER,
      p.CENTER
    );

    p.textSize(42);
    p.text(
      "BREAKOUT",
      p.width / 2,
      p.height / 2 - 20
    );

    p.textSize(18);
    p.text(
      "クリックでスタート",
      p.width / 2,
      p.height / 2 + 24
    );
  }

  drawResult(state) {
    const p = this.p;

    p.fill(0, 0, 0, 120);
    p.rect(0, 0, p.width, p.height);
    p.fill(255);

    p.textAlign(
      p.CENTER,
      p.CENTER
    );

    p.textSize(42);
    p.text(
      state.gameOver
        ? "GAME OVER"
        : "CLEAR!",
      p.width / 2,
      p.height / 2 - 20
    );

    p.textSize(18);
    p.text(
      "クリックで最初から",
      p.width / 2,
      p.height / 2 + 24
    );
  }
}
