import React, { Component } from "react";
import {socket} from "./service/socket";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import Home from './login/Home';
import Game from './game/Game';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies)
  };

  constructor(props) {
    super(props);
    const { cookies } = this.props; 
    this.state = {};
    if (cookies !== undefined && cookies.get("name") !== undefined && cookies.get("id") !== undefined) {
      socket.emit('load game page', cookies.get('name'), cookies.get('id'), null) ;
    }
  }

  // sending sockets
  send = () => {
    console.log('client')
    socket.emit('change color', this.state.color) 
  }

  ///

  componentDidMount() {
    socket.on('toggle screen', (s) => {
      console.log("Set Screen to ", s)
      this.setState({screen: s});
    })
    socket.on('remove cookie', () => {
      const { cookies } = this.props; 
      try {
        cookies.removeCookie("name")
      }
      catch{}
      try {
        cookies.removeCookie("id")
      }
      catch{}
    })
  }

  useEffect = () => {
    socket.on('toggle screen', (s) => {
      console.log("Set Screen to ", s)
      this.setState({screen: s});
    })
  }

  render() {
    return (
      <div>
        {(this.state.screen === undefined || this.state.screen === "Home") && <Home />}
        {this.state.screen === "Game" && <Game />}
      </div>
    )
  }
}

export default withCookies(App);