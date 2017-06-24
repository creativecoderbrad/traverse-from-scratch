
const express = require('express');
const pug = require('pug');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');


mongoose.connect(config.database);
var db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to mongoDB ...');
});

// check for db err
db.on('error', function(err){
  console.log(err);
});


// initialise our app
const app = express();


// bring in our schema models
var Article = require('./models/article');
var User = require('./models/user');

// load our view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

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

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});



// home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles ){
    if (err) {
      console.log(err);
    }
    // if no error
    else {
      res.render('index', {
        title: 'articles',
        articles: articles
      });
    }
  });
});

// route files

var articles = require('./routes/articles');
var users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);


// time of server start

function time (val) {
  var time = new Date();
  var hour = time.getHours();
  var min  = time.getMinutes();
  var sec  = time.getSeconds();

  var fulltime = hour + ':' + min + ':' + sec
  return fulltime;
}


// start our server
app.listen(3000, function() {
  console.log('started server on port 3000 at', time());
});
