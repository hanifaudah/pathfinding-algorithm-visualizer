import { createSelector } from '@reduxjs/toolkit'
export const cellSelector = (state, cellNum) => createSelector(
  state => state.grid.cells,
  cells => cells[cellNum]
)(state)

// export const cellFilter = cellSelector(state)