import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";

class FollowerCard extends Component {
  getFollowerID = () => {
    if ("authorID" in this.props.follower) {
      return this.props.follower.authorID;
    } else {
      return this.props.follower.id;
    }
  }

  render() {
    return (
      <div style={{ border: "solid 1px", margin: 10 }}>
        <div style={{ margin: 5 }}>
          <h3>Follower's Name: {this.props.follower.displayName}</h3>
          <p>Follower's ID: {this.getFollowerID()}</p>
        </div>
        <Button
          style={{ margin: 10 }}
          variant="outlined"
          color="primary"
          onClick={() => { this.props.removeFollower(this.getFollowerID()) }}>
          Remove
         </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(FollowerCard);