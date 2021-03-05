import React, { Component } from 'react'
import { Button } from "@material-ui/core"
import axios from 'axios';

class AuthorCard extends Component {
  follow = async () => {

  }

  render() {
    return (
      <div style={{ border: "solid 1px grey" }}>
        <p>Description: {this.props.author.displayName}</p>
        <Button color="primary" variant="outlined" style={{ margin:5 }} onClick={this.follow}>follow</Button>
      </div>
    )
  }
}

export default AuthorCard;