import React, { Component } from "react";

class CommentCard extends Component {

  state = {}

  // this componentDidMount executes after the component is rendered
  componentDidMount = async () => {

  }

  render() {
    return (
      <div style={{ margin: 10, border: "solid 1px black" }}>
        <p>{this.props.content.comment}</p>
      </div>
    );
  }
}

export default CommentCard;
