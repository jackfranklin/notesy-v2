require('dotenv').config();

import express from 'express';
import http from 'http';

import bodyParser from 'body-parser';
import expressSession from 'express-session';

import passport from 'passport';

import {
  configurePassport,
  passportRoutes,
  ensureAuthenticated
} from './server/passport'

configurePassport();

const app = express();

app.use(bodyParser.json());
app.use(expressSession({
  secret: 'keyboard cat', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine', 'ejs');

passportRoutes(app);

app.get('*', ensureAuthenticated, (req, res) => {
  res.render('index', {});
});

const server = http.createServer(app);

server.listen(3003);
server.on('listening', () => {
  console.log('Listening on 3003');
});
