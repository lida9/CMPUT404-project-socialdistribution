import React, { Component } from "react";
import LikeCard from './LikeCard';
import InboxPostCard from './InboxPostCard'
import FollowCard from './FollowCard'

// This component is used to display items in inbox
class ObjectCard extends Component {
  
  getRemotePost = (authorID, postID) => {
    // todo
    // get remote post
  }

  renderItem = () => {
    if (this.props.item.type === "post")  {
      // if ("remote" in this.props.item) { 
      //   // remote
      //   var post = this.getRemotePost(this.props.item.authorID, this.props.item.postID);
      //   return
      // } else {
      //   //local
      //   var post = this.props.item
      // }
      if ("id" in this.props.item) {
        return <InboxPostCard post={this.props.item}/>
      }
    } else if (this.props.item.type === "like") {
      return <LikeCard like={this.props.item}/>
    } else if (this.props.item.type === "Follow") {
      return <FollowCard follow={this.props.item}/>
    }
  }

  render() {
    return (
      <div>
        {this.renderItem()}
      </div>
    )
  }
}

export default ObjectCard;
