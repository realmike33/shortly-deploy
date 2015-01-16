var express = require('express');
var partials = require('express-partials');
var util = require('./lib/utility');
var mongoose = require('mongoose');
var fs = require('fs');

var handler = require('./lib/request-handler');

if (process.env.NODE_ENV === 'production') {
  var dbUri = fs.readFileSync('dbinfo', {encoding: 'utf8'});
} else {
  var dbUri = "mongodb://localhost/shortly";
}

mongoose.connect(dbUri, function(err) {
    if (err) {
      console.dir(err);
      throw err;
    }
  });

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
});

app.get('/', util.checkUser, handler.renderIndex);
app.get('/create', util.checkUser, handler.renderIndex);

app.get('/links', util.checkUser, handler.fetchLinks);
app.post('/links', handler.saveLink);

app.get('/login', handler.loginUserForm);
app.post('/login', handler.loginUser);
app.get('/logout', handler.logoutUser);

app.get('/signup', handler.signupUserForm);
app.post('/signup', handler.signupUser);

app.get('/*', handler.navToLink);

module.exports = app;
