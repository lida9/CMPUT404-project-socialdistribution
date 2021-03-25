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
    if (authorID) {
      await this.getFollowings();
    }
  }

  getFollowings = async () => {
    const { authorID } = this.props;
    const doc = await axios.get(`/service/author/${authorID.authorID}/followings/`);
    console.log("Followings:", doc.data.items);
    this.setState({ followings: doc.data.items });
  }

  removeFollowing = async (followingId) => {
    const { authorID } = this.props;
    if (authorID) {
      console.log("delete this following: ", followingId);
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