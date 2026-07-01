export default class CollisionService {

  /**
   * @param {p5} p
   * @param {GameState} state
   * @param {AudioService} audio
   */
  constructor(p, state, audio) {
    this.p = p;
    this.state = state;
    this.audio = audio;
  }

  /**
   * ボールの衝突判定
   *
   * @param {Ball} ball
   * @param {Paddle} paddle
   */
  handle(ball, paddle) {
    this.handleWall(ball);
    this.handlePaddle(ball, paddle);
    this.handleBricks(ball);
  }

  /**
   * 壁との衝突
   */
  handleWall(ball) {
    if (ball.x < ball.radius) {
      ball.x = ball.radius;
      ball.reverseX();
      this.audio.playBounce();
    }

    if (ball.x > this.p.width - ball.radius) {
      ball.x = this.p.width - ball.radius;
      ball.reverseX();
      this.audio.playBounce();
    }

    if (ball.y < ball.radius) {
      ball.y = ball.radius;
      ball.reverseY();
      this.audio.playBounce();
    }

    if (ball.y > this.p.height + 50) {
      ball.destroy();
    }
  }

  /**
   * パドルとの衝突
   */
  handlePaddle(ball, paddle) {
    if (
      ball.vy > 0 &&
      ball.x > paddle.x - paddle.w / 2 - ball.radius &&
      ball.x < paddle.x + paddle.w / 2 + ball.radius &&
      ball.y + ball.radius >= paddle.y - paddle.h / 2 &&
      ball.y - ball.radius <= paddle.y + paddle.h / 2
    ) {
      ball.y = paddle.y - paddle.h / 2 - ball.radius;
      ball.reverseY();

      const offset =
        (ball.x - paddle.x) /
        (paddle.w / 2);

      ball.vx += offset * 1.8;

      const speed = Math.sqrt(
        ball.vx * ball.vx +
        ball.vy * ball.vy
      );

      if (speed > 11) {
        const scale = 11 / speed;

        ball.vx *= scale;
        ball.vy *= scale;
      }

      this.audio.playBounce();
    }
  }

  /**
   * ブロックとの衝突
   */
  handleBricks(ball) {
    for (const brick of this.state.bricks) {
      if (brick.hit) {
        continue;
      }

      if (
        ball.x > brick.x &&
        ball.x < brick.x + brick.w &&
        ball.y > brick.y &&
        ball.y < brick.y + brick.h
      ) {
        brick.destroy();
        this.state.score += 10;

        ball.reverseY();
        ball.bounces++;
        this.audio.playBounce();
        break;
      }
    }
  }
}
