import GameState from "./GameState";
import Ball from "../entities/Ball";
import Paddle from "../entities/Paddle";

import BrickFactory from "../factories/BrickFactory";

import CollisionService from "../services/CollisionService";
import Renderer from "../ui/Renderer";

export default class Game {
  /**
   * @param {p5} p
   * @param {AudioService} audio
   */
  constructor(p, audio) {
    this.p = p;
    this.audio = audio;

    this.state = new GameState();

    this.renderer = new Renderer(p);

    this.collision = new CollisionService(
      p,
      this.state,
      audio
    );

    this.paddle = new Paddle(
      p.width / 2,
      p.height - 44,
      120,
      16
    );

    this.createBricks();
  }

  createBricks() {
    this.state.bricks =
      BrickFactory.create(this.p.width, 10, 5);
  }

  reset() {
    this.state.reset();
    this.createBricks();
    this.spawnBall();
  }

  spawnBall(targetX = this.p.mouseX, targetY = this.p.mouseY) {
    const originX = this.paddle.x;
    const originY = this.paddle.y - this.paddle.h / 2 - 10;

    const dir = this.p.createVector(
      targetX - originX,
      targetY - originY
    );

    if (dir.magSq() < 1) {
      dir.set(0, -1);
    }

    dir.normalize();
    dir.mult(8);

    dir.y = Math.min(dir.y, -4);

    this.state.addBall(
      new Ball(
        originX,
        originY,
        dir.x,
        dir.y
      )
    );
  }

  update() {
    if (!this.state.isPlaying()) {
      return;
    }

    for (const ball of this.state.balls) {
      ball.update();
      this.collision.handle(ball, this.paddle);
    }

    this.state.removeDeadBalls();

    if (this.state.balls.length === 0) {
      this.state.loseLife();

      if (!this.state.gameOver) {
        this.spawnBall();
      }
    }

    this.state.checkClear();
  }

  draw() {
    this.renderer.draw(
      this.state,
      this.paddle
    );
  }

  mouseMoved(x) {
    this.paddle.moveTo(
      x,
      this.p.width
    );
  }

  mousePressed(x, y) {
    if (this.state.title) {
      this.state.title = false;
      this.spawnBall(x, y);
      return;
    }

    if (this.state.gameOver || this.state.cleared) {
      this.reset();
      return;
    }

    this.spawnBall(x, y);
  }

  keyPressed(key) {
    if (key === "r" || key === "R") {
      this.reset();
    }
  }

  resize(width, height) {
    this.p.resizeCanvas(width, height);
    this.paddle.y = height - 44;
    this.createBricks();
  }
}
