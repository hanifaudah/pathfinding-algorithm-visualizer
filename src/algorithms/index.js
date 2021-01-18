import { PriorityQueue, Queue } from "buckets-js";
import { store } from "../redux/store";

// toastr
import { toastr } from "react-redux-toastr";

// utils
import { addCellState, cellContains, isValidCell } from "../utils/funcs";
import { COLOR } from "../utils/constants";

// redux
import { setPathDrawn } from "../redux/modules/grid";

// constants
let state = store.getState().grid;
let {
  gridWidth: GRID_WIDTH,
  gridHeight: GRID_HEIGHT,
  startCellIndex: START_INDEX,
  endCellIndex: END_INDEX,
} = state;
let NUM_OF_CELLS = GRID_HEIGHT * GRID_WIDTH;
let ANIMATE = !state.pathDrawn;

store.subscribe(() => {
  state = store.getState().grid;
  ({
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    startCellIndex: START_INDEX,
    endCellIndex: END_INDEX,
  } = state);
  NUM_OF_CELLS = GRID_HEIGHT * GRID_WIDTH;
  ANIMATE = !state.pathDrawn;
});

const TIME_DELAY = 10;

/**
 * Dijkstra's Algorithm Implementation
 * @param {*} param0
 */
export const dijkstra = (dispatch) => {
  if (isValidCell(START_INDEX) && isValidCell(END_INDEX)) {
    const cellsDict = {};
    const frontier = new PriorityQueue((a, b) => {
      const aDist = cellsDict[a].distance;
      const bDist = cellsDict[b].distance;
      if (aDist < bDist) {
        return 1;
      } else if (aDist > bDist) {
        return -1;
      } else {
        return 0;
      }
    });

    // insert all cells to dict
    for (let idx = 0; idx < NUM_OF_CELLS; idx++) {
      cellsDict[idx] = {
        distance: Infinity,
        prev: null,
        isVisited: false,
        adjacent: [
          !cellIsFarLeft(idx) ? idx - 1 : -1,
          !cellIsFarRight(idx) ? idx + 1 : -1,
          !cellIsFarBottom(idx) ? idx + GRID_WIDTH : -1,
          !cellIsFarTop(idx) ? idx - GRID_WIDTH : -1,
        ],
      };
    }

    // Initialize PQ and starting cell
    frontier.enqueue(START_INDEX);

    cellsDict[START_INDEX].isVisited = true;
    cellsDict[START_INDEX].distance = 0;

    // Start searching
    let cur;
    let timeouts = [];
    let delayedQ = new Queue();
    while (!frontier.isEmpty()) {
      cur = frontier.dequeue();
      delayedQ.enqueue(cur);

      // visit cell
      if (ANIMATE) {
        timeouts.push(
          setTimeout(() => {
            addCellState(delayedQ.dequeue(), COLOR.VISITED.verbose);
          }, TIME_DELAY * timeouts.length)
        );
      } else {
        addCellState(cur, COLOR.VISITED.verbose);
      }

      cellsDict[cur].isVisited = true;

      if (cur === END_INDEX) {
        break;
      }

      // Check adjacent cells
      const sourceDistance = cellsDict[cur].distance;
      const adjacentList = cellsDict[cur].adjacent;
      for (let i = 0; i < adjacentList.length; i++) {
        let adj = adjacentList[i];
        const newDistance = sourceDistance + 1;
        if (
          isValidCell(adj) &&
          !cellsDict[adj].isVisited &&
          newDistance < cellsDict[adj].distance &&
          !cellContains(adj, COLOR.WALL.verbose)
        ) {
          if (ANIMATE) {
            timeouts.push(
              setTimeout(() => {
                addCellState(adj, COLOR.EXPLORED.verbose);
              }, TIME_DELAY * timeouts.length - i)
            );
          } else {
            addCellState(adj, COLOR.EXPLORED.verbose);
          }

          cellsDict[adj].distance = newDistance;
          cellsDict[adj].prev = cur;
          frontier.enqueue(adj);
        }
      }
    }

    // Destination not found
    if (cellsDict[END_INDEX].prev == null) toastr.info("No path found");

    // draw path
    let curIdx = END_INDEX;
    cur = cellsDict[curIdx];
    let path = [];
    while (curIdx !== null) {
      if (curIdx !== START_INDEX && curIdx !== END_INDEX) path.push(curIdx);
      curIdx = cur.prev;
      cur = cellsDict[cur.prev];
    }
    path.reverse();

    // draw path
    for (let i = 0; i < path.length; i++) {
      ANIMATE
        ? ((idx) => {
            timeouts.push(
              setTimeout(() => {
                // set path
                addCellState(path[idx], COLOR.PATH.verbose);
                if (i === path.length - 1) animationFinished();
              }, TIME_DELAY * timeouts.length)
            );
          })(i)
        : addCellState(path[i], COLOR.PATH.verbose);
    }
  } else {
    toastr.error("Please set starting and ending cell");
  }
};
/**
 * A* Pathfinding Algorithm Implementation
 */
