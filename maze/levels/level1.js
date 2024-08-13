const maze = [
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
  [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
  [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
];

const cellSize = 30;
let cubeX = 8;
let cubeY = 10;
let movesCount = 0;
const maxMoves = 45;
let totalWhiteCells = 0;
let visitedWhiteCells = 0;
let moveInterval = null;
let moveHistory = [];
let isGameActive = true;
let cellVisitCount = Array(maze.length).fill().map(() => Array(maze[0].length).fill(0));
let startTime = null;
let elapsedTime = 0;
let timerInterval = null;
const beepSound = new Audio('../beep.mp3');

function drawMaze() {
  const container = document.getElementById('maze-container');
  const rows = maze.length;
  const cols = maze[0].length;

  container.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  container.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

  maze.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      if (cell === 1) {
        cellDiv.classList.add('wall');
      } else {
        totalWhiteCells++;
      }
      cellDiv.dataset.row = rowIndex;
      cellDiv.dataset.col = colIndex;
      container.appendChild(cellDiv);
    });
  });

  updateCubePosition();
  markVisitedCell(cubeX, cubeY);
}

function updateCubePosition() {
  const cube = document.getElementById('cube');
  cube.style.left = `${cubeX * cellSize}px`;
  cube.style.top = `${cubeY * cellSize}px`;
}

function markVisitedCell(x, y) {
  const cell = document.querySelector(`.cell[data-row="${y}"][data-col="${x}"]`);
  if (cell && !cell.classList.contains('wall')) {
    cellVisitCount[y][x]++;
    cell.style.backgroundColor = 'yellow';
    if (cellVisitCount[y][x] === 1) {
      visitedWhiteCells++;
    }
    updateCounter();
    checkGameStatus();
  }
}

function updateCounter() {
  const counter = document.getElementById('counter');
  counter.textContent = `Moves: ${movesCount} | Visited: ${visitedWhiteCells}/${totalWhiteCells}`;
}

function checkGameStatus() {
  if (visitedWhiteCells === totalWhiteCells) {
    endGame('Congratulations! You won!');
  } else if (movesCount >= maxMoves) {
    endGame('Game Over! You lost!');
  }
}

function endGame(message) {
  clearInterval(timerInterval);
  setTimeout(() => alert(message), 100);
  isGameActive = false;
}

function moveCube(dx, dy) {
  if (!isGameActive) return;

  let newX = cubeX;
  let newY = cubeY;
  let path = [];

  while (true) {
    const checkX = newX + dx;
    const checkY = newY + dy;

    if (checkX < 0 || checkX >= maze[0].length || checkY < 0 || checkY >= maze.length || maze[checkY][checkX] === 1) {
      break;
    }

    newX = checkX;
    newY = checkY;
    path.push({ x: newX, y: newY });
    markVisitedCell(newX, newY);
  }

  if (newX !== cubeX || newY !== cubeY) {
    moveHistory.push({
      from: { x: cubeX, y: cubeY },
      to: { x: newX, y: newY },
      path: path
    });
    movesCount++;
    updateCounter();
    checkGameStatus();
    beepSound.play();
  }

  cubeX = newX;
  cubeY = newY;
  updateCubePosition();
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
  const timeElement = document.getElementById('time');
  elapsedTime = Date.now() - startTime;

  const totalSeconds = Math.floor(elapsedTime / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  timeElement.textContent = `${minutes}:${seconds}`;
}

function handleKeyPress(event) {
  if (!isGameActive) return;

  if (moveInterval) {
    clearInterval(moveInterval);
  }

  switch (event.key) {
    case 'ArrowUp':
      moveInterval = setInterval(() => moveCube(0, -1), 10);
      break;
    case 'ArrowDown':
      moveInterval = setInterval(() => moveCube(0, 1), 10);
      break;
    case 'ArrowLeft':
      moveInterval = setInterval(() => moveCube(-1, 0), 10);
      break;
    case 'ArrowRight':
      moveInterval = setInterval(() => moveCube(1, 0), 10);
      break;
  }
}

function undo() {
  if (moveHistory.length > 0) {
    const lastMove = moveHistory.pop();
    cubeX = lastMove.from.x;
    cubeY = lastMove.from.y;
    updateCubePosition();

    lastMove.path.forEach(pos => {
      const cell = document.querySelector(`.cell[data-row="${pos.y}"][data-col="${pos.x}"]`);
      if (cell) {
        cellVisitCount[pos.y][pos.x]--;
        if (cellVisitCount[pos.y][pos.x] === 0) {
          cell.style.backgroundColor = '';
          visitedWhiteCells--;
        }
      }
    });

    movesCount--;
    updateCounter();
  }
}

function reset() {
  if (moveInterval) {
    clearInterval(moveInterval);
    moveInterval = null;
  }

  isGameActive = false;
  cubeX = 8;
  cubeY = 10;
  movesCount = 0;
  visitedWhiteCells = 0;
  moveHistory = [];
  cellVisitCount = Array(maze.length).fill().map(() => Array(maze[0].length).fill(0));

  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      const cellElement = document.querySelector(`.cell[data-row="${y}"][data-col="${x}"]`);
      if (cellElement) {
        cellElement.style.backgroundColor = '';
      }
    });
  });

  updateCubePosition();
  updateCounter();
  markVisitedCell(cubeX, cubeY);

  setTimeout(() => {
    isGameActive = true;
  }, 100);
}

function setupGame() {
  startTimer();
  drawMaze();
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('keyup', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
      }
    }
  });

  document.getElementById('undo-btn').addEventListener('click', undo);
  document.getElementById('reset-btn').addEventListener('click', reset);
}

setupGame();

const modal = document.getElementById('modal');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');
const backBtn = document.getElementById('back-btn');

function showModal() {
  modal.style.display = 'block';
}

function hideModal() {
  modal.style.display = 'none';
}

backBtn.addEventListener('click', showModal);
modalConfirm.addEventListener('click', () => {
  reset(); // Reset game
  window.location.href = '../menu/levels.html'; // Redirect to main menu
});
modalCancel.addEventListener('click', hideModal);

// Click outside of the modal to close it
window.onclick = function (event) {
  if (event.target === modal) {
    hideModal();
  }
}
