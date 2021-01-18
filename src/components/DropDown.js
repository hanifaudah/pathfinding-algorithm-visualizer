import React, { useEffect } from "react";
import styled from "styled-components";

const CSS = styled.div`
  select {
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
