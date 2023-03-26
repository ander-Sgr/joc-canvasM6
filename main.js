const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const buttonReset = document.getElementById('reset-button')
const rewardsCounter = document.getElementById('rewards-counter')
const imgBackground = new Image()
const imgCharacter = new Image()
const imgBlock = new Image()
const imgReward = new Image()
const blockSize = 73
const blockSpacing = 9
const rewards = []
const blocks = []
const blockPattern = generateRandomBlockPattern()
/*const blockPattern = [
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0],
]*/
const numRows = blockPattern.length
const numCols = blockPattern[0].length
const randomPattern = []
const character = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: 0,
  dy: 0,
  size: 60
}
const blockMinDistance = 100


let time = document.getElementById('timer')
let interval = null

let countSeconds = 0
let isGameStarted = false
let shouldDraw = true
let lastFrameTime = 0;
let fps = 100; // fotogramas por segundo

imgBackground.onload = function () {
  drawAssets()
}

imgBackground.src = '/img/backgroundGame.jpg'
imgCharacter.src = '/img/character.png'
imgBlock.src = '/img/block.jpg'
imgReward.src = '/img/reward.png'

canvas.width = 950
canvas.height = 650

buttonReset.addEventListener('click', resetGame)

canvas.addEventListener('click', function (event) {
  let x = event.clientX - canvas.offsetLeft
  let y = event.clientY - canvas.offsetTop

  if (x > canvas.width / 2 - 75 && x < canvas.width / 2 + 75 &&
    y > canvas.height / 2 && y < canvas.height / 2 + 50) {
    if (imgBackground.complete) {
      isGameStarted = true
    }
  }

})

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      character.dy = -5;
      break;
    case "ArrowDown":
    case "s":
      character.dy = 5;
      break;
    case "ArrowLeft":
    case "a":
      character.dx = -5;
      break;
    case "ArrowRight":
    case "d":
      character.dx = 5;
      break;
  }
});

document.addEventListener("keyup", function (event) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      character.dy = 0;
      break;
    case "ArrowDown":
    case "s":
      character.dy = 0;
      break;
    case "ArrowLeft":
    case "a":
      character.dx = 0;
      break;
    case "ArrowRight":
    case "d":
      character.dx = 0;
      break;
  }
});



loopGame()
generateBlocks()

function generateRandomBlockPattern() {
  const rows = 8;
  const cols = 13;
  const density = 0.3

  const pattern = []
  for (let row = 0; row < rows; row++) {
    pattern.push([])
    for (let col = 0; col < cols; col++) {
      const isBlock = Math.random() < density
      // pattern[row].push(isBlock ? 1 : 0)
      if (isBlock) {
        pattern[row].push(1)
      } else if (Math.random() < 0.25) {
        pattern[row].push(2)
        rewards.push({
          x: col * (blockSize + blockSpacing),
          y: row * (blockSize + blockSpacing)
        })
      } else {
        pattern[row].push(0)
      }
    }
  }
  return pattern
}

function generateBlocks() {
  let lastBlockX = -blockSpacing;
  let lastBlockY = -blockSpacing;
  for (let row = 0; row < blockPattern.length; row++) {
    for (let col = 0; col < blockPattern[row].length; col++) {
      if (blockPattern[row][col] === 1) {
        const x = col * (blockSize + blockSpacing);
        const y = row * (blockSize + blockSpacing);
        const distanceToLastBlock = Math.sqrt((x - lastBlockX) ** 2 + (y - lastBlockY) ** 2);
        if (distanceToLastBlock >= blockMinDistance) {
          blocks.push({
            x: x,
            y: y,
            width: blockSize,
            height: blockSize
          });
          lastBlockX = x;
          lastBlockY = y;
        }
      }
    }
  }
}

function loopGame(timestamp) {
  let elapsed = timestamp - lastFrameTime;
  let frameDuration = 1000 / fps;

  if (elapsed > frameDuration) {
    lastFrameTime = timestamp - (elapsed % frameDuration);

    if (isGameStarted) {
      updateGame()
      startTimer()
      drawAssets()
    } else {
      drawScreenPresentation()
    }
  }

  requestAnimationFrame(loopGame);
}

function drawAssets() {
  drawBackground()
  drawBlocks()
  drawRewards()
  drawCharacter()
}

function resetGame() {
  isGameStarted = false
  location.reload()
  resetTimer()
}

function drawBackground() {
  ctx.drawImage(imgBackground, 0, 0, 950, 650)
}

function drawCharacter() {
  ctx.drawImage(imgCharacter, character.x, character.y, character.size, character.size);
}

function drawBlocks() {
  for (let block of blocks) {
    ctx.drawImage(imgBlock, block.x, block.y, block.width, block.height);
  }
}

function drawRewards() {
  for (let reward of rewards) {
    ctx.drawImage(imgReward, reward.x, reward.y, blockSize, blockSize);
  }
}

function checkCollisions(newX, newY) {
  let isColliding = false;
  blocks.forEach(obstacle => {
    if (
      newX < obstacle.x + blockSize &&
      newX + character.size > obstacle.x &&
      newY < obstacle.y + blockSize &&
      newY + character.size > obstacle.y
    ) {
      isColliding = true;
      return;
    }
  });

  if (!isColliding) {
    character.x = newX;
    character.y = newY;
  }
}

function updateGame() {
  let newX = character.x + character.dx;
  let newY = character.y + character.dy;
  // Check collision with canvas borders
  if (newX < 0 || newX + character.size > canvas.width) {
    newX = character.x;
  }
  if (newY < 0 || newY + character.size > canvas.height) {
    newY = character.y;
  }

  checkCollisions(newX, newY)
}

function drawScreenPresentation() {
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#3c585f"
  ctx.font = "40px sans-serif"
  ctx.textAlign = "center";
  drawTextPresentation()
  drawButtonStartGame()
}

function drawTextPresentation() {
  ctx.fillText('Bienvenido a recoger las recompensas !', canvas.width / 2, 200);
  ctx.font = '24px Arial';
  ctx.fillText('Para iniciar el juego dale al boton de Iniciar juego', canvas.width / 2, 240);
  ctx.font = '18px Arial';
  ctx.fillText('Para moverse usa las teclas A/W/S/D,', canvas.width / 2, 280);
}


function drawButtonStartGame() {
  ctx.fillStyle = "#FF0000"
  ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2, 150, 50)
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "24px sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("Iniciar Juego", canvas.width / 2, canvas.height / 2 + 32)
}

function createTime() {
  ++countSeconds
  let hour = Math.floor(countSeconds / 3600)
  let minute = Math.floor((countSeconds - hour * 3000) / 60)
  let seconds = countSeconds - (hour * 3600 + minute * 60)


  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  if (seconds < 10) seconds = "0" + seconds;

  time.textContent = minute + ":" + seconds;
}

function startTimer() {
  if (interval == null) {
    interval = setInterval(createTime, 1000)
  } else {
    return
  }
}

function stopTimer() {
  clearInterval(interval)
  interval = null
}

function resetTimer() {
  stopTimer()
  countSeconds = 0
  time.textContent = "00:00"
}