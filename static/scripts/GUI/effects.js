function launchConfetti() {
    const colors = ["#FFC700", "#FF0000", "#2E3191", "#41BBC7", "#7FFF00"];
    const numConfetti = 100;

    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        // Random position, rotation, color, and animation
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animationDelay = `${Math.random()}s`;

        document.body.appendChild(confetti);
        // Remove confetti after it falls
        setTimeout(() => confetti.remove(), 3000);
    }
}

export { launchConfetti };