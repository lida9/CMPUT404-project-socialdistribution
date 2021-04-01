import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import GitCard from "../components/github/GitCard"

class GitActivities extends Component {
  state = {
    allActivities: [],
    loading: false
  }
  componentDidMount = async () => {
    const { authorID } = this.props;
    if (authorID) {
      this.getActivities();
    }
  }

  getActivities = async () => {
    const { authorID } = this.props;
    const doc = await axios.get(`/service/author/${authorID.authorID}/github/`, {
      auth: {
        username: "socialdistribution_t18",
        password: "c404t18"
      }
    });
    if (doc.status === 200) {
      this.setState({ allActivities: doc.data })

    }
  }

  render() {
    const { allActivities } = this.state;
    console.log(allActivities);
    return (
      <>
        <h1>Your Git activities:</h1>
        <div>
          {
            allActivities.length !== 0 && allActivities.map !== undefined ?
              allActivities.map((activity, index) => <GitCard key={index} activity={activity} />)
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

export default connect(mapStateToProps)(GitActivities);

