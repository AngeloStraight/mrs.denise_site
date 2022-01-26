var createError = require('http-errors');
var express = require('express');
const dotenv = require('dotenv')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Handlebars = require('handlebars');
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const connectDB = require('./config/db');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');

dotenv.config({path: './config/config.env'});
connectDB();
require('./config/passport');


// view engine setup
app.engine('.hbs', engine({handlebars: allowInsecurePrototypeAccess(Handlebars),defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(validator()); cant use validator this way anymore
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
  cookie: {maxAge: 180 * 60 * 1000 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user', userRoutes);
app.use('/', indexRouter);

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