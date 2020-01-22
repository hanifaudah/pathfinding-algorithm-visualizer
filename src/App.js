// import logo from './logo.svg';
import './App.css';
// Components
import Grid from "./components/Grid";
import React, { Component } from 'react'

export class App extends Component {
  state = {
    gridWidth:41,
    gridHeight:21,
    gridWidth_array:[],
    gridHeight_array:[]
  }

  componentDidMount() {
    let lst = []
    for(let i=0; i<this.state.gridWidth; i++){
      lst.push(i);
    }
    this.setState({gridWidth_array:lst});
    lst=[]
    for(let i=0;i<this.state.gridHeight;i++){
      lst.push(i);
    }
    this.setState({gridHeight_array:lst})
  }
  render() {
    return (
      <div className="main">
        <div className="grid">
          <Grid className="grid" width={this.state.gridWidth_array} height={this.state.gridHeight_array}/>
        </div>
      </div>
    )
  }
}

export default App

