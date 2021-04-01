import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";

class CommentForm extends Component {

  state = {
    author_write_comment_ID: "",
    comment: "",
    currentPostID: "",
    postAuthorID: ""
  }

  componentDidMount = () => {
    const { authorID, postID, postAuthorID } = this.props;
    this.setState({
      author_write_comment_ID: authorID.authorID,
      currentPostID: postID,
      postAuthorID: postAuthorID
    });
  }

  handlePostComment = async () => {
    const { author_write_comment_ID, comment, currentPostID, postAuthorID } = this.state;
    await axios.post(`service/author/${postAuthorID}/posts/${currentPostID}/comments/`, { author_write_comment_ID, comment },
      {
        auth: {
          username: "socialdistribution_t18",
          password: "c404t18"
        }
      });
    window.location = this.props.location;
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