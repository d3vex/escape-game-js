import Game from "./game.js";
import "./GUI/arrowsInputHoverEffect.js";
import "./GUI/manageATH.js";
import "./GUI/startTimer.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.initialize();
});
