function hideInteractBox() {
  document.querySelector(".interactBox").style.bottom = "calc(-10vh - 4px)";
}

function revealInteractBox(mainMessage, actionRealisedMessage) {
  const mainMessageElement = 
    document.querySelector(".interactBox p");

  const actionRealisedMessageElement =
    document.querySelector(".interactBox span");

  if (mainMessage) {
    mainMessageElement.firstChild.textContent = mainMessage;
  }

  if (actionRealisedMessage) {
    actionRealisedMessageElement.textContent = actionRealisedMessage;
  }

  document.querySelector(".interactBox").style.bottom = "0.1rem";
}

export default { hideInteractBox, revealInteractBox };
