import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { store } from '../redux/store'

// components
import Cell from "./Node"

// constants
import { COLOR, STATUS } from '../utils/constants'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { setStartCellIndex, setEndCellIndex, setStatus, setGridDimensions, addExploredCell, addVisitedCell, addPath } from '../redux/modules/grid'

// algorithms
import { dijkstra, showAdjacent } from '../algorithms'

const CSS = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;

height: 100vh;

.cell-container {
    display: flex;
    flex-wrap: wrap;
    width: ${props => props.cellWidth * props.gridWidth}em;
}
`

const Grid = () => {
    const dispatch = useDispatch()

    // global status
    const { status, gridWidth, gridHeight, cellWidth } = useSelector(state => state.grid)

    // local state
    const [path, setPath] = useState(new Set())

    useEffect(() => {
        dispatch(setGridDimensions({
            width: 30,
            height: 15,
            cellWidth: 2
        }))
    }, [])

    const RenderCells = () => {
        const cells = []
        const numOfCells = gridWidth * gridHeight
        for(let i = 0; i < numOfCells; i++) {
            cells.push(
                <Cell
                    key={i}
                    idx={i}
                    path={path}
                    clickAction={handleCellClick}
                />
                // >{i}</Cell>
            )
        }

        return cells
    }

    const handleCellClick = (cellNum) => {
        if (status === STATUS.SET_START_CELL) {
            dispatch(setStartCellIndex(cellNum))
            dispatch(setStatus(STATUS.DEFAULT))
        } else if (status === STATUS.SET_END_CELL) {
            dispatch(setEndCellIndex(cellNum))
            dispatch(setStatus(STATUS.DEFAULT))
        }
        // else {
        //     showAdjacent({
        //         idx: cellNum,
        //         addExploredCell,
        //         _getState: store.getState
        //     })
        // }
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
                    dijkstra({
                      addExploredCell,
                      addVisitedCell,
                      addPath,
                      _getState: store.getState,
                      dispatch,
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
            cellWidth={cellWidth}
        >
            <MenuBar/>
            <div className='cell-container'>
                <RenderCells/>
            </div>
        </CSS>
    )
}

export default Grid
