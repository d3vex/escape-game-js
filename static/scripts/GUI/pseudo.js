import {startTimer} from "./startTimer.js";
import Game from "../game.js";

const startButton = document.querySelector(".pseudo button");
    
function pseudo() {
    const overlayEl = document.querySelector(".overlay").style;
    const pseudoTxt = document.querySelector(".pseudo input");

    pseudoTxt.addEventListener("input", () => {
        if (pseudoTxt.value !== "") {
            startButton.disabled = false;
        } else {
            startButton.disabled = true;
        }
    });

    let pseudoStored = localStorage.getItem("pseudo")
    if (pseudoStored == null || pseudoStored == "") {
        startButton.addEventListener("click", () => {   
            let pseudo = pseudoTxt.value;
            localStorage.setItem("pseudo", pseudo);
            overlayEl.display = "none";
            startButton.style.display = "none";
            pseudoTxt.disabled = true;
            Game.getInstance().start()
        });
    } else {
        pseudoTxt.value = pseudoStored;
        overlayEl.display = "none";
        startButton.style.display = "none";
        pseudoTxt.disabled = true;
        Game.getInstance().start()
        startTimer(10, document.querySelector(".timer"))
    }
}

pseudo();

export default startButton;
