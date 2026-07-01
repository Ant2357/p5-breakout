export default class GameState {
  constructor() {
    this.balls = [];
    this.bricks = [];
    this.score = 0;
    this.lives = 3;
    this.title = true;
    this.gameOver = false;
    this.cleared = false;
  }

  reset() {
    this.balls = [];
    this.bricks = [];

    this.score = 0;
    this.lives = 3;

    this.title = false;
    this.gameOver = false;
    this.cleared = false;
  }

  addBall(ball) {
    this.balls.push(ball);
  }

  removeDeadBalls() {
    this.balls = this.balls.filter(ball => ball.alive);
  }

  isPlaying() {
    return !this.title && !this.gameOver && !this.cleared;
  }

  loseLife() {
    this.lives--;

    if (this.lives <= 0) {
      this.gameOver = true;
    }
  }

  checkClear() {
    this.cleared = this.bricks.every(brick => brick.hit);
  }
}
