import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from "./utilities.js";

export function createGameBoard() {
  const gameboard = document.querySelector(".gameboard");
  const countTag = PLAYFIELD_COLUMNS * PLAYFIELD_ROWS;
  const elements = [];
  gameboard.style.gridTemplateColumns = `repeat(${PLAYFIELD_COLUMNS}, auto)`;
  gameboard.style.gridTemplateRows = `repeat(${PLAYFIELD_ROWS}, auto)`;
  for (let i = 0; i < countTag; i++) {
    const div = document.createElement("div");
    gameboard.append(div);
    elements.push(div);
  }
  return elements;
}
