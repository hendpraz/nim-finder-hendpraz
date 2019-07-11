import React, {Component} from 'react';

class Table extends Component{
    constructor(props){
        super(props);
        this.generateTableHead = this.generateTableHead.bind(this);
        this.generateTable = this.generateTable.bind(this);
        this.tableCreate = this.tableCreate.bind(this);
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

    tableCreate(){
        let table = document.querySelector("table");
        let cols = Object.keys(this.props.data[0]);
        this.generateTable(table, this.props.data); // generate the table first
        this.generateTableHead(table); // then the head
    }

    render(){
        if(this.props.data.length !== 0){
            this.tableCreate(this.props.data);
        }
        return(
            <table id="tableID">

            </table>
        );
    }
}

export default Table;