var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var adminsRouter = require('./routes/admins');
var workersRouter = require('./routes/workers');
var appointmentsRouter = require('./routes/appointments');
var reviewsRouter = require('./routes/reviews');
var addressesRouter = require('./routes/addresses');
var servicesRouter = require('./routes/services');
var customersRouter = require('./routes/customers');
var galleriesRouter = require('./routes/galleries');
var specialistsRouter = require('./routes/specialists');
var cors = require('cors');
require('dotenv').config();


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

app.use(process.env.API_PREFIX, indexRouter);

app.use('/', indexRouter);
app.use('/admins', adminsRouter);
app.use('/workers', workersRouter);
app.use('/appointments', appointmentsRouter);
app.use('/reviews', reviewsRouter);
app.use('/addresses', addressesRouter);
app.use('/services', servicesRouter);
app.use('/customers', customersRouter);
app.use('/galleries', galleriesRouter);
app.use('/specialists', specialistsRouter);


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
