const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', (ws) => {
    console.log('Новое соединение установлено');


    ws.on('message', (message) => {
        console.log(`Получено сообщение: ${message}`);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Соединение закрыто');
    });
});


app.use(express.static('public'));


server.listen(8081, () => {
    console.log('Сервер запущен на http://localhost:8081');
});