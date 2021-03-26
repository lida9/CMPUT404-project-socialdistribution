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

  getShareText = () => {
    if (this.props.post.visibility === "PUBLIC") {
      return "everyone";
    } else {
      return "friends"
    }
  }

  reshare = async (authorID) => {
    if (this.props.post.visibility === "PUBLIC") {
      // get logged in author's followers
      var res = await axios.get(`service/author/${authorID}/followers/`);
    } else {
      // get logged in author's friends
      var res = await axios.get(`service/author/${authorID}/friends/`);
    }
    var authors = res.data.items;
    for (let author of authors) {
      // only send to local author's inbox
      if ("authorID" in author) {
        let data = { "type": "post", "postID": this.props.post.postID};
        axios.post(`service/author/${author.authorID}/inbox/`, data);
      }
    }
  }

  render() {
    var login_id = this.props.post.author.authorID;
    var author_id = this.props.authorID.authorID;

    if (this.props.post.visibility === "FRIEND"){
      if (login_id === author_id){
        var visible = true;
      }else{
        var visible = false;
      }
    }else{
      var visible = true;
    }

    return (
      <div style={{ border: "solid 1px grey" }}>
        <Button color="primary" variant="outlined" className="reshareBtn" style={{ margin: 5 }}
          onClick={() => this.reshare(author_id)}>
            Reshare with {this.getShareText()}
        </Button>
        
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
                    visible? 
                    <div key={index}>
                      <CommentCard content={comment} />
                    </div>:null
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
