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
  res.render('index', {
    githubId: req.user.id,
    scriptSrc: process.env.NODE_ENV === 'production' ? 'http://notesy2.surge.sh/production-build.js' : 'webpack-build.js'
  });
});

const server = http.createServer(app);

const port = process.env.PORT || 3003;
server.listen(port);
server.on('listening', () => {
  console.log('Listening on ' + port);
});
