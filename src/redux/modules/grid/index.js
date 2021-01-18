import { createSlice } from "@reduxjs/toolkit";
import { STATUS, COLOR } from "../../../utils/constants";

const grid = createSlice({
  name: "grid",
  initialState: {
    gridWidth: 0,
    gridHeight: 0,
    cellWidth: 0,
    cells: {},
    startCellIndex: -1,
    endCellIndex: -1,
    status: "DEFAULT",
    curAlgo: "DIJKSTRA",
  },
  reducers: {
    setStartCellIndex(state, { payload }) {
      const oldStart = state.startCellIndex;
      const tempCells = { ...state.cells };
      if (oldStart !== -1) {
        tempCells[oldStart] = {
          ...state.cells[oldStart],
          color: COLOR.DEFAULT,
        };
      }
      tempCells[payload] = {
        ...state.cells[payload],
        color: COLOR.START,
      };
      return {
        ...state,
        startCellIndex: payload,
        cells: tempCells,
      };
    },
    setEndCellIndex(state, { payload }) {
      const oldEnd = state.endCellIndex;
      const tempCells = { ...state.cells };
      if (oldEnd !== -1) {
        tempCells[oldEnd] = {
          ...state.cells[oldEnd],
          color: COLOR.DEFAULT,
        };
      }
      tempCells[payload] = {
        ...state.cells[payload],
        color: COLOR.END,
      };
      return {
        ...state,
        endCellIndex: payload,
        cells: tempCells,
      };
    },
    setStatus(state, { payload }) {
      let hoverColor;
      switch (payload) {
        case STATUS.SET_START_CELL:
          hoverColor = COLOR.START;
          break;
        case STATUS.SET_END_CELL:
          hoverColor = COLOR.END;
          break;
        case STATUS.SET_WALL:
          hoverColor = COLOR.WALL;
          break;
        default:
          hoverColor = COLOR.NONE;
      }
      return {
        ...state,
        status: payload,
        hoverColor,
      };
    },
    setGridDimensions(state, { payload }) {
      const { width, height, cellWidth } = payload;
      return {
        ...state,
        gridWidth: width,
        gridHeight: height,
        cellWidth,
      };
    },
    setCurAlgo(state, { payload }) {
      return {
        ...state,
        curAlgo: payload,
      };
    },
  },
});

export const {
  setStartCellIndex,
  setEndCellIndex,
  setStatus,
  setGridDimensions,
  setCurAlgo,
} = grid.actions;

export default grid.reducer;
