

const express = require('express');
const pug = require('pug');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
    res.redirect('/');
    }
  })
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


// start our server
app.listen(3000, function() {
  console.log('running server on port 3000');
});
