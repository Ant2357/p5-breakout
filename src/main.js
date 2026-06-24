import p5 from 'p5';

new p5((p) => {
  /**
   * ゲーム全体の状態を管理するオブジェクト。
   * @type {{
   *   balls: Ball[],
   *   bricks: Array<{
   *     x: number,
   *     y: number,
   *     w: number,
   *     h: number,
   *     hit: boolean,
   *     color: string
   *   }>,
   *   score: number,
   *   lives: number,
   *   gameOver: boolean,
   *   cleared: boolean
   * }}
   */
  const state = {
    balls: [],
    bricks: [],
    score: 0,
    lives: 3,
    gameOver: false,
    cleared: false,
  };

  /** @type {{ x: number, y: number, w: number, h: number }} */
  let paddle;
  /** @type {number} 横方向のブロック数 */
  let cols = 10;
  /** @type {number} 縦方向のブロック数 */
  let rows = 5;
  /** @type {number} ブロック群の先頭Y座標 */
  let brickTop = 72;
  /** @type {number} ブロック同士の横間隔 */
  let brickGap = 0;

  /**
   * ボールを表すクラス。
   * 位置・速度・衝突状態を保持し、移動と当たり判定を担当する。
   */
  class Ball {
    /**
     * ボールを生成する。
     * @param {number} x 初期X座標
     * @param {number} y 初期Y座標
     * @param {number} vx 初期X速度
     * @param {number} vy 初期Y速度
     */
    constructor(x, y, vx, vy) {
      /** @type {p5.Vector} ボールの位置 */
      this.pos = p.createVector(x, y);
      /** @type {p5.Vector} ボールの速度 */
      this.vel = p.createVector(vx, vy);
      /** @type {number} 半径 */
      this.r = 8;
      /** @type {boolean} 画面内で生存しているか */
      this.alive = true;
      /** @type {number} ブロックに当たった回数 */
      this.bounces = 0;
    }

    /**
     * ボールを1フレーム分更新する。
     * 壁・パドル・ブロックとの衝突処理もここで行う。
     */
    update() {
      this.pos.add(this.vel);

      // 左右の壁で反射する
      if (this.pos.x < this.r) {
        this.pos.x = this.r;
        this.vel.x *= -1;
      }
      if (this.pos.x > p.width - this.r) {
        this.pos.x = p.width - this.r;
        this.vel.x *= -1;
      }

      // 上の壁で反射する
      if (this.pos.y < this.r) {
        this.pos.y = this.r;
        this.vel.y *= -1;
      }

      // 画面下まで落ちたら消滅扱いにする
      if (this.pos.y > p.height + 50) {
        this.alive = false;
      }

      this.handlePaddle();
      this.handleBricks();
    }

    /**
     * パドルとの衝突を判定し、跳ね返り方向を調整する。
     * パドルの中央から外れるほど、横方向の速度が変化する。
     */
    handlePaddle() {
      if (this.vel.y > 0 &&
          this.pos.x > paddle.x - paddle.w / 2 - this.r &&
          this.pos.x < paddle.x + paddle.w / 2 + this.r &&
          this.pos.y + this.r >= paddle.y - paddle.h / 2 &&
          this.pos.y - this.r <= paddle.y + paddle.h / 2) {
        this.pos.y = paddle.y - paddle.h / 2 - this.r;
        this.vel.y *= -1;

        const offset = (this.pos.x - paddle.x) / (paddle.w / 2);
        this.vel.x += offset * 1.8;
        this.vel.limit(11);
      }
    }

    /**
     * ブロックとの衝突を判定する。
     * 命中したブロックは破壊済みにし、スコアを加算する。
     */
    handleBricks() {
      for (const brick of state.bricks) {
        if (brick.hit) continue;
        if (
          this.pos.x > brick.x &&
          this.pos.x < brick.x + brick.w &&
          this.pos.y > brick.y &&
          this.pos.y < brick.y + brick.h
        ) {
          brick.hit = true;
          state.score += 10;
          this.vel.y *= -1;
          this.bounces += 1;
          break;
        }
      }
    }

    /**
     * ボールを描画する。
     */
    draw() {
      p.noStroke();
      p.fill(250);
      p.circle(this.pos.x, this.pos.y, this.r * 2);
    }
  }

  /**
   * ゲームを初期状態に戻す。
   * スコア・残機・ボール・ブロック配置をリセットする。
   */
  function resetGame() {
    state.balls = [];
    state.score = 0;
    state.lives = 3;
    state.gameOver = false;
    state.cleared = false;
    createBricks();
    spawnBall();
  }

  /**
   * ブロックの配置を作成する。
   * 行ごとに色を変え、横一列にブロックを並べる。
   */
  function createBricks() {
    state.bricks = [];
    const margin = 32;
    const totalGap = brickGap * (cols - 1);
    const brickW = (p.width - margin * 2 - totalGap) / cols;
    const brickH = 24;

    const colors = [
      '#f97316', '#fb7185', '#facc15', '#34d399', '#60a5fa'
    ];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        state.bricks.push({
          x: margin + col * (brickW + brickGap),
          y: brickTop + row * (brickH + 10),
          w: brickW,
          h: brickH,
          hit: false,
          color: colors[row % colors.length],
        });
      }
    }
  }

  /**
   * ボールを発射する。
   * クリック位置方向へ飛ぶように速度を決定する。
   * @param {number} [targetX=p.mouseX] 目標X座標
   * @param {number} [targetY=p.mouseY] 目標Y座標
   */
  function spawnBall(targetX = p.mouseX, targetY = p.mouseY) {
    if (state.gameOver || state.cleared) return;

    const originX = paddle.x;
    const originY = paddle.y - paddle.h / 2 - 10;
    const dir = p.createVector(targetX - originX, targetY - originY);
    if (dir.magSq() < 1) dir.set(0, -1);
    dir.normalize();
    dir.mult(8);
    dir.y = Math.min(dir.y, -4);

    state.balls.push(new Ball(originX, originY, dir.x, dir.y));
  }

  /**
   * 全ブロック破壊済みかどうかを確認する。
   * すべて破壊されていればクリア状態にする。
   */
  function checkClear() {
    if (state.bricks.every((b) => b.hit)) {
      state.cleared = true;
    }
  }

  /**
   * 初期化処理。
   * キャンバス作成、パドル初期位置設定、ブロック生成、初回ボール発射を行う。
   */
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    paddle = {
      x: p.width / 2,
      y: p.height - 44,
      w: 120,
      h: 16,
    };
    createBricks();
    spawnBall();
  };

  /**
   * ウィンドウサイズ変更時の処理。
   * キャンバスとパドル位置を再調整し、ブロックを再配置する。
   */
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    paddle.y = p.height - 44;
    createBricks();
  };

  /**
   * マウス移動時の処理。
   * パドルをマウス位置に追従させる。
   */
  p.mouseMoved = () => {
    paddle.x = p.constrain(p.mouseX, paddle.w / 2, p.width - paddle.w / 2);
  };

  /**
   * マウスドラッグ時の処理。
   * パドルをドラッグ位置に追従させる。
   */
  p.mouseDragged = () => {
    paddle.x = p.constrain(p.mouseX, paddle.w / 2, p.width - paddle.w / 2);
  };

  /**
   * マウスクリック時の処理。
   * ゲーム終了・クリア時はリセットし、それ以外ではボールを追加発射する。
   */
  p.mousePressed = () => {
    if (state.gameOver || state.cleared) {
      resetGame();
      return;
    }
    spawnBall();
  };

  /**
   * キー入力時の処理。
   * Rキーでゲームを最初からやり直す。
   */
  p.keyPressed = () => {
    if (p.key === 'r' || p.key === 'R') {
      resetGame();
    }
  };

  /**
   * 毎フレームの描画処理。
   * 背景、HUD、ブロック、パドル、ボール、ゲームオーバー表示を描画する。
   */
  p.draw = () => {
    p.background(15, 23, 42);

    p.noStroke();
    p.fill(30, 41, 59);
    p.rect(0, 0, p.width, p.height);

    p.fill(148, 163, 184);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(18);
    p.text(`SCORE: ${state.score}`, 20, 18);
    p.text(`LIVES: ${state.lives}`, 20, 42);
    p.text('クリックでボール発射 / R でリスタート', 20, p.height - 32);

    // ブロック描画
    for (const brick of state.bricks) {
      if (brick.hit) continue;
      p.noStroke();
      p.fill(brick.color);
      p.rect(brick.x, brick.y, brick.w, brick.h, 6);
    }

    // パドル描画
    p.noStroke();
    p.fill(226, 232, 240);
    p.rectMode(p.CENTER);
    p.rect(paddle.x, paddle.y, paddle.w, paddle.h, 8);
    p.rectMode(p.CORNER);

    // プレイ中の更新処理
    if (!state.gameOver && !state.cleared) {
      for (const ball of state.balls) {
        ball.update();
        ball.draw();
      }
      state.balls = state.balls.filter((ball) => ball.alive);

      // ボールが1つも残っていない場合は残機を減らす
      if (state.balls.length === 0) {
        state.lives -= 1;
        if (state.lives <= 0) {
          state.gameOver = true;
        } else {
          spawnBall();
        }
      }

      checkClear();
    } else {
      for (const ball of state.balls) ball.draw();
    }

    // ゲーム終了・クリア表示
    if (state.gameOver || state.cleared) {
      p.fill(0, 0, 0, 120);
      p.rect(0, 0, p.width, p.height);
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(42);
      p.text(state.gameOver ? 'GAME OVER' : 'CLEAR!', p.width / 2, p.height / 2 - 20);
      p.textSize(18);
      p.text('クリックで最初から', p.width / 2, p.height / 2 + 24);
    }
  };
});
