import React from 'react'
import styled from 'styled-components'

const CSS = styled.div``

const DropDown = ({ setState, placeholder, children }) => {
  return (
      <select onChange={e => setState(e.target.value)} defaultValue=''>
        <option value='' disabled>{placeholder}</option>
        {children}
      </select>
  )
}

DropDown.Item = ({ value, children }) => {
  return (
      <option value={value}>{children}</option>
  )
}

export default DropDown