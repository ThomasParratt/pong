const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Game Constants
const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let player1Y = (canvasHeight - paddleHeight) / 2;
let player2Y = (canvasHeight - paddleHeight) / 2;
let ballX = canvasWidth / 2, ballY = canvasHeight / 2;
let ballSpeedX = 5, ballSpeedY = 3;
const paddleSpeed = 6;
let player1Score = 0;
let player2Score = 0;

// Event Listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'w') player1Y -= paddleSpeed;
  if (e.key === 's') player1Y += paddleSpeed;
  player1Y = Math.max(0, Math.min(canvasHeight - paddleHeight, player1Y));
  if (e.key === 'ArrowUp') player2Y -= paddleSpeed;
  if (e.key === 'ArrowDown') player2Y += paddleSpeed;
  player2Y = Math.max(0, Math.min(canvasHeight - paddleHeight, player2Y));
});

// Game Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Ball Movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Collision with top and bottom
  if (ballY <= 0 || ballY + ballSize >= canvasHeight) ballSpeedY *= -1;

  // Player paddle collision
  if (ballX <= paddleWidth + 15 &&
      ballY + ballSize >= player1Y &&
      ballY <= player1Y + paddleHeight) {
    ballSpeedX *= -1;
  }

  if (ballX + ballSize >= canvasWidth - paddleWidth - 15 &&
      ballY + ballSize >= player2Y &&
      ballY <= player2Y + paddleHeight) {
    ballSpeedX *= -1;
  }

  // Reset ball if missed and count score
  if (ballX < 0) {
    player2Score++;
    resetBall();
  }
  if (ballX > canvasWidth) {
    player1Score++;
    resetBall();
  }
}

function resetBall() {
  ballX = canvasWidth / 2;
  ballY = canvasHeight / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw player paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(15, player1Y, paddleWidth, paddleHeight);

  ctx.fillRect((canvasWidth - paddleWidth) - 15, player2Y, paddleWidth, paddleHeight);

  // Draw centre line
  for (let i = 0; i < canvasHeight; i+=canvasHeight/20)
    ctx.fillRect(canvasWidth / 2, i, 3, canvasHeight / 40);

  // Draw ball
  ctx.fillRect(ballX, ballY, ballSize, ballSize);

  //Draw scores
  ctx.font = "50px 'Courier New', monospace";
  ctx.fillText("" + player1Score, canvasWidth * 0.25, 70);
  ctx.fillText("" + player2Score, canvasWidth * 0.75, 70);
}

gameLoop();
