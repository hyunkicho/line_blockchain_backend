var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//Module container 
global.dicontainer = require( './module/diContainer' )();
dicontainer.register( "BigNumber", require( 'bignumber.js' ) );
dicontainer.register( "pathUtil", require( 'path' ) );
dicontainer.register( "crypto", require( 'crypto' ) );
dicontainer.factory( "CommonConfig", require( "./config/CommonConfig" ) );
dicontainer.factory( "Err", require( './module/error-handle' ) );
dicontainer.factory( "JSONResponse", require( "./module/JSON-Response" ) );
dicontainer.factory( "DB", require( './module/sql' ) );

// Router Load
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
const cors = require('cors');


var app = express();

app.use(
  cors({
    origin:true,
    methods: 'OPTIONS,GET,PUT,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  }),
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

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
