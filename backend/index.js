const connectToAtlas = require("./db")
const express = require('express')
const path = require('path');
const cors = require('cors')

const app = express()
const port = 5000
connectToAtlas();

app.use(express.json());
// app.use(express.urlencoded({ limit: "25mb" }));
app.use(cors())

app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))
app.use("/api/users", require("./routes/user"));
app.use("/api/trips", require("./routes/trip"));

// Import required modules
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');

// Define secret key for JWT
const secretKey = 'HelloRashid';

// Serve static files
// app.use(express.static(path.join(__dirname, '/uploads')));
app.use('/uploads', express.static('uploads'));
console.log(__dirname);

// Authenticate user using JWT
const authenticate = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: no token provided'));
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: invalid token'));
    }

    // Attach user ID to socket object
    socket.userId = decoded.userId;
    next();
  });
};

io.use(authenticate).on('connection', (socket) => {
  console.log('User connected: ' + socket.userId);

  // Receive message from client
  socket.on('sendMessage', (message) => {
    console.log('Message received: ' + message);

    // Broadcast message to other user
    socket.to(message.receiverId).emit('receiveMessage', message);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.userId);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


// app.listen(port, () => {
//   console.log(`App listening on port http://localhost:${port}`)
// })


