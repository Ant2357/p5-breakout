export default class Ball {

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} vx
   * @param {number} vy
   * @param {number} radius
   */
  constructor(x, y, vx, vy, radius = 8) {
    this.x = x;
    this.y = y;

    this.vx = vx;
    this.vy = vy;

    this.radius = radius;
    this.alive = true;
    this.bounces = 0;
  }

  /**
   * 位置更新のみ
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * 速度設定
   */
  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }

  /**
   * X方向反転
   */
  reverseX() {
    this.vx *= -1;
  }

  /**
   * Y方向反転
   */
  reverseY() {
    this.vy *= -1;
  }

  /**
   * 消滅
   */
  destroy() {
    this.alive = false;
  }
}
