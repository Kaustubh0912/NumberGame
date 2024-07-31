const gridSize = 10;
const targetLength = 6;
let targetNumbers = [];
let grid = [];
let selectedRow = 0;
let selectedCol = 0;
let starttime=45;
let timeLeft = starttime;
let shuffletime=5;
let gameInterval;

function initGame() {
    generateTarget();
    initGrid();
    renderGrid();
    updateTarget();
    startTimer();
    document.addEventListener('keydown', handleKeyPress);
    setInterval(shuffleGrid, shuffletime*1000);
}

function generateTarget() {
    targetNumbers = [];
    while (targetNumbers.length < targetLength) {
        let num = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        if (!targetNumbers.includes(num)) {
            targetNumbers.push(num);
        }
    }
}

function initGrid() {
    grid = [];
    const allNumbers = new Set([...targetNumbers]);
    while (allNumbers.size < gridSize * gridSize) {
        let num = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        allNumbers.add(num);
    }
    const shuffledNumbers = [...allNumbers].sort(() => Math.random() - 0.5);
    for (let i = 0; i < gridSize; i++) {
        grid[i] = shuffledNumbers.slice(i * gridSize, (i + 1) * gridSize);
    }
}

function renderGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[i][j];
            if (i === selectedRow && j === selectedCol) {
                cell.classList.add('selected');
            }
            gridElement.appendChild(cell);
        }
    }
}

function updateTarget() {
    document.getElementById('target').textContent = targetNumbers.join('.');
    document.getElementById('progress-bar').style.setProperty('--progress', `${(1 - targetNumbers.length / targetLength) * 100}%`);
}

function startTimer() {
    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'w': case 'W': case 'ArrowUp':
            selectedRow = (selectedRow - 1 + gridSize) % gridSize;
            break;
        case 's': case 'S': case 'ArrowDown':
            selectedRow = (selectedRow + 1) % gridSize;
            break;
        case 'a': case 'A': case 'ArrowLeft':
            selectedCol = (selectedCol - 1 + gridSize) % gridSize;
            break;
        case 'd': case 'D': case 'ArrowRight':
            selectedCol = (selectedCol + 1) % gridSize;
            break;
        case 'Enter':
            checkSelection();
            break;
    }
    renderGrid();
}

function checkSelection() {
    const selectedNumber = grid[selectedRow][selectedCol];
    if (selectedNumber === targetNumbers[0]) {
        targetNumbers.shift();
        updateTarget();
        if (targetNumbers.length === 0) {
            endGame(true);
        }
    }
}

function shuffleGrid() {
    const allNumbers = grid.flat();
    for (let i = allNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
    }
    for (let i = 0; i < gridSize; i++) {
        grid[i] = allNumbers.slice(i * gridSize, (i + 1) * gridSize);
    }
    renderGrid();
}

function endGame(isWin) {
    clearInterval(gameInterval);
    alert(isWin ? 'You win!' : 'Game over!');
    // Restart the game
    timeLeft = starttime;
    initGame();
}

initGame();