// server.js

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

let clients = [];

wss.on("connection", function connection(ws) {
  clients.push(ws);
  console.log("A client connected. Total clients:", clients.length);

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    // Broadcast to all other clients
    clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", function () {
    clients = clients.filter(c => c !== ws);
    console.log("A client disconnected. Total clients:", clients.length);
  });
});

console.log("WebSocket server is running...");
