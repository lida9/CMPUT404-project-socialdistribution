import React, { Component } from "react";
import { connect } from 'react-redux';
import axios from 'axios';
import { Button } from "@material-ui/core"
import ReactMarkDown from "react-markdown";
import CommentCard from "../comments/CommentCard";
import CommentForm from "../comments/CommentForm";
import "../../styles/postCard.css";

// This component is used to display the Post
class PostCard extends Component {
  state = {
    title: "",
    source: "http://hello.com",
    origin: "http://hh.com",
    description: "",
    contentType: "text/plain",
    content: "",
    visibility: "PUBLIC",
    unlisted: false,
    like_button_text: "like",
    showComments: false,
    comments: []
  }

  likepostClick = async () => {
    var author_url = this.props.post.author.id;
    var author_data = author_url.split("/");
    var post_author_id = author_data[4];
    var login_author_id = this.props.authorID.authorID;
    var post_id = this.props.post.postID;

    var post_information = {
      "summary": "post",
      "type": "like",
      "author_like_ID": login_author_id,
      "postID": post_id,
    }
    try {
      let doc = await axios.post(`service/author/${post_author_id}/inbox/`, post_information)
      if (doc.status == 200) {
        console.log(doc)
        this.setState({ like_button_text: "you have liked!" });
      }
    } catch (err) {
      console.log(err.response.status)
    }
  }

  renderPostContent = () => {
    const { contentType } = this.props.post;
    switch (contentType) {
      case "text/markdown":
        return <ReactMarkDown>{this.props.post.content}</ReactMarkDown>;
      case "image/png;base64":
      case "image/jpeg;base64":
        return <div><img className="imagePreview" src={this.props.post.content} alt="Unavailable" /></div>
      default:
        return <p>{this.props.post.content}</p>
    }
  }

  getComments = async (page = 1) => {
    try {
      const post = this.props.post;
      const res = await axios.get(`service/author/${post.author.authorID}/posts/${post.postID}/comments/`,
        { params: { page: page } });
      this.setState({ comments: res.data.comments });
    } catch (e) {
      console.log(e);
    }
  }

  handleShowComments = () => {
    const { showComments } = this.state;
    if (this.state.showComments === false) {
      this.getComments();
    }
    this.setState({ showComments: !showComments })
  }

  render() {
    return (
      <div style={{ border: "solid 1px grey" }}>
        <h1>Author: {this.props.post.author.displayName}</h1>
        <h1>Title: {this.props.post.title}</h1>
        <h2>Description: {this.props.post.description}</h2>
        Content: {this.renderPostContent()}
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.likepostClick}>{this.state.like_button_text}</Button>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.handleShowComments}>{this.state.showComments ? "Close" : "Show Comments"}</Button>
        {
          this.state.showComments ?
            <div>
              <CommentForm postID={this.props.post.postID} location={"/"} />
              {
                this.state.comments.map((comment, index) => {
                  return (
                    <div key={index}>
                      <CommentCard content={comment} />
                    </div>
                  );
                })
              }
            </div>
            :
            null
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})


export default connect(mapStateToProps)(PostCard);
