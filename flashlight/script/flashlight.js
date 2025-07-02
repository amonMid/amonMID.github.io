const box = document.querySelector('.box');
const scaryImage = document.getElementById('scary');
const fadeOverlay = document.querySelector('.fade-overlay');
const glitch = document.querySelector('.glitch');
const glitchSound = document.getElementById('glitchsound');

let flashlightX = window.innerWidth / 2;
let flashlightY = window.innerHeight / 2;
const radius = 300;

let hideTimer;
let finalRevealed = false;

document.addEventListener('mousemove', e => {
  const rect = box.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  flashlightX = x;
  flashlightY = y;

  box.style.setProperty('--x', `${x}px`);
  box.style.setProperty('--y', `${y}px`);

  checkImageInBeam();
});

function isOutsideFlashlight(x, y) {
  const dx = x - flashlightX;
  const dy = y - flashlightY;
  return Math.sqrt(dx * dx + dy * dy) > radius;
}

function randomOutsidePosition() {
  let x, y;
  do {
    x = Math.random() * window.innerWidth;
    y = Math.random() * window.innerHeight;
  } while (!isOutsideFlashlight(x, y));
  return { x, y };
}

function moveImageTo(x, y) {
  scaryImage.style.left = `${x}px`;
  scaryImage.style.top = `${y}px`;
}

function moveImageOutsideSmoothly() {
  const { x, y } = randomOutsidePosition();
  scaryImage.classList.add('jump');
  setTimeout(() => {
    scaryImage.classList.remove('jump');
    moveImageTo(x, y);
  }, 500);
}

function checkImageInBeam() {
  if (finalRevealed) return;
  
  const rect = scaryImage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = flashlightX - centerX;
  const dy = flashlightY - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < radius){
    scaryImage.style.opacity = 1;
    scaryImage.classList.remove('big');
    scaryImageFound();
  }

  if (dist < radius && !scaryImage.classList.contains('jump')) {
    moveImageOutsideSmoothly();
  }
}

function scaryImageFound(){
  clearTimeout(hideTimer);
  hideTimer = setTimeout(triggerBigReveal, 5000)
}

function triggerBigReveal(){
  finalRevealed = true;

  fadeOverlay.style.opacity = 1;
  setTimeout(() => triggerGlitch(), 50);

  setTimeout(() => {
    scaryImage.style.left = '50%';
    scaryImage.style.top = '50%';
    scaryImage.style.transform = 'translate(-50%, -50%)';
    scaryImage.style.height = '150px';
    scaryImage.style.width = 'auto';
    scaryImage.style.opacity = 1;
  }, 500);
  
  setTimeout(() => {
    fadeOverlay.style.opacity = 0;
    setTimeout(() => triggerGlitch(), 50);
  }, 2000);

  setTimeout(() => {
    fadeOverlay.style.opacity = 1;
    setTimeout(() => triggerGlitch(), 50);

    setTimeout(() => {
      scaryImage.style.height = '';
      scaryImage.style.width = '';
      scaryImage.classList.add('big');
      fadeOverlay.style.opacity = 0;
      setTimeout(() => triggerGlitch(), 50);

      setTimeout(() => {
        fadeOverlay.style.opacity = 1;
        setTimeout(() => triggerGlitch(), 50);

        setTimeout(() => {
          scaryImage.classList.remove('big');
          scaryImage.style.height = '150px';
          scaryImage.style.width = 'auto';

          const{x, y} = randomOutsidePosition();
          scaryImage.style.left = `${x}px`;
          scaryImage.style.top = `${y}px`;
          scaryImage.style.transform = 'translate(-50%, -50%)';

          setTimeout(() => {
            finalRevealed = false;
            scaryImageFound();
            fadeOverlay.style.opacity = 0;
            setTimeout(() => triggerGlitch(), 50);
          }, 500);
        }, 2000 );
      }, 4000);
    }, 2000);
  }, 5000);
  

}

function triggerGlitch() {
  glitch.classList.add('active');
  try {
    glitchSound.pause();
    glitchSound.currentTime = 0;
    glitchSound.play();
  } catch (e) {
    console.warn('Glitch Sound Failed', e);
  }

  setTimeout(() => {
    glitch.classList.remove('active');
  }, 500);
}

setTimeout(() => {
  const { x, y } = randomOutsidePosition();
  moveImageTo(x, y);
  scaryImage.style.opacity = 1;
  scaryImageFound();
}, 3000);
