const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddle = {
  width: 80,
  height: 10,
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  speed: 5,
  moveLeft: false,
  moveRight: false
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 5,
  dx: 2,
  dy: -2
};

function drawPaddle() {
  ctx.fillStyle = '#09f';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#f30';
  ctx.fill();
  ctx.closePath();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  if (paddle.moveLeft) {
    paddle.x -= paddle.speed;
  } else if (paddle.moveRight) {
    paddle.x += paddle.speed;
  }

  // bounds
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

  ball.x += ball.dx;
  ball.y += ball.dy;

  // wall collisions
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // paddle collision
  if (ball.y + ball.radius >= paddle.y &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width) {
    ball.dy = -ball.dy;
    ball.y = paddle.y - ball.radius;
  }

  // bottom out -> reset
  if (ball.y - ball.radius > canvas.height) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -2;
  }
}

function draw() {
  clear();
  drawPaddle();
  drawBall();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') paddle.moveLeft = true;
  if (e.key === 'ArrowRight') paddle.moveRight = true;
});

document.addEventListener('keyup', function (e) {
  if (e.key === 'ArrowLeft') paddle.moveLeft = false;
  if (e.key === 'ArrowRight') paddle.moveRight = false;
});

loop();
