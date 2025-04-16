import gameOver from "./gameOver.js";
import startButton from "./pseudo.js";

function startTimer(durationInMinutes, displayElement) {
    
    let remainingTime = durationInMinutes * 60; // Seconds to Minutes conversion
    const timer = localStorage.getItem("remainingTime");

    if (timer) {
        remainingTime = parseInt(timer, 10)
    }

    function updateTimer() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        // Time Format (ex: 14:59)
        displayElement.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (remainingTime > 0) {
            remainingTime--;
            localStorage.setItem("remainingTime", remainingTime)
            if (remainingTime < 10) {
                toggleDanger()
            }
        } else {
            clearInterval(timerInterval); //Stop when arrived at 0
            displayElement.textContent = "Time's up!";
            localStorage.removeItem("remainingTime");
            gameOver()
        }
    }

    // Update timer every seconds
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

const timerEl = document.querySelector(".timer");

// Timer initialised
startButton.addEventListener("click", () => {
    startTimer(10, timerEl); 
    startButton.disabled = true; 
});

function toggleDanger() {
    const timerBox = document.querySelector(".timer");
    console.log(timerBox);
    const toggler = () => timerBox.classList.toggle("timerDanger");
    toggler()
}

export default startTimer
