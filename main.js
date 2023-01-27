


window.onload = function (){
    const backgroundImage = document.getElementById('backgroundGame')

    let canvas = document.getElementById('myCanvas')
    let ctx
    ctx = canvas.getContext('2d')
    ctx.drawImage(backgroundImage, 300,500)
    draw()
}
function draw(){

}