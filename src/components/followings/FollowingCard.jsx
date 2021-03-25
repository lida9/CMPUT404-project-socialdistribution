import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";

class FollowingCard extends Component {
  render() {
    return (
      <div style={{ border: "solid 1px", margin: 10 }}>
        <div style={{ margin: 5 }}>
          <h3>Following's Name: {this.props.following.displayName}</h3>
          <p>Following's ID: {this.props.following.authorID}</p>
        </div>
        <Button
          style={{ margin: 10 }}
          variant="outlined"
          color="primary"
          onClick={() => { this.props.removeFollowing(this.props.following.authorID) }}>
          Delete
         </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})


export default connect(mapStateToProps)(FollowingCard);