import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import { connect } from "react-redux";
import "../../styles/postForm.css";
import axios from "axios";

class PostForm extends Component {
  state = {
    show: false,
    title: "",
    source: "http://hello.com",
    origin: "http://hh.com",
    description: "",
    contentType: "text/plain",
    content: "",
    visibility: "PUBLIC",
    unlisted: false,
  }

  componentDidMount = () => {
    console.log("authorID in PostForm (componentDidMount): ", this.props.authorID);
  }

  handleShow = () => {
    const { show } = this.state;
    this.setState({ show: !show });
  }

  sendToFollowers = async (authorID, postID) => {
    // get followers
    var res = await axios.get(`service/author/${authorID}/followers/`);
    var followers = res.data.items;
    for (let follower of followers) {
      // send to follower's inbox
      let splitUrl = follower.id.split("/");
      let followerID = splitUrl[splitUrl.length - 1];
      let data = { "type": "post", "postID": postID };
      axios.post(`service/author/${followerID}/inbox/`, data);
    }
  }

  handlePost = async () => {
    const {
      title,
      source,
      origin,
      description,
      contentType,
      content,
      visibility,
      unlisted } = this.state;

    const { authorID } = this.props;
    if (title && description && content) {
      try {
        var res = await axios.post(`service/author/${authorID.authorID}/posts/`, { title, source, origin, description, contentType, content, visibility, unlisted });
        this.setState({ show: false });
        // window.location = "/aboutme";
        this.props.getPosts();
        this.sendToFollowers(authorID.authorID, res.data.postID);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert("Cannot be empty !");
    }

  }

  render() {
    const { show, title, description, content } = this.state;

    return (
      <div>
        {
          this.props.authorID !== null ?
            <div id="form-control">
              <Button
                id="show-btn"
                variant="outlined"
                color="primary"
                className="btn"
                onClick={this.handleShow}
              >
                {show ? "Cancel" : "Create Post"}
              </Button>
              {
                show ?
                  <div id="post-form">
                    <h4>New Post</h4>
                    <TextField
                      style={{ width: 300 }}
                      id="post-title"
                      label="Title"
                      value={title}
                      onChange={(e) => this.setState({ title: e.target.value })}
                    /><br />
                    <TextField
                      style={{ width: 300 }}
                      id="post-description"
                      label="Description"
                      value={description}
                      onChange={(e) => this.setState({ description: e.target.value })}
                    /><br />
                    <TextField
                      style={{ width: 350 }}
                      id="post-content"
                      label="Content"
                      multiline
                      rows={5}
                      value={content}
                      onChange={(e) => this.setState({ content: e.target.value })}
                    /><br />

                    <label>Content Type:</label>
                    <select onChange={(e) => { this.setState({ contentType: e.target.value }) }}>
                      <option value="text/plain">text/plain</option>
                      <option value="text/markdown">text/markdown</option>
                    </select>

                    <label>Visibility:</label>
                    <select onChange={(e) => { this.setState({ visibility: e.target.value }) }}>
                      <option value="PUBLIC">PUBLIC</option>
                      <option value="FRIEND">FRIEND</option>
                    </select>

                    <Button
                      id="post-btn"
                      style={{ marginTop: 15 }}
                      variant="outlined"
                      color="primary"
                      onClick={this.handlePost}
                    >
                      Post
                    </Button>
                  </div>
                  :
                  null
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

export default connect(mapStateToProps)(PostForm);