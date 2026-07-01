import Brick from "../entities/Brick";

export default class BrickFactory {

  /**
   * ブロックを生成する
   *
   * @param {number} canvasWidth キャンバス幅
   * @param {number} cols 横方向のブロック数
   * @param {number} rows 縦方向のブロック数
   * @param {Object} [options]
   * @param {number} [options.margin=32]
   * @param {number} [options.top=72]
   * @param {number} [options.gap=0]
   * @param {number} [options.height=24]
   * @returns {Brick[]}
   */
  static create(
    canvasWidth,
    cols,
    rows,
    options = {}
  ) {

    const {
      margin = 32,
      top = 72,
      gap = 0,
      height = 24
    } = options;

    const totalGap = gap * (cols - 1);

    const brickWidth =
      (canvasWidth - margin * 2 - totalGap) / cols;

    const colors = [
      "#f97316",
      "#fb7185",
      "#facc15",
      "#34d399",
      "#60a5fa"
    ];

    const bricks = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        bricks.push(
          new Brick(
            margin + col * (brickWidth + gap),
            top + row * (height + 10),
            brickWidth,
            height,
            colors[row % colors.length]
          )
        );
      }
    }

    return bricks;
  }
}
