import React, { Component } from 'react';
import './Home.css';
import { GetData } from '../../services/GetData';
import { PostData } from '../../services/PostData';

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            query: '',
        }
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.generateTableHead = this.generateTableHead.bind(this);
        this.generateTable = this.generateTable.bind(this);
        this.tableCreate = this.tableCreate.bind(this);
        this.login = this.login.bind(this);
    }

    // Lifecycle
    componentWillMount(){
        this.login();
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

    //Generate Table
    generateTableHead(table) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        let key = ["Nama","NIM TPB","NIM Jurusan","Program Studi"]
        for (let i = 0;i<4;i++) {
            let th = document.createElement("th");
            let text = document.createTextNode(key[i]);
            th.appendChild(text);
            row.appendChild(th);
        }
    }

    generateTable(table, cols) {
        for (let element of cols) {
            let row = table.insertRow();
            for (let key in element) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
        }
    }

    tableCreate(data){
        let table = document.querySelector("table");
        this.generateTable(table, data); // generate the table first
        this.generateTableHead(table); // then the head
    }

    //Actions taken if user clicked Search button
    onSearch = event => {
        event.preventDefault();
    
        const query = this.state.query;
        var queryURL = 'https://api.stya.net/nim/';

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
                    this.tableCreate(data);
                }
            }
        });
    };

    render(){
        return (
        <div className="Home" background-color="#282c34">
            <header className="Home-header">
                <h2 align="center">ITB NIM Finder</h2>
            </header>
            <body className="Home-body">
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
                <br />
            </body>
            <footer className="Home-footer">
                    Masukkan Nama atau NIM. Salah satu saja<br />
                    Contoh "Hendry", "13517105"<br />
            </footer>
        </div>
        );
    }
}

export default Home;