require('dotenv').config();

import express from 'express';
import http from 'http';

import bodyParser from 'body-parser';
import expressSession from 'express-session';
import githubStrategy from 'passport-github2';
const GitHubStrategy = githubStrategy.Strategy;

import passport from 'passport';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    // TODO: this needs to deal with a production URL
    callbackURL: "http://localhost:3003/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  })
);

const app = express();

app.use(bodyParser.json());
app.use(expressSession({
  secret: 'keyboard cat', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine', 'ejs');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('*', ensureAuthenticated, (req, res) => {
  res.render('index', {});
});

const server = http.createServer(app);

server.listen(3003);
server.on('listening', () => {
  console.log('Listening on 3003');
});
