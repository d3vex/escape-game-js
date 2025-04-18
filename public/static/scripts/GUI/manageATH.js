import LocalStorageService from "../services/localStorageService.js";
import { stopTimer } from "./startTimer.js";
import Game from "../game.js";
function hideATH() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "h") {
            const hideMessageElement = document.querySelector(".hideMessage");
            const wrapperElement = document.querySelector(".wrapper");
            const timerElement = document.querySelector(".timer");
            const enigmaBoxElement = document.querySelector(".enigmaBox");
            const questBoxElement = document.querySelector(".questBox");

            if (timerElement.style.transform === "scale(0.5)") {
                revealATH(
                    hideMessageElement,
                    wrapperElement,
                    timerElement,
                    enigmaBoxElement,
                    questBoxElement
                );
            } else {
                hideMessageElement.style.opacity = "0";
                hideMessageElement.style.transition = "opacity 0.5s ease";

                wrapperElement.style.transform = "scale(0.5)";
                wrapperElement.style.opacity = "0.5";
                wrapperElement.style.transition =
                    "transform 1s ease, opacity 0.5s ease";

                timerElement.style.transform = "scale(0.5)";
                timerElement.style.opacity = "0.5";
                timerElement.style.transition =
                    "transform 1s ease, opacity 0.5s ease";

                enigmaBoxElement.style.left = "calc(-21vw - 4px)";
                enigmaBoxElement.style.transition = "left 0.5s ease";

                questBoxElement.style.right = "calc(-26vw - 4px)";
                questBoxElement.style.transition = "right 0.5s ease";
            }
        }
    });
}

function revealATH(
    hideMessageElement,
    wrapperElement,
    timerElement,
    enigmaBoxElement,
    questBoxElement
) {
    hideMessageElement.style.opacity = "0.5";
    hideMessageElement.style.transition = "opacity 0.5s ease";

    wrapperElement.style.transform = "scale(1)";
    wrapperElement.style.opacity = "1";
    wrapperElement.style.transition = "transform 1s ease, opacity 1s ease";

    timerElement.style.transform = "scale(1)";
    timerElement.style.opacity = "1";
    timerElement.style.transition = "transform 1s ease, opacity 1s ease";

    enigmaBoxElement.style.left = "0";
    enigmaBoxElement.style.transition = "left 1s ease";

    questBoxElement.style.right = "0";
    questBoxElement.style.transition = "right 1s ease";
}

function setQuitGameListener() {
    const quitGameBtn = document.querySelector(".quitGame");
    if (!quitGameBtn) return;
    quitGameBtn.onclick = async () => {
        if (confirm("Are you sure? you will lose all your progression!")) {
          // Stop all current loop
            Game.getInstance().stop();
            stopTimer();
          // Reset the data and go to the home page
            LocalStorageService.resetAttributes();
            localStorage.removeItem("remainingTime");
            location.replace("/");
        }
    };
}

setQuitGameListener();
hideATH();
export default { hideATH };
