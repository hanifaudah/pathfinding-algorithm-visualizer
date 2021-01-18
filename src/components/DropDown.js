import React, { useEffect } from "react";
import styled from "styled-components";

const CSS = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  select {
    outline: none;
    border: none;
    background: rgb(255, 198, 64);
    padding: 0.2em 0.5em;
    border-radius: 0.2em;
    cursor: pointer;
    margin: 0 1em;
    font-weight: 400;
    font-size: 1em;
    color: white;
  }

  option {
    background: white;
    color: black;
  }
`;

const DropDown = ({ setState, placeholder, children, defaultValue }) => {
  useEffect(() => {
    setState(defaultValue);
  }, []);
  return (
    <CSS>
      <select
        onChange={(e) => setState(e.target.value)}
        defaultValue={defaultValue || ""}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    </CSS>
  );
};

DropDown.Item = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

export default DropDown;
