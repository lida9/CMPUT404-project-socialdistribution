import axios from "axios";
import React, { Component } from "react";
import { Button } from "@material-ui/core"
import "../styles/login.css";
import { setCurrentUser } from '../redux/user/actions';
import { connect } from 'react-redux'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    }
  }

  handleLogin = async () => {
    const { email, password } = this.state;
    if (email && password) {
      try {
        const doc = await axios.post("service/author/login/", { email, password }, {
          auth: {
            username: "socialdistribution_t18",
            password: "c404t18"
          }
        });
        this.props.setCurrentUser(doc.data);

        window.location = "/";
      } catch (error) {
        alert("Email or password is incorrect");
        console.log(error.message);
      }

    } else {
      alert("Email and Password Cannot be Empty!")
    }



  }

  render() {
    const { email, password } = this.state;
    return (
      <div id="login-page">
        <h1 id="login-title">Login</h1>
        <input
          id="email"
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => this.setState({ email: e.target.value })}
        />
        <input
          id="password"
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <Button id="login-btn" color="primary"
          variant="outlined" onClick={this.handleLogin}>Login</Button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => {
    dispatch(setCurrentUser(user))
  }
})

export default connect(null, mapDispatchToProps)(Login);