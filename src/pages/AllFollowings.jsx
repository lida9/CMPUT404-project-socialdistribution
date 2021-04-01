import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import FollowingCard from "../components/followings/FollowingCard";

class AllFollowings extends Component {
  state = {
    followings: []
  }

  componentDidMount = async () => {
    const { authorID } = this.props;
    console.log("Current user: ", authorID);
    if (authorID) {
      await this.getFollowings();
    }
  }

  getFollowings = async () => {
    const { authorID } = this.props;
    const doc = await axios.get(`/service/author/${authorID.authorID}/followings/`, {
      auth: {
        username: "socialdistribution_t18",
        password: "c404t18"
      }
    });
    console.log("Followings:", doc.data.items);
    this.setState({ followings: doc.data.items });
  }

  removeFollowing = async (followingId) => {
    const { authorID } = this.props;
    if (authorID) {
      // await axios.delete(`/service/author/${authorID.authorID}/unfollow/${followingId}/`);
      await axios.delete(`/service/author/${followingId}/followers/${authorID.authorID}/`, {
        auth: {
          username: "socialdistribution_t18",
          password: "c404t18"
        }
      });
      await this.getFollowings();
    }
  }

  render() {
    const { followings } = this.state;
    return (
      <>
        <h1 style={{ margin: 10 }}>You are following</h1>
        <br />
        {
          followings.length !== 0 ?
            followings.map((following, index) => <FollowingCard key={index} following={following} removeFollowing={this.removeFollowing} />)
            :
            null
        }
      </>
    )
  }
}
const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(AllFollowings);