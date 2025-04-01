document.addEventListener("DOMContentLoaded", () => {
    const spots = document.querySelectorAll(".spot");
    const playAgainBtn = document.getElementById("play-again");
    const cat = document.getElementById("cat");

    const meowSound = new Audio("meow.mp3");

    // Kucing bersembunyi di tempat acak
    let hiddenSpot = spots[Math.floor(Math.random() * spots.length)];

    // Posisi awal kucing
    let randomX = Math.random() * 200 - 100;
    let randomY = Math.random() * 100 - 50;

    cat.style.left = `${randomX}px`;
    cat.style.bottom = `${randomY}px`;

    spots.forEach(spot => {
        spot.addEventListener("click", () => {
            if (spot === hiddenSpot) {
                meowSound.play();
                gsap.to(cat, { x: 0, y: -50, duration: 0.5, scale: 1.2, backgroundColor: "#FFD700" });
                cat.classList.remove("hidden");
                playAgainBtn.classList.remove("hidden");
            } else {
                gsap.to(spot, { scale: 0.9, duration: 0.3, backgroundColor: "#888" });
            }
        });
    });

    playAgainBtn.addEventListener("click", () => {
        window.location.reload();
    });
});
