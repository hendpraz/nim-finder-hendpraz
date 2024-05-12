import React, { Component } from "react";
import "./Home.css";
import { GetData } from "../../services/GetData";
import { CreateTable } from "../../services/GenerateTable";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      currQuery: "",
      pageNum: 0,
    };
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.searchQuery = this.searchQuery.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
  }

  // Lifecycle
  componentDidMount() {
    document.title = "ITB Nim Finder - Hendpraz";
  }

  toggleHide(docId) {
    var x = document.getElementById(docId);
    x.style.display = "none";
  }

  toggleShow(docId) {
    var x = document.getElementById(docId);
    x.style.display = "inline-block";
  }

  //Set value of query
  onChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  clearTable() {
    var parent = document.getElementById("tableID");
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
  }

  //Actions taken if user clicked Search button
  onSearch = (event) => {
    event.preventDefault();

    const query = this.state.query;
    var queryURL =
      "https://07qw5uk5i4.execute-api.ap-southeast-1.amazonaws.com/mahasiswa?query=";

    this.toggleHide("nextButton");
    this.toggleHide("prevButton");

    //Clear search results (table or "not found")
    var parent = document.getElementById("tableID");
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    document.getElementById("notfound").innerHTML = "";

    if (query === "") {
      return;
    }

    //Create URL for query
    queryURL = queryURL + query + "&page=0";
    this.setState({
      currQuery: queryURL.slice(0, queryURL.length - 1),
    });

    this.setState({
      pageNum: 0,
    });

    this.searchQuery(queryURL);
  };

  nextPage = (event) => {
    event.preventDefault();

    let temp = this.state.pageNum + 1;

    let queryURL = this.state.currQuery + temp.toString();
    this.searchQuery(queryURL);
    this.toggleShow("prevButton");
    this.setState({
      pageNum: temp,
    });
  };

  prevPage = (event) => {
    event.preventDefault();

    let temp = this.state.pageNum - 1;

    var queryURL;
    if (temp === 0) {
      queryURL = this.state.currQuery + "0";
      this.toggleHide("prevButton");
    } else {
      queryURL = this.state.currQuery + temp.toString();
    }
    this.searchQuery(queryURL);
    this.toggleShow("nextButton");
    this.setState({
      pageNum: temp,
    });
  };

  searchQuery(queryURL) {
    this.toggleHide("nextButton");
    this.clearTable();
    GetData(queryURL).then((result) => {
      var responseJson = result;
      if (responseJson.status !== "OK") {
        alert("Something wrong!");
        let myString = JSON.stringify(result);
        alert(myString);
      } else {
        let payload = responseJson.payload;
        var data = [];
        for (var i = 0; i < payload.length; i++) {
          data.push(JSON.parse(JSON.stringify(payload[i])));
        }
        //Check the data of payload
        if (data.length === 0) {
          document.getElementById("notfound").innerHTML =
            "Tidak ada hasil yang ditemukan!";
        } else {
          CreateTable(data);
        }

        if (data.length === 10) {
          this.toggleShow("nextButton");
        } else {
          this.toggleHide("nextButton");
        }
      }
    });
  }

  render() {
    return (
      <div className="Home">
        <div className="home-container">
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginTop: "40px",
            }}
          >
            ITB NIM Finder
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "normal",
              marginBottom: "20px",
            }}
          >
            Cari mahasiswa berdasarkan NIM atau Nama.
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "80%",
                maxWidth: "800px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  marginTop: "19px",
                  marginLeft: "12px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="26px"
                  height="26px"
                  viewBox="0 0 122.879 119.799"
                  enable-background="new 0 0 122.879 119.799"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlSpace="preserve"
                  fill="#ababab"
                >
                  <g>
                    <path d="M49.988,0h0.016v0.007C63.803,0.011,76.298,5.608,85.34,14.652c9.027,9.031,14.619,21.515,14.628,35.303h0.007v0.033v0.04 h-0.007c-0.005,5.557-0.917,10.905-2.594,15.892c-0.281,0.837-0.575,1.641-0.877,2.409v0.007c-1.446,3.66-3.315,7.12-5.547,10.307 l29.082,26.139l0.018,0.016l0.157,0.146l0.011,0.011c1.642,1.563,2.536,3.656,2.649,5.78c0.11,2.1-0.543,4.248-1.979,5.971 l-0.011,0.016l-0.175,0.203l-0.035,0.035l-0.146,0.16l-0.016,0.021c-1.565,1.642-3.654,2.534-5.78,2.646 c-2.097,0.111-4.247-0.54-5.971-1.978l-0.015-0.011l-0.204-0.175l-0.029-0.024L78.761,90.865c-0.88,0.62-1.778,1.209-2.687,1.765 c-1.233,0.755-2.51,1.466-3.813,2.115c-6.699,3.342-14.269,5.222-22.272,5.222v0.007h-0.016v-0.007 c-13.799-0.004-26.296-5.601-35.338-14.645C5.605,76.291,0.016,63.805,0.007,50.021H0v-0.033v-0.016h0.007 c0.004-13.799,5.601-26.296,14.645-35.338C23.683,5.608,36.167,0.016,49.955,0.007V0H49.988L49.988,0z M50.004,11.21v0.007h-0.016 h-0.033V11.21c-10.686,0.007-20.372,4.35-27.384,11.359C15.56,29.578,11.213,39.274,11.21,49.973h0.007v0.016v0.033H11.21 c0.007,10.686,4.347,20.367,11.359,27.381c7.009,7.012,16.705,11.359,27.403,11.361v-0.007h0.016h0.033v0.007 c10.686-0.007,20.368-4.348,27.382-11.359c7.011-7.009,11.358-16.702,11.36-27.4h-0.006v-0.016v-0.033h0.006 c-0.006-10.686-4.35-20.372-11.358-27.384C70.396,15.56,60.703,11.213,50.004,11.21L50.004,11.21z" />
                  </g>
                </svg>
              </div>
              <form className="Search" onSubmit={this.onSearch}>
                <input
                  name="query"
                  placeholder="Masukkan Nama/NIM"
                  type="text"
                  onChange={this.onChange}
                />
                <button type="submit">↵</button>
              </form>
              <p id="notfound"></p>

              <table id="tableID"></table>
            </div>
          </div>
        </div>
        <div className="Bottom">
          <button
            id="prevButton"
            className="pagination"
            onClick={this.prevPage}
          >
            PREV
          </button>
          <button
            id="nextButton"
            className="pagination"
            onClick={this.nextPage}
          >
            NEXT
          </button>
          <br />
          <br />
          <footer className="Home-footer">
            {!this.state.currQuery && (
              <span>Hasil pencarian akan muncul di sini.</span>
            )}

            <small>
              <br />
              Note: NIM Finder ini hanya bisa mencari mahasiswa angkatan 2016 ke
              atas.
            </small>
            <br />
            <br />
            <br />
          </footer>
        </div>
      </div>
    );
  }
}

export default Home;
