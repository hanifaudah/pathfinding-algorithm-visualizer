import React from "react";
import styled from "styled-components";

// components
import DropDown from "./DropDown";

// utils
import { clearCells, resetPath } from "../utils/funcs";

// constants
import { STATUS, ALGORITHMS } from "../utils/constants";

// redux
import { useDispatch, useSelector } from "react-redux";
import { setStatus, setCurAlgo } from "../redux/modules/grid";

const CSS = styled.div`
  padding: 1em;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;

  button {
    outline: none;
    border: 1px solid grey;
    background: white;
    padding: 0.5em 1em;
    border-radius: 0.2em;
    cursor: pointer;
    margin: 0 1em;
    font-weight: 400;
    font-size: 1em;

    &:hover {
      opacity: 0.6;
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
`;

const MenuBar = () => {
  // Dispatch function
  const dispatch = useDispatch();

  // global state
  const { status, curAlgo } = useSelector((state) => state.grid);

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
      <button onClick={clearCells}>CLEAR</button>

      <DropDown
        placeholder="Select Algorithm"
        setState={(val) => dispatch(setCurAlgo(val))}
        defaultValue={curAlgo}
      >
        {Object.keys(ALGORITHMS).map((key, idx) => (
          <DropDown.Item key={idx} value={key}>
            {ALGORITHMS[key].displayName}
          </DropDown.Item>
        ))}
      </DropDown>

      <button
        onClick={() => {
          resetPath();
          ALGORITHMS[curAlgo].func();
        }}
      >
        Run
      </button>

      <StatusButton checkedStatus={STATUS.SET_WALL}>Wall</StatusButton>

      <StatusButton checkedStatus={STATUS.SET_START_CELL}>
        Set Start
      </StatusButton>

      <StatusButton checkedStatus={STATUS.SET_END_CELL}>Set End</StatusButton>
    </CSS>
  );
};

export default MenuBar;
