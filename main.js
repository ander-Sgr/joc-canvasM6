let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let up = false
let down = false
let left = false
let right = false

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.onload = function () {
    drawBackgroundImage()
    character.draw()
}

canvas.addEventListener('keydown', function(event){
    eventKeyCharacter(event, false)
})

canvas.addEventListener('keyUp', function(event) {
    eventKeyCharacter(event, true) 
})

const character = (x, y) => {
    this.x = x
    y: 0,
    length: 0,
    speed: 0,
    draw: () => {
        let imgCharacter = document.getElementById('characterImage')
        ctx.drawImage(imgCharacter, 100, 800, 120, 100)
    }
}


function eventKeyCharacter(eventKey, trigger) {
    eventKey.preventDefault()
    switch (eventKey.key) {
        case 'w':
        case 'ArrowUp':
            up = trigger
            break;
        case 's':
        case 'ArrowDoww':
            down = trigger
            break;
        case 'a':
        case 'ArrowLeft':
            left = trigger
            break;
        case 'd':
        case 'ArrowRight':
            right = trigger
            break
        default:
            break;
    }
}

function drawBackgroundImage() {
    let imgBackground = document.getElementById('backgroundGame')
    ctx.drawImage(imgBackground, 0, 0, window.innerWidth, window.innerHeight)
}

function main() {
    switch (key) {
        case value:
            
            break;
    
        default:
            break;
    }
}