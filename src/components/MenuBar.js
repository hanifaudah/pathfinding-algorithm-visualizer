import React, { useEffect } from "react";
import styled from "styled-components";

// components
import DropDown from "./DropDown";

// utils
import { clearCells, resetPath, clearWalls } from "../utils/funcs";

// constants
import {
  STATUS,
  WEIGHTED_ALGORITHMS,
  UNWEIGHTED_ALGORITHMS,
} from "../utils/constants";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setStatus, setCurAlgo, setPathDrawn } from "../redux/modules/grid";

const CSS = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;

  .top,
  .bottom {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.4em 1em;
  }

  .top {
    background: rgb(133, 135, 255);

    .brand {
      align-items: center;
      h1 {
        color: white;
        font-size: 1.5em;
        margin: 0;
      }
    }

    button {
      &:hover {
        background-color: rgb(118, 120, 240);
      }

      &.chosen {
        background-color: rgb(255, 198, 64);
      }
    }
  }

  .bottom {
    background: white;
    justify-content: center;
    height: 100%;

    button {
      color: black;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      padding: 0.2em;
      border-radius: 0.2em;
      &.chosen,
      &:hover {
        background: rgba(230, 230, 230, 1);
      }
    }
  }

  button {
    outline: none;
    border: none;
    padding: 0.2em 0.5em;
    border-radius: 0.2em;
    cursor: pointer;
    margin: 0 1em;
    font-weight: 400;
    font-size: 1em;
    color: white;
    background: none;

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
  }

  .directions {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.2em 0;
    h1 {
      color: black;
      margin: 0;
      font-size: 1em;
      height: 1em;
      font-weight: normal;
    }
  }
`;

const MenuBar = () => {
  // Dispatch function
  const dispatch = useDispatch();

  // global state
  const {
    status,
    curAlgo,
    startCellIndex,
    endCellIndex,
    pathDrawn,
  } = useSelector((state) => state.grid);

  // On update
  useEffect(() => {
    if (pathDrawn) {
      resetPath();
      WEIGHTED_ALGORITHMS[curAlgo].func();
    }
  }, [startCellIndex, endCellIndex]);

  const getDirections = () => {
    let message = "Select one of the options above to start plotting the grid";
    switch (status) {
      case STATUS.SET_START_CELL:
        message = "Click anywhere on the grid to set starting point";
        break;
      case STATUS.SET_END_CELL:
        message = "Click anywhere on the grid to set ending point";
        break;
      case STATUS.SET_WALL:
        message = "Click and drag anywhere on the grid to set walls";
        break;
    }
    return `* ${message} *`;
  };

  // Button component
  const StatusButton = ({ checkedStatus, className, children }) => (
    <button
      className={`${className} ${status === checkedStatus ? "chosen" : ""}`}
      onClick={() => {
        console.log(checkedStatus);
        dispatch(
          setStatus(status === checkedStatus ? STATUS.DEFAULT : checkedStatus)
        );
      }}
    >
      {children}
    </button>
  );

  return (
    <CSS>
      <div className="top">
        <div className="brand">
          <h1>Pathfinding Visualizer</h1>
        </div>
        <button
          onClick={() => {
            clearCells();
            dispatch(setPathDrawn(false));
          }}
        >
          Clear
        </button>

        <button onClick={clearWalls}>Clear walls</button>

        <button
          onClick={() => {
            dispatch(setPathDrawn(false));
            resetPath();
          }}
        >
          Reset
        </button>

        <DropDown
          placeholder="Select Algorithm"
          setState={(val) => dispatch(setCurAlgo(val))}
          defaultValue={curAlgo}
        >
          <option disabled>-- Weighted --</option>
          {Object.keys(WEIGHTED_ALGORITHMS).map((key, idx) => (
            <DropDown.Item key={idx} value={key}>
              {WEIGHTED_ALGORITHMS[key].displayName}
            </DropDown.Item>
          ))}
          <option disabled>-- Unweighted --</option>
          {Object.keys(UNWEIGHTED_ALGORITHMS).map((key, idx) => (
            <DropDown.Item key={idx} value={key}>
              {WEIGHTED_ALGORITHMS[key].displayName}
            </DropDown.Item>
          ))}
        </DropDown>

        <button
          onClick={() => {
            resetPath();
            dispatch(setPathDrawn(false));
            WEIGHTED_ALGORITHMS[curAlgo].func();
          }}
        >
          Run
        </button>
      </div>
      <div className="bottom">
        <StatusButton checkedStatus={STATUS.SET_START_CELL}>
          <div className="placeholder-cell START"></div>
          Set starting point
        </StatusButton>
        <StatusButton checkedStatus={STATUS.SET_END_CELL}>
          <div className="placeholder-cell END"></div>
          Set ending point
        </StatusButton>
        <StatusButton checkedStatus={STATUS.SET_WALL}>
          <div className="placeholder-cell WALL"></div>
          Set walls
        </StatusButton>
      </div>
      <div className="directions">
        <h1>{getDirections()}</h1>
      </div>
    </CSS>
  );
};

export default MenuBar;
