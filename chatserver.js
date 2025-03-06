const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Обработчик подключения WebSocket
wss.on('connection', (ws) => {
    console.log('Новое соединение установлено');

    // Обработчик сообщений от клиента
    ws.on('message', (message) => {
        console.log(`Получено сообщение: ${message}`);

        // Отправляем сообщение всем подключенным клиентам
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Обработчик закрытия соединения
    ws.on('close', () => {
        console.log('Соединение закрыто');
    });
});

// Статический сервер для обслуживания HTML-файла
app.use(express.static('public'));

// Запуск сервера
server.listen(8081, () => {
    console.log('Сервер запущен на http://localhost:8081');
});