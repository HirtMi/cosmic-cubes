let SCALE = 1.5;
let WIDTH = window.innerWidth * SCALE;
let HEIGHT = window.innerHeight * SCALE;
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
ctx.setTransform(1, 0, 0, -1, WIDTH / 2, HEIGHT / 2);
ctx.globalCompositeOperation = "lighter";
ctx.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);


function connectPoints(p1, p2){
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y, p1.z);
    ctx.lineTo(p2.x, p2.y, p2.z);
    ctx.stroke();
}


function setStroke(lineWidth, color, opacity){
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
}


export { canvas, ctx, connectPoints, setStroke, WIDTH, HEIGHT };