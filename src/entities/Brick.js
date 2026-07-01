export default class Brick {

  constructor(
    x,
    y,
    width,
    height,
    color
  ) {
    this.x = x;
    this.y = y;

    this.w = width;
    this.h = height;

    this.color = color;

    this.hit = false;
  }

  /**
   * 破壊
   */
  destroy() {
    this.hit = true;
  }

  /**
   * 未破壊か
   */
  isAlive() {
    return !this.hit;
  }
}
