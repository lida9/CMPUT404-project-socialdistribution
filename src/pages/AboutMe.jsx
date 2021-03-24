import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import UserHeader from '../components/headers/UserHeader';
import PostForm from "../components/posts/PostForm";
import UpdateProfileForm from '../components/profile/UpdateProfileForm';
import PostCard from '../components/posts/PostCard';

class AboutMe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      userPosts: []
    }
  }

  componentDidMount = async () => {
    const { authorID } = this.props;
    console.log("authorID in AboutMe (componentDidMount):", authorID);
    if (authorID) {
      const doc = await axios.get(`service/author/${authorID.authorID}/`);
      this.setState({ currentUser: doc.data })
      this.getPosts();
    }
  }

  getPosts = async () => {
    const { authorID } = this.props;
    const doc = await axios.get(`service/author/${authorID.authorID}/posts/`);
    this.setState({ userPosts: doc.data.posts });
  }

  render() {
    const { currentUser, userPosts } = this.state;
    return (
      <>
        {
          currentUser !== null ? <UserHeader currentUser={currentUser} /> : null
        }
        <UpdateProfileForm />
        <PostForm getPosts={this.getPosts} />
        <hr />
        <div style={{ margin: 10 }}>
          {currentUser !== null ? <a href="/author/followerfriends" title="follower"><i className="fas fa-user-friends fa-2x"></i></a> : null}
        </div>
        <div>
          {
            userPosts.length !== 0 ?
              userPosts.map((post, index) => {
                return <PostCard key={index} post={post} />
              })
              :
              null
          }
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(AboutMe);