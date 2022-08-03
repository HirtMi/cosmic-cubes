import { Cube, randomColor } from './geometry.js';
import { setStroke, WIDTH, HEIGHT } from './canvas.js';


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

for (let i = 0; i < NUM_CUBES; i++){
    generateRandomCube();
}


const fps = 60;
let PLAY = true;

function animate(){
    if (PLAY == true){
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000 / fps);
    }

    for (let i = 0; i < cubes.length; i++){
        setStroke(2, colors[i], .01);
        cubes[i].connectVerticesToOrigin();
        cubes[i].drawFrame();
        cubes[i].translate(translations[i][0], translations[i][1], translations[i][2]);
        cubes[i].rotate(rotations[i][0], rotations[i][1], rotations[i][2]);
    }
}

function pause(){
    PLAY = !PLAY;
    if (PLAY == true){animate()};
    console.log('test');
}

window.addEventListener("click", pause);
window.addEventListener("touchstart", pause);

animate();