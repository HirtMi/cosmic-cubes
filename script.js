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


function connectPoints(p1, p2){
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y, p1.z);
    ctx.lineTo(p2.x, p2.y, p2.z);
    ctx.stroke();
}


function Line(p1, p2){
    this.p1 = p1;
    this.p2 = p2;

    this.draw = function(){
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y, this.p1.z);
        ctx.lineTo(this.p2.x, this.p2.y, this.p2.z);
        ctx.stroke();
    }

    this.translate = function(dx, dy, dz){
        this.p1.x += dx;
        this.p1.y += dy;
        this.p1.z += dz;
        this.p2.x += dx;
        this.p2.y += dy;
        this.p2.z += dz;
    }
}


function Vector2D(startX, startY, angle, magnitude){
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
            let vector = new Vector2D(this.centerX, this.centerY, this.angle * i, this.size);
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


// Axes are: X - left and right, Y - up and down, Z - front and back //
// 'angle' is regular rotation in 2D (around Z-axis). 'depthAngle' is rotation front and back, around X-axis. Only need these 2 angles to construct vector in 3D space//
// 'radsY' is introduced for rotation around Y axis //
function Vector3D(origin, angle, depthAngle, magnitude){
    this.startX = origin.x;
    this.startY = origin.y;
    this.startZ = origin.z;
    this.radsZ = (Math.PI / 180) * angle;
    this.radsX = (Math.PI / 180) * depthAngle;
    this.radsY;
    this.magnitude = magnitude;

    this.construct = function(){
        this.endX = this.startX + (Math.cos(this.radsX) * Math.sin(this.radsZ) * this.magnitude);
        this.endY = this.startY + (Math.cos(this.radsX) * Math.cos(this.radsZ) * this.magnitude);
        this.endZ = this.startZ + Math.sin(this.radsX) * this.magnitude;
        this.endPoint = new Point(this.endX, this.endY, this.endZ);
        this.line = new Line(new Point(this.startX, this.startY, this.startZ), this.endPoint);
    }

    this.draw = function(){
        this.line.p2 = this.endPoint;
        this.line.draw();
    }

    this.rotateZ = function(angleZ){
        this.radsZ = (Math.PI / 180) * angleZ;
        this.endX = (this.endX * Math.cos(this.radsZ) - this.endY * Math.sin(this.radsZ));
        this.endY = (this.endX * Math.sin(this.radsZ) + this.endY * Math.cos(this.radsZ));
        this.endPoint = new Point(this.endX, this.endY, this.endZ);
        console.log(this.endPoint);
    }
    
    this.rotateX = function(angleX){
        this.radsX = (Math.PI / 180) * angleX;
        this.endY = (this.endY * Math.cos(this.radsX) - this.endZ * Math.sin(this.radsX));
        this.endZ = (this.endY * Math.sin(this.radsX) + this.endZ * Math.cos(this.radsX));
        this.endPoint = new Point(this.endX, this.endY, this.endZ);
        console.log(this.endPoint);
    }
    
    this.rotateY = function(angleY){
        this.radsY = (Math.PI / 180) * angleY;
        this.endX = (this.endX * Math.cos(this.radsY) + this.endZ * Math.sin(this.radsY));
        this.endZ = (-1 * this.endX * Math.sin(this.radsY) + this.endZ * Math.cos(this.radsY));
        this.endPoint = new Point(this.endX, this.endY, this.endZ);
        console.log(this.endPoint);
    }

    // no longer functional. remake function. will have to calculate new distance from starting point //
    this.scale = function(scalar){
        this.magnitude *= scalar;
    }

    this.translate = function(dx, dy, dz){
        this.startXs += dx;
        this.startY += dy;
        this.startZ += dz;
    }
}


function Cube(x, y, z, size){
    this.center = new Point(x,y,z);
    this.dist = size / 2;
    this.vertexVectors = [
        new Vector3D(this.center, 45, size, -109.5),
        new Vector3D(this.center, 135, size, -109.5),
        new Vector3D(this.center, 225, size, -109.5),
        new Vector3D(this.center, 315, size, -109.5),
        new Vector3D(this.center, 45, size, 109.5),
        new Vector3D(this.center, 135, size, 109.5),
        new Vector3D(this.center, 225, size, 109.5),
        new Vector3D(this.center, 315, size, 109.5)];
    
    this.faces = [
        [this.vertexVectors[0], this.vertexVectors[1], this.vertexVectors[2], this.vertexVectors[3]],
        [this.vertexVectors[4], this.vertexVectors[5], this.vertexVectors[6], this.vertexVectors[7]],
        [this.vertexVectors[2], this.vertexVectors[3], this.vertexVectors[5], this.vertexVectors[4]],
        [this.vertexVectors[1], this.vertexVectors[0], this.vertexVectors[6], this.vertexVectors[7]],
        [this.vertexVectors[1], this.vertexVectors[2], this.vertexVectors[4], this.vertexVectors[7]],
        [this.vertexVectors[0], this.vertexVectors[3], this.vertexVectors[5], this.vertexVectors[6]]];

    this.construct = function(){
        this.vertices = [];
        for (let i = 0; i < 8; i++){
            this.vertexVectors[i].construct();
            this.vertices.push(new Point(this.vertexVectors[i].endX, this.vertexVectors[i].endY, this.vertexVectors[i].endZ));
        }
    }
        
    this.drawFrame = function(){
        for (let i = 0; i < 6; i++){
            for (let j = 0; j < 3; j++){
                connectPoints(this.faces[i][j].endPoint, this.faces[i][j+1].endPoint);
                }
            connectPoints(this.faces[i][0].endPoint, this.faces[i][3].endPoint);
            }
        }
       
    this.rotateX = function(angle){
        for (let i = 0; i < 8; i++){
            this.vertexVectors[i].rotateX(angle);
        }
    }

    this.rotateY = function(angle){
        for (let i = 0; i < 8; i++){
            this.vertexVectors[i].rotateY(angle);
        }
    }

    this.rotateZ = function(angle){
        for (let i = 0; i < 8; i++){
            this.vertexVectors[i].rotateZ(angle);
        }
    }
}



// ----------------- Testing --------------------- //
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

let cube = new Cube(0,0,0,555);
cube.construct();
cube.drawFrame();

let v = new Vector3D(new Point(0,0,0), 0,0,100);
v.construct();
const fps = 1000;
function animate(){
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps);
    ctx.clearRect(-WIDTH/2, -HEIGHT/2, WIDTH, HEIGHT);
    // v.draw();
    // v.rotateX(1);
    // v.rotateZ(1);
    // v.rotateY(1);

    cube.drawFrame();
    cube.rotateZ(1);
    cube.rotateX(1);
    cube.rotateY(1);
}
animate();
// ------------------- End Testing ----------------- //


// ------------ BUGS ----------- //
// 1. rotation causes vector to shrink over time //
// 2. cube is not a cube //
// 3. vector scaling doesn't work anymore //