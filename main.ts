const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let gameState: 'menu' | 'playing' | 'result' = 'menu'; // Start in menu mode
let twoPlayerMode = false; // Default is one-player mode

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
let winner = player1;
let player1Score = 0;
let player2Score = 0;

// To track which keys are currently pressed
const keysPressed: { [key: string]: boolean } = {}; // Object to track key presses

document.addEventListener('keydown', (e) => {
  if (gameState === 'menu') {
    if (e.key === '1') {
      twoPlayerMode = false; // One player mode (AI plays as Player 2)
      player2 = "AI";
      gameState = 'playing';
      resetGame();
    } else if (e.key === '2') {
      twoPlayerMode = true; // Two-player mode
      gameState = 'playing';
      resetGame();
    }
  } else {
    if (e.key === 'Escape') {
      gameState = 'menu'; // Return to the menu screen
      resetGame(); // Reset game variables
    } else {
      keysPressed[e.key] = true; // Handle normal game input
    }
  }
});

document.addEventListener('keyup', (e) => {
  keysPressed[e.key] = false;
});

function resetGame() {
  player1Y = (canvasHeight - paddleHeight) / 2;
  player2Y = (canvasHeight - paddleHeight) / 2;
  ballX = canvasWidth / 2;
  ballY = canvasHeight / 2;
  ballSpeedX = 5;
  ballSpeedY = 3;
  player1Score = 0;
  player2Score = 0;
}


function updatePlayerPositions() {
  // Player 1 movement (W and S keys)
  if (keysPressed['w']) player1Y -= paddleSpeed;
  if (keysPressed['s']) player1Y += paddleSpeed;

  if (twoPlayerMode) {
    // Player 2 movement (ArrowUp and ArrowDown keys)
    if (keysPressed['ArrowUp']) player2Y -= paddleSpeed;
    if (keysPressed['ArrowDown']) player2Y += paddleSpeed;
  } else {
    // AI movement for Player 2
    const lerpSpeed = 0.1; // Smooth movement
    player2Y += (ballY - (player2Y + paddleHeight / 2)) * lerpSpeed;
  }

  // Ensure paddles stay within bounds
  player1Y = Math.max(0, Math.min(canvasHeight - paddleHeight, player1Y));
  player2Y = Math.max(0, Math.min(canvasHeight - paddleHeight, player2Y));
}


// Game Loop
function gameLoop() {
  if (gameState === 'menu') {
    drawMenu();
  } 
  else if (gameState === 'result') {
    drawResult();
  }
  else {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}


function update() {
  updatePlayerPositions();
  // Ball Movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Collision with top and bottom
  if (ballY <= 0 || ballY + ballSize >= canvasHeight) ballSpeedY *= -1;

  // Player 1 paddle collision
  if (ballX === paddleWidth + 15 &&
    ballY + ballSize >= player1Y &&
    ballY <= player1Y + paddleHeight) {

      ballSpeedX *= -1;

      /* // Calculate where the ball hit the paddle
      const hitPos = (ballY + ballSize / 2) - (player1Y + paddleHeight / 2); //how far the ball's center is from the paddle's center vertically
      const normalized = hitPos / (paddleHeight / 2); // Value between -1 and 1
      ballSpeedY = normalized * 3; // Max vertical speed */
  }

  // Player 2 paddle collision
  if (ballX + ballSize === canvasWidth - paddleWidth - 15 &&
    ballY + ballSize >= player2Y &&
    ballY <= player2Y + paddleHeight) {

      ballSpeedX *= -1;

      /* // Calculate where the ball hit the paddle
      const hitPos = (ballY + ballSize / 2) - (player2Y + paddleHeight / 2);
      const normalized = hitPos / (paddleHeight / 2); // Value between -1 and 1
      ballSpeedY = normalized * 3; // Max vertical speed */
  }

  // Reset ball if missed and count score
  if (ballX < 0) {
    player2Score++;
    if (player2Score === 5) {
      gameState = 'result';
      winner = player2;
    }
    resetBall();
  }
  if (ballX > canvasWidth) {
    player1Score++;
    if (player1Score === 5) {
      gameState = 'result';
    }
    resetBall();
  }
}

function resetBall() {
  ballX = canvasWidth / 2;
  ballY = canvasHeight / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function drawResult() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = 'white';
  ctx.font = "30px 'Courier New', monospace";
  const pong = winner + " is the winner!";
  const pongWidth = ctx.measureText(pong).width;
  ctx.fillText(pong, (canvasWidth * 0.5) - (pongWidth / 2), canvasHeight / 4);
}

function drawMenu() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = 'white';
  ctx.font = "100px 'Courier New', monospace";
  const pong = "PONG";
  const pongWidth = ctx.measureText(pong).width;
  ctx.fillText(pong, (canvasWidth * 0.5) - (pongWidth / 2), canvasHeight / 4);

  ctx.font = "30px 'Courier New', monospace"; // Set font before measuring text
  const text1 = "Press '1' for One Player";
  const text1Width = ctx.measureText(text1).width;
  const text2 = "Press '2' for Two Players"; // Fixed text from "One Player" to "Two Players"
  const text2Width = ctx.measureText(text2).width;

  ctx.fillText(text1, (canvasWidth * 0.5) - (text1Width / 2), canvasHeight / 2);
  ctx.fillText(text2, (canvasWidth * 0.5) - (text2Width / 2), canvasHeight / 2 + 50);
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
  
  /* ctx.fillText("" + player1Score, canvasWidth * 0.25, 70);
  ctx.fillText("" + player2Score, canvasWidth * 0.75, 70); */

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