export const aStar = () => {
  if (isValidCell(START_INDEX) && isValidCell(END_INDEX)) {
    const cellsDict = {};
    const frontier = new PriorityQueue((a, b) => {
      const aDist = cellsDict[a].f;
      const bDist = cellsDict[b].f;
      if (aDist < bDist) {
        return 1;
      } else if (aDist > bDist) {
        return -1;
      } else {
        return cellsDict[a].h < cellsDict[b].h ? 1 : -1;
      }
    });

    // insert all cells to dict
    for (let idx = 0; idx < NUM_OF_CELLS; idx++) {
      cellsDict[idx] = {
        g: Infinity,
        h:
          Math.abs(getXPos(END_INDEX) - getXPos(idx)) +
          Math.abs(getYPos(END_INDEX) - getYPos(idx)),
        f: 0,
        isVisited: false,
        prev: null,
        adjacent: [
          !cellIsFarLeft(idx) ? idx - 1 : -1,
          !cellIsFarRight(idx) ? idx + 1 : -1,
          !cellIsFarBottom(idx) ? idx + GRID_WIDTH : -1,
          !cellIsFarTop(idx) ? idx - GRID_WIDTH : -1,
        ],
      };
    }

    // Initiate frontier
    cellsDict[START_INDEX].g = 0;
    frontier.enqueue(START_INDEX);

    // Start path finding
    let timeouts = [];
    const delayedQ = new Queue();
    while (!frontier.isEmpty()) {
      let cur = frontier.dequeue();
      delayedQ.enqueue(cur);

      // visit cell
      if (ANIMATE) {
        timeouts.push(
          setTimeout(() => {
            addCellState(delayedQ.dequeue(), COLOR.VISITED.verbose);
          }, TIME_DELAY * timeouts.length)
        );
      } else {
        addCellState(cur, COLOR.VISITED.verbose);
      }

      cellsDict[cur].isVisited = true;

      let adjacentList = cellsDict[cur].adjacent;
      for (let i = 0; i < adjacentList.length; i++) {
        let adj = adjacentList[i];
        if (isValidCell(adj) && !cellContains(adj, COLOR.WALL.verbose)) {
          // Successor is destination
          let newDist = cellsDict[cur].g + 1;

          if (cellsDict[adj].g > newDist || adj === END_INDEX) {
            cellsDict[adj].g = newDist;
            cellsDict[adj].f = cellsDict[adj].g + cellsDict[adj].h;
            cellsDict[adj].prev = cur;

            if (adj !== END_INDEX) {
              ANIMATE
                ? timeouts.push(
                    setTimeout(() => {
                      addCellState(adj, COLOR.EXPLORED.verbose);
                    }, TIME_DELAY * timeouts.length - i)
                  )
                : addCellState(adj, COLOR.EXPLORED.verbose);
              frontier.enqueue(adj);
            } else {
              frontier.clear();
              break;
            }
          }
        }
      }
    }

    // Draw path
    let curIdx = END_INDEX;
    let cur;
    cur = cellsDict[curIdx];
    let path = [];
    while (curIdx !== null) {
      if (curIdx !== START_INDEX && curIdx !== END_INDEX) path.push(curIdx);
      curIdx = cur.prev;
      cur = cellsDict[cur.prev];
    }
    path.reverse();

    // draw path
    for (let i = 0; i < path.length; i++) {
      ANIMATE
        ? ((idx) => {
            timeouts.push(
              setTimeout(() => {
                // set path
                addCellState(path[idx], COLOR.PATH.verbose);
                if (i === path.length - 1) animationFinished();
              }, TIME_DELAY * timeouts.length)
            );
          })(i)
        : addCellState(path[i], COLOR.PATH.verbose);
    }
  } else {
    toastr.error("Please set starting and ending cell");
  }
};

// Utility Functions
const cellIsFarLeft = (cellNum) => {
  return (cellNum + 1) % GRID_WIDTH === 1;
};

const cellIsFarRight = (cellNum) => {
  return (cellNum + 1) % GRID_WIDTH === 0;
};

const cellIsFarTop = (cellNum) => {
  return cellNum < GRID_WIDTH;
};

const cellIsFarBottom = (cellNum) => {
  return cellNum + 1 >= GRID_WIDTH * (GRID_HEIGHT - 1);
};

const getXPos = (cellNum) => {
  return cellNum % GRID_WIDTH;
};

const getYPos = (cellNum) => {
  return (cellNum - getXPos(cellNum)) / GRID_WIDTH;
};

const animationFinished = () => {
  store.dispatch(setPathDrawn(true));
};
