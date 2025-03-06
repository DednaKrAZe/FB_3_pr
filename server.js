const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const http = require('http');
const WebSocket = require('ws');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '')));

const fs = require('fs');

let items=JSON.parse(fs.readFileSync(path.join(__dirname, '', 'db.json'), 'utf-8'));
const server = http.createServer(app);
const ws = new WebSocket.Server({ server });
const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: {
      name: { type: GraphQLString },
      cost: { type: GraphQLString },
      description: { type: GraphQLString },
      cats: { type: new GraphQLList(GraphQLString) },
    },
  });

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      items: {
        type: new GraphQLList(ItemType),
        resolve: () => {
          return items.map(item => ({
            name: item.name,
            cost: item.cost,
            description: item.description,
            cats: item.cats,
          }));
        },
      },
    },
  });

  const schema = new GraphQLSchema({
    query: RootQueryType,
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
    items=JSON.parse(fs.readFileSync(path.join(__dirname, '', 'db.json'), 'utf-8'));
});

app.use(
    '/goods',
    graphqlHTTP({
      schema: schema,
      graphiql: true, 
    }),
  );

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '', '404.html'));
});

ws.on('connection', (ws) => {
  console.log('Новое соединение установлено');

  // Обработчик сообщений от клиента
  ws.on('message', (message) => {
      console.log(`Получено сообщение: ${message}`);

      // Отправляем сообщение всем подключенным клиентам
      ws.clients.forEach((client) => {
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

app.on('listening', function () {
    items=JSON.parse(fs.readFileSync(path.join(__dirname, '', 'db.json'), 'utf-8'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});