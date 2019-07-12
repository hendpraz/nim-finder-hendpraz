import React, { Component } from 'react';
import './Home.css';
import { GetData } from '../../services/GetData';
import { PostData } from '../../services/PostData';
import { CreateTable } from '../../services/GenerateTable';
import { Redirect } from 'react-router-dom'

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            query: '',
            currQuery: '',
            pageNum: 0
        }
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.login = this.login.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.searchQuery = this.searchQuery.bind(this);
        this.toggleHide = this.toggleHide.bind(this);
    }

    // Lifecycle
    componentWillMount(){
        if (!(sessionStorage.getItem('authToken'))) {
            this.login();
        }
    }

    componentDidMount(){
        document.title = "ITB Nim Finder - Hendpraz"
    }

    toggleHide(docId){
        var x = document.getElementById(docId);
        x.style.display = "none";
    }

    toggleShow(docId){
        var x = document.getElementById(docId);
        x.style.display = "inline-block";
    }

    //Login with my account
    login(){
        var userData = {
            username: 'mhendryp123',
            password: 'hahaha123'
        }
        PostData('login', userData).then((result) =>{
            if(result.code === 0){
                sessionStorage.setItem('authToken',JSON.stringify(result.token));
            } else{
                alert("Something wrong!");
                let myString = JSON.stringify(result);
                alert(myString);

                sessionStorage.setItem("authToken",'');
                sessionStorage.clear();
            }
        });
    }

    //Set value of query
    onChange = (event) =>{
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    clearTable(){
        var parent = document.getElementById("tableID");
        while(parent.hasChildNodes()){
            parent.removeChild(parent.firstChild);
        }
    }

    //Actions taken if user clicked Search button
    onSearch = event => {
        event.preventDefault();
    
        const query = this.state.query;
        var queryURL = 'https://api.stya.net/nim/';
        let temp2 = 0;
        
        this.toggleHide("nextButton");
        this.toggleHide("prevButton");

        //Clear search results (table or "not found")
        var parent = document.getElementById("tableID");
        while(parent.hasChildNodes())
        {
            parent.removeChild(parent.firstChild);
        }
        document.getElementById("notfound").innerHTML = "";

        if (query === '') {
            return;
        }
    
        //Recognize the query, Name/Number
        var ord = query.charCodeAt(0) - "0".charCodeAt(0);
        if((ord >= 0) && (ord <= 9)){
            queryURL = queryURL + 'byid?query=';
        } else{
            queryURL = queryURL + 'byname?name=';
        }

        //Create URL for query
        queryURL = queryURL + query + '&count=10';
        let temp = queryURL + '&page=' + temp2.toString()
        this.setState({
            currQuery : temp.slice(0,temp.length-1)
        })
        
        this.setState({
            pageNum: 0
        })

        this.searchQuery(queryURL)
    };

    nextPage = event =>{
        event.preventDefault();

        let temp = this.state.pageNum + 1;

        let queryURL = this.state.currQuery + temp.toString();
        this.searchQuery(queryURL);
        this.toggleShow("prevButton");
        this.setState({
            pageNum: temp
        });
    }

    prevPage = event =>{
        event.preventDefault();

        let temp = this.state.pageNum - 1;

        var queryURL;
        if(temp === 0){
            let temp = this.state.currQuery
            queryURL = temp.slice(0,temp.length-6);
            this.toggleHide("prevButton");
        } else{
            queryURL = this.state.currQuery + temp.toString();
        }
        this.searchQuery(queryURL);
        this.toggleShow("nextButton");
        this.setState({
            pageNum: temp
        });
    }

    searchQuery(queryURL){
        this.toggleHide("nextButton");
        this.clearTable();
        const token = sessionStorage.getItem("authToken");
        GetData(queryURL, token).then((result) =>{
            var responseJson = result;
            if(responseJson.status !== "OK"){
                alert("Something wrong!");
                let myString = JSON.stringify(result);
                alert(myString);
            } else{
                let payload = responseJson.payload;
                var data = [];
                for (var i=0;i<payload.length;i++) {
                    data.push(JSON.parse(JSON.stringify(payload[i])));
                }
                //Check the data of payload
                if(data.length === 0){
                    document.getElementById("notfound").innerHTML = "Tidak ada hasil yang ditemukan!";
                } else{
                    CreateTable(data);
                }

                if(data.length === 10){
                    this.toggleShow("nextButton");
                } else{
                    this.toggleHide("nextButton");
                }
            }
        });
    }

    render(){
        return (
			<div>
            <div className="Home" background-color="#282c34">
                <title>ITB NIM Finder</title>
                <header className="Home-header">
                    
                    <h2 align="center">ITB NIM Finder - Hendpraz</h2>
                </header>
                <div className="Home-body">
                    <form className="Search" onSubmit = {this.onSearch}>
                        <input 
                            name="query"
                            placeholder="Masukkan Nama/NIM"
                            type="text"
                            onChange={this.onChange}
                        />
                        <button type="submit">Search</button>
                    </form>
                    <p id="notfound">
    
                    </p>
                    
                    <table id="tableID">
                        
                    </table>
                </div>
                
            </div>
            <div className="Bottom">
				<button id="prevButton" className="pagination" onClick={this.prevPage}>PREV</button><button id="nextButton" className="pagination" onClick={this.nextPage}>NEXT</button>
				<br />
				<br />
				<footer className="Home-footer">
                        Masukkan Nama atau NIM. Salah satu saja<br />
                        Contoh "Hendry", "13517105"<br />
                </footer>
            </div>
            </div>
        );    
    }
}

export default Home;
