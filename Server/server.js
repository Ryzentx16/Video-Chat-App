const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve your static files (HTML, CSS, JS, etc.)
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Set up PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/peerjs", // The path to PeerJS server
});

// Middleware to handle PeerJS requests
app.use("/peerjs", peerServer);

// Set up WebSockets for signaling
io.on("connection", (socket) => {
  // Handle WebRTC signaling here
});

app.get("/peerjs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
