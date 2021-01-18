import React, { useState, useEffect } from "react";
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
const bg = "white";
const borderColor = "rgb(196, 195, 199)";

const CSS = styled.div`
  overflow: hidden;
  &,
  & * {
    font-family: Josefin Sans;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background: ${bg};

  height: 100vh;

  .cell-container {
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    padding-bottom: 1em;
  }

  .cell,
  .placeholder-cell {
    border: 0.5px solid ${borderColor};
    width: calc(100vw / ${(props) => props.gridWidth});
    height: calc(100vw / ${(props) => props.gridWidth});
    box-sizing: border-box;
    background-color: ${COLOR.DEFAULT.color};

    ${(props) =>
      ((props) => {
        let colorClasses = "";
        console.log(props.animate);
        Object.keys(COLOR).map((key) => {
          colorClasses += `
                    &.${COLOR[key].verbose} {
                        background-color: ${COLOR[key].color};
                        transition: all ${props.animate ? ".5" : "0"}s;
                        animation: grow ${
                          props.animate
                            ? COLOR[key] === COLOR.VISITED ||
                              COLOR[key] === COLOR.EXPLORED
                              ? ".5"
                              : ".25"
                            : "0"
                        }s;
                        ${
                          COLOR[key] === COLOR.WALL
                            ? `border-color: ${COLOR.WALL.color};`
                            : ""
                        }
                    }
                `;
        });
        return colorClasses;
      })(props)}
  }

  @keyframes grow {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

const Grid = () => {
  const dispatch = useDispatch();

  // global state
  const {
    status,
    gridWidth,
    gridHeight,
    cellWidth,
    endCellIndex,
    startCellIndex,
    pathDrawn,
  } = useSelector((state) => state.grid);

  useEffect(() => {
    dispatch(
      setGridDimensions({
        width: 50,
        height: 18,
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

  const handleMouseOver = (event, cellNum) => {
    event.preventDefault();
    if (event.buttons === 1) {
      if (status === STATUS.SET_WALL) {
        document.querySelector(`.cell-${cellNum}`).classList.add("WALL");
      } else if (status === STATUS.SET_END_CELL) {
        dispatch(setEndCellIndex(cellNum));
      } else if (status === STATUS.SET_START_CELL) {
        dispatch(setStartCellIndex(cellNum));
      }
    }
  };

  const handleMouseDown = (event, cellNum) => {
    event.preventDefault();
    if (event.buttons === 1) {
      if (status === STATUS.DEFAULT) {
        if (cellNum === endCellIndex) dispatch(setStatus(STATUS.SET_END_CELL));
        else if (cellNum === startCellIndex)
          dispatch(setStatus(STATUS.SET_START_CELL));
      } else if (status === STATUS.SET_WALL) {
        document.querySelector(`.cell-${cellNum}`).classList.add("WALL");
      }
    }
  };

  const handleMouseUp = (event, cellNum) => {
    event.preventDefault();
    if (
      (cellNum === endCellIndex && status === STATUS.SET_END_CELL) ||
      (cellNum === startCellIndex && status === STATUS.SET_START_CELL)
    )
      dispatch(setStatus(STATUS.DEFAULT));
  };

  return (
    <CSS gridWidth={gridWidth} cellWidth={cellWidth} animate={!pathDrawn}>
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
                onMouseDown={(e) => handleMouseDown(e, idx)}
                onMouseOver={(e) => handleMouseOver(e, idx)}
                onMouseUp={(e) => handleMouseUp(e, idx)}
                // onDrag={(e) => handleDrag(e, idx)}
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
