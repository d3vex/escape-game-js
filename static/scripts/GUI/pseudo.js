const startButton = document.querySelector(".pseudo button");

function pseudo() {
    const overlayEl = document.querySelector(".overlay").style;
    const pseudoTxt = document.querySelector(".pseudo input");

    pseudoTxt.addEventListener("input", () => {
        if (pseudoTxt.value !== "") {
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

export default startButton