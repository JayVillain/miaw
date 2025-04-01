document.addEventListener("DOMContentLoaded", () => {
    const spots = document.querySelectorAll(".spot");
    const playAgainBtn = document.getElementById("play-again");
    const cat = document.getElementById("cat");
    const meowSound = new Audio("meow.mp3");
  
    // Pilih spot secara acak sebagai lokasi kucing
    let hiddenSpot = spots[Math.floor(Math.random() * spots.length)];
  
    // Fungsi untuk mengatur posisi kucing di tengah spot yang benar
    function animateCatToSpot(spot) {
      // Dapatkan posisi spot relatif terhadap viewport
      const rect = spot.getBoundingClientRect();
      const catX = rect.left + rect.width / 2 - cat.offsetWidth / 2;
      const catY = rect.top + rect.height / 2 - cat.offsetHeight / 2;
  
      // Tampilkan kucing (hilangkan class hidden) dan animasi dari luar layar ke spot
      cat.classList.remove("hidden");
      gsap.fromTo(
        cat,
        { x: -150, opacity: 0 },
        {
          x: catX,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            // Tambahkan animasi bounce kecil saat sampai di spot
            gsap.to(cat, { y: -20, duration: 0.3, yoyo: true, repeat: 1 });
          },
        }
      );
    }
  
    spots.forEach((spot) => {
      spot.addEventListener("click", () => {
        if (spot === hiddenSpot) {
          // Animasi spot jika benar
          gsap.to(spot, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
          meowSound.play();
          animateCatToSpot(spot);
          playAgainBtn.classList.remove("hidden");
        } else {
          // Animasi spot jika salah (shake effect)
          gsap.to(spot, { x: 10, duration: 0.1, yoyo: true, repeat: 3 });
          gsap.to(spot, { backgroundColor: "#D1D5DB", duration: 0.3 });
        }
      });
    });
  
    playAgainBtn.addEventListener("click", () => {
      // Reset game dengan animasi fade-out dan reload
      gsap.to("body", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => window.location.reload(),
      });
    });
  });
  