function hideATH() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "h") {
      const timerElement = document.querySelector(".timer");
      const enigmaBoxElement = document.querySelector(".enigmaBox");
      const questBoxElement = document.querySelector(".questBox");

      if (timerElement.style.transform === "scale(0.5)") {
        revealATH(timerElement, enigmaBoxElement, questBoxElement);
      } else {
        timerElement.style.transform = "scale(0.5)";
        timerElement.style.opacity = "0.5";
        timerElement.style.transition = "transform 1s ease, opacity 1s ease";

        enigmaBoxElement.style.left = "calc(-21vw - 4px)";
        enigmaBoxElement.style.transition = "left 1s ease";

        questBoxElement.style.right = "calc(-26vw - 4px)";
        questBoxElement.style.transition = "right 1s ease";
      }
    }
  });
}

function revealATH(timerElement, enigmaBoxElement, questBoxElement) {
  timerElement.style.transform = "scale(1)";
  timerElement.style.opacity = "1";
  timerElement.style.transition = "transform 1s ease, opacity 1s ease";

  enigmaBoxElement.style.left = "0";
  enigmaBoxElement.style.transition = "left 1s ease";

  questBoxElement.style.right = "0";
  questBoxElement.style.transition = "right 1s ease";
}

hideATH();
export default { hideATH };
