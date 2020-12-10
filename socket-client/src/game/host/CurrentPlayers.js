import React from 'react';
import {socket} from "../../service/socket";

//This screen will have a button for visibility for every list item. 
//If we click the button, it will update itself from hide to show and 
//it will send a message to the socket to update the content. 
//The socket will update the data on the server and will then emit the 
//Updated data to the player-room, where the screen of the players will 
//be rerendered.


//When a user loggs in, the host should get an updated list of the current users 
//(and he should be able to remove users)


//Stretch goal: Score counting

class CurrentPlayers extends React.Component {

  constructor() {
    super();
    this.state = {
      players: [],
    };
    socket.emit('get players')
  }
    
  componentDidMount() {
    socket.on('update players', (players) => {
      console.log("Updating players")
      var p = [];
      Object.entries(players).map(player => p.push({"id":player[0], "name":player[1]["name"], "guesses":player[1]["guesses"]}));
      this.setState({players: p});
      this.props.data.setPlayerList(p);
    })
  }

  removePlayer = (id) => {
    console.log("Removing player ", id);
    socket.emit('remove player', id);
    socket.emit('get players')
  }

  activePlayers = () => {
    return (
        <table>
          <tbody>
            <tr><th>Name</th><th>Remove</th></tr>
            {this.state.players.map(player => 
              <tr key={player['id']}>
                <td>{player['name']}</td>
                <td><button onClick={() => this.removePlayer(player['id'])}>Remove</button></td>
              </tr>)
            }
          </tbody>
        </table>
      )
  }

  render() {
    return ( 
      this.activePlayers()
    );
  }
}

export default CurrentPlayers;