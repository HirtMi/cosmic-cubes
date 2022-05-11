let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
ctx.setTransform(1,0,0,-1,WIDTH/2, HEIGHT/2);


function setStroke(lineWidth, color){
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
}


function Line(startX, startY, endX, endY){
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;

    this.draw = function(){
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
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
    this.startX = startX;
    this.startY = startY;
    this.angle = angle;
    this.rads = (Math.PI / 180) * this.angle;
    this.magnitude = magnitude;

    this.construct = function(){
        this.endX = this.startX + Math.cos(this.rads) * this.magnitude;
        this.endY = this.startY + Math.sin(this.rads) * this.magnitude;
        this.line = new Line(this.startX, this.startY, this.endX, this.endY);
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


function Circle (x, y, radius, expansionSpeed){
    this.x = x;
    this.y = y;
    this.r = radius;
    this.speed = expansionSpeed;
    this.collapse = false;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.stroke();
    }

    this.expand = function() {
        this.r += this.speed;
    }

    this.shrink = function() {
        this.r -= this.speed;
    }

    this.moveX = function(dx){
        this.x += dx;
    }

    this.moveY = function(dy){
        this.y -= dy;
    }

    this.randomizeColor = function(probability){
        if (Math.random() < probability){
            this.color = "#" + Math.floor(Math.random()*16777215).toString(16);
        }
    }
}


function Polygon(x, y, sides, size){
    this.centerX = x;
    this.centerY = y;
    this.size = size;
    this.angle = 360 / sides;

    this.construct = function(){
        this.vectors = [];
        this.points = [];
        for (let i = 1; i <= sides; i++){
            let vector = new Vector(this.centerX, this.centerY, this.angle * i, this.size);
            vector.construct();
            this.vectors.push(vector);
            let point = new Point(vector.endX, vector.endY);
            this.points.push(point);
        }
        this.rotate(this.angle + 90);
    }

    this.draw = function(){
        for (let i = 0; i < this.points.length - 1; i++){
            connectPoints(this.points[i], this.points[i+1])
        }
        connectPoints(this.points[0], this.points[this.points.length - 1]);
    }

    this.rotate = function(angle){
        for (let i = 0; i < this.vectors.length; i++){
            this.vectors[i].rotate(angle);
            this.vectors[i].construct();
        }
        for (let i = 0; i < this.points.length; i++){
            this.points[i].x = this.vectors[i].endX;
            this.points[i].y = this.vectors[i].endY;
        }
    }

    this.dilate = function(scale_factor){
        this.size *= scale_factor;
        this.construct();
    }
}


// Testing //
setStroke(1, "black");

let origin = new Circle(0, 0, 3);
origin.draw();

let outline = new Circle(0,0,20*11);
outline.draw();

for (let i = 3; i < 12; i++){
    let polygon = new Polygon(0,0,i,20*i);
    polygon.construct();
    polygon.draw();
}

// End Testing //










function Polyhedron(){

}