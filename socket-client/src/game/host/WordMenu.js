import React from 'react';
import {socket} from "../../service/socket";

class WordMenu extends React.Component {

  //Add a word to the list
  //Remove all words
  constructor() {
    super();
    this.state = {
      word: "",  
      words: [],
    };
    socket.emit('get wordList')
  }
    
  componentDidMount() {
    socket.on('update wordList', (words) => {
      console.log("Updating words")
      this.setState({words: words});
    })
  }

  clearWordList = () => {
    console.log("Clearing word list");
    socket.emit('clear wordList');
  }

  addWord = (event) => {
    event.preventDefault();
    console.log("Adding word", this.state.word);
    socket.emit('add word', this.state.word);
  }

  handleWordChange = (event) => {
    this.setState({word: event.target.value});
  }

  clearWordList = () => {
    socket.emit('clear wordList');
  }

  render() {
    return (
      <div className="wordMenu">
        <form>
          <label>New Word:</label>
          <input type="text" name="word" onChange={this.handleWordChange}></input><br/>
          <input type="submit" onClick={this.addWord} value="Add Word"/>
        </form>
        <button onClick={() => this.clearWordList()}>Clear all words</button>
      </div>
    );
  }
}

export default WordMenu;