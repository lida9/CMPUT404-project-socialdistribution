import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import FriendCard from "../components/friends/FriendCard";

class AllFriends extends Component {

  state = {
    friends: []
  };

  componentDidMount = async () => {
    const { authorID } = this.props;
    if (authorID) {
      await this.getFriends();
    }
  }

  removeFriend = async (friendId) => {
    const { authorID } = this.props
    if (authorID) {
      console.log("Remove friend: ", friendId);
      await this.getFriends();
    }
  }

  getFriends = async () => {
    const { authorID } = this.props;
    const doc = await axios.get(`/service/author/${authorID.authorID}/friends/`, {
      auth: {
        username: "socialdistribution_t18",
        password: "c404t18"
      }
    });
    this.setState({ friends: doc.data.items });
  }

  render() {
    const { friends } = this.state;
    return (
      <>
        <h1 style={{ margin: 10 }}>Your Friends</h1>
        <br />
        {
          friends.length !== 0 ?
            friends.map((friend, index) => <FriendCard key={index} friend={friend} removeFriend={this.removeFriend} />)
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

export default connect(mapStateToProps)(AllFriends)