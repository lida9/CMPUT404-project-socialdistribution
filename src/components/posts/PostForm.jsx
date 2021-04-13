import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import { connect } from "react-redux";
import "../../styles/postForm.css";
import axios from "axios";

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      title: "",
      source: "http://localhost:3000/",
      origin: "http://localhost:3000/",
      description: "",
      contentType: "text/plain",
      content: "",
      visibility: "PUBLIC",
      unlisted: false,
      imagePreview: null,
      img: null,
      privateToAuthor: "",
    };
    this.onImageChange = this.onImageChange.bind(this);
    this.chooseFile = React.createRef();
  }


  componentDidMount = () => { }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ img: event.target.files[0] }, () => {
        this.setState({ imagePreview: URL.createObjectURL(this.state.img) });
      })
    }
  };
  showOpenFileDlg = () => {
    this.chooseFile.current.click()
  };

  getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise(resolve => {
      reader.onload = e => {
        resolve(e.target.result);
      }
    })
  };

  handleShow = () => {
    const { show } = this.state;
    this.setState({ show: !show });
  }

  sendToFollowers = async (authorID, postID, visibility) => {
    if (visibility === "PUBLIC") {
      // get followers
      var res = await axios.get(`service/author/${authorID}/followers/`, { auth: { username: "socialdistribution_t18", password: "c404t18" } });
    } else {
      // get friends
      var res = await axios.get(`service/author/${authorID}/friends/`, { auth: { username: "socialdistribution_t18", password: "c404t18" } });
    }
    var authors = res.data.items;
    for (let author of authors) {
      let data = { "type": "post", "postID": postID };
      if ("authorID" in author) {
        // local
        axios.post(`service/author/${author.authorID}/inbox/`, data, { auth: { username: "socialdistribution_t18", password: "c404t18" } });
      } else {
        // remote
        axios.post(`service/author/${author.id}/inbox/`, data, { auth: { username: "socialdistribution_t18", password: "c404t18" } });
      }
    }
  }

  handlePost = async () => {
    const { title, source, origin, description, visibility, unlisted } = this.state;
    const { authorID } = this.props;

    if (this.state.contentType === "image") {
      // convert image to base 64
      var base64String = await this.getBase64(this.state.img);
      var contentType = base64String.slice(5).split(",")[0];
      var content = base64String;
    } else {
      var contentType = this.state.contentType;
      var content = this.state.content;
    }

    if (title && description && content) {
      try {
        var res = await axios.post(`service/author/${authorID.authorID}/posts/`, { title, source, origin, description, contentType, content, visibility, unlisted }, { auth: { username: "socialdistribution_t18", password: "c404t18" } });
        this.setState({ show: false });
        console.log("postID(unlisted):", res.data.postID);
        this.props.getPosts();
        if (!unlisted) { // unlisted === false
          this.sendToFollowers(authorID.authorID, res.data.postID, visibility);
        }

        if (unlisted) {
          let msg = "Remember this route! You will not see this again! /post/unlisted/" + res.data.postID;
          alert(msg);
        }

      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert("Cannot be empty !");
    }
  }

  render() {
    const { show, title, description, content, contentType, unlisted, privateToAuthor } = this.state;

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
                    {
                      contentType === "text/plain" || contentType === "text/markdown" ?
                        <div>
                          <TextField
                            style={{ width: 350 }}
                            id="post-content"
                            label="Content"
                            multiline
                            rows={5}
                            value={content}
                            onChange={(e) => this.setState({ content: e.target.value })}
                          /><br />
                        </div>
                        :
                        <div>
                          <Button color="primary" onClick={this.showOpenFileDlg}>Choose Image</Button>
                          <br />
                          <input type="file" ref={this.chooseFile} onChange={this.onImageChange} style={{ display: 'none' }}
                            accept="image/png, image/jpeg" />
                          {this.state.imagePreview ? <div><img className="imagePreview" src={this.state.imagePreview} alt="Unavailable" /></div> : null}
                        </div>
                    }

                    <label>Content Type:</label>
                    <select onChange={(e) => { this.setState({ contentType: e.target.value }) }}>
                      <option value="text/plain">plaintext</option>
                      <option value="text/markdown">markdown</option>
                      <option value="image">image</option>
                    </select>

                    <label>Visibility:</label>
                    <select onChange={(e) => { this.setState({ visibility: e.target.value }) }}>
                      <option value="PUBLIC">PUBLIC</option>
                      <option value="FRIEND">FRIEND</option>
                      <option value="PRIVATE">PRIVATE</option>
                    </select>
                    <label>Unlisted:</label>
                    <input type="checkbox" checked={unlisted} onChange={(e) => this.setState({ unlisted: e.target.checked })} />
                    {
                      this.state.visibility === "PRIVATE" ?
                        <TextField
                          style={{ margin: 10 }}
                          value={privateToAuthor}
                          onChange={(e) => this.setState({ privateToAuthor: e.target.value })}
                          placeholder="private to"
                          variant="filled"
                        />
                        :
                        null
                    }
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