import React, { Component } from 'react';
import '../../styles/navbar.css';
import { setCurrentUser } from '../../redux/user/actions';
import { connect } from 'react-redux'

class Navbar extends Component {



  renderNavItems = () => {
    const { authorID } = this.props;
    switch (authorID) {
      case null:
        return (
          <div>
            <li id="nav-item-signup"> <a href="/register"><i className="fas fa-sign-in-alt"></i></a> </li>
            <li id="nav-item-login"> <a href="/login"><i className="fas fa-user-lock"></i></a> </li>
          </div>
        );
      default:
        return (
          <div>

            <li id="nav-item-logout" onClick={() => {
              this.props.setCurrentUser(null);
              localStorage.removeItem("state")
            }}><a href="/service/author/logout/"><i className="fas fa-sign-out-alt"></i></a> </li>
            <li id="nav-item-3"> <a href="/aboutme"><i className="fas fa-user-circle"></i></a> </li>
            <li id="search-icon"> <a href="/authors"><i className="fas fa-search"></i></a> </li>
            <li id="public-posts"> <a href="/post/public"> <i className="fas fa-globe"></i> </a> </li>
          </div>
        );
    }
  }

  render() {
    return (
      <nav id="navbar">
        <h1 id="navbar-title"> <a href="/">Social Distribution</a> </h1>
        <ul>
          {this.renderNavItems()}
        </ul>
      </nav>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => {
    dispatch(setCurrentUser(user))
  }
})

const mapStateToProps = (state) => ({
  authorID: state.user.authorID
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);