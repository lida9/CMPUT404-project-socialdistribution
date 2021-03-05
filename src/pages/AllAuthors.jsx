import React, { Component } from 'react';
import axios from "axios";
// import {connect} from "react-redux";

class AllAuthors extends Component {

  state = {
    allAuthors: [],
  }

  componentDidMount = async () => {
    const doc = await axios.get("service/author/");
    const data = doc.data;
    console.log("all author: ", data);
    // console.log(data[0].id.split("/"));
    for(var i = 0; i <= data.length; i = i + 1){
      this.state.allAuthors.push(i)
    }


  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

export default AllAuthors;