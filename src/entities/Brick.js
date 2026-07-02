/**
 * ブロック崩しで使用するブロックを表すクラス。
 *
 * ブロックの位置・サイズ・色・破壊状態を管理します。
 */
export default class Brick {

  /**
   * Brick インスタンスを生成します。
   *
   * @param {number} x ブロックのX座標
   * @param {number} y ブロックのY座標
   * @param {number} width ブロックの幅
   * @param {number} height ブロックの高さ
   * @param {string} color ブロックの描画色
   */
  constructor(
    x,
    y,
    width,
    height,
    color
  ) {
    /**
     * ブロックのX座標です。
     * @type {number}
     */
    this.x = x;

    /**
     * ブロックのY座標です。
     * @type {number}
     */
    this.y = y;

    /**
     * ブロックの幅です。
     * @type {number}
     */
    this.w = width;

    /**
     * ブロックの高さです。
     * @type {number}
     */
    this.h = height;

    /**
     * ブロックの描画色です。
     * @type {string}
     */
    this.color = color;

    /**
     * ブロックが破壊済みかどうかを表します。
     *
     * @type {boolean}
     */
    this.hit = false;
  }

  /**
   * ブロックを破壊済み状態にします。
   *
   * @returns {void}
   */
  destroy() {
    this.hit = true;
  }

  /**
   * ブロックが生きているかどうかを判定します。
   *
   * @returns {boolean}
   * 生きている場合は `true`、破壊済みの場合は `false`
   */
  isAlive() {
    return !this.hit;
  }
}
