let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
ctx.setTransform(1,0,0,-1,WIDTH/2, HEIGHT/2);


function setStroke(lineWidth, color, opacity){
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
}


function Point(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;

    this.rotateZ = function(angleZ, centerOfRotation){
        radsZ = (Math.PI / 180) * angleZ;
        let px = this.x;
        let py = this.y;
        this.x = ((px - centerOfRotation.x) * Math.cos(radsZ) - (py - centerOfRotation.y) * Math.sin(radsZ)) + centerOfRotation.x;
        this.y = ((px - centerOfRotation.x) * Math.sin(radsZ) + (py - centerOfRotation.y) * Math.cos(radsZ)) + centerOfRotation.y;
    }
    
    this.rotateX = function(angleX, centerOfRotation){
        radsX = (Math.PI / 180) * angleX;
        let py = this.y;
        let pz = this.z;
        this.y = ((py - centerOfRotation.y) * Math.cos(radsX) - (pz - centerOfRotation.z) * Math.sin(radsX)) + centerOfRotation.y;
        this.z = ((py - centerOfRotation.y) * Math.sin(radsX) + (pz - centerOfRotation.z) * Math.cos(radsX)) + centerOfRotation.z;
    }
    
    this.rotateY = function(angleY, centerOfRotation){
        radsY = (Math.PI / 180) * angleY;
        let px = this.x;
        let pz = this.z;
        this.x = ((px - centerOfRotation.x) * Math.cos(radsY) + (pz - centerOfRotation.z) * Math.sin(radsY)) + centerOfRotation.x;
        this.z = (-1 * (px - centerOfRotation.x) * Math.sin(radsY) + (pz - centerOfRotation.z) * Math.cos(radsY)) + centerOfRotation.z;
    }
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

    // this.length = Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2 + (p2.z - p1.z)**2);

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


// Axes: X - left/right, Y - up/down, Z - front/back //
// 'angle' is regular rotation in 2D (around Z-axis). 'depthAngle' is rotation front and back, around X-axis. Only need these 2 angles to construct vector in 3D space //
// 'radsY' is introduced for rotation around Y axis //
function Vector3D(origin, angle, depthAngle, magnitude){
    this.startX = origin.x;
    this.startY = origin.y;
    this.startZ = origin.z;
    this.radsZ = (Math.PI / 180) * angle;
    this.radsX = (Math.PI / 180) * depthAngle;
    this.radsY;
    this.magnitude = magnitude;
    this.line = new Line(new Point(this.startX, this.startY, this.startZ), this.endPoint);

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

    this.rotateX = function(angle){
        this.endPoint.rotateX(angle, origin);
    }

    this.rotateY = function(angle){
        this.endPoint.rotateY(angle, origin);
    }

    this.rotateZ = function(angle){
        this.endPoint.rotateZ(angle, origin);
    }

    this.rotate = function(angleZ, angleX, angleY){
        if (angleZ != 0){this.rotateZ(angleZ);}
        if (angleX != 0){this.rotateX(angleX);}
        if (angleY != 0){this.rotateY(angleY);}
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
    
    this.vertices = [
        new Point(this.center.x - this.dist, this.center.y - this.dist, this.center.z + this.dist),
        new Point(this.center.x - this.dist, this.center.y - this.dist, this.center.z - this.dist),
        new Point(this.center.x + this.dist, this.center.y - this.dist, this.center.z - this.dist),
        new Point(this.center.x + this.dist, this.center.y - this.dist, this.center.z + this.dist),
        new Point(this.center.x + this.dist, this.center.y + this.dist, this.center.z + this.dist),
        new Point(this.center.x + this.dist, this.center.y + this.dist, this.center.z - this.dist),
        new Point(this.center.x - this.dist, this.center.y + this.dist, this.center.z - this.dist),
        new Point(this.center.x - this.dist, this.center.y + this.dist, this.center.z + this.dist)
    ];

    
    this.faces = [
        [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
        [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
        [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
        [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
        [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
        [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
    ];
  
    this.drawFrame = function(){
        this.scale(1 - (.00007 * this.center.z));
        for (let i = 0; i < this.faces.length; i++){
            for (let j = 0; j < this.faces[i].length - 1; j++){
                connectPoints(this.faces[i][j], this.faces[i][j+1]);
                }
            connectPoints(this.faces[i][0], this.faces[i][this.faces[i].length - 1]);
            }
        }

    this.connectVerticesToOrigin = function(){
        for (let i = 0; i < 8; i++){
            connectPoints(this.vertices[i], this.center);
        }
    }

    this.rotateZ = function(angle){
        for (let i = 0; i < this.vertices.length; i++){
            this.vertices[i].rotateZ(angle, this.center);
        }
    }

    this.rotateX = function(angle){
        for (let i = 0; i < this.vertices.length; i++){
            this.vertices[i].rotateX(angle, this.center);
        }
    }

    this.rotateY = function(angle){
        for (let i = 0; i < this.vertices.length; i++){
            this.vertices[i].rotateY(angle, this.center);
        }
    }

    this.rotate = function(angleZ, angleX, angleY){
        if (angleZ != 0){this.rotateZ(angleZ);}
        if (angleX != 0){this.rotateX(angleX);}
        if (angleY != 0){this.rotateY(angleY);}
    }

    this.translate = function(dx, dy, dz){
        this.center.x += dx;
        this.center.y += dy;
        this.center.z += dz;
        for (let i = 0; i < this.vertices.length; i++){
            this.vertices[i].x += dx;
            this.vertices[i].y += dy;
            this.vertices[i].z += dz;
        }
    }

    this.scale = function(scalar){
        for (let i = 0; i < this.vertices.length; i++){
            this.scalePoint(this.vertices[i], this.center, scalar)
        }
    }

    this.scalePoint = function(point, center, scalar){
        point.x = center.x + scalar * (point.x - center.x);
        point.y = center.y + scalar * (point.y - center.y);
        point.z = center.z + scalar * (point.z - center.z);
    }
}


randomColor = function(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}


// have depth-scaling built in to every object //
// before you draw it, scale it based on Z coorindate // 
// store original vertices //


// ----------------- Testing --------------------- //


let origin = new Circle(0, 0, 3);
origin.draw();

let outline = new Circle(0,0,20*11);
outline.draw();

let p = new Point(100,100,100);
let cube = new Cube(-150,100,0,100);



const fps = 60;
let PLAY = true;
function animate(){

    if (PLAY == true){
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000 / fps);
    }


    ctx.clearRect(-WIDTH/2, -HEIGHT/2, WIDTH, HEIGHT);
    setStroke(1, "#00aaff", 0.2);
    // cube.connectVerticesToOrigin();
    cube.drawFrame();
    cube.translate(2,-1,1);
    cube.rotate(2,2,2);
}
animate();

window.addEventListener("click", function(){
    PLAY = !PLAY;
    if (PLAY == true){animate()};
})



// ------------------- End Testing ----------------- //

// TODO: make cube function a general polyhedron function. have subfunction to construct vertices and faces for different polyhedrons //

// TODO: make it actual 3D environment where you can move camera around and it has depth //



// ------------ BUGS ----------- //
// 1. vector scaling doesn't work anymore //



// THIS is the way //
// Create full 3D environment with movable camera. Bruh do this//

// Future Features //
// 0. Create full 3D environment with movable camera //
// 1. Add ability to graph functions and have cube center follow curve //
// 2. Other 3D shapes //
// 3. Hypercube. //
// 4. Fractals. Recursion //
// 5. Increase resolution //
// 6. Cool 3D visualizations of different algorithms and techniques. DFS/BFS, sorting algorithms, graph traversal, etc //