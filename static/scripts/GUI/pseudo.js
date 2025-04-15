function pseudo() {
    const pseudoOv = document.querySelector(".pseudo overlay");
    const pseudoTxt = document.querySelector(".pseudo input");
    const startButton = document.querySelector(".pseudo button");

    pseudoTxt.addEventListener("input", () => {
        if (pseudoTxt.value.trim() !== "") {
            startButton.disabled = false ;
        } else {
            startButton.disabled = true ;
        }
    });
}

export default pseudo