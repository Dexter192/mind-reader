import React from 'react';
import {socket} from "../../service/socket";

class WordTable extends React.Component {  

  buildWordList = () => {
    return (
        <div className="wordTable">
          {this.props.data["wordList"].map((word, index) => 
            <div className="wordContainer">
              <p className="wordHeader">Word {index+1}</p>
              <hr className="hr"/>
              {this.buildWord(index, word, this.props.data["players"], this.props.data["type"])}
            </div>
          )
          }  
          {this.fillRemainingDivs(this.props.data["wordList"].length)}
        </div>
      )
  }

  fillRemainingDivs = (start) => {
    var emptyWords = [];
    for (var i = start+1; i <= 10; i++) {
      emptyWords.push(this.emptyFrame(i));
    }
    return emptyWords
  }

  emptyFrame = (i) => {
    return (
    <div className="wordContainer">
      <p className="wordHeader">Word {i}</p>
      <hr className="hr"/>
    </div>)
  }

  toggleWordVisibility = (index) => {
    socket.emit('toggle word visibility', index);
  }

  togglePlayerGuess = (id, index) => {
    socket.emit('toggle player guess for word', id, index);
  }

  removeWord = (index) => {
    socket.emit('remove word', index);
  }

  buildWord = (index, word, players, type) => {
    if(type === "host") {
      var visibleClass = "not".repeat(1-word["visible"]) + "visible";
      return (
        <div className="word">
            <h1><span className={visibleClass} onClick={() => this.toggleWordVisibility(index)}>{word["word"]}</span></h1>
            <div className="playerGuesses">
              {players.map(player => {
              var guessed = "not".repeat(1-player["guesses"][index]) + "guessed";
              return <span className={guessed} onClick={() => this.togglePlayerGuess(player["id"], index)}>{player["name"]} + </span>
            })} 
            <button className="removeWord" onClick={() => this.removeWord(index)}>Remove</button>
          </div>
        </div>
      )
    }
    if(type === "player") {
        if(word["visible"]) {
          return (
            <div className="word">
              <h1>{word["word"]}</h1>
                <div className="playerGuesses">
                {players.map(player => {
                  if (player["guesses"][index]) {
                    return <span className="playerGuess">{player["name"]}</span>
                  }
                })} 
                </div>
            </div>
            )        
        } else {
          return (
            <div className="word">
              <h1>?????</h1>
            </div>
          )
        }
      }
    return <p>Problem loading game content</p>
  }

  render() {
    return (
      <div className="frame">
        {this.buildWordList()}
      </div>
    );
  }
}

export default WordTable;