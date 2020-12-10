
import React from 'react';
import {socket} from "../../service/socket";

class Score extends React.Component {  

  addScore = (playerId) => {
    socket.emit('add score', playerId)
  }

  removeScore = (playerId) => {
    socket.emit('subtract score', playerId)
  }
    
  drawScoreBar = () => {
    var colours = ['#8934B8', '#0A53DE', '#24D024', '#FBF21A', '#FB6F24', '#EA0D0D']
    var players = this.props.data["players"]
    var w = (100/players.length)-1+"vw"
    var index = 1
    if(this.props.data["type"] === "player") {
      return players.map(player => {
        index = (index+1)%colours.length
        return (
            <div style={{width: w, 'background-color':colours[index]}} className="playerScore">
                <p className="playerName">{player["name"]}</p>
                <hr/>
                <p className="pScore">{player["score"]}</p>
            </div>
        )
      })
    }
    else {
      return players.map(player => {
        index = (index+1)%colours.length
          return (
            <div style={{width: w, 'background-color':colours[index]}} className="playerScore">
              <p className="playerName">{player["name"]}</p>
              <hr/>
              <p className="pScore">{player["score"]}</p>
              <button onClick={() => this.addScore(player['id'])}>+</button>
              <button onClick={() => this.removeScore(player['id'])}>-</button>
            </div>
          )
        })
      }
    }
    
  render() {
    return (
      <div className="score">
        {this.drawScoreBar()}
      </div>
    );
  }
}

export default Score;