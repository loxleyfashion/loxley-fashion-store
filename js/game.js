const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let birdY = 200;
let gravity = 1.2;
let jump = -18;
let velocity = 0;
let playing = true;

canvas.addEventListener("click", () => {
  velocity = jump;
});

function drawBird() {
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(160, birdY, 12, 0, Math.PI * 2);
  ctx.fill();
}

function gameLoop() {
  if (!playing) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  velocity += gravity;
  birdY += velocity;

  drawBird();

  if (birdY > canvas.height || birdY < 0) {
    endGame();
  }

  requestAnimationFrame(gameLoop);
}

function endGame() {
  playing = false;
  ctx.fillText("Loading Collection...", 90, 240);

  setTimeout(() => {
    window.location.href = "products.html";
  }, 1500);
}

// Auto redirect even if user doesn't play
setTimeout(() => {
  window.location.href = "products.html";
}, 10000);

gameLoop();
