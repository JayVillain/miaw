document.addEventListener("DOMContentLoaded", () => {
    const spots = document.querySelectorAll(".spot");
    const playAgainBtn = document.getElementById("play-again");
    const cat = document.getElementById("cat");
    const meowSound = new Audio("meow.mp3");
  
    // Pilih spot secara acak sebagai lokasi kucing
    let hiddenSpot = spots[Math.floor(Math.random() * spots.length)];
  
    // Fungsi animasi kucing: kucing masuk dari kiri, kemudian bounce ke spot target
    function animateCatToSpot(spot) {
      const rect = spot.getBoundingClientRect();
      const catX = rect.left + rect.width / 2 - cat.offsetWidth / 2;
      const catY = rect.top + rect.height / 2 - cat.offsetHeight / 2;
  
      cat.classList.remove("hidden");
  
      // Timeline animasi GSAP untuk gerakan lebih terstruktur
      const tl = gsap.timeline();
      tl.fromTo(cat, 
        { x: -150, opacity: 0 }, 
        { x: catX, opacity: 1, duration: 0.8, ease: "power2.out" }
      )
      .to(cat, { y: -20, duration: 0.3, ease: "bounce.out" })
      .to(cat, { y: 0, duration: 0.2 });
    }
  
    spots.forEach((spot) => {
      spot.addEventListener("click", () => {
        if (spot === hiddenSpot) {
          // Animasi spot ketika pilihan benar
          gsap.to(spot, { scale: 1.15, duration: 0.3, ease: "back.out(1.7)" });
          meowSound.play();
          animateCatToSpot(spot);
  
          // Efek tambahan: confetti sederhana menggunakan GSAP (bentuk-bentuk kecil)
          gsap.to(spot, {
            duration: 1,
            backgroundColor: "#FFD700",
            ease: "none"
          });
          playAgainBtn.classList.remove("hidden");
        } else {
          // Jika salah, spot mendapatkan efek shake dan perubahan warna
          gsap.to(spot, { x: 10, duration: 0.1, yoyo: true, repeat: 3 });
          gsap.to(spot, { backgroundColor: "#A0AEC0", duration: 0.3 });
        }
      });
    });
  
    playAgainBtn.addEventListener("click", () => {
      // Animasi fade-out sebelum restart game
      gsap.to("body", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => window.location.reload(),
      });
    });
  });
  