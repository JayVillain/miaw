document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const spots = document.querySelectorAll(".spot");
    const playAgainBtn = document.getElementById("play-again");
    const pauseBtn = document.getElementById("pause-btn");
    const soundToggleBtn = document.getElementById("sound-toggle");
    const hintBtn = document.getElementById("hint-btn");
    const mainCat = document.getElementById("cat");
    const orangeCat = document.getElementById("orange-cat");
    const blackCat = document.getElementById("black-cat");
    const messageBox = document.getElementById("message");
    const levelUpModal = document.getElementById("level-up-modal");
    const gameOverModal = document.getElementById("game-over-modal");
    const continueBtn = document.getElementById("continue-btn");
    const restartBtn = document.getElementById("restart-btn");
    const pawPrints = document.querySelector(".paw-prints");
    
    // Game state
    let gameState = {
      level: 1,
      score: 0,
      timeLeft: 30,
      isGameOver: false,
      isPaused: false,
      soundEnabled: true,
      hiddenSpots: [],
      foundCats: 0,
      catsToFind: 1, // Increases with level
      timerInterval: null
    };
    
    // Sound effects using Howler.js
    const sounds = {
      meow: new Howl({ src: ['https://assets.codepen.io/21542/howler-push.mp3'], volume: 0.7 }),
      wrong: new Howl({ src: ['https://assets.codepen.io/21542/howler-retro.mp3'], volume: 0.6 }),
      levelUp: new Howl({ src: ['https://assets.codepen.io/21542/howler-coin.mp3'], volume: 0.8 }),
      gameOver: new Howl({ src: ['https://assets.codepen.io/21542/howler-sfx.mp3'], volume: 0.7 }),
      background: new Howl({ 
        src: ['https://assets.codepen.io/21542/howler-ambient.mp3'], 
        volume: 0.3, 
        loop: true 
      })
    };
    
    // Initialize game
    function initGame() {
      updateDisplay();
      resetCats();
      selectRandomSpots();
      startTimer();
      createRandomPawPrints();
      
      // Start background music if enabled
      if (gameState.soundEnabled) {
        sounds.background.play();
      }
      
      // Parallax effect for background elements
      document.addEventListener('mousemove', handleParallax);
    }
    
    // Handle parallax effect on mouse move
    function handleParallax(e) {
      const parallaxItems = document.querySelectorAll('.parallax-cloud, .parallax-bird');
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      parallaxItems.forEach(item => {
        const depth = parseFloat(item.dataset.depth || 0.1);
        const moveX = mouseX * depth * 30;
        const moveY = mouseY * depth * 30;
        gsap.to(item, {
          x: moveX,
          y: moveY,
          duration: 1,
          ease: "power1.out"
        });
      });
    }
    
    // Create random paw prints across the screen
    function createRandomPawPrints() {
      setInterval(() => {
        if (gameState.isPaused || gameState.isGameOver) return;
        
        const paw = document.createElement('div');
        paw.classList.add('paw');
        paw.innerHTML = '<i class="fas fa-paw"></i>';
        
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomRotation = Math.random() * 360;
        
        paw.style.left = `${randomX}%`;
        paw.style.top = `${randomY}%`;
        paw.style.setProperty('--rotation', `${randomRotation}deg`);
        
        pawPrints.appendChild(paw);
        
        // Remove paw print after animation
        setTimeout(() => {
          paw.remove();
        }, 3000);
      }, 2000);
    }
    
    // Reset cat positions and visibility
    function resetCats() {
      mainCat.classList.add('hidden');
      orangeCat.classList.add('hidden');
      blackCat.classList.add('hidden');
      
      gsap.set(mainCat, { x: 0, y: 0, opacity: 0 });
      gsap.set(orangeCat, { x: 0, y: 0, opacity: 0 });
      gsap.set(blackCat, { x: 0, y: 0, opacity: 0 });
    }
    
    // Randomly select spots to hide cats based on level
    function selectRandomSpots() {
      gameState.hiddenSpots = [];
      gameState.foundCats = 0;
      gameState.catsToFind = Math.min(3, gameState.level);
      
      // Shuffle spots array
      const shuffledSpots = Array.from(spots).sort(() => 0.5 - Math.random());
      
      // Select first N spots based on level
      for (let i = 0; i < gameState.catsToFind; i++) {
        if (shuffledSpots[i]) {
          gameState.hiddenSpots.push(shuffledSpots[i]);
        }
      }
    }
    
    // Start the game timer
    function startTimer() {
      // Clear any existing timer
      if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
      }
      
      // Set time based on level
      gameState.timeLeft = 30 + (gameState.level * 5);
      updateDisplay();
      
      gameState.timerInterval = setInterval(() => {
        if (gameState.isPaused) return;
        
        gameState.timeLeft--;
        updateDisplay();
        
        // Flash timer when low on time
        if (gameState.timeLeft <= 10) {
          const timerElement = document.getElementById('timer');
          gsap.to(timerElement, {
            color: '#ff0000',
            duration: 0.3,
            yoyo: true,
            repeat: 1
          });
        }
        
        if (gameState.timeLeft <= 0) {
          endGame();
        }
      }, 1000);
    }
    
    // Update all displayed game information
    function updateDisplay() {
      document.getElementById('score').textContent = gameState.score;
      document.getElementById('timer').textContent = gameState.timeLeft;
      document.getElementById('level').textContent = gameState.level;
      document.getElementById('final-score').textContent = gameState.score;
      document.getElementById('new-level').textContent = gameState.level;
    }
    
    // Show in-game message
    function showMessage(text, type = 'info') {
      messageBox.textContent = text;
      messageBox.className = `message-box text-xl font-bold text-center mb-6 text-white ${type}`;
      messageBox.classList.remove('hidden');
      
      // Auto-hide message after delay
      setTimeout(() => {
        messageBox.classList.add('hidden');
      }, 2000);
    }
    
    // Animate cat to target spot
    function animateCatToSpot(spot, catElement = mainCat) {
      const rect = spot.getBoundingClientRect();
      const containerRect = document.querySelector('.game-grid').getBoundingClientRect();
      
      // Get the correct position relative to the container
      const catX = rect.left - containerRect.left + (rect.width / 2) - (catElement.offsetWidth / 2);
      const catY = rect.top - containerRect.top + (rect.height / 2) - (catElement.offsetHeight / 2);
      
      catElement.classList.remove('hidden');
      
      // Timeline animation for each cat
      const tl = gsap.timeline();
      
      // Starting position depends on which cat
      let startX = -150;
      let startY = 0;
      
      // Different starting positions for different cats
      if (catElement === orangeCat) {
        startX = containerRect.width + 50;
        startY = -50;
      } else if (catElement === blackCat) {
        startX = containerRect.width / 2;
        startY = -150;
      }
      
      // Animate cat movement
      tl.fromTo(catElement, 
        { x: startX, y: startY, opacity: 0, scale: 0.8 }, 
        { x: catX, y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      )
      .to(catElement, { y: catY, duration: 0.5, ease: "bounce.out" })
      .to(catElement, { rotation: 5, duration: 0.1, ease: "none", yoyo: true, repeat: 3 });
      
      return tl;
    }
    
    // Show a hint by highlighting potential hiding spots
    function showHint() {
      if (gameState.hiddenSpots.length === 0 || gameState.score < 50) {
        showMessage("Petunjuk tidak tersedia!", "error");
        return;
      }
      
      // Deduct points for using hint
      gameState.score -= 50;
      updateDisplay();
      
      // Highlight hidden spots briefly
      gameState.hiddenSpots.forEach(spot => {
        gsap.to(spot, { 
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)", 
          duration: 0.5,
          yoyo: true,
          repeat: 3
        });
      });
      
      showMessage("Lihat kilatan cahaya!");
    }
    
    // Level up the game
    function levelUp() {
      gameState.level++;
      updateDisplay();
      
      // Show the level up modal
      levelUpModal.classList.remove('hidden');
      
      // Add appropriate number of cat emojis to modal
      const modalCats = levelUpModal.querySelector('.modal-cats');
      modalCats.innerHTML = '';
      
      const catEmojis = ['😺', '😸', '😻'];
      for (let i = 0; i < gameState.level && i < catEmojis.length; i++) {
        const catEmoji = document.createElement('div');
        catEmoji.className = 'modal-cat';
        catEmoji.textContent = catEmojis[i];
        catEmoji.style.animationDelay = `${i * 0.2}s`;
        modalCats.appendChild(catEmoji);
      }
      
      // Play level up sound
      if (gameState.soundEnabled) {
        sounds.levelUp.play();
      }
    }
    
    // End the game
    function endGame() {
      clearInterval(gameState.timerInterval);
      gameState.isGameOver = true;
      gameState.timeLeft = 0;
      
      // Play game over sound
      if (gameState.soundEnabled) {
        sounds.gameOver.play();
        sounds.background.stop();
      }
      
      // Show game over modal
      gameOverModal.classList.remove('hidden');
      playAgainBtn.classList.remove('hidden');
    }
    
    // Reset and restart the game
    function restartGame() {
      gameState = {
        level: 1,
        score: 0,
        timeLeft: 30,
        isGameOver: false,
        isPaused: false,
        soundEnabled: gameState.soundEnabled,
        hiddenSpots: [],
        foundCats: 0,
        catsToFind: 1,
        timerInterval: null
      };
      
      // Hide modals
      levelUpModal.classList.add('hidden');
      gameOverModal.classList.add('hidden');
      playAgainBtn.classList.add('hidden');
      
      // Reset all spots
      spots.forEach(spot => {
        gsap.to(spot, { 
          backgroundColor: '', 
          scale: 1, 
          duration: 0.3 
        });
      });
      
      initGame();
    }
    
    // Pause/resume the game
    function togglePause() {
      gameState.isPaused = !gameState.isPaused;
      
      if (gameState.isPaused) {
        clearInterval(gameState.timerInterval);
        pauseBtn.querySelector('i').className = 'fas fa-play';
        showMessage("Game Dijeda");
      } else {
        startTimer();
        pauseBtn.querySelector('i').className = 'fas fa-pause';
        showMessage("Game Dilanjutkan");
      }
    }
    
    // Toggle sound on/off
    function toggleSound() {
      gameState.soundEnabled = !gameState.soundEnabled;
      
      if (gameState.soundEnabled) {
        soundToggleBtn.querySelector('i').className = 'fas fa-volume-up';
        sounds.background.play();
      } else {
        soundToggleBtn.querySelector('i').className = 'fas fa-volume-mute';
        sounds.background.pause();
      }
    }
    
    // Handle spot click
    function handleSpotClick(spot) {
      if (gameState.isPaused || gameState.isGameOver) return;
      
      // Check if this spot has a cat
      const isHiddenSpot = gameState.hiddenSpots.includes(spot);
      
      if (isHiddenSpot) {
        // Remove from hidden spots
        gameState.hiddenSpots = gameState.hiddenSpots.filter(hiddenSpot => hiddenSpot !== spot);
        gameState.foundCats++;
        
        // Determine which cat to show based on found order
        let catToShow = mainCat;
        if (gameState.foundCats === 2) catToShow = orangeCat;
        if (gameState.foundCats === 3) catToShow = blackCat;
        
        // Success animation for spot
        gsap.to(spot, { 
          scale: 1.15, 
          duration: 0.3, 
          ease: "back.out(1.7)",
          backgroundColor: "var(--success-color)" 
        });
        
        // Play meow sound
        if (gameState.soundEnabled) {
          sounds.meow.play();
        }
        
        // Animate cat
        animateCatToSpot(spot, catToShow);
        
        // Update score
        gameState.score += 100 * gameState.level;
        updateDisplay();
        
        // Create confetti effect
        createConfetti(spot);
        
        // Show success message
        showMessage(`Kucing ditemukan! +${100 * gameState.level} poin`);
        
        // Check if all cats are found in this level
        if (gameState.hiddenSpots.length === 0) {
          // Add time bonus
          const timeBonus = gameState.timeLeft * 5;
          gameState.score += timeBonus;
          
          setTimeout(() => {
            showMessage(`Level Selesai! Bonus Waktu: +${timeBonus} poin`);
            
            // Level up after short delay
            setTimeout(() => {
              levelUp();
            }, 1500);
          }, 1000);
        }
      } else {
        // Incorrect spot
        gsap.to(spot, { 
          x: 10, 
          duration: 0.1, 
          yoyo: true, 
          repeat: 3,
          backgroundColor: "var(--danger-color)",
          onComplete: () => {
            // Reset color after a short delay
            gsap.to(spot, { 
              backgroundColor: "", 
              duration: 0.5,
              delay: 0.5
            });
          }
        });
        
        // Play wrong sound
        if (gameState.soundEnabled) {
          sounds.wrong.play();
        }
        
        // Penalty - lose time
        gameState.timeLeft = Math.max(1, gameState.timeLeft - 3);
        updateDisplay();
        
        showMessage("Tidak ada kucing di sini! -3 detik");
      }
    }
    
    // Create confetti effect
    function createConfetti(spot) {
      const rect = spot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        const angle = Math.random() * 360;
        const distance = Math.random() * 100 + 50;
        
        // Set initial style
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.position = 'fixed';
        confetti.style.zIndex = '5';
        confetti.style.left = `${centerX}px`;
        confetti.style.top = `${centerY}px`;
        confetti.style.borderRadius = `${Math.random() > 0.5 ? '50%' : '0'}`;
        confetti.style.opacity = '1';
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        gsap.to(confetti, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance + 100,
          rotation: Math.random() * 720 - 360,
          opacity: 0,
          duration: 1.5,
          ease: 'power1.out',
          onComplete: () => confetti.remove()
        });
      }
    }
    
    // Event Listeners
    spots.forEach(spot => {
      spot.addEventListener("click", () => handleSpotClick(spot));
    });
    
    playAgainBtn.addEventListener("click", restartGame);
    restartBtn.addEventListener("click", restartGame);
    continueBtn.addEventListener("click", () => {
      levelUpModal.classList.add('hidden');
      resetCats();
      selectRandomSpots();
      startTimer();
    });
    
    pauseBtn.addEventListener("click", togglePause);
    soundToggleBtn.addEventListener("click", toggleSound);
    hintBtn.addEventListener("click", showHint);
    
    // Add extra CSS for confetti
    const style = document.createElement('style');
    style.textContent = `
      .confetti {
        position: fixed;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    
    // Start the game
    initGame();
  });