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

function togglePopUp() {
  const popUpBox = document.querySelector(".messagePopUp");

  const toggler = () => popUpBox.classList.toggle("popActive");
  
  toggler();
  
  popUpBox.addEventListener("click", toggler);
}

export { messagePopUp, togglePopUp }
