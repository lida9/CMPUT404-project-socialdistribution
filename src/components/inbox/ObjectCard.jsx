import React, { Component } from "react";
import LikeCard from './LikeCard';
import InboxPostCard from './InboxPostCard'
import FollowCard from './FollowCard'
import CommentNoteCard from './CommentNoteCard'

// This component is used to display items in inbox
class ObjectCard extends Component {

  renderItem = () => {
    if (this.props.item.type === "post")  {
      return <InboxPostCard post={this.props.item}/>
    } else if (this.props.item.type === "like") {
      return <LikeCard like={this.props.item}/>
    } else if (this.props.item.type === "Follow") {
      return <FollowCard follow={this.props.item}/>
    }else if(this.props.item.type === "comment"){
      return <CommentNoteCard comment={this.props.item}/>
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
