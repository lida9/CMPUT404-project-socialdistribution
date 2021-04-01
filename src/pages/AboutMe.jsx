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
      const doc = await axios.get(`service/author/${authorID.authorID}/`, { auth: { username: "socialdistribution_t18", password: "c404t18" } });
      this.setState({ currentUser: doc.data })
      this.getPosts();
    }
  }

  getPosts = async () => {
    const { authorID } = this.props;
    const doc = await axios.get(`service/author/${authorID.authorID}/posts/`, { auth: { username: "socialdistribution_t18", password: "c404t18" } });
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
          {
            currentUser !== null ?
              <div>
                <a style={{ marginRight: 100 }} href="/author/followers" title="followers"><i className="fas fa-user-friends fa-2x"></i></a>
                <a style={{ marginRight: 100 }} href="/author/followings" title="followings"><i className="far fa-eye fa-2x"></i></a>
                <a style={{ marginRight: 100 }} href="/author/friends" title="friends"><i className="fas fa-handshake fa-2x"></i></a>
                <a style={{ marginRight: 100 }} href="/author/gitactivities" title="Git activity"><i className="fab fa-github fa-2x"></i></a>
              </div>
              :
              null
          }
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