import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostCard from '../components/posts/PostCard';

class PublicPosts extends Component {
  state = {
    allposts: [],
  }

  componentDidMount = async () => {
    const doc = await axios.get("/service/allposts/")
    console.log("All public posts: ", doc.data);
    this.setState({ allposts: doc.data.posts })
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
              }) : null
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