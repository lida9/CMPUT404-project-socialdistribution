import React from 'react';
import '../../styles/userHeader.css';
import Avatar from '@material-ui/core/Avatar';
import { Button } from "@material-ui/core";


const UserHeader = props => {
  // console.log("currentUser (UserHeader): ", props.currentUser);



  return (
    <div id="user-header">
      <h1>Welcome!</h1>
      <hr />
      <div>
        <Avatar id="user-avatar">{props.currentUser.displayName.slice(0, 1).toUpperCase()}</Avatar>
        <Button >click to add friend</Button>
        <div id="user-info">
          <h1>Username: {props.currentUser.displayName} </h1>
          <h2>GitHub: {props.currentUser.github}</h2>
        </div>
      </div>
    </div>
  )


  
}

export default UserHeader
