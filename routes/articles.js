

const express = require('express');
const router = express.Router();

// bring in our schema models
var Article = require('../models/article');


// add article route
router.get('/add', function(req, res){
  res.render('add_article', {
    title: ' add articles'
  });
});

// Add a submit post Route
router.post('/add', function(req, res) {

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
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {
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
  article.author = req.body.author;
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

  var query = {_id:req.params.id}

  Article.remove(query, function(err){
    if (err) {
    console.log(err)
    }
    res.send('success');
  });
});

// get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {
    article: article
    });
  });
})


module.exports = router;
