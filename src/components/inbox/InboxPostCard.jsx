import React, { Component } from "react";
import { connect } from 'react-redux';
import axios from 'axios';
import { Button } from "@material-ui/core"
import ReactMarkDown from "react-markdown";
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
    like_button_text:"like"
  }
  likepostClick= async()=>{
    var author_url = this.props.post.author.id
    var author_data = author_url.split("/")
    var post_author_id = author_data[4]
    var login_author_id = this.props.authorID.authorID
    var post_id = this.props.post.postID

    var post_information = {
      "summary": "post",
      "type":"like",
      "author_like_ID":login_author_id,
      "postID":post_id,
    }
    try{
      let doc = await axios.post(`service/author/${post_author_id}/inbox/`,post_information)
      if(doc.status == 200){
        console.log(doc)
        this.setState({like_button_text :"you have liked!"});
      }
    }catch (err) {
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
        return <div><img class="imagePreview" src={this.props.post.content} alt="Unavailable" /></div>
      default:
        return <p>{this.props.post.content}</p>
    }
  }

  render() {
    return (
      <div style={{ border: "solid 1px grey" }}>
        <h1>Author: {this.props.post.author.displayName}</h1>
        <h1>Title: {this.props.post.title}</h1>
        <h2>Description: {this.props.post.description}</h2>
        Content: {this.renderPostContent()}
         <Button color="primary" variant="outlined" className={"postCardButton"} onClick={this.likepostClick}>{this.state.like_button_text}</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})


export default connect(mapStateToProps)(PostCard);
