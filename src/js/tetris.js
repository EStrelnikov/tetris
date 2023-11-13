import { scorePoints } from "./score.js";
import {
  PLAYFIELD_COLUMNS,
  PLAYFIELD_ROWS,
  TETROMINO_NAMES,
  TETROMINOES,
  getRandomElement,
  rotateMatrix,
} from "./utilities.js";

export class Tetris {
  constructor() {
    // игровое поле
    this.playfield;
    // фигура
    this.tetromino;
    this.isGameOver = false;
    this.init();
  }

  init() {
    // генерация игроового поля
    this.generatePlayfield();
    // генерация фигуры
    this.generateTetromino();
  }

  // генерация игроового поля
  generatePlayfield() {
    this.playfield = new Array(PLAYFIELD_ROWS)
      .fill()
      .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
  }

  // генерация фигуры
  generateTetromino() {
    const name = getRandomElement(TETROMINO_NAMES);

    // присвоем в переменную массив фигур
    const matrix = TETROMINOES[name];
    // расчет номер колонки с которо должна начаться фигура (по центру поля)
    const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
    // номер строки с которой должна начаться рисоваться фигура (изначально каждая фигура будет спрятана за пределами экрана)
    const row = -2;

    // данные фигурки
    this.tetromino = {
      name,
      matrix,
      row,
      column,
      ghostColumn: column,
      ghostRow: row,
    };

    this.calculateGhostPosition();
  }

  // перемещение фигуры вниз
  moveTetrominoDown() {
    this.tetromino.row += 1;
    if (!this.isValid()) {
      this.tetromino.row -= 1;
      this.placeTetromino();
    }
  }

  // перемещение фигуры влево
  moveTetrominoLeft() {
    this.tetromino.column -= 1;
    if (!this.isValid()) {
      this.tetromino.column += 1;
    } else {
      this.calculateGhostPosition();
    }
  }

  // перемещение фигуры вправо
  moveTetrominoRight() {
    this.tetromino.column += 1;
    if (!this.isValid()) {
      this.tetromino.column -= 1;
    } else {
      this.calculateGhostPosition();
    }
  }

  // вращение фигуры на 90 градусов
  rotateTetromino() {
    // сохраняем старые координаты фигуры
    const oldMatrix = this.tetromino.matrix;
    // вращние фигуры на 90 градусов
    const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
    // перезаписываем новые координаты фигуры
    this.tetromino.matrix = rotatedMatrix;
    if (!this.isValid()) {
      this.tetromino.matrix = oldMatrix;
    } else {
      this.calculateGhostPosition();
    }
  }

  // мгновенное опускание фигуры вниз
  dropTetrominoDown() {
    this.tetromino.row = this.tetromino.ghostRow;
    this.placeTetromino();
  }

  // проверка корректности расположения фигурки
  isValid() {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
      for (let column = 0; column < matrixSize; column++) {
        if (!this.tetromino.matrix[row][column]) continue;
        if (this.isOutsideOfGameBoard(row, column)) return false;
        if (this.isCollides(row, column)) return false;
      }
    }
    return true;
  }
  // проверка - вышел ли элемент матрицы за пределы игрового поля
  isOutsideOfGameBoard(row, column) {
    return (
      // проверка левого края поля
      this.tetromino.column + column < 0 ||
      // проверка правого края поля
      this.tetromino.column + column >= PLAYFIELD_COLUMNS ||
      // проверка нижнего края поля
      this.tetromino.row + row >= this.playfield.length
    );
  }

  // Проверка - не налезает ли падающая фигурка на имеющие уже в поле фигурки
  isCollides(row, column) {
    return this.playfield[this.tetromino.row + row]?.[
      this.tetromino.column + column
    ];
  }

  // сохранение фигурки в игровом поле
  placeTetromino() {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
      for (let column = 0; column < matrixSize; column++) {
        if (!this.tetromino.matrix[row][column]) continue;
        if (this.isOutsideOfTopBoard(row)) {
          this.isGameOver = true;
          return;
        }

        this.playfield[this.tetromino.row + row][
          this.tetromino.column + column
        ] = this.tetromino.name;
      }
    }

    this.processFilledRows();
    this.generateTetromino();
  }

  // проверка верхней границы поля
  isOutsideOfTopBoard(row) {
    return this.tetromino.row + row < 0;
  }

  // удаление заполненных строк
  processFilledRows() {
    const filledLines = this.findFilledRows();
    this.removeFilledRows(filledLines);
    scorePoints(filledLines.length);
  }

  // Нахождение заполненных строк
  findFilledRows() {
    const filledRows = [];
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
      if (this.playfield[row].every((cell) => Boolean(cell))) {
        filledRows.push(row);
      }
    }

    return filledRows;
  }

  // удаление заполненных строк
  removeFilledRows(filledRows) {
    filledRows.forEach((row) => {
      this.dropRowsAbove(row);
    });
  }

  // смещает строки (перед удаенными) на 1 клетку вниз
  dropRowsAbove(rowToDelete) {
    for (let row = rowToDelete; row > 0; row--) {
      this.playfield[row] = this.playfield[row - 1];
    }
    this.playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
  }

  // расчет тени (крайнего положения)
  calculateGhostPosition() {
    const tetrominoRow = this.tetromino.row;
    this.tetromino.row++;
    while (this.isValid()) {
      this.tetromino.row++;
    }
    this.tetromino.ghostRow = this.tetromino.row - 1;
    this.tetromino.ghostColumn = this.tetromino.column;
    this.tetromino.row = tetrominoRow;
  }
}
