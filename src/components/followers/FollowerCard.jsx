import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";

class FollowerCard extends Component {

  render() {
    return (
      <div style={{ border: "solid 1px", margin: 10 }}>
        <p style={{ overflow: "auto" }}>{JSON.stringify(this.props.follower)}</p>
        <Button
          style={{ margin: 10 }}
          variant="outlined"
          color="primary"
          onClick={() => { this.props.removeFollower(this.props.follower.authorID) }}>
          Delete
         </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(FollowerCard);