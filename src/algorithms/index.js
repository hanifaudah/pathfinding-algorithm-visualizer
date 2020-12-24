import { PriorityQueue } from 'buckets-js'

// toastr
import {toastr} from 'react-redux-toastr'
import { COLOR } from '../utils/constants'

const TIME_DELAY = 10

export const dijkstra = ({
  addVisitedCell,
  addExploredCell,
  addPath,
  _getState,
  dispatch
}={}) => {
  const GRID_WIDTH = _getState().grid.gridWidth
  const GRID_HEIGHT = _getState().grid.gridHeight
  const START_INDEX = _getState().grid.startCellIndex
  const END_INDEX = _getState().grid.endCellIndex
  const NUM_OF_CELLS = GRID_HEIGHT * GRID_WIDTH

  if (isValidCell(START_INDEX, _getState) && isValidCell(END_INDEX, _getState)) {
    const cellsDict = {}
    const frontier = new PriorityQueue((a, b) => {
      const aDist = cellsDict[a].distance
      const bDist = cellsDict[b].distance
      if (aDist < bDist) {
        return 1
      } else if (aDist > bDist) {
        return - 1
      } else {
        return 0
      }
    })

    // insert all cells to dict
    for (let idx = 0; idx < NUM_OF_CELLS; idx++) {
      cellsDict[idx] = {
        distance: Infinity,
        prev: null,
        isVisited: false,
        adjacent: [
          !cellIsFarLeft(idx, _getState) ? idx - 1 : -1,
          !cellIsFarRight(idx, _getState) ? idx + 1 : -1,
          !cellIsFarBottom(idx, _getState) ? idx + GRID_WIDTH : -1,
          !cellIsFarTop(idx, _getState) ? idx - GRID_WIDTH : -1
        ]
      }
    }

    // Initialize PQ and starting cell
    frontier.enqueue(START_INDEX)

    cellsDict[START_INDEX].isVisited = true
    cellsDict[START_INDEX].distance = 0

    // Start searching
    let cur
    let timeouts = []
    while (!frontier.isEmpty()) {
      cur = frontier.dequeue()

      // visit cell
      // timeouts.push(
      //   setTimeout(
      //     () => {
      //       dispatch(addVisitedCell(cur))
      //     },
      //     TIME_DELAY * timeouts.length
      //   )
      // )
      dispatch(addVisitedCell(cur))

      cellsDict[cur].isVisited = true

      if (cur === END_INDEX) {
        break
      }

      // Check adjacent cells
      const sourceDistance = cellsDict[cur].distance
      const adjacentList = cellsDict[cur].adjacent
      for(let i = 0; i < adjacentList.length; i++) {
        let adj = adjacentList[i]
        const newDistance = sourceDistance + 1
        if (isValidCell(adj, _getState) && !cellsDict[adj].isVisited && (newDistance < cellsDict[adj].distance) && _getState().grid.cells[adj].color !== COLOR.WALL ) {

          // timeout
          // ((idx) => {
          //   timeouts.push(
          //     setTimeout(
          //       () => {
          //       // explore cell
          //       dispatch(addExploredCell(idx))
          //     }, TIME_DELAY * timeouts.length)
          //   )
          // })(adj)
          dispatch(addExploredCell(adj))

          cellsDict[adj].distance = newDistance
          cellsDict[adj].prev = cur
          frontier.enqueue(adj)
        }
      }
    }

    // draw path
    let curIdx = END_INDEX
    cur = cellsDict[curIdx]
    let path = []
    while (curIdx !== null) {
      path.push(curIdx)
      curIdx = cur.prev
      cur = cellsDict[cur.prev]
    }
    path.reverse()

    // draw path
    for (let i = 0; i < path.length; i++) {
      ((idx) => {
        timeouts.push(
          setTimeout(
            () => {
              // set path
              dispatch(addPath(path[idx]))
            }, TIME_DELAY * timeouts.length)
        )
      })(i)
    }
  } else {
    toastr.error('Please set starting and ending cell')
  }
}

export const showAdjacent = ({
  idx,
  addExploredCell,
  _getState
}={}) => {
  const GRID_WIDTH = _getState().grid.gridWidth

  const adjacent = [
    !cellIsFarLeft(idx, _getState) ? idx - 1 : -1,
    !cellIsFarRight(idx, _getState) ? idx + 1 : -1,
    !cellIsFarBottom(idx, _getState) ? idx + GRID_WIDTH : -1,
    !cellIsFarTop(idx, _getState) ? idx - GRID_WIDTH : -1
  ]

  adjacent.map((adj) => {
    if (isValidCell(adj, _getState)) {
      addExploredCell(adj)
    }
  })
}

const isValidCell = (idx, _getState) => {
  return idx >= 0 && idx < (_getState().grid.gridWidth * _getState().grid.gridHeight)
}

const cellIsFarLeft = (cellNum, _getState) => {
  return (cellNum + 1) % _getState().grid.gridWidth === 1
}

const cellIsFarRight = (cellNum, _getState) => {
  return (cellNum + 1) % _getState().grid.gridWidth === 0
}

const cellIsFarTop = (cellNum, _getState) => {
  return cellNum < _getState().grid.gridWidth
}

const cellIsFarBottom = (cellNum, _getState) => {
  return (cellNum + 1) >= _getState().grid.GRID_WIDTH * (_getState().grid.GRID_HEIGHT - 1)
}

const sleep = () => {
  return new Promise(resolve => setTimeout(resolve, TIME_DELAY));
}