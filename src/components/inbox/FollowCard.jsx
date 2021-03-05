import React, { Component } from "react";
import "../../styles/followCard.css";

// This component is used to display the friend request
class FollowCard extends Component {
  render() {
    return (
      <div id='follow-object' style={{ border: "solid 1px grey" }}>
        {this.props.like.summary}
      </div>
    )
  }
}

export default FollowCard;
