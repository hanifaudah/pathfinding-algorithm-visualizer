import React, { Component } from 'react'
import Cell from "./Cell"
// import { findByLabelText } from '@testing-library/react'

export class Row extends Component {
    render() {
        return this.props.width.map((cell)=> (
            <div className={`cell (${cell},${this.props.yAxis})`}>
                <Cell x={cell} y={this.props.yAxis}/>
            </div>
        ))
    }
}

export default Row
