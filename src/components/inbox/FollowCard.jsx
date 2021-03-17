import React, { Component } from "react";
import "../../styles/followCard.css";
import { Button } from "@material-ui/core"
import axios from 'axios';

// This component is used to display the friend request
class FollowCard extends Component {
    state = {
        clicked: null
    }

    // set Cookie and check if clicked if referenced from
    // edited from https://stackoverflow.com/a/22279996
    setCookie = (name, value1, value2) => {
        // Set cookie to `namevalue;`
        // Won't overwrite existing values with different names
        var insert_array = name + "=" + value1 + "=" + value2 + "==";
        document.cookie += insert_array;
        // document.cookie += insert_array;
    }

    accept = async() => {
        var author_url = this.props.follow.object.id
        var author_data = author_url.split("/")
        var author_id = author_data[4]

        var follower_url = this.props.follow.actor.id
        var follower_data = follower_url.split("/")
        var follower_id = follower_data[4]

        var post_information = {
            "type": "accept",
        }
        try {
            let doc = await axios.post(`service/author/${author_id}/inbox/friendrequest/${follower_id}/`,post_information)
            if (doc.status == 200) {
                this.setCookie("accepted", author_id, follower_id);
                this.setState({clicked: "Accepted"});
            }
        } catch (err) {
            console.log(err.response.status)
        }
    }

    reject = async() => {
        var author_url = this.props.follow.object.id
        var author_data = author_url.split("/")
        var author_id = author_data[4]

        var follower_url = this.props.follow.actor.id
        var follower_data = follower_url.split("/")
        var follower_id = follower_data[4]

        var post_information = {
            "type": "reject",
        }
        try {
            let doc = await axios.post(`service/author/${author_id}/inbox/friendrequest/${follower_id}/`,post_information)
            if (doc.status == 200) {
                this.setCookie("rejected", author_id, follower_id);
                this.setState({clicked: "Rejected"});
            }
        } catch (err) {
            console.log(err.response.status)
        }
    }

    checkIfClicked = () => {
        var cookie = document.cookie.split("==");
        // iterate over cookie array
        var answeredRequests = {};
        for (var i = 0; i < cookie.length; i++) {
            var c = cookie[i];
            // if it contains string "accepted"
            if (c.includes("accepted")) {
                c = c.split("=");
                var name = c[0];
                var id = c[1]+c[2];
                answeredRequests[id] = name;
            }
            // if it contains string "rejected"
            else if (c.includes("rejected")) {
                c = c.split("=");
                var name = c[0];
                var id = c[1]+c[2];
                answeredRequests[id] = name;
            }
        }
        // cookie does not exist
        return answeredRequests;
    }

    render() {
        if (this.state.clicked === null) {
            var answeredRequests = this.checkIfClicked();

            // get author and follower id
            var author_url = this.props.follow.object.id
            var author_data = author_url.split("/")
            var author_id = author_data[4]
            var follower_url = this.props.follow.actor.id
            var follower_data = follower_url.split("/")
            var follower_id = follower_data[4]

            for (var key in answeredRequests) {
                if (key === author_id+follower_id) {
                    if (answeredRequests[key] === "accepted") {
                        this.setState({clicked: "Accepted"});
                    }
                    else {
                        this.setState({clicked: "Rejected"});
                    }
                }
            }
        }
        return (
            <div id='follow-object' style={{ border: "solid 1px grey" }}>
                {this.props.follow.summary}
                {
                  this.state.clicked === null ?

                  <div class="buttonRight">
                  <Button color="primary" variant="outlined" onClick = {this.accept}>Accept</Button>
                  <Button color="primary" variant="outlined" onClick = {this.reject}>Reject</Button>
                  </div>
                  :
                  <div class="text">
                    <p>{this.state.clicked}</p>
                  </div>
                }
            </div>
    )
  }
}

export default FollowCard;
