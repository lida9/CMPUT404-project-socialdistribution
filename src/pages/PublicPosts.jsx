import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostCard from '../components/publicPosts/PostCard';

class PublicPosts extends Component {
  state = {
    allposts: [],
  }

  componentDidMount = async () => {
    if (this.props.authorID) {
      const doc = await axios.get("/service/allposts/")
      this.setState({ allposts: doc.data.posts })
    } else {
      alert("Log in to see more post")
      console.log("not logged in");
    }
  }

  render() {
    const { allposts } = this.state;
    return (
      <>
        <h1 style={{ padding: 10 }}>Public Posts</h1>
        <div>
          {
            allposts.length !== 0 ?
              allposts.map((post, index) => {
                return <PostCard key={index} post={post} />
              }) : <h4 style={{ padding: 10 }}>No post yet</h4>
          }
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(PublicPosts);