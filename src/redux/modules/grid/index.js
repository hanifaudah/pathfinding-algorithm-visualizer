import { createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../../utils/constants'

const grid = createSlice({
  name: 'grid',
  initialState: {
    startCellIndex: -1,
    endCellIndex: -1,
    gridWidth: 0,
    gridHeight: 0,
    status: STATUS.DEFAULT,
    visitedCells: new Set(),
    exploredCells: new Set(),
  },
  reducers: {
    setStartCellIndex(state, { payload }) {
      state.startCellIndex = payload
      return state
    },
    setEndCellIndex(state, { payload }) {
      state.endCellIndex = payload
      return state
    },
    setStatus(state, { payload }) {
      state.status = payload
      return state
    },
    addVisitedCell(state, { payload }) {
      state.visitedCells = new Set(state.visitedCells.add(payload))
      if (state.exploredCells.has(payload)) {state.exploredCells = new Set(state.exploredCells.delete(payload))}
      return state
    },
    addExploredCell(state, { payload }) {
      state.exploredCells = new Set(state.exploredCells.add(payload))
      return state
    },
    setGridWidth(state, { payload }) {
      state.gridWidth = payload
      return state
    },
    setGridHeight(state, { payload }) {
      state.gridHeight = payload
      return state
    }
  }
})

export const {
  setStartCellIndex,
  setEndCellIndex,
  setStatus,
  addVisitedCell,
  addExploredCell,
  setGridHeight,
  setGridWidth
} = grid.actions

export default grid.reducer