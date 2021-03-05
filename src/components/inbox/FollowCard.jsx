import React, { Component } from "react";
import "../../styles/followCard.css";
import { Button } from "@material-ui/core"
import axios from 'axios';

// This component is used to display the friend request
class FollowCard extends Component {
    accept = async() => {
        var author_url = this.props.like.object.id
        var author_data = author_url.split("/")
        var author_id = author_data[4]
        
        var follower_url = this.props.like.actor.id
        var follower_data = follower_url.split("/")
        var follower_id = follower_data[4]

        var post_information = {
          "type": "accept",
        }
        try {
          let doc = await axios.post(`service/author/${author_id}/inbox/friendrequest/${follower_id}/`,post_information)
          if (doc.status == 200) {
            console.log(doc)
          }
        } catch (err) {
            console.log(err.response.status)
        }
    }

    reject = async() => {
        var author_url = this.props.like.object.id
        var author_data = author_url.split("/")
        var author_id = author_data[4]

        var follower_url = this.props.like.actor.id
        var follower_data = follower_url.split("/")
        var follower_id = follower_data[4]

        var post_information = {
          "type": "reject",
        }
        try {
          let doc = await axios.post(`service/author/${author_id}/inbox/friendrequest/${follower_id}/`,post_information)
          if (doc.status == 200) {
            console.log(doc)
          }
        } catch (err) {
            console.log(err.response.status)
        }
    }

    render() {
        return (
            <div id='follow-object' style={{ border: "solid 1px grey" }}>
                {this.props.like.summary}
                <div class="buttonRight">
                <Button color="primary" variant="outlined" onClick = {this.accept}>Accept</Button>
                <Button color="primary" variant="outlined" onClick = {this.reject}>Reject</Button>
                </div>
            </div>
    )
  }
}

export default FollowCard;
