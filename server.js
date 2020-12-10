const express = require('express')
const http = require('http')

// our localhost port
const port = 4001

const app = express()

// our server instance
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

global.colour = 'white'; 
global.users = {"host":{},"players":{}}
global.wordList = []
global.timer = null;
global.time = 0

io.on('connection', socket => {
  console.log('New client connected', socket.id)
  ///
  
  socket.on('load game page', (name, id, type) => {
    console.log(name, id)
    if(id === null) {
      return
    }
    if(type === null) {
      if(id in global.users["host"]) {
        type = 'host'  
      }
      else if (id in global.users['players']) {
        type = 'player'  
      }
      else {
        io.to(socket.id).emit('remove cookie');
        return
      }
    }
    if(type === "host") {
      global.users["host"][id] = ({"name": name, "socket": socket.id});
    } 
    else if (type === "player") {
      global.users["players"][id] = ({"name": name, "socket": socket.id, "guesses": new Array(global.wordList.length).fill(false)});
    } 
    console.log("Current players: " + JSON.stringify(global.users, null, 4));
    io.to(socket.id).emit('toggle screen', 'Game');
    io.to(socket.id).emit('load gamescreen', type, name);
    io.emit('update players', global.users.players);
  })

  ///
   
  socket.on('remove player', (id) => {
    try {
      console.log('removed player', id);
      console.log('socket', global.users.players[id].socket)
      io.to(global.users.players[id].socket).emit('toggle screen', 'Home');
      io.to(global.users.players[id].socket).emit('remove cookie');
      delete global.users.players[id];
    } catch{
      console.log('Did not find player', id);
    }
    io.emit('update players', global.users.players);
    console.log("Current players: " + JSON.stringify(global.users, null, 4));
  })  

  ///
   
  socket.on('get players', () => {
    io.to(socket.id).emit('update players', global.users.players);
  })

  ///
   
  socket.on('clear wordList', () => {
    global.wordList = []
    for (var playerId in global.users.players) {
      global.users.players[playerId]["guesses"] = [];
    }
    io.emit('update players', global.users.players);
    io.emit('update wordList', global.wordList);
  })

  ///
   
  socket.on('add word', (word) => {
    newWord = {"word": word, "visible": false}
    global.wordList.push(newWord);
    for (var playerId in global.users.players) {
      global.users.players[playerId]["guesses"].push(false);
    }
    io.emit('update players', global.users.players);
    io.emit('update wordList', global.wordList);
  })
  
  ///

  socket.on('toggle player guess for word', (playerId, index) => {
    global.users.players[playerId]["guesses"][index] = !global.users.players[playerId]["guesses"][index]
    io.emit('update players', global.users.players);
    io.emit('update wordList', global.wordList);
  })

  ///

  socket.on('toggle word visibility', (index) => {
    global.wordList[index]["visible"] = !global.wordList[index]["visible"] 
    io.emit('update wordList', global.wordList);
  })

  ///

  socket.on('remove word', (index) => {
    global.wordList.splice(index,1)
    for (var playerId in global.users.players) {
      global.users.players[playerId]["guesses"].splice(index, 1);
    }
    io.emit('update players', global.users.players);
    io.emit('update wordList', global.wordList);
  })

  ///

  socket.on('fetch wordlist', () => {
    io.emit('update wordList', global.wordList);
  })
  
  ///
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  ///

  socket.on('start timer', () => {
    console.log("Start timer")
    try {
      clearInterval(global.timer)
      console.log("Clear timer")  
    }
    catch{}
    global.time = 45
    global.timer = setInterval(() => {
      console.log("Update timer")  
      global.time = global.time - 1;
      io.emit('update timer', global.time);
      if(global.time <= 0) {
        clearInterval(global.timer)
      }
    }, 1000);
  });

})

server.listen(port, () => console.log(`Listening on port ${port}`))