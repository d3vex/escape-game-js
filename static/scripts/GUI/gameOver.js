import LocalStorageService from "../services/localStorageService.js";

function gameOver() {
    const gameOver = document.querySelector(".gameOver");
    gameOver.classList.toggle("gameOverActive");
    gameOver.style.display = "block";
    gameOver.style.pointerEvents = "auto";

    const gameContainer = document.querySelector("#game");
    gameContainer.style.pointerEvents = "none";
    gameContainer.style.opacity = "0.5";
    LocalStorageService.resetAttributes()
}

export default gameOver
