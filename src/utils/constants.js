// algorithms
import { dijkstra, aStar } from "../algorithms/index";

export const COLOR = {
  VISITED: {
    verbose: "VISITED",
    color: "rgb(227, 255, 125)",
  },
  START: {
    verbose: "START",
    color: "rgb(94, 255, 126)",
  },
  END: {
    verbose: "END",
    color: "rgb(255, 69, 69)",
  },
  EXPLORED: {
    verbose: "EXPLORED",
    color: "rgb(255, 146, 51)",
  }, // orange
  DEFAULT: {
    verbose: "DEFAULT",
    color: "white",
  },
  PATH: {
    verbose: "PATH",
    color: "rgb(140, 140, 140)",
  },
  WALL: {
    verbose: "WALL",
    color: "black",
  },
  NONE: {
    verbose: "NONE",
    color: "rgba(0, 0, 0, 0)",
  },
};

export const STATUS = {
  SET_START_CELL: "SET_START_CELL",
  SET_END_CELL: "SET_END_CELL",
  SET_WALL: "SET_WALL",
  DEFAULT: "DEFAULT",
};

export const WEIGHTED_ALGORITHMS = {
  DIJKSTRA: {
    displayName: "Dijkstra",
    func: dijkstra,
  },
  ASTAR: {
    displayName: "A*",
    func: aStar,
  },
};

export const UNWEIGHTED_ALGORITHMS = {};
