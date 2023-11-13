import { createGameBoard } from "./gameboard.js";
import { Tetris } from "./tetris.js";
import {
  PLAYFIELD_COLUMNS,
  PLAYFIELD_ROWS,
  convertPositionToIndex,
} from "./utilities.js";

let requestId;
let timeoutId;
const cells = createGameBoard();
const tetris = new Tetris();

const gameOverText = document.querySelector(".over");
const startBtn = document.querySelector("button");

startBtn.addEventListener("click", (e) => {
  moveDown();
  e.target.remove();
});

// отслеживание нажатия клавиши
initKeydown();

// отслеживание нажатия клавиши
function initKeydown() {
  document.addEventListener("keydown", onKeydown);
}
// проверка нажатой клавиши
function onKeydown(event) {
  switch (event.key) {
    case "ArrowUp":
      rotate();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case " ":
      dropDown();
      break;
    default:
      return;
  }
}

// перемещение фигуры вниз
function moveDown() {
  tetris.moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();

  if (tetris.isGameOver) {
    gameOver();
  }
}
// перемещение фигуры влево
function moveLeft() {
  tetris.moveTetrominoLeft();
  draw();
}

// перемещение фигуры вправо
function moveRight() {
  tetris.moveTetrominoRight();
  draw();
}

// вращение фигурки
function rotate() {
  tetris.rotateTetromino();
  draw();
}

// мгновенное опускание фигуры в крайнее положение
function dropDown() {
  tetris.dropTetrominoDown();
  draw();
  stopLoop();
  startLoop();

  if (tetris.isGameOver) {
    gameOver();
  }
}

function startLoop() {
  timeoutId = setTimeout(
    () => (requestId = requestAnimationFrame(moveDown)),
    700
  );
}

function stopLoop() {
  cancelAnimationFrame(requestId);
  clearTimeout(timeoutId);
}
// функция отрисовки
function draw() {
  // очистка классов у всех элементов
  cells.forEach((cell) => cell?.removeAttribute("class"));
  // отрисовка поля
  drawPlayfield();
  // отрисовка фигуры
  drawTetromino();
  drawGhostTetromino();
}

// отрисовка поля
function drawPlayfield() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      // пропускаем пустые элементы
      if (!tetris.playfield[row][column]) continue;
      // сохраняем в консатнту элемент, который нашли в поле
      const name = tetris.playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);
      cells[cellIndex].classList.add(name);
    }
  }
}

// отрисовка фигуры
function drawTetromino() {
  const name = tetris.tetromino.name;
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.row + row < 0) continue;
      const cellIndex = convertPositionToIndex(
        tetris.tetromino.row + row,
        tetris.tetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
}

// призрачная фигурка (конечное положение)
function drawGhostTetromino() {
  const tetrominoMatrixSize = tetris.tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (!tetris.tetromino.matrix[row][column]) continue;
      if (tetris.tetromino.ghostRow + row < 0) continue;
      const cellIndex = convertPositionToIndex(
        tetris.tetromino.ghostRow + row,
        tetris.tetromino.ghostColumn + column
      );
      cells[cellIndex].classList.add("ghost");
    }
  }
}

// окончание игры
function gameOver() {
  stopLoop();
  document.removeEventListener("keydown", onKeydown);
  gameOverText.classList.add("game_over");
}
