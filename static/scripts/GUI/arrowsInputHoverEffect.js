function arrowsInputEffect() {
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        document
          .querySelector(".fa-arrow-up")
          .parentElement.classList.add("active");
        break;
      case "ArrowDown":
        document
          .querySelector(".fa-arrow-down")
          .parentElement.classList.add("active");
        break;
      case "ArrowLeft":
        document
          .querySelector(".fa-arrow-left")
          .parentElement.classList.add("active");
        break;
      case "ArrowRight":
        document
          .querySelector(".fa-arrow-right")
          .parentElement.classList.add("active");
        break;
    }
  });

  document.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowUp":
        document
          .querySelector(".fa-arrow-up")
          .parentElement.classList.remove("active");
        break;
      case "ArrowDown":
        document
          .querySelector(".fa-arrow-down")
          .parentElement.classList.remove("active");
        break;
      case "ArrowLeft":
        document
          .querySelector(".fa-arrow-left")
          .parentElement.classList.remove("active");
        break;
      case "ArrowRight":
        document
          .querySelector(".fa-arrow-right")
          .parentElement.classList.remove("active");
        break;
    }
  });
}

arrowsInputEffect();
