const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

// Car properties
const car = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 60,
    speed: 5
};

// Cone properties
const cones = [];
const coneWidth = 30;
const coneHeight = 30;
const coneSpeed = 3;
let coneSpawnInterval = 1000; // Cone spawn every second

// Game control variables
let score = 0;
let gameOver = false;
let gameWon = false;

// Key controls
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Function to draw the car
function drawCar() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Function to draw a cone
function drawCone(x, y) {
    ctx.fillStyle = 'orange';
    ctx.fillRect(x, y, coneWidth, coneHeight);
}

// Function to update car position
function updateCar() {
    if (keys.ArrowLeft && car.x > 0) {
        car.x -= car.speed;
    }
    if (keys.ArrowRight && car.x < canvas.width - car.width) {
        car.x += car.speed;
    }
}

// Function to update cones
function updateCones() {
    for (let i = cones.length - 1; i >= 0; i--) {
        cones[i].y += coneSpeed;

        // Check collision with car
        if (cones[i].x < car.x + car.width &&
            cones[i].x + coneWidth > car.x &&
            cones[i].y < car.y + car.height &&
            cones[i].y + coneHeight > car.y) {
            gameOver = true;
        }

        // Remove cones that are out of canvas
        if (cones[i].y > canvas.height) {
            cones.splice(i, 1);
            score++;
        }
    }
}

// Function to spawn cones
function spawnCone() {
    const x = Math.random() * (canvas.width - coneWidth);
    cones.push({ x: x, y: -coneHeight });
}

// Function to update and draw everything
function updateGame() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over, Womp Womp.', canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 35, canvas.height / 2 + 30);
        return;
    }

    if (score >= 100) {
        gameWon = true;
        ctx.fillStyle = 'green';
        ctx.font = '30px Arial';
        ctx.fillText('You Win! Thanks for Playing', canvas.width / 2 - 60, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 35, canvas.height / 2 + 30);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update car and cones
    drawCar();
    updateCar();
    cones.forEach(cone => drawCone(cone.x, cone.y));
    updateCones();

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(updateGame);
}

// Start spawning cones
setInterval(spawnCone, coneSpawnInterval);

// Start game loop
updateGame();
