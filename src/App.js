import React, { Component } from 'react';
import './App.css';
import Routes from './routes'

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            appName: "ITB NIM Finder",
            home: false
        }

    }

    render(){
        return (
        <div className="App">
            <Routes name ={this.state.appName}/>
        </div>
        );
    }
}

export default App;