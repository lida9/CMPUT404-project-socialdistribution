import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PostCard from "../components/posts/PostCard";

class UnlistedPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unlistedPost: null
    };
  }

  componentDidMount = async () => {
    const { authorID } = this.props;
    if (authorID) {
      const doc = await axios.get(`/service/author/${authorID.authorID}/posts/${this.props.match.params.id}/`, {
        auth: {
          username: "socialdistribution_t18",
          password: "c404t18"
        }
      });
      console.log(doc.data);
      this.setState({ unlistedPost: doc.data });
    }
  }

  render() {
    const { unlistedPost } = this.state;
    return (
      <>
        {
          unlistedPost ? <PostCard post={unlistedPost} /> : null
        }

      </>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})


export default connect(mapStateToProps)(UnlistedPost);