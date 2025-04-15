function messagePopUp(popUpTitleArg, popUpMessageArg) {
  const popUpTitle = document.querySelector(".messagePopUp p").textContent;
  const popUpMessage = document.querySelector(".messagePopUp span").textContent;

  if (popUpTitle) {
    popUpTitle = popUpTitleArg;
  }

  if (popUpMessage) {
    popUpMessage = popUpMessageArg;
  }
}

function togglePopUp() {
  const popUpBox = document.querySelector(".messagePopUp");

  const toggler = () => popUpBox.classList.toggle("popActive");
  
  toggler();
  
  popUpBox.addEventListener("click", toggler);
}

export { messagePopUp, togglePopUp }
