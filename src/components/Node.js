import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

// redux
import { useSelector, useDispatch } from 'react-redux'
// import { setStartCellIndex, endStartCellIndex } from '../redux/modules/grid'

// constants
import { COLOR, STATUS } from '../utils/constants'

const CSS = styled.div`
border: 1px solid grey;
width: ${props => props.width + 'em'};
height: ${props => props.width + 'em'};
box-sizing: border-box;
background: ${props => props.color};

&:hover {
    background: ${props => props.hover};
    opacity: 1;
}
`

const Node = ({ width, clickAction, children, idx, visited, explored, path }) => {
    const dispatch = useDispatch()

    // access global state
    const { startCellIndex, endCellIndex, status } = useSelector(state => state.grid)

    // local state
    const [color, setColor] = useState(COLOR.DEFAULT)
    const [hoverColor, setHoverColor] = useState(COLOR.DEFAULT)

    useEffect(() => {
        setCurrentColor()
        setCurrentHoverColor()
        console.log('update')
    }, [color, explored, visited])

    const setCurrentColor = () => {
        if (path && path.has(idx)) {
            setColor(COLOR.PATH)
        } else if (idx === startCellIndex) {
            setColor(COLOR.START)
        } else if (idx === endCellIndex) {
            setColor(COLOR.END)
        } else if (visited && visited.has(idx)) {
            setColor(COLOR.VISITED)
        } else if (explored && explored.has(idx)) {
            setColor(COLOR.EXPLORED)
        } else {
            setColor(COLOR.DEFAULT)
        }
    }

    const setCurrentHoverColor = () => {
        if (status === STATUS.SET_START_CELL) {
            setHoverColor(COLOR.START)
        } else if (status === STATUS.SET_END_CELL) {
            setHoverColor(COLOR.END)
        } else {
            setHoverColor(COLOR.DEFAULT)
        }
    }

    return (
        <CSS
            width={width}
            color={color}
            hover={hoverColor}
            onClick={clickAction}
        >
            {children}
        </CSS>
    )
}

export default Node
