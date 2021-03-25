import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";

class FriendCard extends Component {
  render() {
    return (
      <div style={{ border: "solid 1px", margin: 10 }}>
        <div style={{ margin: 5 }}>
          <h3>Friend's Name: {this.props.friend.displayName}</h3>
          <p>Friend's ID: {this.props.friend.authorID}</p>
        </div>
        <Button
          style={{ margin: 10 }}
          variant="outlined"
          color="primary"
          onClick={() => this.props.removeFriend(this.props.friend.authorID)} >
          Delete
          </Button>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})
export default connect(mapStateToProps)(FriendCard);