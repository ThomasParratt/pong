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
let playerNames = ["Tom", "Felipe", "Michael", "Panu", "Lauri"];
let player1 = playerNames[Math.floor(Math.random() * 5)];
let player2 = playerNames[Math.floor(Math.random() * 5)];
while (player2 === player1) {
  // If player2 is the same as player1, select a new player2
  player2 = playerNames[Math.floor(Math.random() * 5)];
}
let player1Score = 0;
let player2Score = 0;

// To track which keys are currently pressed
const keysPressed: { [key: string]: boolean } = {}; // Object to track key presses

document.addEventListener('keydown', (e) => {
  keysPressed[e.key] = true; // Set key to true when it's pressed
});

document.addEventListener('keyup', (e) => {
  keysPressed[e.key] = false; // Set key to false when it's released
});

function updatePlayerPositions() {
  // Player 1 movement (W and S keys)
  if (keysPressed['w']) player1Y -= paddleSpeed;
  if (keysPressed['s']) player1Y += paddleSpeed;

  // Player 2 movement (ArrowUp and ArrowDown keys)
  if (keysPressed['ArrowUp']) player2Y -= paddleSpeed;
  if (keysPressed['ArrowDown']) player2Y += paddleSpeed;

  // Ensure paddles stay within bounds
  player1Y = Math.max(0, Math.min(canvasHeight - paddleHeight, player1Y));
  player2Y = Math.max(0, Math.min(canvasHeight - paddleHeight, player2Y));
}

// Game Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  updatePlayerPositions();
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
  // Calculate the width of the text for player 1 and adjust to center
  const player1Text = player1 + ": " + player1Score;
  const player1TextWidth = ctx.measureText(player1Text).width;
  ctx.fillText(player1Text, (canvasWidth * 0.25) - (player1TextWidth / 2), 70);

  // Calculate the width of the text for player 2 and adjust to center
  const player2Text = player2 + ": " + player2Score;
  const player2TextWidth = ctx.measureText(player2Text).width;
  ctx.fillText(player2Text, (canvasWidth * 0.75) - (player2TextWidth / 2), 70);
}

gameLoop();
