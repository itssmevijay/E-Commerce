var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose')
const connectDB = require('./config/connection.js')

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const ConnectMongodbSession = require('connect-mongodb-session')
const mongodbSession = new ConnectMongodbSession(session)

var userRoute = require('./routes/userRoute');
var adminRoute = require('./routes/adminRoute');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts)

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/backEnd')));



// Connect to mongodb
connectDB();

//session
app.use(session({
  saveUninitialized: true,
  secret: 'sessionSecret',
  resave: false,
  store: new mongodbSession({
    uri: "mongodb://127.0.0.1:27017/E-Commerce" ,
    collection: "session"
  }),
  cookie: {
    maxAge: 1000 * 60 * 24 * 10,//10 days
  },
}))


app.use('/', userRoute);
app.use('/admin', adminRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
