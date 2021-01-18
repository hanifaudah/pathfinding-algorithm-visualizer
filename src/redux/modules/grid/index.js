import { createSlice } from "@reduxjs/toolkit";

const grid = createSlice({
  name: "grid",
  initialState: {
    gridWidth: 0,
    gridHeight: 0,
    cellWidth: 0,
    startCellIndex: -1,
    endCellIndex: -1,
    status: "DEFAULT",
    curAlgo: "DIJKSTRA",
    pathDrawn: false,
  },
  reducers: {
    setStartCellIndex(state, { payload }) {
      const oldStart = state.startCellIndex;
      if (oldStart !== -1)
        document.querySelector(`.cell-${oldStart}`).classList.remove("START");
      document.querySelector(`.cell-${payload}`).classList.add("START");
      return {
        ...state,
        startCellIndex: payload,
      };
    },
    setEndCellIndex(state, { payload }) {
      const oldEnd = state.endCellIndex;
      if (oldEnd !== -1)
        document.querySelector(`.cell-${oldEnd}`).classList.remove("END");
      document.querySelector(`.cell-${payload}`).classList.add("END");
      return {
        ...state,
        endCellIndex: payload,
      };
    },
    setStatus(state, { payload }) {
      return {
        ...state,
        status: payload,
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
    setPathDrawn(state, { payload }) {
      return {
        ...state,
        pathDrawn: payload,
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
  setPathDrawn,
} = grid.actions;

export default grid.reducer;
