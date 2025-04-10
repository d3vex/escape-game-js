function fetchContent(enigmaMessage, questPoints) {
  if (enigmaMessageMessage) {
    const enigmaMessageElement = document.querySelector(".enigmaBox span");
    enigmaMessageElement.textContent = enigmaMessage
  }

  if (questPoints && Array.isArray(questPoints)) {
    const questBoxContent = document.querySelector(".contentQuestBox");
    questBoxContent.innerHTML = "";

    questPoints.forEach((questPoint) => {
        const {questMessage, clue} = questPoint;
        const questContainer = document.createElement("p");
        
        const radioInput = document.createElement("Input");
        radioInput.type = "radio";

        const questText = document.createTextNode(`${questMessage}`);
        questContainer.appendChild(radioInput);
        questContainer.appendChild(questText);
        questBoxContent.appendChild(questContainer);

        if (clue) {
            const clueElement = document.createElement("span");
            clueElement.textContent = clue;
            clueElement.style.display = "block";
            questBoxContent.appendChild(clueElement);
        }
    });
  }
}
