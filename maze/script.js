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
let cubeX = 8; // Vị trí x của ô đỏ
let cubeY = 10; // Vị trí y của ô đỏ
let movesCount = 0; // Biến đếm số lần di chuyển
const maxMoves = 50; // Số lần di chuyển tối đa
let totalWhiteCells = 0; // Tổng số ô trắng
let visitedWhiteCells = 0; // Số ô trắng đã được tô màu
let moveInterval = null;

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
        totalWhiteCells++; // Đếm số ô trắng
      }
      cellDiv.dataset.row = rowIndex;
      cellDiv.dataset.col = colIndex;
      container.appendChild(cellDiv);
    });
  });

  updateCubePosition();
  markVisitedCell(cubeX, cubeY); // Đánh dấu ô ban đầu
}

function updateCubePosition() {
  const cube = document.getElementById('cube');
  cube.style.left = `${cubeX * cellSize}px`;
  cube.style.top = `${cubeY * cellSize}px`;
}

function markVisitedCell(x, y) {
  const cell = document.querySelector(`.cell[data-row="${y}"][data-col="${x}"]`);
  if (cell && !cell.classList.contains('wall') && cell.style.backgroundColor !== 'yellow') {
    cell.style.backgroundColor = 'yellow'; // Đổi màu ô thành vàng
    visitedWhiteCells++; // Cập nhật số ô trắng đã được tô màu
    updateCounter();
    checkGameStatus();
  }
}

function updateCounter() {
  const counter = document.getElementById('counter');
  counter.textContent = `Moves: ${movesCount}`;
}

function checkGameStatus() {
  if (visitedWhiteCells === totalWhiteCells) {
    setTimeout(() => alert('Congratulations! You won!'), 100); // Thông báo chiến thắng
    document.removeEventListener('keydown', handleKeyPress); // Ngừng nhận sự kiện bàn phím
  } else if (movesCount >= maxMoves) {
    setTimeout(() => alert('Game Over! You lost!'), 100); // Thông báo thua cuộc
    document.removeEventListener('keydown', handleKeyPress); // Ngừng nhận sự kiện bàn phím
  }
}

function moveCube(dx, dy) {
  let newX = cubeX;
  let newY = cubeY;

  // Di chuyển đến khi gặp tường hoặc đến cuối mê cung
  while (true) {
    const checkX = newX + dx;
    const checkY = newY + dy;

    if (checkX < 0 || checkX >= maze[0].length || checkY < 0 || checkY >= maze.length || maze[checkY][checkX] === 1) {
      break; // Dừng lại khi gặp tường hoặc ra ngoài mê cung
    }

    newX = checkX;
    newY = checkY;

    // Thay đổi màu ô nếu khối lập phương đi qua ô trắng
    markVisitedCell(newX, newY);
  }

  if (newX !== cubeX || newY !== cubeY) { // Chỉ cập nhật số lần di chuyển nếu thực sự có di chuyển
    movesCount++;
    updateCounter();
    checkGameStatus();
  }

  cubeX = newX;
  cubeY = newY;
  updateCubePosition();
}

function handleKeyPress(event) {
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

document.addEventListener('keydown', handleKeyPress);
drawMaze();
