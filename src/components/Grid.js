import React, { Component } from 'react'
import Row from "./Row"
import '../App.css'

export class Grid extends Component {
    render() {
        return this.props.height.map((cell)=> (
            <div className="row d-flex justify-content-center">
                <Row width={this.props.width} yAxis={cell}/>
            </div>
        ))
        
    }
}

export default Grid
