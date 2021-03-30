import React, { Component } from "react";
import "../../styles/CommentNoteCard.css";

// This component is used to display the like
class CommentNoteCard extends Component {
  render() {
    return (
      <div id='comment-object' style={{ border: "solid 1px grey" }}>
        {this.props.comment.summary}
      </div>
    )
  }
}

export default CommentNoteCard;