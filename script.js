let SCALE = 1.5;
let WIDTH = window.innerWidth * SCALE;
let HEIGHT = window.innerHeight * SCALE;
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
ctx.setTransform(1, 0, 0, -1, WIDTH / 2, HEIGHT / 2);


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
  
    this.drawFrame = function(){
        if (this.center.z < -2000){return;}
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
        this.scale(1 - (.001 * dz));
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


function randomColor(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}


let cubes = [];
let translations = [];
let rotations = [];
let colors = [];
const ROTATION_SPEED = 1.5;
const TRANSLATION_SPEED = 5;
const MAX_SIZE = 400;
const MIN_SIZE = 100;
const NUM_CUBES = 45;

function generateRandomCube(){
    let x = Math.random() * WIDTH * ((Math.random() - 0.5) * 2);
    let y = Math.random() * HEIGHT * ((Math.random() - 0.5) * 2);
    let z = Math.random() * HEIGHT * ((Math.random() - 0.5) * 2);
    let size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    let color = randomColor();

    let translation = [
         Math.random() * TRANSLATION_SPEED * ((Math.random() - 0.5) * 2),
         Math.random() * TRANSLATION_SPEED * ((Math.random() - 0.5) * 2), 
         Math.random() * TRANSLATION_SPEED * ((Math.random() - 0.5) * 2)
        ];

    let rotation = [
         Math.random() * ROTATION_SPEED * ((Math.random() - 0.5) * 2),
         Math.random() * ROTATION_SPEED * ((Math.random() - 0.5) * 2), 
         Math.random() * ROTATION_SPEED * ((Math.random() - 0.5) * 2)
        ];

    let cube = new Cube(x, y, z, size);

    cubes.push(cube);
    translations.push(translation);
    rotations.push(rotation);
    colors.push(color);
}

for (i = 0; i < NUM_CUBES; i++){
    generateRandomCube();
}

// ----------------- Animation --------------------- //

ctx.globalCompositeOperation = "lighter";
ctx.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);

const fps = 60;
let PLAY = true;

function animate(){
    if (PLAY == true){
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000 / fps);
    }

    for (i = 0; i < cubes.length; i++){
        setStroke(2, colors[i], .01);
        cubes[i].connectVerticesToOrigin();
        cubes[i].drawFrame();
        cubes[i].translate(translations[i][0], translations[i][1], translations[i][2]);
        cubes[i].rotate(rotations[i][0], rotations[i][1], rotations[i][2]);
    }
}
animate();

window.addEventListener("click", function(){
    PLAY = !PLAY;
    if (PLAY == true){animate()};
})
