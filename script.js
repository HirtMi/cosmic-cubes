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


function Vector(startX, startY, angle, magnitude, lineWidth, color){
    this.startX = startX;
    this.startY = startY;
    this.angle = angle;
    this.rads = (Math.PI / 180) * this.angle;
    this.magnitude = magnitude;
    this.lineWidth = lineWidth;
    this.color = color;

    this.construct = function(){
        this.endX = this.startX + Math.cos(this.rads) * this.magnitude;
        this.endY = this.startY + Math.sin(this.rads) * this.magnitude;
        this.line = new Line(this.startX, this.startY, this.endX, this.endY, this.lineWidth, this.color);
    }

    this.draw = function(){
        this.construct();
        this.line.draw();
    }

    this.rotate = function(angle){
        this.rads += (Math.PI / 180) * angle;
    }

    this.scale = function(scalar){
        this.magnitude *= scalar;
    }

    this.translate = function(dx, dy){
        this.startX += dx;
        this.startY += dy;
    }
}

let vector = new Vector(0,0,190,140,3,"red");
vector.draw();
vector.rotate(30);
vector.draw();
vector.translate(100,100);
vector.scale(.3);
vector.draw();
vector.rotate(-90);
vector.scale(4);
vector.draw();


function Polygon(x, y, sides, size){
    this.centerX = x;
    this.centerY = y;
    this.size = size;
    this.polygon = [];
    this.point1 = [this.centerX + x, this.centerY + y];

    this.construct = function(){
        this.polygon.push(this.point1);
        for (let i = 1; i < sides; i ++){
            //apply rotation matrix to previous point to find next point, start with this.point1//
        }
    }

    this.draw = function(){
        //connect points in array//
    }
}

//make polygon a list of points, then just have function that connects the points//




