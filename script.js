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


function Point(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}


function Line(p1, p2){
    this.startX = p1.x;
    this.startY = p1.y;
    this.startZ = p1.z;
    this.endX = p2.x;
    this.endY = p2.y;
    this.endZ = p2.z;

    this.draw = function(){
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY, this.startZ);
        ctx.lineTo(this.endX, this.endY, this.endZ);
        ctx.stroke();
    }

    this.translate = function(dx, dy, dz){
        this.startX += dx;
        this.startY += dy;
        this.startZ += dz;
        this.endX += dx;
        this.endY += dy;
        this.endZ += dz;
    }
}


function Vector(origin, angle, magnitude, depthAngle){
    this.startX = origin.x;
    this.startY = origin.y;
    this.startZ = origin.z;
    this.angle = angle;
    this.depthAngle = depthAngle;
    this.rads = (Math.PI / 180) * this.angle;
    this.depthRads = (Math.PI / 180) * this.depthAngle;
    this.magnitude = magnitude;

    this.construct = function(){
        this.endX = this.startX + Math.cos(this.rads) * this.magnitude;
        this.endY = this.startY + Math.sin(this.rads) * this.magnitude;
        this.endZ = this.startZ + Math.cos(this.depthRads) * this.magnitude;
        this.line = new Line(new Point(this.startX, this.startY, this.startZ), new Point(this.endX, this.endY, this.endZ));
    }

    this.draw = function(){
        this.construct();
        this.line.draw();
    }

    this.rotate = function(angle, depthAngle){
        this.rads += (Math.PI / 180) * angle;
        this.depthRads += (Math.PI / 180) * depthAngle;
    }

    this.scale = function(scalar){
        this.magnitude *= scalar;
    }

    this.translate = function(dx, dy, dz){
        this.startX += dx;
        this.startY += dy;
        this.startZ += dz;
    }
}

let v = new Vector(new Point(0,0,0), 120, 100, 120);






function connectPoints(p1, p2){
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y, p1.z);
    ctx.lineTo(p2.x, p2.y, p2.z);
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

    this.translate = function(dx, dy){
        this.x += dx;
        this.y += dy;
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
            let vector = new Vector(new Point(0,0,0), this.angle * i, this.size);
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

    this.translate = function(dx, dy){
        this.centerX += dx;
        this.centerY += dy;
        this.construct();
    }
}


function connectPolygons(poly1, poly2){
    if (poly1.points.length != poly2.points.length){
        return;
    }
    for (let i = 0; i < poly1.points.length; i++){
        connectPoints(poly1.points[i], poly2.points[i]);
    }
}


// Testing //
// setStroke(1, "black");

// let origin = new Circle(0, 0, 3);
// origin.draw();

// let outline = new Circle(0,0,20*11);
// outline.draw();

// for (let i = 3; i < 12; i++){
//     let polygon = new Polygon(0,0,i,20*i);
//     polygon.construct();
//     polygon.draw();
// }

// End Testing //



function Cube(x, y, z, size){
    this.center = new Point(x,y,z);
    this.dist = size / 2;
    this.vertices = [
        new Point(this.center.x - this.dist, this.center.y - this.dist, this.center.z + this.dist),
        new Point(this.center.x - this.dist, this.center.y - this.dist, this.center.z - this.dist),
        new Point(this.center.x + this.dist, this.center.y - this.dist, this.center.z - this.dist),
        new Point(this.center.x + this.dist, this.center.y - this.dist, this.center.z + this.dist),
        new Point(this.center.x + this.dist, this.center.y + this.dist, this.center.z + this.dist),
        new Point(this.center.x + this.dist, this.center.y + this.dist, this.center.z - this.dist),
        new Point(this.center.x - this.dist, this.center.y + this.dist, this.center.z - this.dist),
        new Point(this.center.x - this.dist, this.center.y + this.dist, this.center.z + this.dist)];
    
    this.faces = [
        [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
        [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
        [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
        [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
        [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
        [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]];
    
    this.drawFrame = function(){
        for (let i = 0; i < this.faces.length; i++){
            for (let j = 0; j < this.faces[i].length - 1; j++){
                connectPoints(this.faces[i][j], this.faces[i][j+1]);
            }
            connectPoints(this.faces[i][0], this.faces[i][this.faces[i].length - 1]);
        }
    }

    this.rotate = function(x, y, z){
        radX = (Math.PI / 180) * x;
        radY = (Math.PI / 180) * y;
        radZ = (Math.PI / 180) * z;


    }
}

let cube = new Cube(0,0,0,100);
// cube.drawFrame();





function Polyhedron(){

}