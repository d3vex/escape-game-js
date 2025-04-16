function pseudo() {
    const overlayEl = document.querySelector(".overlay").style;
    const pseudoTxt = document.querySelector(".pseudo input");
    const startButton = document.querySelector(".pseudo button");

    pseudoTxt.addEventListener("input", () => {
        if (pseudoTxt.value.trim() !== "") {
            startButton.disabled = false ;
        } else {
            startButton.disabled = true ;
        }
    });

    startButton.addEventListener("click", () => {
        let pseudo = pseudoTxt.value;
        localStorage.setItem("input", pseudo);
        overlayEl.display = "none";
        startButton.style.display = "none";
        pseudoTxt.disabled = true;
    });
}

pseudo();

export default pseudo