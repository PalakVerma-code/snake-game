let gameContainer = document.querySelector('.game-container');
let scoreContainer = document.querySelector('.score-container');
let foodX, foodY;
let headX = 12, headY = 12;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let score = 0;
let gameInterval = null;

// Overlay
let overlay = document.createElement("div");
overlay.className = "overlay";
overlay.innerHTML = `
    <div class="overlay-content">
        <h2>Game Over</h2>
        <p>Your Score: <span id="finalScore">0</span></p>
        <button id="restartBtn">Restart</button>
    </div>
`;
gameContainer.appendChild(overlay);

function generateFood() {
    foodX = Math.floor(Math.random() * 25) + 1;
    foodY = Math.floor(Math.random() * 25) + 1;
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === foodX && snakeBody[i][1] === foodY) {
            generateFood();
        }
    }
}

function gameOver() {
    clearInterval(gameInterval);
    document.getElementById("finalScore").textContent = score;
    overlay.style.display = "flex";
}

function resetGame() {
    headX = 12; headY = 12;
    velocityX = 0; velocityY = 0;
    snakeBody = [];
    score = 0;
    scoreContainer.innerHTML = `Score: ${score}`;
    generateFood();
    overlay.style.display = "none";
    gameInterval = setInterval(renderGame, 150);
}

function renderGame() {
    let updatedGame = `<div class="food" style="grid-area: ${foodY}/${foodX};"></div>`;

    if (foodX === headX && foodY === headY) {
        snakeBody.push([foodX, foodY]);
        generateFood();
        score += 10;
        scoreContainer.innerHTML = `Score: ${score}`;
    } else {
        snakeBody.pop();
    }

    headX += velocityX;
    headY += velocityY;
    snakeBody.unshift([headX, headY]);

    if (headX <= 0 || headY <= 0 || headX > 25 || headY > 25) {
        gameOver();
        return;
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver();
            return;
        }
    }

    for (let i = 0; i < snakeBody.length; i++) {
        updatedGame += `<div class="snake" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]};"></div>`;
    }

    gameContainer.innerHTML = updatedGame;
    gameContainer.appendChild(overlay);
}

// Keyboard controls
document.addEventListener("keydown", function(e){
    if(e.key === "ArrowUp" && velocityY !== 1){ velocityX = 0; velocityY = -1; }
    else if(e.key === "ArrowDown" && velocityY !== -1){ velocityX = 0; velocityY = 1; }
    else if(e.key === "ArrowRight" && velocityX !== -1){ velocityX = 1; velocityY = 0; }
    else if(e.key === "ArrowLeft" && velocityX !== 1){ velocityX = -1; velocityY = 0; }
});

// Touch controls for mobile
let startX, startY, endX, endY;

gameContainer.addEventListener("touchstart", e => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
});

gameContainer.addEventListener("touchend", e => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;

    let diffX = endX - startX;
    let diffY = endY - startY;

    if(Math.abs(diffX) > Math.abs(diffY)){
        if(diffX > 0 && velocityX !== -1){ velocityX = 1; velocityY = 0; }
        else if(diffX < 0 && velocityX !== 1){ velocityX = -1; velocityY = 0; }
    } else {
        if(diffY > 0 && velocityY !== -1){ velocityX = 0; velocityY = 1; }
        else if(diffY < 0 && velocityY !== 1){ velocityX = 0; velocityY = -1; }
    }
});

// Restart button
overlay.addEventListener("click", e => {
    if(e.target.id === "restartBtn"){ resetGame(); }
});

// Start game
generateFood();
gameInterval = setInterval(renderGame, 150);
