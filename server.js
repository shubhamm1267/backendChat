const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
let messageHistory = []; 

wss.on('connection', ws => {
  console.log('New client connected');

  ws.send(JSON.stringify({ type: "history", messages: messageHistory }));

  ws.on('message', data => {
    try {
      let parsedData = JSON.parse(data);
      
      let fullMessage = {
        username: parsedData.username,
        message: parsedData.message
      };

      messageHistory.push(fullMessage); 

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(fullMessage));
        }
      });

    } catch (error) {
      console.error(" Invalid JSON received:", data);
    }
  });

  ws.send(JSON.stringify({ username: 'Server', message: 'Welcome to the chat!' }));
});

console.log('WebSocket server running on ws://localhost:3000');
