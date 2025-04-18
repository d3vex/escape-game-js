import { sleep } from "../utils.js";

function messagePopUp(popUpTitleArg, popUpMessageArg) {
    let popUpTitle = document.querySelector(".messagePopUp p");
    let popUpMessage = document.querySelector(".messagePopUp span");

    if (popUpTitle) {
        popUpTitle.textContent = popUpTitleArg;
    }

    if (popUpMessage) {
        popUpMessage.textContent = popUpMessageArg;
    }
}

async function togglePopUp() {
    const popUpBox = document.querySelector(".messagePopUp");
    const toggler = () => popUpBox.classList.toggle("popActive");
    toggler();
    await sleep(5000);
    popUpBox.classList.remove("popActive");
}

export { messagePopUp, togglePopUp };
