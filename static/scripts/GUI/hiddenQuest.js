function hiddenQuest(playerProgress = 0) {
    const questBoxP = document.querySelectorAll(".questBox p");

    if (playerProgress < questBoxP.length) {
        const currentQuest = questBoxP[playerProgress];

        currentQuest.classList.remove("hiddenQuest");
        currentQuest.style.display = "block"; 

        playerProgress++;
    }
}

export default hiddenQuest;