import React, { Component } from "react";
import "./Home.css";
import { GetData } from "../../services/GetData";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      currQuery: "",
      pageNum: 0,
      currentData: [],
      numOfTotalData: 0,
      matches: window.matchMedia("(min-width: 768px)").matches,
    };
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.loadMore = this.loadMore.bind(this);
    this.searchQuery = this.searchQuery.bind(this);

    this.toggleHide = this.toggleHide.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  // Lifecycle
  componentDidMount() {
    const handler = (e) => this.setState({ matches: e.matches });
    window.matchMedia("(min-width: 768px)").addEventListener("change", handler);
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

    this.setState({
      currentData: [],
    });
  }

  //Actions taken if user clicked Search button
  onSearch = (event) => {
    event.preventDefault();

    const query = this.state.query;
    var queryURL =
      "https://07qw5uk5i4.execute-api.ap-southeast-1.amazonaws.com/mahasiswa?query=";

    //Clear search results (table or "not found")
    var parent = document.getElementById("tableID");
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }

    if (query === "") {
      return;
    }

    //Create URL for query
    queryURL = queryURL + query + "&page=0";
    this.setState({
      currQuery: queryURL.slice(0, queryURL.length - 1),
      pageNum: 0,
      isLoading: true,
    });

    this.toggleHide("loadMoreButton");

    this.clearTable();

    this.searchQuery(queryURL);
  };

  loadMore = (event) => {
    event.preventDefault();

    let temp = this.state.pageNum + 1;

    let queryURL = this.state.currQuery + temp.toString();
    this.searchQuery(queryURL);

    this.setState({
      pageNum: temp,
      isLoading: true,
    });
  };

  searchQuery(queryURL) {
    GetData(queryURL).then((result) => {
      var responseJson = result;
      if (responseJson.status !== "OK") {
        alert("Something wrong!");
        let myString = JSON.stringify(result);
        alert(myString);
      } else {
        let payload = responseJson.payload;
        var data = this.state.currentData;
        var newDataLength = 0;
        for (var i = 0; i < payload.length; i++) {
          data.push(JSON.parse(JSON.stringify(payload[i])));
          newDataLength++;
        }

        this.setState({
          currentData: data,
          numOfTotalData: responseJson.total,
          isLoading: false,
        });

        const isLastPage =
          this.state.numOfTotalData / 10 - 1 === this.state.pageNum;

        if (newDataLength === 10 && !isLastPage) {
          this.toggleShow("loadMoreButton");
        } else {
          this.toggleHide("loadMoreButton");
        }
      }
    });
  }

  renderData(data) {
    let widgets = [];

    for (let element of data) {
      const name = element["name"];
      const nim_tpb = element["nim_tpb"];
      const nim_jur = element["nim_jur"];
      const prodi = element["prodi"];

      widgets.push(
        <div key={element["nim_jur"]} className="mahasiswa-item">
          <div
            style={{
              textAlign: "left",
              paddingTop: "0.5em",
              paddingBottom: "0.5em",
              paddingLeft: "0.5em",
            }}
          >
            <div>
              <span style={{ fontWeight: "bold", fontSize: 16 }}>{name}</span>
              <div style={{ fontWeight: "normal", marginTop: 4 }}>
                {nim_jur}
                {nim_jur !== nim_tpb ? " - " + nim_tpb : ""} - {prodi}
              </div>
            </div>
          </div>
          <hr style={{ margin: 0 }} />
        </div>
      );
    }

    return widgets;
  }

  render() {
    return (
      <div className="Home">
        <div className="home-container">
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            ITB NIM Finder
          </div>

          {this.state.matches ? (
            <div
              style={{
                fontSize: "24px",
                fontWeight: "normal",
                marginBottom: "20px",
              }}
              className="Home-intro"
            >
              <span style={{ fontSize: "18px" }}>
                Lengkap dari angkatan 2011 hingga 2024, termasuk mahasiswa S1,
                S2 dan S3.
              </span>
            </div>
          ) : (
            <div style={{ height: 20 }}></div>
          )}
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
                width: "90%",
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
              {this.state.currQuery &&
                this.state.currentData.length === 0 &&
                !this.state.isLoading && (
                  <div id="notfound">Tidak ada hasil yang ditemukan!</div>
                )}

              {this.state.isLoading && this.state.pageNum === 0 && (
                <div id="loading">Loading...</div>
              )}

              <table id="tableID"></table>

              {this.state.currQuery && this.state.currentData.length > 0 && (
                <div style={{ marginTop: "4px" }}>
                  Menampilkan{" "}
                  {10 * (this.state.pageNum + 1) <= this.state.numOfTotalData
                    ? 10 * (this.state.pageNum + 1)
                    : this.state.numOfTotalData}{" "}
                  dari {this.state.numOfTotalData} hasil.
                  <div style={{ height: 6 }}></div>
                </div>
              )}

              {this.state.currentData.length > 0 &&
                this.renderData(this.state.currentData)}
            </div>
          </div>
        </div>
        <div className="Bottom">
          <button
            id="loadMoreButton"
            className="pagination"
            onClick={(event) => {
              if (this.state.isLoading) return;

              this.loadMore(event);
            }}
            style={
              this.state.isLoading
                ? {
                    backgroundColor: "#f1f1f1",
                    color: "grey",
                    border: "1px solid darkgrey",
                    cursor: "not-allowed",
                  }
                : {}
            }
          >
            Load More...
          </button>

          {!this.state.currQuery && (
            <footer className="Home-footer">
              <span>
                <br />
                <br />
                Hasil pencarian akan muncul di sini.
                <br />
                <br />
              </span>
              <br />
            </footer>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
