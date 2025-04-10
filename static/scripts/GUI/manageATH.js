function hideATH() {
  document.querySelector("keydown", (event) => {
    if (event.key === "h") {
      const timerElement = document.querySelector(".timer");
      timerElement.style.transform = "scale(0.5)";
      timerElement.style.opacity = "0.5";
      timerElement.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      document.querySelector(".enigmaBox").style.left = calc("20vw + 4px");
      document.querySelector(".questBox").style.right = calc("25vw + 4px");
    }
  });
}

export default {hideATH}