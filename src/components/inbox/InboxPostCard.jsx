import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from 'react-redux';
import axios from 'axios';
import { Button } from "@material-ui/core"
import ReactMarkDown from "react-markdown";
import CommentCard from "../comments/CommentCard";
import CommentForm from "../comments/CommentForm";
import AuthorLike from "../authors/AuthorLike";
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
    comments: [],
    showModal: false,
    likes: []
  }

  likepostClick = async () => {
    var author_url = this.props.post.author.id;
    if (author_url.includes("/")) {
      var author_data = author_url.split("/");
      var post_author_id = author_data[4];
    } else {
      var post_author_id = author_url
    }

    var login_author_id = this.props.authorID.authorID;
    if ("postID" in this.props.post) {
      var post_id = this.props.post.postID;
    } else {
      var post_id = this.props.post.id;
    }

    var post_information = {
      "summary": "post",
      "type": "like",
      "author_like_ID": login_author_id,
      "postID": post_id,
    }
    try {
      let doc = await axios.post(`service/author/${post_author_id}/inbox/`, post_information,
        {
          auth: {
            username: "socialdistribution_t18",
            password: "c404t18"
          }
        })
      if (doc.status === 200) {
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
    const post = this.props.post;
    if ("postID" in post) {
      try {
        const res = await axios.get(`service/author/${post.author.authorID}/posts/${post.postID}/comments/`,
          {
            params: { page: page },
            auth: {
              username: "socialdistribution_t18",
              password: "c404t18"
            }
          });
        this.setState({ comments: res.data.comments });
      } catch (e) {
        console.log(e);
      }
    } else {
      this.setState({ comments: post.comments });
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

  getPostID = () => {
    if ("postID" in this.props.post) {
      return this.props.post.postID
    }
    return this.props.post.id
  }

  getPostAuthorID = () => {
    if ("postID" in this.props.post) {
      return this.props.post.authorID;
    }
    return this.props.post.author.id;
  }

  checkLikes = async () => {
    var post_author_id = this.props.post.authorID
    var post_id = this.props.post.postID
    try{
      let doc = await axios.get(`service/author/${post_author_id}/posts/${post_id}/likes/`, { auth: { username: "socialdistribution_t18", password: "c404t18" } })
      if (doc.status === 200){
        console.log(doc.data);
        var likesArray = []
        for (let like of doc.data) {
          likesArray.push(like.author.displayName);
        }
        this.setState({ likes: likesArray });
      }

    }catch(err){
      console.log(err.response.status)
    }
  }

  getModal = () => {
    this.checkLikes();
    this.setState({ showModal: true});
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  reshare = async (authorID) => {
    if (this.props.post.visibility === "PUBLIC") {
      // get logged in author's followers
      var res = await axios.get(`service/author/${authorID}/followers/`,
        {
          auth: {
            username: "socialdistribution_t18",
            password: "c404t18"
          }
        });
    } else {
      // get logged in author's friends
      var res = await axios.get(`service/author/${authorID}/friends/`,
        {
          auth: {
            username: "socialdistribution_t18",
            password: "c404t18"
          }
        });
    }
    var authors = res.data.items;
    for (let author of authors) {
      if ("postID" in this.props.post) {
        // local post
        var data = { "type": "post", "postID": this.props.post.postID, "authorID": this.props.post.authorID };
      } else {
        // remote post
        var data = { "type": "post", "postID": this.props.post.id, "authorID": this.props.post.author.id };
      }
      if ("authorID" in author) {
        // local
        axios.post(`service/author/${author.authorID}/inbox/`, data,
          {
            auth: {
              username: "socialdistribution_t18",
              password: "c404t18"
            }
          });
      } else {
        // remote
        axios.post(`service/author/${author.id}/inbox/`, data,
          {
            auth: {
              username: "socialdistribution_t18",
              password: "c404t18"
            }
          });
      }
    }
  }

  render() {
    var login_id = this.props.post.author.authorID;
    var author_id = this.props.authorID.authorID;

    if (this.props.post.visibility === "FRIEND") {
      var isfriend = true;
      if (login_id === author_id) {
        var visible = true;
      } else {
        var visible = false;
      }
    } else {
      var visible = true;
      var isfriend = false;
    }

    return (
      <div style={{ border: "solid 1px grey" }}>
      {
        this.props.post.visibility != "PRIVATE" ?
        <Button color="primary" variant="outlined" className="reshareBtn" style={{ margin: 5 }}
          onClick={() => this.reshare(author_id)}>
          Reshare with {this.getShareText()}
        </Button>
          :
          null
      }

        <h1>Author: {this.props.post.author.displayName}</h1>
        <h1>Title: {this.props.post.title}</h1>
        <h2>Description: {this.props.post.description}</h2>
        Content: {this.renderPostContent()}
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.likepostClick}>{this.state.like_button_text}</Button>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.handleShowComments}>{this.state.showComments ? "Close" : "Show Comments"}</Button>
        {
          isfriend ?<Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.getModal}>check likes</Button> : null
        }
        <Modal
          show={this.state.showModal}
          onHide={this.hideModal}
          centered
        >
          <Modal.Body>
            <h4>Who liked this post:</h4>
            <div>
            <hr/>
              {this.state.likes.map(function(name, idx){
                return <AuthorLike key={idx} name={name} />;
              })}
            </div>
          </Modal.Body>

        </Modal>
        {
          this.state.showComments ?
            <div>
              <CommentForm postID={this.getPostID()} postAuthorID={this.getPostAuthorID()} location={"/"} />
              {
                this.state.comments.map((comment, index) => {
                  return (
                    visible ?
                      <div key={index}>
                        <CommentCard content={comment} />
                      </div> : null
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
