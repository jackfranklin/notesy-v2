import expressSession from 'express-session';
import githubStrategy from 'passport-github2';
const GitHubStrategy = githubStrategy.Strategy;

import passport from 'passport';

export function configurePassport() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  const REDIRECT_URL = process.env.NODE_ENV === 'production' ?
    'http://notesy2.herokuapp.com/auth/github/callback' :
    'http://localhost:3003/auth/github/callback';

  const strategy = new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    // TODO: this needs to deal with a production URL
    callbackURL: REDIRECT_URL
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  });

  passport.use(strategy);
}

export function passportRoutes(app) {
  app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => res.redirect('/'));

  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
