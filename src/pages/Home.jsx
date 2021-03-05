import React, { Component } from "react";
import NoUserHeader from "../components/headers/NoUserHeader";
import UserHeader from "../components/headers/UserHeader";
import ObjectCard from '../components/inbox/ObjectCard';
import { connect } from "react-redux";
import axios from "axios";
import { Button } from "@material-ui/core";

class Home extends Component {

  state = {
    currentUser: null,
    inbox: []
  }

  componentDidMount = async () => {
    const { authorID } = this.props;
    if (authorID) {
      const res = await axios.get(`service/author/${authorID.authorID}/`)
      this.setState({ currentUser: res.data })
      this.getInbox();
      // setInterval(this.getInbox, 10 * 60 * 1000);
    }
  }

  renderHeader = () => {
    const { currentUser } = this.state;
    if (currentUser === null) {
      return <NoUserHeader />
    } else {
      // this.getInbox();
      return <UserHeader currentUser={currentUser} />
    }
  }

  getInbox = async () => {
    try {
      const { authorID } = this.props;
      const res = await axios.get(`service/author/${authorID.authorID}/inbox/`);
      this.setState({ inbox: res.data.items });
    } catch (e) {
      console.log(e);
    }
  }

  clearInbox = async () => {
    try {
      const { authorID } = this.props;
      const res = await axios.delete(`service/author/${authorID.authorID}/inbox/`);
      this.setState({ inbox: res.data.items });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { authorID } = this.props;
    return (
      <div>
        {this.renderHeader()}
        {
          authorID !== null ?
            <h1
              id="home-title-login"
              style={{
                textAlign: "center",
                fontFamily: "sans-serif",
                padding: 15
              }}
            >
              Inbox
          </h1>
            :
            <h1
              id="home-title-logout"
              style={{
                textAlign: "center",
                fontFamily: "sans-serif",
                padding: 15
              }}
            >
              Please Login
          </h1>
        }
        <Button
          color="primary"
          variant="outlined"
          onClick={this.getInbox}
          style={{ margin: 10 }}
        >
          Refresh Inbox
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={this.clearInbox}
          style={{ margin: 10 }}
        >
          Clear Inbox
        </Button>
        <div>
          {
            this.state.inbox.length !== 0 ?
              this.state.inbox.map((item, index) => {
                return <ObjectCard key={index} item={item} />
              })
              :
              null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps)(Home);
