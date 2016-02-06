import express from 'express';
import http from 'http';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {});
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

const server = http.createServer(app);

server.listen(3003);
server.on('listening', () => {
  console.log('Listening on 3003');
});
