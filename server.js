const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 });
let clients = new Map();

server.on("connection", (ws) => {
  const id = Math.random().toString(36).substr(2, 9); // unique id
  clients.set(ws, id);
  console.log(`Client connected: ${id}`);

  ws.send(JSON.stringify({ type: "id", id }));

  ws.on("message", (message) => {
    // Broadcast to all clients
    for (let [client, _] of clients.entries()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected: ${clients.get(ws)}`);
    clients.delete(ws);
  });
});
