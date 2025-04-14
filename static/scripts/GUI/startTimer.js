import gameOver from "./gameOver.js";

function startTimer(durationInMinutes, displayElement) {
    
    let remainingTime = durationInMinutes * 60; // Seconds to Minutes conversion

    function updateTimer() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        // Time Format (ex: 14:59)
        displayElement.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime > 0) {
            remainingTime--;
        } else {
            clearInterval(timerInterval); //Stop when arrived at 0
            displayElement.textContent = "Time's up!";
            gameOver();
        }
    }

    // Update timer every seconds
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Timer initialised
const timerElement = document.querySelector('.timer');
startTimer(0, timerElement);

export default startTimer