import React, { Component } from 'react';
import logo from '../../logo.svg';
import './Welcome.css';
import {Redirect} from 'react-router-dom'

class Welcome extends Component {
    constructor(props){
        super(props);
        this.state = {
            log: false,
            reg: false
        }
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    login(){
        this.setState({
            log: true
        });
        console.log(this.state);
    }

    register(){
        this.setState({
            reg: true
        });
        console.log(this.state);
    }

    render(){
        if (sessionStorage.getItem('authToken')) {
            return (<Redirect to={'/home'}/>);
        } else if(this.state.log){
            return (<Redirect to={'/login'}/>);
        } else if(this.state.reg){
            return (<Redirect to={'/register'}/>);
        }
        return (
        <div className="App">
            <header className="App-header">
                <h2 align="center">ITB NIM Finder - Hendpraz</h2>
                <img src={logo} className="App-logo" alt="logo" />
                <a href="/nim-finder/#/login" className="button1">Login</a>
                <a href="/nim-finder/#/register" className="button2">Register</a>
            </header>
        </div>
        );
    }
}

export default Welcome;