const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Responsive canvas
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Ball
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;
let ballRadius = 8;

// Paddle
let paddleHeight = 10;
let paddleWidth = 80;
let paddleX = canvas.width / 2 - paddleWidth / 2;

// Controls
let rightPressed = false;
let leftPressed = false;

// Game state
let score = 0;
let lives = 3;

// Bricks
let brickRowCount = 4;
let brickColumnCount = 6;
let brickWidth = 60;
let brickHeight = 15;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 20;

let bricks = [];

function initBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}
initBricks();

// Keyboard
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", e => {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
});

// Touch controls
canvas.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  let touchX = touch.clientX - rect.left;

  paddleX = touchX - paddleWidth / 2;

  if (paddleX < 0) paddleX = 0;
  if (paddleX > canvas.width - paddleWidth)
    paddleX = canvas.width - paddleWidth;
});

// Draw Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffff";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00ffff";
  ctx.fill();
  ctx.closePath();
}

// Draw Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#ff00ff";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#ff00ff";
  ctx.fill();
  ctx.closePath();
}

// Draw Bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

        b.x = brickX;
        b.y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = `hsl(${c * 50}, 70%, 50%)`;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Collision
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          document.getElementById("score").textContent = score;

          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Game Over UI
function showGameOver() {
  document.getElementById("gameOverScreen").classList.remove("hidden");
}

function restartGame() {
  document.location.reload();
}

// Game Loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Wall bounce
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius)
    dx = -dx;

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      document.getElementById("lives").textContent = lives;

      if (lives === 0) {
        showGameOver();
        return;
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
      }
    }
  }

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth)
    paddleX += 5;
  if (leftPressed && paddleX > 0)
    paddleX -= 5;

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

// Start game
draw();
