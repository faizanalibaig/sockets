const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 5000;
const WSPORT = 8080;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'websocket-client.html'));
});

app.listen(PORT, () => {
  console.log(`HTTP server running at http://localhost:${PORT}`);
});

const socketserver = new WebSocketServer({ port: WSPORT });
console.log(`WebSocket server running on ws://localhost:${WSPORT}`);

socketserver.on('connection', (ws) => {
  console.log('New Client Connected!');
  ws.send('Connection established');

  ws.on('message', (data) => {
    console.log(`Received: ${data}`);
    socketserver.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(`${data}`);
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
  ws.on('error', (err) => console.error('WebSocket error:', err));
});
