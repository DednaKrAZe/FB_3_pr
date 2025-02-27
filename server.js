const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

let goods=[];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '')));

const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.get('/goods', (req, res) => {
    goods=JSON.parse(fs.readFileSync(path.join(__dirname, '', 'db.json'),'utf-8'));
    res.json(goods);
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});