const canvas = document.getElementById('canvas')
const resetButton = document.getElementById('resetButton')
const ctx = canvas.getContext('2d')
const blocks = []
const rewards = []
const blockSize = 80
const maxBlocks = 16
const maxRewards = 10
const character = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dx: 0,
  dy: 0,
  size: 60
}

let time = document.getElementById('timer')
let interval = null
let countSeconds = 0
let countPremis = 0
let gameOver = false


canvas.width = 950
canvas.height = 650

generateBlockCoordinates()
animationLoop()
resetButton.addEventListener('click', resetGame, false)

function drawBackgroundImage() {

  const imgBackground = document.getElementById('backgroundGame')
  ctx.drawImage(imgBackground, 0, 0, 950, 650)
}

function drawCharacter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackgroundImage()
  drawBlock()
  const imgCharacter = document.getElementById('characterImage')
  ctx.drawImage(imgCharacter, character.x, character.y, character.size, character.size)
}

function drawBlock() {
  const imgBlock = document.getElementById('blockImage')
  for (const block of blocks) {
    ctx.drawImage(imgBlock, block.x, block.y, blockSize, blockSize)
  }
}

function drawReward (){
  for (const rewards of rewards) {
    
  }
}

function generateBlockCoordinates() {
  for (let i = 0; i < maxBlocks; i++) {
    let x = Math.floor(Math.random() * canvas.width)
    let y = Math.floor(Math.random() * canvas.height)

    while (isOverlapping(x, y)) {
      x = Math.floor(Math.random() * canvas.width)
      y = Math.floor(Math.random() * canvas.height)
    }

    blocks.push({ x, y })
  }
}

function isOverlapping(x, y) {
  for (const block of blocks) {
  if (Math.abs(block.x - x) < blockSize  +  blockSize && Math.abs(block.y - y) < blockSize + blockSize) {
      return true
    }
  }

  if (Math.abs(character.x - x) < character.size + 20 && Math.abs(character.y - y) < character.size+ 20) {
    return true
  }

  return false
}

function updatePosition() {
  startTimer()
  let newX = character.x + character.dx;
  let newY = character.y + character.dy;
  // Check collision with canvas borders
  if (newX < 0 || newX + character.size > canvas.width) {
    newX = character.x;
  }
  if (newY < 0 || newY + character.size > canvas.height) {
    newY = character.y;
  }

  // Check collision with obstacles
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

  // Update position if no collision
  if (!isColliding) {
    character.x = newX;
    character.y = newY;
  }
}

document.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      character.dy = -5;
      break;
    case "ArrowDown":
    case "KeyS":
      character.dy = 5;
      break;
    case "ArrowLeft":
    case "KeyA":
      character.dx = -5;
      break;
    case "ArrowRight":
    case "KeyD":
      character.dx = 5;
      break;
  }
});

document.addEventListener("keyup", function (event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      character.dy = 0;
      break;
    case "ArrowDown":
    case "KeyS":
      character.dy = 0;
      break;
    case "ArrowLeft":
    case "KeyA":
      character.dx = 0;
      break;
    case "ArrowRight":
    case "KeyD":
      character.dx = 0;

      break;
  }
});

function resetGame() {
  resetTimer()
  //window.location.reload();
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
  console.log('entra')
  countSeconds = 0
  console.log(countSeconds)
  time.textContent = "00:00"
}

function animationLoop() {
  updatePosition();
  drawCharacter();
  requestAnimationFrame(animationLoop);

}
