import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

// components
import MenuBar from "./MenuBar";

// utils & constants
import { STATUS, COLOR } from "../utils/constants";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  setStartCellIndex,
  setEndCellIndex,
  setStatus,
  setGridDimensions,
} from "../redux/modules/grid";

// css constants
let bg = "white";

const CSS = styled.div`
  &,
  & * {
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

  .cell {
    border: 1px solid grey;
    width: calc(100vw / ${(props) => props.gridWidth});
    height: calc(100vw / ${(props) => props.gridWidth});
    box-sizing: border-box;
    background-color: ${COLOR.DEFAULT.color};

    &:hover {
      background-color: ${(props) => props.hover};
      opacity: 0.4;
    }

    ${(() => {
      let colorClasses = "";
      Object.keys(COLOR).map((key) => {
        colorClasses += `
                    &.${COLOR[key].verbose} {
                        background-color: ${COLOR[key].color};
                        transition: all .1s;
                    }
                `;
      });
      return colorClasses;
    })()}
  }
`;

const Grid = () => {
  const dispatch = useDispatch();

  // global status
  const { status, gridWidth, gridHeight, cellWidth } = useSelector(
    (state) => state.grid
  );

  useEffect(() => {
    dispatch(
      setGridDimensions({
        width: 40,
        height: 15,
      })
    );
  }, []);

  const handleCellClick = (cellNum) => {
    switch (status) {
      case STATUS.SET_START_CELL:
        dispatch(setStartCellIndex(cellNum));
        document.querySelector(`.cell-${cellNum}`).classList.add("START");
        dispatch(setStatus(STATUS.DEFAULT));
        break;
      case STATUS.SET_END_CELL:
        dispatch(setEndCellIndex(cellNum));
        document.querySelector(`.cell-${cellNum}`).classList.add("END");
        dispatch(setStatus(STATUS.DEFAULT));
        break;
      case STATUS.SET_WALL:
        document.querySelector(`.cell-${cellNum}`).classList.add("WALL");
        break;
    }
  };

  const handleMouseOver = (cellNum, event) => {
    // If mouse down
    event.preventDefault();
    if (event.buttons === 1) {
      if (status === STATUS.SET_WALL) {
        document.querySelector(`.cell-${cellNum}`).classList.add("WALL");
      }
    }
  };

  return (
    <CSS gridWidth={gridWidth} cellWidth={cellWidth}>
      <MenuBar />
      <div className="cell-container">
        {(() => {
          let arr = [];
          for (let idx = 0; idx < gridHeight * gridWidth; idx++) {
            arr.push(
              <div
                key={idx}
                className={`cell cell-${idx}`}
                onClick={() => handleCellClick(idx)}
                onMouseDown={(e) => handleMouseOver(idx, e)}
                onMouseOver={(e) => handleMouseOver(idx, e)}
              ></div>
            );
          }
          return arr;
        })()}
      </div>
    </CSS>
  );
};

export default Grid;
