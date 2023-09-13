const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidV4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to handle PeerJS requests
app.set("view engine", "ejs"); // Tell Express we are using EJS
app.use(express.static("views"));

// Set up WebSockets for signaling

// When someone connects to the server
io.on("connection", (socket) => {
  // When someone attempts to join the room
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId); // Join the room
    socket.broadcast.emit("user-connected", userId); // Tell everyone else in the room that we joined
    console.log("User Connected");

    // Communicate the disconnection
    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", userId);
      console.log("User Disconnected");
    });
  });
});

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

// If they join a specific room, then render that room
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
