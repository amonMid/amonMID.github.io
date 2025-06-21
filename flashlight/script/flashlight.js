const box = document.querySelector('.box');
const scaryImage = document.getElementById('scary');

let flashlightX = window.innerWidth / 2;
let flashlightY = window.innerHeight / 2;
const radius = 300;

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
  const rect = scaryImage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = flashlightX - centerX;
  const dy = flashlightY - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < radius && !scaryImage.classList.contains('jump')) {
    moveImageOutsideSmoothly();
  }
}

// Initial reveal
setTimeout(() => {
  const { x, y } = randomOutsidePosition();
  moveImageTo(x, y);
  scaryImage.style.opacity = 1;
}, 3000);
