var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');
var Users = require('../app/models/user');
var Links = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.find().exec().then(function(links) {
    console.log(links);
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Links.findOne({ url: uri }).exec().then(function(found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Links({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(function(err, newLink) {
          console.log(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  Users.findOne({ username: username })
    .exec().then(function(user) {
      console.log("HARE");
      if (!user) {
        console.log("HARE2");
        res.redirect('/login');
      } else {
        console.log("HARE3");
        user.comparePassword(password, function(match) {
          if (match) {
            console.log("HARE4");
            util.createSession(req, res, user);
          } else {
            console.log("HARe5");
            res.redirect('/login');
          }
        });
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  Users.findOne({ username: username })
    .exec().then(function(user) {
      if (!user) {
        var newUser = new Users({
          username: username,
          password: password
        });
        newUser.save(function(err, newUser) {
            console.log("DID WE GET HERE?");
            util.createSession(req, res, newUser);
            console.log("HOW ABOUT HERE?");
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Links.findOne({ code: req.params[0] }).exec().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits += 1;
      link.save(function(err) {
        // if(err) { throw err; }
        return res.redirect(link.url);
      });
    }
  });
};
