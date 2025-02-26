const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

let goods=[];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '')));

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Shop API',
            version: '1.0.0',
            description: 'API для интернет-магазина',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['openapi.yaml'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.get('/goods', (req, res) => {
    res.json(goods);
});

app.delete('/admin/:id', (req, res) => {
    const goodId = parseInt(req.params.id);
    const good = goods.find(t => t.id === goodId);
    if (good){
        goods = goods.filter(t => t.id !== goodId);
        res.status(204).send();
    }
    else{
        res.status(404).json({ message: 'good not found' });
    }
});

app.post('/admin', (req, res) => {
    const { name, cost,description,cats } = req.body;
    const newGood = {
        id: goods.length + 1,
        name:name,
        cost:cost,
        description:description,
        cats:cats
    };
    goods.push(newGood);
    res.status(201).json(newGood);
});

app.put('/admin/:id', (req, res) => {
    const goodId = parseInt(req.params.id);
    const good = goods.find(t => t.id === goodId);
    if (good) {
        const { name, cost, description, cats } = req.body;
        good.name = name !== undefined ? name : good.name;
        good.cost = cost !== undefined ? cost : good.cost;
        good.description = description !== undefined ? description : description;
        good.cats = cats !== undefined ? cats : good.cats;
        res.json(good);
    } else {
        res.status(404).json({ message: 'good not found' });
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});