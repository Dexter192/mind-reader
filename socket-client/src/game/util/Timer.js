import React from 'react';
import {socket} from "../../service/socket";

class Timer extends React.Component {

  constructor() {
    super();
    this.state = {
      seconds: 45,
    };
  }

  startTimer() {
    socket.emit('start timer')
  }
  
  componentDidMount() {
    socket.on('update timer', (time) => {
      this.setState({seconds: time});
    })  
  } 

  drawTimer = () => {
  if(this.props.data.type === "host") {
    return (
      <div className="timerDiv">  
        <button onClick={this.startTimer}>Start</button>
        <p className="timer">0:{('00'+this.state.seconds).slice(-2)}</p>
      </div>
    )
  }
  return (
    <div className="timerDiv">
        <p className="timer">0:{('00'+this.state.seconds).slice(-2)}</p>
    </div>
  )  
  }

    render() {
      return(
        this.drawTimer()
      );
    }
  }
  
  export default Timer;