// IMPORTS

const express = require('express')
const app = express()
const pool = require('./db')
const bodyParser = require('body-parser')
const session = require('express-session')
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// MIDDLEWARE

app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

// SOCKET CONNECTION
io.on('connection', (socket) => {
  console.log(socket.id);

  // host creates game
  socket.on('host-create-game', async (data) => {
    //create the session
    const session = await pool.query('INSERT INTO sessions (rounds, forfeit) VALUES ($1, $2) RETURNING session_id', [data.rounds, data.forfeit])
    
    //create the room
    socket.join(session.rows[0].session_id)

    //create the user
    const user = await pool.query('INSERT INTO users (socket_id, session_id, user_name, is_host) VALUES ($1, $2, $3, $4) RETURNING user_id', [socket.id, session.rows[0].session_id, data.name, data.host]);

    //redirect the user to the correct room
    io.emit("join-host-lobby", {room: session.rows[0].session_id, host: true})
  })

  // user joins game
  socket.on('user-joins-game', async (data) => {
    // checks if room exists
    const session = await pool.query('SELECT session_id FROM sessions WHERE session_id=$1', [data.session_id])
    if (session.rowCount === 0){
      io.emit("session-dne")
    }else {
      // joins user to room
      socket.join(data.session_id)
  
      // creates the user
      const user = await pool.query('INSERT INTO users (socket_id, session_id, user_name, is_host) VALUES ($1, $2, $3, $4) RETURNING user_id', [socket.id, data.session_id, data.name, data.host]);
  
      // redirects the user to the correct room
      io.emit("join-user-lobby", {room: data.session_id, host: false})
    }
    
  })

  // host starts game

  // round part 1 starts

  // user submit their question

  // timer

  // round part 2 starts

  // user answer their question

  // timer

  // round part 3 starts

  // user guesses

  // timer

  //show forfeit

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(8000, () => console.log("SERVER RUNNING ON PORT 8000"))

