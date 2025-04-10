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

/*

fetchContent("Solve the mystery!", [
  { questMessage: "Find the key under the bed", clue: "Check the left side" },
  { questMessage: "Open the locked drawer", clue: "Use the golden key" },
  { questMessage: "Read the note inside the drawer", clue: "It contains a code" },
]);

Wished Output for html : 
<div class="contentQuestBox">
  <p>
    <input type="radio" disabled>
    Find the key under the bed
  </p>
  <span>Check the left side</span>
  <p>
    <input type="radio" disabled>
    Open the locked drawer
  </p>
  <span>Use the golden key</span>
  <p>
    <input type="radio" disabled>
    Read the note inside the drawer
  </p>
  <span>It contains a code</span>
</div>

*/
