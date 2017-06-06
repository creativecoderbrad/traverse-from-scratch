

const express = require('express');
const pug = require('pug');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/nodekb');
var db = mongoose.connection;

// check connection
db.once('open', function(){
  console.log('Connected to mongoDB ...');
});

// check for db err
db.on('error', function(err){
  console.log(err);
});


// initialise our app
const app = express();



// start our server
app.listen(3000, function() {
  console.log('running server on port 3000');
});
