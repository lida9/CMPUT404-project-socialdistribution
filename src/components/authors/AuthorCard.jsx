import React, { Component } from 'react'
import { Button } from "@material-ui/core"
import axios from 'axios';
import { connect } from 'react-redux';

class AuthorCard extends Component {
  follow = async () => {
    var login_author_id = this.props.authorID.authorID
    var want_to_add_id = this.props.author.authorID
    var post_information = {
      "type": "follow",
      "new_follower_ID": ""
    }
    post_information['new_follower_ID'] = login_author_id
    if (login_author_id === want_to_add_id) {
      window.alert('you are adding yourself')
    } else {
      try {
        let doc = await axios.post(`service/author/${want_to_add_id}/inbox/`, post_information,
          {
            auth: {
              username: "socialdistribution_t18",
              password: "c404t18"
            }
          })
        if (doc.status === 200) {
          console.log(doc)
        }
      } catch (err) {
        console.log(err.response.status)
      }
    }

  }

  render() {
    return (
      <div style={{ border: "solid 1px grey" }}>
        <p>Author: {this.props.author.displayName}</p>
        <Button color="primary" variant="outlined" style={{ margin: 5 }} onClick={this.follow}>follow</Button>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(AuthorCard);