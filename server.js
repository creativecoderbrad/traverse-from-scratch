

const express = require('express');
const pug = require('pug');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');


mongoose.connect('mongodb://localhost/nodekb');
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


// home route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if (err) {
      console.log(err);
    }
    else {
      res.render('index', {
        title: 'articles',
        articles: articles
      });
    }
  });
});


// get single article
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {
    article: article
    });
  });
})

// add article route
app.get('/articles/add', function(req, res){
  res.render('add_article', {
    title: ' add articles'
  });
});

// Add a submit post Route
app.post('/articles/add', function(req, res) {

  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // get errors
  var errors =  req.validationErrors();

  if(errors) {
    res.render('add_article', {
      title: 'Add article',
      errors: errors
    })
  }
  else {
    var article = new Article();
    //retrieve our json
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if (err) {
        console.log(err)
      }
      else {
        req.flash('success', 'Article added');
        res.redirect('/');
      }
    })
  }

});

// edit form
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {
    res.render('edit_article', {
      title: 'Edit article',
      article: article
    });
  });
})

// update submit route
app.post('/articles/edit/:id', function(req, res) {
  let article = {};
  //retrieve our json
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id:req.params.id}

  Article.update(query, article, function(err){
    if (err) {
    console.log(err)
    }
    else {
    res.redirect('/');
    }
  })
});

// delete article request

app.delete('/article/:id', function(req, res) {

  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if (err) {
    console.log(err)
    }
    res.send('success');
  });

});




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
