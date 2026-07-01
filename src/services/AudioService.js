export default class AudioService {

  /**
   * @param {string} bounceSEUrl
   */
  constructor(bounceSEUrl) {
    this.bounceSE = new Audio(bounceSEUrl);
    this.bounceSE.preload = "auto";
  }

  /**
   * ボール反射音
   */
  playBounce() {
    const sound = this.bounceSE.cloneNode();
    sound.volume = 0.5;
    sound.play().catch(() => {});
  }
}
