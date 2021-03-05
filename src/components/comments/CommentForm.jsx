import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";

class CommentForm extends Component {

  state = {
    author_write_comment_ID: "",
    comment: "",
    currentPostID: "",
  }

  componentDidMount = () => {
    const { authorID, postID } = this.props;
    this.setState({
      author_write_comment_ID: authorID.authorID,
      currentPostID: postID
    });
  }

  handlePostComment = async () => {
    const { author_write_comment_ID, comment, currentPostID } = this.state;
    // console.log(author_write_comment_ID, comment);
    // console.log(currentPostID === this.props.postID);
    await axios.post(`service/author/${author_write_comment_ID}/posts/${currentPostID}/comments/`, { author_write_comment_ID, comment });
    window.location = "/aboutme"
  }

  render() {
    const { comment } = this.state;
    return (
      <div style={{ background: "#C0C0C0" }}>
        <h2>New Comment</h2>
        <TextField
          label="Comment"
          value={comment}
          fullWidth
          onChange={(e) => this.setState({ comment: e.target.value })}
        />
        <br />
        <br />
        <Button
          color="primary"
          variant="outlined"
          onClick={this.handlePostComment}
        >
          post
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(CommentForm);