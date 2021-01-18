import { PriorityQueue, Queue } from 'buckets-js'

// toastr
import {toastr} from 'react-redux-toastr'

// constants
const TIME_DELAY = 10

/**
 * Dijkstra's Algorithm Implementation
 * @param {*} param0
 */
export const dijkstra = ({
  _getState,
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
    let delayedQ = new Queue();
    while (!frontier.isEmpty()) {
      cur = frontier.dequeue()
      delayedQ.enqueue(cur);

      // visit cell
      timeouts.push(setTimeout(() => {
        let cell = document.querySelector(`.cell-${delayedQ.dequeue()}`)
        cell.classList.remove('EXPLORED')
        cell.classList.add('VISITED')
      }, TIME_DELAY * timeouts.length))

      cellsDict[cur].isVisited = true

      if (cur === END_INDEX) {
        break
      }


      // Check adjacent cells
      const sourceDistance = cellsDict[cur].distance
      const adjacentList = cellsDict[cur].adjacent
      let cnt = 0;
      for(let i = 0; i < adjacentList.length; i++) {
        let adj = adjacentList[i]
        const newDistance = sourceDistance + 1
        if (isValidCell(adj, _getState) &&
            !cellsDict[adj].isVisited &&
            (newDistance < cellsDict[adj].distance) &&
            !document.querySelector(`.cell-${adj}`).classList.contains('WALL') ) {
          cnt++;
          timeouts.push(setTimeout(() => {
            document.querySelector(`.cell-${adj}`).classList.add('EXPLORED')
          }, TIME_DELAY * timeouts.length - cnt))

          cellsDict[adj].distance = newDistance
          cellsDict[adj].prev = cur
          frontier.enqueue(adj)
        }
      }
    }

    // Destination not found
    if (cellsDict[END_INDEX].prev == null) toastr.info('No path found')

    // draw path
    let curIdx = END_INDEX
    cur = cellsDict[curIdx]
    let path = []
    while (curIdx !== null) {
      if (curIdx !== START_INDEX && curIdx !== END_INDEX) path.push(curIdx)
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
            document.querySelector(`.cell-${path[idx]}`).classList.add('PATH')
            }, TIME_DELAY * timeouts.length)
        )
      })(i)
    }
  } else {
    toastr.error('Please set starting and ending cell')
  }
}

/**
 * A* Pathfinding Algorithm Implementation
 */
// export const aStar = ({
//   start
// }={}) => {

// }

/**
 * Show Adjacent Cells
 * @param {*} param0
 */
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
      // document.querySelector(`cell-${adj}`).classList.add('EXPLORED')
    }
  })
}

export const animation = () => {
  let timeouts = []
  for (let i = 0; i < 10; i++) {
    timeouts.push(setTimeout(() => {
      document.querySelector(`.cell-${i}`).classList.add('EXPLORED')
    }, TIME_DELAY * timeouts.length))
  }
}

// Utility Functions
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