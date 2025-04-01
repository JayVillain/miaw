document.addEventListener("DOMContentLoaded", () => {
    const spots = document.querySelectorAll(".spot");
    const playAgainBtn = document.getElementById("play-again");
    
    const meowSound = new Audio("meow.mp3");
    
    // Pilih tempat sembunyi secara acak
    let hiddenSpot = spots[Math.floor(Math.random() * spots.length)];
    
    spots.forEach(spot => {
        spot.addEventListener("click", () => {
            if (spot === hiddenSpot) {
                gsap.to(spot, { scale: 1.2, duration: 0.5, backgroundColor: "#FFD700" });
                meowSound.play();
                spot.innerHTML = "<img src='cat.png' class='w-16 h-16'>";
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
