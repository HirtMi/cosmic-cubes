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

function Point(x, y){
    this.x = x;
    this.y = y;
}

function connectPoints(p1, p2){
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}



function Polygon(x, y, sides, size){
    this.centerX = x;
    this.centerY = y;
    this.size = size;
    this.angle = 360 / sides;
    this.points = [];
    
    this.construct = function(){
        for (let i = 1; i <= sides; i ++){
            let vector = new Vector(this.centerX, this.centerY, this.angle * i, this.size);
            vector.construct();
            let point = new Point(vector.endX, vector.endY);
            this.points.push(point);
        }
    }

    this.draw = function(){
        for (let i = 0; i < this.points.length - 1; i++){
            connectPoints(this.points[i], this.points[i+1])
        }
        connectPoints(this.points[0], this.points[this.points.length - 1]);
    }
}

let test1 = new Polygon(0,0, 8, 100);
test1.construct();
test1.draw();














function Polyhedron(){

}