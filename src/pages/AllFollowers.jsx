import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import FollowerCard from "../components/followers/FollowerCard";

class AllFollowers extends Component {

  state = {
    followers: []
  }

  componentDidMount = async () => {
    const { authorID } = this.props;
    if (authorID) {
      await this.getFollowers();
    }
  }

  removeFollower = async (followerId) => {
    console.log("Delete this follwer: ", followerId);
    const { authorID } = this.props;
    if (authorID) {
      await axios.delete(`/service/author/${authorID.authorID}/followers/${followerId}/`);
      await this.getFollowers();
    }

  }

  getFollowers = async () => {
    const { authorID } = this.props;
    const doc = await axios.get(`/service/author/${authorID.authorID}/followers/`);
    this.setState({ followers: doc.data.items });
  }

  render() {
    const { followers } = this.state;
    return (
      <>
        <h1 style={{ margin: 10 }}>Your Followers</h1>
        <br />
        {
          followers.length !== 0 ? followers.map((follower, index) => <FollowerCard key={index} follower={follower} removeFollower={this.removeFollower} />) : null
        }
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(AllFollowers);