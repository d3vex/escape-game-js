import Game from "./game.js";
import "./GUI/arrowsInputHoverEffect.js";
import "./GUI/manageATH.js";
import "./GUI/messagePopUp.js";
import "./GUI/startTimer.js";
import "./GUI/gameOver.js"

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.initialize();
});