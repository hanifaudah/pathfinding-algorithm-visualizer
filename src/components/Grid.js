import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { store } from '../redux/store'

// components
import Cell from "./Node"
import DropDown from './DropDown'

// constants
import { STATUS, ALGORITHMS } from '../utils/constants'

// redux
import { useDispatch, useSelector } from 'react-redux'
import {
    setStartCellIndex,
    setEndCellIndex,
    setStatus,
    setGridDimensions,
    addExploredCell,
    addVisitedCell,
    addPath,
    clearCells,
    clearPath,
    setWall
} from '../redux/modules/grid'

// algorithms
import { dijkstra, showAdjacent } from '../algorithms'

// css constants
let bg = 'white'

const CSS = styled.div`

&, & * {
    font-family: Josefin Sans;
}

display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
background: ${bg};

height: 100vh;

.cell-container {
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
}

.menu-bar {
    padding: 1em;

    button, select {
        outline: none;
        border: 1px solid grey;
        background: white;
        padding: .5em 1em;
        border-radius: .2em;
        cursor: pointer;
        margin: 0 1em;
        font-weight: 400;
        font-size: 1em;

        &:hover {
            opacity: .6;
        }

        &.start-btn {
            &:hover {
                background: rgb(105, 255, 110);
            }
        }

        &.end-btn {
            &:hover {
                background: rgb(255, 105, 105);
            }
        }

        &.chosen {
            background: black;
            color: white;
        }
    }
}
`

const Grid = () => {
    const dispatch = useDispatch()

    // global status
    const { status, gridWidth, gridHeight, cellWidth } = useSelector(state => state.grid)

    // local state
    const [curAlgo, setCurAlgo] = useState(null)

    useEffect(() => {
        dispatch(setGridDimensions({
            width: 40,
            height: 15,
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
                    clickAction={handleCellClick}
                    mouseOverAction={handleMouseOver}
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
        } else if (status === STATUS.SET_WALL) {
            dispatch(setWall(cellNum))
        }
    }

    const handleMouseOver = (cellNum, event) => {
        // If mouse down
        if (event.buttons === 1) {
            if (status === STATUS.SET_WALL) {
                // console.log(cellNum)
                dispatch(setWall(cellNum))
            }
        }
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

        const ALGORITHMS = {
            DIJKSTRA: {
                displayName: 'Dijkstra',
                func: () => dijkstra({
                    addExploredCell,
                    addVisitedCell,
                    addPath,
                    _getState: store.getState,
                    dispatch
                })
            }
        }

        return (
            <div className='menu-bar'>
                <button onClick={() => dispatch(clearCells())}>CLEAR</button>
                <button onClick={() => dispatch(clearPath())}>RESET PATH</button>
                <DropDown placeholder='Select Algorithm' setState={(val) => setCurAlgo(val)}>
                    {Object.keys(ALGORITHMS).map((key, idx) =>
                        <DropDown.Item key={idx} value={key}>{ALGORITHMS[key].displayName}</DropDown.Item>
                    )}
                </DropDown>
                <button onClick={() => ALGORITHMS[curAlgo].func()}>Run</button>
                <button className={`${status === STATUS.SET_WALL ? 'chosen' : ''}`} onClick={() => handleButton(
                    () => dispatch(setStatus(STATUS.SET_WALL)),
                    STATUS.SET_WALL
                )}>Wall</button>
                <button
                    className={`start-btn ${status === STATUS.SET_START_CELL ? 'chosen' : ''}`}
                    onClick={() => handleButton(
                        () => dispatch(setStatus(STATUS.SET_START_CELL)),
                        STATUS.SET_START_CELL
                    )}
                >Set start</button>
                <button
                    className={`end-btn ${status === STATUS.SET_END_CELL ? 'chosen' : ''}`}
                    onClick={() => handleButton(
                        () => dispatch(setStatus(STATUS.SET_END_CELL)),
                        STATUS.SET_END_CELL
                    )}
                >Set end</button>
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
