import { connectPoints } from './canvas.js';


function Point(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}


Point.prototype.rotateZ = function(angleZ, centerOfRotation){
    let radsZ = (Math.PI / 180) * angleZ;
    let px = this.x;
    let py = this.y;
    this.x = ((px - centerOfRotation.x) * Math.cos(radsZ) - (py - centerOfRotation.y) * Math.sin(radsZ)) + centerOfRotation.x;
    this.y = ((px - centerOfRotation.x) * Math.sin(radsZ) + (py - centerOfRotation.y) * Math.cos(radsZ)) + centerOfRotation.y;
}


Point.prototype.rotateX = function(angleX, centerOfRotation){
    let radsX = (Math.PI / 180) * angleX;
    let py = this.y;
    let pz = this.z;
    this.y = ((py - centerOfRotation.y) * Math.cos(radsX) - (pz - centerOfRotation.z) * Math.sin(radsX)) + centerOfRotation.y;
    this.z = ((py - centerOfRotation.y) * Math.sin(radsX) + (pz - centerOfRotation.z) * Math.cos(radsX)) + centerOfRotation.z;
}


Point.prototype.rotateY = function(angleY, centerOfRotation){
    let radsY = (Math.PI / 180) * angleY;
    let px = this.x;
    let pz = this.z;
    this.x = ((px - centerOfRotation.x) * Math.cos(radsY) + (pz - centerOfRotation.z) * Math.sin(radsY)) + centerOfRotation.x;
    this.z = (-1 * (px - centerOfRotation.x) * Math.sin(radsY) + (pz - centerOfRotation.z) * Math.cos(radsY)) + centerOfRotation.z;
}           


function Cube(x, y, z, size){
    this.center = new Point(x, y, z);
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
}


Cube.prototype.drawFrame = function(){
    if (this.center.z < -2000){return;}
    for (let i = 0; i < this.faces.length; i++){
        for (let j = 0; j < this.faces[i].length - 1; j++){
            connectPoints(this.faces[i][j], this.faces[i][j+1]);
            }
        connectPoints(this.faces[i][0], this.faces[i][this.faces[i].length - 1]);
    }
}


Cube.prototype.connectVerticesToOrigin = function(){
    for (let i = 0; i < 8; i++){
        connectPoints(this.vertices[i], this.center);
    }
}


Cube.prototype.rotateZ = function(angle){
    for (let i = 0; i < this.vertices.length; i++){
        this.vertices[i].rotateZ(angle, this.center);
    }
}


Cube.prototype.rotateX = function(angle){
    for (let i = 0; i < this.vertices.length; i++){
        this.vertices[i].rotateX(angle, this.center);
    }
}

Cube.prototype.rotateY = function(angle){
    for (let i = 0; i < this.vertices.length; i++){
        this.vertices[i].rotateY(angle, this.center);
    }
}


Cube.prototype.rotate = function(angleZ, angleX, angleY){
    if (angleZ != 0){this.rotateZ(angleZ);}
    if (angleX != 0){this.rotateX(angleX);}
    if (angleY != 0){this.rotateY(angleY);}
}


Cube.prototype.translate = function(dx, dy, dz){
    this.center.x += dx;
    this.center.y += dy;
    this.center.z += dz;
    for (let i = 0; i < this.vertices.length; i++){
        this.vertices[i].x += dx;
        this.vertices[i].y += dy;
        this.vertices[i].z += dz;
    }
    if (dz != 0){
        this.scale(1 - (.001 * dz));
    }
}


Cube.prototype.scale = function(scalar){
    for (let i = 0; i < this.vertices.length; i++){
        this.scalePoint(this.vertices[i], this.center, scalar)
    }
}


Cube.prototype.scalePoint = function(point, center, scalar){
    point.x = center.x + scalar * (point.x - center.x);
    point.y = center.y + scalar * (point.y - center.y);
    point.z = center.z + scalar * (point.z - center.z);
}


function randomColor(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}


export { Cube, randomColor };
