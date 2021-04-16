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
      let doc = await axios.post(`service/author/${post_author_id}/inbox/`, post_information, { auth: { username: "socialdistribution_t18", password: "c404t18" } })
      if (doc.status === 200) {
        window.location = '/aboutme'
        this.setCookie("click", post_id);
      }
    } catch (err) {
      console.log(err.response.status)
    }
  }
  //set Cookie and check if clicked if referenced from 
  //https://stackoverflow.com/questions/22279372/javascript-for-keeping-buttons-disabled-even-after-refreshing
  //author: Gaurang Tandon
  setCookie = (name, post_id) => {
    // Set cookie to `namevalue;`
    // Won't overwrite existing values with different names
    var insert_array = name + "=" + post_id + '==';
    document.cookie += insert_array;
    // document.cookie += insert_array;
  }

  checkIfClicked = () => {
    // Split by `;`

    var cookie = document.cookie.split("==");
    // iterate over cookie array
    var posts = {};
    for (var i = 0; i < cookie.length; i++) {
      var c = cookie[i];
      // if it contains string "click"

      if (/click/.test(c)) {
        c = c.split("=");
        var name = c[0];
        var post_id = c[1];
        posts[post_id] = name;

      }

    }
    // cookie does not exist
    return posts;
  }

  renderPostContent = () => {
    // var clicked = this.checkIfClicked();
    // if (clicked === true){
    //   this.props.state.like_button_text = "you have liked!";
    // }
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
        let doc = await axios.delete(`service/author/${post_author_id}/posts/${post_id}/`, { auth: { username: "socialdistribution_t18", password: "c404t18" } })
        if (doc.status === 200) {
          window.location = '/aboutme'
        }
      } catch (err) {
        console.log(err.response.status)
      }
    }
  }

  render() {
    // console.log("this.props.post.postID:", this.props.post.postID);
    var clicked_posts = this.checkIfClicked();
    for (var key in clicked_posts) {
      if (key === this.props.post.postID) {
        var clicked = true;
      }
    }
    var login_id = this.props.post.author.authorID;
    var author_id = this.props.authorID.authorID;

    if (this.props.post.visibility === "FRIEND") {
      if (login_id === author_id) {
        var visible = true;
      } else {
        var visible = false;
      }
    } else {
      var visible = true;
    }

    return (
      <div style={{ border: "solid 1px grey" }}>
        <h1>Title: {this.props.post.title}</h1>
        <h2>Description: {this.props.post.description}</h2>
        Content: {this.renderPostContent()}
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.likepostClick} disabled={clicked === true}>{this.state.like_button_text}</Button>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.ShowEdit}>edit post</Button>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.handleShowComments}>{this.state.showComments ? "Close" : "Show Comments"}</Button>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.deletepostClick}>Delete</Button>
        <br />
        {
          this.state.showComments ?
            <div>
              <CommentForm postID={this.props.post.postID} postAuthorID={this.props.post.authorID} location={"/aboutme"} />
              {
                this.props.post.comment_list.map((comment, index) => {

                  return (
                    visible ?
                      <div key={index}>
                        <CommentCard content={comment} postID={""} />
                      </div> : null
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