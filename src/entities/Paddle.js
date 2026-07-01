export default class Paddle {

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;

    this.w = width;
    this.h = height;
  }

  /**
   * マウス位置へ移動
   */
  moveTo(mouseX, canvasWidth) {
    const half = this.w / 2;
    this.x = Math.max(
      half,
      Math.min(mouseX, canvasWidth - half)
    );
  }
}
