import { store } from "../redux/store";

// constants
import { COLOR } from "../utils/constants";

// state
let state = store.getState().grid;
let { startCellIndex, endCellIndex, gridHeight, gridWidth } = state;
let NUM_OF_CELLS = gridHeight * gridWidth;
store.subscribe(() => {
  state = store.getState().grid;
  ({ startCellIndex, endCellIndex, gridHeight, gridWidth } = state);
  NUM_OF_CELLS = gridHeight * gridWidth;
});

export const clearCells = () => {
  document.querySelectorAll(".cell").forEach((el) => {
    el.classList.remove("VISITED");
    el.classList.remove("EXPLORED");
    el.classList.remove("WALL");
    el.classList.remove("START");
    el.classList.remove("END");
    el.classList.remove("PATH");
  });
};

export const isValidCell = (idx) => {
  return idx >= 0 && idx < NUM_OF_CELLS;
};

export const clearCell = (cellNum) => {
  if (isValidCell(cellNum)) {
    let cell = document.querySelector(`.cell-${cellNum}`);
    cell.classList.value = `cell cell-${cellNum}`;
  }
};

export const addCellState = (cellNum, state) => {
  if (
    isValidCell(cellNum) &&
    cellNum !== startCellIndex &&
    cellNum !== endCellIndex &&
    state !== COLOR.START &&
    state !== COLOR.END
  ) {
    clearCell(cellNum);
    let cell = document.querySelector(`.cell-${cellNum}`);
    cell.classList.add(state);
  }
};

export const addEndPoint = (cellNum, state) => {
  if ((isValidCell(cellNum) && state === COLOR.START) || state === COLOR.END) {
    clearCell(cellNum);
    let cell = document.querySelector(`.cell-${cellNum}`);
    cell.classList.add(state);
  }
};

export const cellContains = (cellNum, state) => {
  return (
    isValidCell(cellNum) &&
    document.querySelector(`.cell-${cellNum}`).classList.contains(state)
  );
};

export const resetPath = () => {
  document.querySelectorAll(".cell").forEach((el) => {
    el.classList.remove("VISITED");
    el.classList.remove("EXPLORED");
    el.classList.remove("PATH");
  });
};

export const clearWalls = () => {
  document.querySelectorAll(".cell").forEach((el) => {
    el.classList.remove("WALL");
  });
};
