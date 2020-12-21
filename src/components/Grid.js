import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { store } from '../redux/store'

// components
import Cell from "./Node"

// constants
import { COLOR, STATUS } from '../utils/constants'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { setStartCellIndex, setEndCellIndex, setStatus, setGridHeight, setGridWidth } from '../redux/modules/grid'

// algorithms
import { dijkstra } from '../algorithms'

const CELL_WIDTH = 2

const CSS = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;

height: 100vh;

.cell-container {
    display: flex;
    flex-wrap: wrap;
    width: ${props => CELL_WIDTH * props.gridWidth}em;
}
`

const Grid = () => {
    const dispatch = useDispatch()

    // global status
    const { status, gridWidth, gridHeight } = useSelector(state => state.grid)

    // local state
    const [visited, setVisited] = useState(new Set())
    const [explored, setExplored] = useState(new Set())
    const [path, setPath] = useState(new Set())

    useEffect(() => {
        dispatch(setGridHeight(15))
        dispatch(setGridWidth(30))
    }, [])

    const RenderCells = () => {
        const cells = []
        const numOfCells = gridWidth * gridHeight
        for(let i = 0; i < numOfCells; i++) {
            cells.push(
                <Cell
                    width={CELL_WIDTH}
                    key={i}
                    idx={i}
                    visited={visited}
                    explored={explored}
                    path={path}
                    clickAction={() => handleCellClick(i)}
                />
            )
        }
        return cells
    }

    const handleCellClick = (cellNum) => {
        if (status === STATUS.SET_START_CELL) {
            dispatch(setStartCellIndex(cellNum))
        } else if (status === STATUS.SET_END_CELL) {
            dispatch(setEndCellIndex(cellNum))
        }
    }

    const addVisitedCell = idx => {
        if (explored.has(idx)) {
            const temp = explored
            temp.delete(idx)
            setExplored(temp)
        }
        setVisited(new Set(visited.add(idx)))
    }

    const addExploredCell = idx => {
        setExplored(new Set(explored.add(idx)))
    }

    const addPath = idx => {
        setPath(new Set(path.add(idx)))
    }

    const MenuBar = () => {
        const clearStatus = (reference) => {
            if (status === reference) {
                dispatch(setStatus(STATUS.DEFAULT))
                return true
            }
            return false
        }

        const handleButton = (func, reference) => {
            !clearStatus(reference) && func()
        }

        return (
            <div className='menu-bar'>
                <button onClick={() => {
                    // dispatch(setStartCellIndex(100))
                    // dispatch(setEndCellIndex(305))
                    dijkstra({
                      addExploredCell,
                      addVisitedCell,
                      addPath,
                      _getState: store.getState
                    })
                }}>
                    Run DIJKSTRA
                </button>
                <button
                    onClick={() => handleButton(
                        () => dispatch(setStatus(STATUS.SET_START_CELL)),
                        STATUS.SET_START_CELL
                    )}
                >Set Start Cell</button>
                <button
                    onClick={() => handleButton(
                        () => dispatch(setStatus(STATUS.SET_END_CELL)),
                        STATUS.SET_END_CELL
                    )}
                >Set End Cell</button>
                Current status: {status}
            </div>
        )
    }

    return (
        <CSS
            gridWidth={gridWidth}
        >
            <MenuBar/>
            <div className='cell-container'>
                <RenderCells/>
            </div>
        </CSS>
    )
}

export default Grid
