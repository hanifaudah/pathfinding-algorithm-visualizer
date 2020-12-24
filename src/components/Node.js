import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

// redux
import { useSelector, useDispatch } from 'react-redux'

// constants
import { COLOR, STATUS } from '../utils/constants'

const CSS = styled.div`
border: 1px solid grey;
width: ${props => props.width + 'em'};
height: ${props => props.width + 'em'};
box-sizing: border-box;
background: ${props => props.color};
transition: background .2s;

&:hover {
    background: ${props => props.hover};
    opacity: 1;
}
`

const Node = ({ clickAction, children, idx, path }) => {

    // access global state
    const { cellWidth, hoverColor, cells } = useSelector(state => state.grid)

    // const getColor = () => {
    //     let newColor = COLOR.DEFAULT;
    //     if (path && path.has(idx)) {
    //         newColor = COLOR.PATH
    //     } else if (idx === startCellIndex) {
    //         newColor = COLOR.START
    //     } else if (idx === endCellIndex) {
    //         newColor = COLOR.END
    //     } else if (visited && visited.has(idx)) {
    //         newColor = COLOR.VISITED
    //     } else if (explored && explored.has(idx)) {
    //         newColor = COLOR.EXPLORED
    //     }
    //     return newColor
    // }

    // const getHoverColor = () => {
    //     let newColor = COLOR.DEFAULT
    //     if (status === STATUS.SET_START_CELL) {
    //         newColor = COLOR.START
    //     } else if (status === STATUS.SET_END_CELL) {
    //         newColor = COLOR.END
    //     }
    //     return newColor
    // }

    return (
        <CSS
            width={cellWidth}
            color={cells[idx].color}
            hover={hoverColor}
            onClick={() => clickAction(idx)}
        >
            {children}
        </CSS>
    )
}

export default Node
