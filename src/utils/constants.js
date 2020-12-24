// algorithms
import { dijkstra } from '../algorithms/index'

export const COLOR = {
  VISITED: 'rgb(227, 255, 125)',
  START: 'rgb(94, 255, 126)',
  END: 'rgb(255, 69, 69)',
  EXPLORED: 'rgb(255, 146, 51)', // orange
  DEFAULT: 'white',
  PATH: 'rgb(140, 140, 140)',
  WALL: 'black',
  NONE: 'rgba(0, 0, 0, 0)'
}

export const STATUS = {
  SET_START_CELL: 'SET_START_CELL',
  SET_END_CELL: 'SET_END_CELL',
  SET_WALL: 'SET_WALL',
  DEFAULT: 'DEFAULT'
}