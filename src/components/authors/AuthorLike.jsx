import React, { Component } from 'react'

class AuthorLike extends Component {

  render() {
    return (
      <div style={{ borderBottom: "solid 1px lightgrey" }}>
        <p style={{margin: "auto", padding: "20px"}}>{this.props.name}</p>
      </div>
    )
  }
}

export default AuthorLike;