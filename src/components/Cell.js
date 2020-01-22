import React, { Component } from 'react';
import '../App.css';

export class Cell extends Component {
    state = {
        isVisited:false,
        status:"null",
        color:"notVisited",
        x:this.props.x,
        y:this.props.y
    }

    componentDidMount(){
        if(this.state.x===2 && this.state.y===11){
            this.setState({color:"start",status:"start"})
        }
        if(this.state.x===39 && this.state.y===11){
            this.setState({color:"end",status:"end"})
        }
    }

    over = (e) => {
        if(this.state.color!=="end" && this.state.color!=="start"){
            this.setState({color:"visited"});
        }
    }

    render() {
        return (
            <React.Fragment>
                <table>
                    <tbody>
                        <tr>
                            <td className={"cell " + this.state.color}></td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

export default Cell
