import React, { Component } from "react";
import { Button } from "@material-ui/core";
import { connect } from 'react-redux';
import axios from 'axios';

class CommentCard extends Component {

  state = {
    like_button_text: "like"
  }

  // this componentDidMount executes after the component is rendered
  componentDidMount = async () => {

  }

  likeCommentClick = async () => {
    var post_information = {
      "summary": "comment",
      "type": "like",
      "author_like_ID": "",
      "commentID": "",
      "postID": ""
    }
    post_information['author_like_ID'] = this.props.authorID.authorID

    if ("commentID" in this.props.content) {
      post_information['commentID'] = this.props.content.commentID
      post_information['postID'] = this.props.content.postID
      var comment_author_information = this.props.content.author_write_comment_ID
    } else {
      // remote comment
      post_information['commentID'] = this.props.content.id
      post_information['postID'] = this.props.postID
      var comment_author_information = this.props.content.author.id
    }

    try {
      let doc = await axios.post(`service/author/${comment_author_information}/inbox/`, post_information,
        {
          auth: {
            username: "socialdistribution_t18",
            password: "c404t18"
          }
        })
      if (doc.status === 200) {
        console.log(doc)
        this.setState({ like_button_text: "liked" });
      }
    } catch (err) {
      console.log(err.response.status)
    }

  }

  render() {
    return (
      <div style={{ margin: 10, border: "solid 1px black" }}>
        <p>{this.props.content.comment}</p>
        <Button color="primary" onClick={this.likeCommentClick}>{this.state.like_button_text}</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(CommentCard);
