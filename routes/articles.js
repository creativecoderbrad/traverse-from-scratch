

const express = require('express');
const router = express.Router();

// bring in our schema models
var Article = require('../models/article');
var User = require('../models/user');


// add article route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title: ' add articles'
  });
});

// Add a submit post Route
router.post('/add', function(req, res) {

  req.checkBody('title', 'Title is required').notEmpty();
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
    // gets the authors id object who submits
    article.author = req.user._id;
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

// load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article) {
    //
    if (article.author != req.user._id) {
      req.flash('danger', 'not authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit article',
      article: article
    });
  });
})

// update submit route
router.post('/edit/:id', function(req, res) {
  var article = {};
  //retrieve our json
  article.title = req.body.title;
  article.body = req.body.body;

  var query = { _id:req.params.id}

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

router.delete('/:id', function(req, res) {

  if (!req.user._id) {
    res.status(401).send();
  }

  var query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article) {
    if(article.author != req.user._id) {
      res.status(401).send();
    }
    else {
      Article.remove(query, function(err){
        if (err) {
        console.log(err)
        }
        res.send('success');
      });
    }
  });
});

// get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {

    User.findById(article.author, function(err, user){
      res.render('article', {
      article: article,
      author: user.name
      });
    });

  });
})

// access control

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  else {
    req.flash('danger', 'please login');
    res.redirect('/users/login');
  }
}


module.exports = router;
