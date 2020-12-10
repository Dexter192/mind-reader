import React from 'react';
import {socket} from "../../service/socket";
import WordTable from "../util/WordTable"
import Timer from "../util/Timer"

class PlayerScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      wordList: []
    };
    socket.emit('clear wordList');
    this.tempAddWord("Word1")
    this.tempAddWord("Word2")
    this.tempAddWord("Word3")
    this.tempAddWord("Word4")  
    socket.emit('fetch wordlist')
  }
  
  tempAddWord = (word) => {
    socket.emit('add word', word);
  }
  
  componentDidMount() {
    socket.on('toggle screen', (s) => {
      console.log('Test')
    })
    socket.on('update wordList', (words) => {
        console.log("Updating words", words)
        this.setState({wordList: words});
    })  
    socket.on('update players', (players) => {
        var p = [];
        Object.entries(players).map(player => p.push({"id":player[0], "name":player[1]["name"], "guesses":player[1]["guesses"]}));
        this.setState({players: p});
    })
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value});
  }

  render() {
    return (
      <div>
        <h1 className="title">Mind-Reader</h1>
        <Timer data={{"type":"player"}}/>
        <WordTable data={{"wordList":this.state.wordList, "players":this.state.players, "type":"player"}} /> 
      </div>
    );
  }
}

export default PlayerScreen;