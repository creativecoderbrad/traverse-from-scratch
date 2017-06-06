

const express = require('express');
const pug = require('pug');
const path = require('path');

// initialise our app
const app = express();


// load our view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.get('/', function(req, res){

var articles = [
{
  id: 1,
  title: 'Article one',
  author: 'brad lumber',
  body: 'this is article one which has text'
},
{
  id: 2,
  title: 'Article two',
  author: 'john doe',
  body: 'this is article two which has text'
},
{
  id: 3,
  title: 'Article three',
  author: 'jane doe',
  body: 'this is article three which has text'
}
];


  res.render('index', {
    title: 'articles',
    articles: articles
  });
});

app.get('/articles/add', function(req, res){
  res.render('add_article', {
    title: ' add articles'
  });
});

// start our server
app.listen(3000, function() {
  console.log('running server on port 3000');
});
