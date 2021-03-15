import React, { Component } from "react";
import { connect } from 'react-redux';
import axios from 'axios';
import { Button } from "@material-ui/core"
import ReactMarkDown from "react-markdown";
import CommentCard from "../comments/CommentCard";
import CommentForm from "../comments/CommentForm";
import PostEditForm from "../posts/PostEditForm";
import "../../styles/postCard.css";

// This component is used to display the Post
class PostCard extends Component {
  state = {
    title: "",
    source: "http://hello.com",
    origin: "http://hh.com",
    description: "",
    contentType: "",
    content: "",
    visibility: "",
    unlisted: false,
    like_button_text: "Like Post",
    showComments: false,
    showEditForm: false,
  }

  likepostClick = async () => {
    var author_url = this.props.post.author.id
    var author_data = author_url.split("/")
    var post_author_id = author_data[4]
    var login_author_id = this.props.authorID.authorID
    var post_id = this.props.post.postID

    var post_information = {
      "summary": "post",
      "type": "like",
      "author_like_ID": login_author_id,
      "postID": post_id
    }
    try {
      let doc = await axios.post(`service/author/${post_author_id}/inbox/`, post_information)
      if (doc.status === 200) {
        console.log(doc)
        this.setState({ like_button_text: "you have liked!" });
      }
    } catch (err) {
      console.log(err.response.status)
    }
  }

  renderPostContent = () => {
    const { contentType } = this.props.post;
    console.log(contentType);
    switch (contentType) {
      case "text/markdown":
        return <ReactMarkDown>{this.props.post.content}</ReactMarkDown>;
      case "image/png;base64":
      case "image/jpeg;base64":
        return <div><img class="imagePreview" src={this.props.post.content} alt="Unavailable" /></div>
      default:
        return <p>{this.props.post.content}</p>
    }
  }

  ShowEdit = () => {
    const { showEditForm } = this.state;
    this.setState({ showEditForm: !showEditForm });
  }

  handleShowComments = () => {
    const { showComments } = this.state;
    this.setState({ showComments: !showComments })
  }

  deletepostClick = async () => {
    var login_author_id = this.props.authorID.authorID
    var post_author_id = this.props.post.authorID
    var post_id = this.props.post.postID
    if (login_author_id !== post_author_id) {
      window.alert("you cannot delete this post")
    } else {
      try {
        let doc = await axios.delete(`service/author/${post_author_id}/posts/${post_id}/`)
        if (doc.status === 200) {
          console.log(doc)
          window.location = '/aboutme'
        }
      } catch (err) {
        console.log(err.response.status)
      }
    }
  }

  render() {
    // console.log("this.props.post.postID:", this.props.post.postID);
    return (
      <div style={{ border: "solid 1px grey" }}>
        <h1>Title: {this.props.post.title}</h1>
        <h2>Description: {this.props.post.description}</h2>
        Content: {this.renderPostContent()}
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.likepostClick}>{this.state.like_button_text}</Button>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.ShowEdit}>edit post</Button>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.handleShowComments}>{this.state.showComments ? "Close" : "Show Comments"}</Button>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.deletepostClick}>Delete</Button>

        <br />
        {
          this.state.showComments ?
            <div>
              <CommentForm postID={this.props.post.postID} location={"/aboutme"}/>
              {
                this.props.post.comment_list.map((comment, index) => {
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
        {
          this.state.showEditForm ? <PostEditForm postID={this.props.post.postID} /> : null
        }

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})


export default connect(mapStateToProps)(PostCard);