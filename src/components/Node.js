import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

// redux
import { useSelector, useDispatch } from 'react-redux'

const CSS = styled.div`
border: 1px solid grey;
width: calc(100vw / ${props => props.gridWidth});
height: calc(100vw / ${props => props.gridWidth});
box-sizing: border-box;
background: ${props => props.color};
transition: background .2s;

&:hover {
    background: ${props => props.hover};
    opacity: .4;
}
`

const Node = ({ clickAction, mouseOverAction, children, idx }) => {

    // access global state
    const { gridWidth, hoverColor, cells } = useSelector(state => state.grid)

    return (
        <CSS
            gridWidth={gridWidth}
            color={cells[idx].color}
            hover={hoverColor}
            onClick={() => clickAction(idx)}
            onMouseOver={(e) => mouseOverAction(idx, e)}
        >
            {children}
        </CSS>
    )
}

export default Node
