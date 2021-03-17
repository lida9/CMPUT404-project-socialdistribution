import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from "axios";
import AuthorCard from '../components/authors/AuthorCard';

class AllAuthors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      authors: []
    }
  }


  componentDidMount = async () => {
    const { authorID } = this.props;
    if (authorID) {
      const author = await axios.get(`service/author/${authorID.authorID}/`);
      const res = await axios.get("service/author/");
      console.log(res.data);
      this.setState({
        currentUser: author.data,
        authors: res.data
      });
    }
  }

  render() {
    const { currentUser, authors } = this.state;
    console.log(authors);
    return (
      <div>
        <div>
          {
            authors.length !== 0 ?
              authors.map((author, index) => {
                if (author.authorID !== this.props.authorID.authorID) {
                  return <AuthorCard key={index} currentUser={currentUser} author={author} />
                } else {
                  return null;
                }
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

export default connect(mapStateToProps)(AllAuthors);