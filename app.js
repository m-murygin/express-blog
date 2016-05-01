'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const flash = require('connect-flash');
const mongo = require('mongodb');
const expressValidator = require('express-validator');
const expressMessages = require('express-messages');
const db  = require('monk')('localhost/nodeblog');

const routes = require('./routes/index');
const posts = require('./routes/posts');
const categories = require('./routes/categories');

var app = express();
app.locals.moment = require('moment');

app.locals.truncateText = require('./modules/formatter').truncateText;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Handle File Uploads
app.use(multer({ dest: './uploads/images'}).any());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',  express.static(__dirname + '/uploads'));

// Handle Express Sessions
app.use(session({
  secret: 'lsdfjasdf_%dfss',
  saveUninitialized: true,
  resave: true
}));

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.');
    var root    = namespace.shift();
    var formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// init connect flash messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db;
  next();
});

// Set routes
app.use('/', routes);
app.use('/post', posts);
app.use('/category', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
