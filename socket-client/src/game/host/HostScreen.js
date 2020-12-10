import React from 'react';
import {socket} from "../../service/socket";
import CurrentPlayers from "./CurrentPlayers"
import WordMenu from "./WordMenu"
import WordTable from "../util/WordTable"
import Timer from "../util/Timer"
import Score from "../util/Score"

class HostScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      players: [],
      wordList: []
    };
    socket.emit('fetch wordlist')
  }   
    
  componentDidMount() {
    socket.on('toggle screen', (s) => {
      console.log('Test')
    })
    socket.on('update wordList', (words) => {
        console.log("Updating words", words)
        this.setState({wordList: words});
    })  
  }

  setPlayerList(playerList) {
    console.log("Player list in parent")
    console.log(playerList)
    this.setState({players: playerList});
  }

  render() {
    return (
      <div className="root">
        <h1 className="title">Mind-Reader</h1>
        <CurrentPlayers data={{setPlayerList:this.setPlayerList.bind(this)}}/>
        <WordMenu/>
        <Timer data={{"type":"host"}}/>
        <WordTable data={{"wordList":this.state.wordList, "players":this.state.players, "type":"host"}} />
        <Score data={{"players":this.state.players, "type":"host"}}/>
      </div>
    );
  }
}

export default HostScreen;