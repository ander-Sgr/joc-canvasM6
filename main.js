const gameComponents = {

}
const canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')

window.onload = function(){
    drawBackground()
}

function drawBackground() {
   imgBackground = new Image()
   imgBackground.src = './img/backgroundGame.jpg'
   ctx.drawImage(imgBackground, 0, 0, 300, 150)
}

