import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import AuthorCard from '../components/authors/AuthorCard';
import { Button, TextField } from '@material-ui/core';

class AllAuthors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      authors: [],
      remoteAuthorId: "",
    }
  }

  componentDidMount = async () => {
    const { authorID } = this.props;
    if (authorID) {
      const author = await axios.get(`service/author/${authorID.authorID}/`);
      const res = await axios.get("service/author/");
      console.log(res.data);
      this.setState({
        currentUser: author.data,
        authors: res.data
      });
    }
  }

  sendRemote = async () => {
    const { remoteAuthorId } = this.state;
    const { authorID } = this.props;
    if (authorID) {
      if (remoteAuthorId) {
        console.log("remoteAuthorId: ", remoteAuthorId);
        let req_body = {
          "type": "follow",
          "new_follower_ID": authorID.authorID
        }

        try {
          const doc = await axios.post(`/service/author/${remoteAuthorId}/inbox/`, req_body);
          if (doc.status === 200) {
            console.log("Success:", doc);
          }
        } catch (err) {
          console.log(err.message);
        }

      } else {
        alert("Cannot be empty!");
      }
    } else {
      console.log("Not Logged in");
    }
  }

  render() {
    const { currentUser, authors, remoteAuthorId } = this.state;
    console.log(authors);
    return (
      <div>
        <TextField
          style={{ width: "60%", margin: 10 }}
          id="remote-author"
          variant="outlined"
          label="Friend AuthorID"
          value={remoteAuthorId}
          onChange={(e) => this.setState({ remoteAuthorId: e.target.value })}
        />
        <Button
          style={{ marginTop: 10 }}
          color="primary"
          variant="outlined"
          onClick={this.sendRemote}
        >
          Send Request
        </Button>
        <div>
          {
            authors.length !== 0 ?
              authors.map((author, index) => {
                if (author.authorID !== this.props.authorID.authorID) {
                  return <AuthorCard key={index} currentUser={currentUser} author={author} />;
                } else {
                  return null;
                }
              })
              :
              null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(AllAuthors);