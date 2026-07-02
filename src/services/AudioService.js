/**
 * Audio を管理するサービスクラス。
 */
export default class AudioService {

  /**
   * AudioService インスタンスを生成します。
   *
   * @param {string} bounceSEUrl ボール反射音の音声ファイルURL
   */
  constructor(bounceSEUrl) {
    /**
     * ボール反射音の音声データです。
     *
     * @type {HTMLAudioElement}
     */
    this.bounceSE = new Audio(bounceSEUrl);
    this.bounceSE.preload = "auto";
  }

  /**
   * ボールの反射音を再生します。
   *
   * @returns {void}
   */
  playBounce() {
    const sound = this.bounceSE.cloneNode();
    sound.volume = 0.5;
    sound.play().catch(() => {});
  }
}
