import React, { Component } from 'react';
import './Home.css';
import {Redirect} from 'react-router-dom'
import { GetData } from '../../services/GetData';
import Table from './Table';

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            query: '',
            JSONData: [],
            currQuery: '',
            pageNum: 0,
            redirectToReferrer: false
        }
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.logout = this.logout.bind(this);
        this.clearTable = this.clearTable.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    // Lifecycle
    componentWillMount(){
        if(!(sessionStorage.getItem("authToken"))){
            this.setState({redirectToReferrer: true});
        }
    }

    componentDidMount(){
        this.toggleHide();
    }

    //Set value of query
    onChange = (event) =>{
        event.preventDefault();
        this.setState({
            [event.target.name] : event.target.value
        })
        this.clearTable();
        console.log(this.state);
    }

    clearTable(){
        var parent = document.getElementById("tableID");
        while(parent.hasChildNodes()){
            parent.removeChild(parent.firstChild);
        }
    }

    onSearch = event => {
        event.preventDefault();
    
        const query = this.state.query;
        var queryURL = 'https://api.stya.net/nim/';
        this.setState({
            pageNum: 0
        })

        //Clear search results (table or "not found")
        this.toggleHide();
        this.clearTable();
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
        const token = sessionStorage.getItem("authToken");
        GetData(queryURL, token).then((result) =>{
            var responseJson = result;
            if(responseJson.status !== "OK"){
                alert("Something wrong!");
                let myString = JSON.stringify(result);
                alert(myString);
                this.setState({
                    redirectToReferrer: true
                });
            } else{
                let payload = responseJson.payload;
                var data = [];
                for (var i=0;i<payload.length;i++) {
                    data.push(JSON.parse(JSON.stringify(payload[i])));
                }
                //Check the data of payload
                if(data.length === 0){
                    this.clearTable();
                    console.log("HAHA");
                    document.getElementById("notfound").innerHTML = "Tidak ada hasil yang ditemukan!";
                    this.setState({
                        JSONData : []
                    })
                } else{
                    this.clearTable();
                    let temp = queryURL + '&page=' + this.state.pageNum.toString()
                    this.setState({
                        JSONData : data,
                        currQuery : temp.slice(0,temp.length-1)
                    })
                    if(data.length === 10){
                        this.toggleShow();
                    } else{
                        this.toggleHide();
                    }
                }
            }
        });
    };

    toggleHide(){
        var x = document.getElementById("nextButton");
        x.style.display = "none";
    }

    toggleShow(){
        var x = document.getElementById("nextButton");
        x.style.display = "block";
    }

    nextPage = event =>{
        event.preventDefault();

        this.setState({
            pageNum: this.state.pageNum + 1
        })
        this.clearTable();

        var queryURL = this.state.currQuery + this.state.pageNum.toString();
        const token = sessionStorage.getItem("authToken");
        GetData(queryURL, token).then((result) =>{
            var responseJson = result;
            if(responseJson.status !== "OK"){
                alert("Something wrong!");
            } else{
                let payload = responseJson.payload;
                var data = [];
                for (var i=0;i<payload.length;i++) {
                    data.push(JSON.parse(JSON.stringify(payload[i])));
                }
                //Check the data of payload
                if(data.length === 0){
                    this.clearTable();
                    document.getElementById("notfound").innerHTML = "Tidak ada hasil yang ditemukan!";
                    this.setState({
                        JSONData : []
                    });
                    this.toggleHide();
                } else{
                    this.clearTable();
                    this.setState({
                        JSONData : data
                    })
                    if(data.length === 10){
                        this.toggleShow();
                    } else{
                        this.clearTable();
                        this.setState({
                            pageNum : 0
                        })
                        this.toggleHide();
                    }
                }
            }
        });
    }

    logout(){
        sessionStorage.setItem("authToken",'');
        sessionStorage.clear();
        this.setState({redirectToReferrer: true});
    }

    render(){
        if (this.state.redirectToReferrer) {
            return (<Redirect to={'/login'}/>);
        }
        
        return (
        <div className="Home" background-color="#282c34">
            <header className="Home-header">
                <h2 align="center">ITB NIM Finder</h2>
            </header>
            <body id="bodypart" className="Home-body">
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
                
                <button id="nextButton" onClick={this.nextPage}>NEXT</button>
                <br />
                <Table id="tableID" data={this.state.JSONData}/>
                <br />
            </body>
            <footer className="Home-footer">
                    Masukkan Nama atau NIM. Salah satu saja<br />
                    Contoh "Hendry", "13517105"<br />
                    <button onClick = {this.logout}>Logout</button>
            </footer>
        </div>
        );
    }
}

export default Home;