import p5 from "p5";

import Game from "./core/Game";
import AudioService from "./services/AudioService";

new p5((p) => {

  /** @type {Game} */
  let game;

  p.setup = () => {
    p.createCanvas(
      p.windowWidth,
      p.windowHeight
    );

    const audio = new AudioService(
      "https://dova-worker.tracks-cid.workers.dev?filepath=se%2Faudio%2F3db0fb2b-63ee-435f-a473-0d6e51e2fb1a.mp3&expires=1782803784&token=af245702f704beac17082a61f503c10988c9ae50de5f2ce72e58ec9321bd6aa0"
    );

    game = new Game(
      p,
      audio
    );
  };

  p.draw = () => {
    game.update();
    game.draw();
  };

  p.windowResized = () => {
    game.resize(
      p.windowWidth,
      p.windowHeight
    );
  };

  p.mouseMoved = () => {
    game.mouseMoved(
      p.mouseX
    );
  };

  p.mouseDragged = () => {
    game.mouseMoved(
      p.mouseX
    );
  };

  p.mousePressed = () => {
    game.mousePressed(
      p.mouseX,
      p.mouseY
    );
  };

  p.keyPressed = () => {
    game.keyPressed(
      p.key
    );
  };
});
