
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const uuid = require('uuid/v4');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BusinessCustomer = require('./model/BusinessCustomer');

var indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/bootstrap',express.static(__dirname + '/node_modules/bootstrap/'));

//login business
app.use(session({
    genid: (req) => {
        console.log('Inside the session middleware');
        console.log(req.sessionID);
        return uuid() // use UUIDs for session IDs
    },
    secret: 'oxygenius',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        BusinessCustomer.getBusinessCustomerFromDb(email,(bc)=> {
            if(bc.password === password) done(null,bc);
        });
    }
));

passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('Inside deserializeUser callback');
    console.log(`The user id passport saved in the session file store is: ${user}`);
    //const user = users[0].id === id ? users[0] : false;
    done(null, user);
});

app.use('/', indexRouter);
app.use('/login', loginRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




// error handler default case
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;