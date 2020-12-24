import { createSlice } from '@reduxjs/toolkit'
import { STATUS, COLOR } from '../../../utils/constants'

const isEndpoint = color => color === COLOR.START || color === COLOR.END

const grid = createSlice({
  name: 'grid',
  initialState: {
    gridWidth: 0,
    gridHeight: 0,
    cellWidth: 0,
    cells: {},
    startCellIndex: -1,
    endCellIndex: -1,
    status: STATUS.DEFAULT,
    hoverColor: COLOR.NONE
  },
  reducers: {
    setStartCellIndex(state, { payload }) {
      const oldStart = state.startCellIndex
      const tempCells = {...state.cells}
      if (oldStart !== -1) {
        tempCells[oldStart] = {
          ...state.cells[oldStart],
          color: COLOR.DEFAULT
        }
      }
      tempCells[payload] = {
        ...state.cells[payload],
        color: COLOR.START
      }
      return {
        ...state,
        startCellIndex: payload,
        cells: tempCells
      }
    },
    setEndCellIndex(state, { payload }) {
      const oldEnd = state.endCellIndex
      const tempCells = {...state.cells}
      if (oldEnd !== -1) {
        tempCells[oldEnd] = {
          ...state.cells[oldEnd],
          color: COLOR.DEFAULT
        }
      }
      tempCells[payload] = {
        ...state.cells[payload],
        color: COLOR.END
      }
      return {
        ...state,
        endCellIndex: payload,
        cells: tempCells
      }
    },
    setHoverColor(state, { payload }) {
      return {
        ...state,
        hoverColor: payload
      }
    },
    setStatus(state, { payload }) {
      let hoverColor;
      switch(payload) {
        case STATUS.SET_START_CELL:
          hoverColor = COLOR.START
          break
        case STATUS.SET_END_CELL:
          hoverColor = COLOR.END
          break
        case STATUS.SET_WALL:
          hoverColor = COLOR.WALL
          break
        default:
          hoverColor = COLOR.NONE
      }
      return {
        ...state,
        status: payload,
        hoverColor
      }
    },
    addVisitedCell(state, { payload }) {
      return isEndpoint(state.cells[payload].color) ? state : {
        ...state,
        cells: {
          ...state.cells,
          [payload]: {
            ...state.cells[payload],
            color: COLOR.VISITED
          }
        }
      }
    },
    addExploredCell(state, { payload }) {
      return isEndpoint(state.cells[payload].color) ? state : {
        ...state,
        cells: {
          ...state.cells,
          [payload]: {
            ...state.cells[payload],
            color: COLOR.EXPLORED
          }
        }
      }
    },
    addPath(state, { payload }) {
      return isEndpoint(state.cells[payload].color) ? state : {
        ...state,
        cells: {
          ...state.cells,
          [payload]: {
            ...state.cells[payload],
            color: COLOR.PATH
          }
        }
      }
    },
    setGridDimensions(state, { payload }) {
      const { width, height, cellWidth } = payload

      // set cell state
      const initialCells = {}
      for (let i = 0; i < (width * height); i++) {
        initialCells[i] = {
          color: COLOR.DEFAULT,
        }
      }
      return {
        ...state,
        gridWidth: width,
        gridHeight: height,
        cellWidth,
        cells: initialCells,
      }
    },
    clearCells(state) {
      let objLength = Object.keys(state.cells).length
      for (let key = 0; key < objLength; key++) {
        state.cells[key].color = COLOR.DEFAULT
      }
      return state
    },
    clearPath(state) {
      let objLength = Object.keys(state.cells).length
      for (let key = 0; key < objLength; key++) {
        let curColor = state.cells[key].color
        state.cells[key].color =
          (curColor === COLOR.START || curColor === COLOR.END || curColor === COLOR.WALL)
          ?
          curColor
          :
          COLOR.DEFAULT
      }
      return state
    },
    setWall(state, { payload }) {
      let curColor = state.cells[payload].color
      return {
        ...state,
        cells: {
          ...state.cells,
          [payload]: {
            ...state.cells[payload],
            color: (curColor === COLOR.START || curColor === COLOR.END ? curColor : COLOR.WALL)
          }
        }
      }
    }
  }
})

export const {
  setStartCellIndex,
  setEndCellIndex,
  setStatus,
  addVisitedCell,
  addExploredCell,
  addPath,
  setGridDimensions,
  clearCells,
  clearPath,
  setWall
} = grid.actions

export default grid.reducer