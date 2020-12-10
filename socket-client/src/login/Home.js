import React from 'react';
import {socket} from "../service/socket";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Home extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies)
  };
  
  // adding the function
  load_game_page = (player_type) => {
    const { cookies } = this.props; 
    socket.emit('load game page', cookies.get('name'), cookies.get('id'), player_type) 
  }

  ///

  // set cookie and login save id to server socket
  login = (event) => {
    event.preventDefault();
    if(this.state === null) {
      alert("Cookie required. Please refresh the page");
      return 
    }    
    if(this.state.name === undefined || this.state.name === "") {
      alert('Name not set')
      return
    }
    console.log('Logging', this.state.name, 'in as', event.target.name)
    const { cookies } = this.props; 
    cookies.set('name', this.state.name, { path: '/' });
    console.log('Cookie id before: ', cookies.cookies.id)
    if(cookies.cookies.id === undefined) {
        console.log('Set new cookie id')
        cookies.set('id', socket.id, { path: '/' });
    }
    console.log('Cookie id: ', cookies.cookies.id)
    this.load_game_page(event.target.name)
  }

  ///

  handleNameChange = (event) => {
    this.setState({name: event.target.value});
  }

  render() {
    socket.on('force_reload', (col) => {
      alert("Cookie required. Please refresh the page");
    })    
    return (
      <div style={{ textAlign: "center" }}>
        <form>
          <label>Player name:</label>
          <input type="text" name="name" onChange={this.handleNameChange}></input><br/>
          <input type="submit" onClick={this.login} name="host" value="Host"/>
          <input type="submit" onClick={this.login} name="player" value="Player"/>
        </form>
      </div>
    );
  }
}

export default withCookies(Home);