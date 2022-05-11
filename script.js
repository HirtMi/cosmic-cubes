let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
ctx.setTransform(1,0,0,-1,WIDTH/2, HEIGHT/2);


function Line(startX, startY, endX, endY, lineWidth, color){
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.lineWidth = lineWidth;
    this.color = color

    this.draw = function(){
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }

    this.translate = function(dx, dy){
        this.startX += dx;
        this.startY += dy;
        this.endX += dx;
        this.endY += dy;
    }
}

function Vector(startX, startY, angle, magnitude){
    this.angle = angle;
    this.rads = (Math.PI / 180) * this.angle;
    this.endX = startX + Math.cos(this.rads) * magnitude;
    this.endY = startY + Math.sin(this.rads) * magnitude;

    this.construct = function(){
        this.line = new Line(startX, startY, this.endX, this.endY, 2, "black");
    }

    this.draw = function(){
        this.construct();
        this.line.draw();
    }

    this.rotate = function(angle){
        this.rads += (Math.PI / 180) * angle;
        this.endX = startX + Math.cos(this.rads) * magnitude;
        this.endY = startY + Math.sin(this.rads) * magnitude;
    }

}

let vector = new Vector(0,0,190,100);
vector.draw();
vector.rotate(60);
vector.draw();
vector.rotate(180);
vector.draw();

function Polygon(sides){
    let polygon;
}