import React from 'react';
import {socket} from "../service/socket";
import Error from "./Error";
import HostScreen from "./host/HostScreen"
import PlayerScreen from "./player/PlayerScreen"

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      type: 'none',
    };
  }


  componentDidMount() {
    socket.on('load gamescreen', (type, name) => {
      console.log("Load game screen")
      this.setState({type: type, name: name});
    })
  }

  loadPageContent = () => {
    if (this.state.type === "none") {
      return <div/>
    }
    else if (this.state.type === "host") {
      return (
        <HostScreen/>
      )
    }
    else if (this.state.type === "player") {
      return (      
        <PlayerScreen/>
      )
    }
    else {
      return <Error/>
    }

  }

  render() {
    return (
      this.loadPageContent()
    );
  }
}

export default Game;