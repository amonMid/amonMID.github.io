const flashlight = document.querySelector('.flashlight');
const message = document.getElementById('message');
const scaryImage = document.getElementById('scary');

const messageRect = () => message.getBoundingClientRect();

document.addEventListener('mousemove', e => {
  const x = e.clientX;
  const y = e.clientY;

  flashlight.style.setProperty('--x', `${x}px`);
  flashlight.style.setProperty('--y', `${y}px`);

  const rect = messageRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.hypot(centerX - x, centerY - y);

  message.style.opacity = distance < 250 ? 1 : 0;
});

setTimeout(() => {
  scaryImage.style.opacity = 1;
}, 5000);
