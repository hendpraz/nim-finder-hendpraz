import React, { Component } from 'react';
import logo from '../../logo.svg';
import './Welcome.css';
import {Redirect} from 'react-router-dom';

class Welcome extends Component {
    constructor(props){
        super(props);

        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    login(){
        
    }

    register(){
        
    }

    render(){
        if (sessionStorage.getItem('authToken')) {
            return (<Redirect to={'/home'}/>);
        }else{
            return (
            <div className="App">
                <header className="App-header">
                    <h2 align="center">ITB NIM Finder - Hendpraz</h2>
                    <img src={logo} className="App-logo" alt="logo" />
                    <button className="button1" onClick={this.login}>Login</button>
                    <p>About this NIM Finder, <a href="/about">Click Here</a></p>
                </header>
            </div>
            );
        }
    }
}

export default Welcome;