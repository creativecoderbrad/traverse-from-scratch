
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// bring in our user schema model
var User = require('../models/user');

// register form router

router.get('/register', function(req, res) {
  res.render('register');
});

// Register process

router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  // match passwords
  req.checkBody('password2','passwords do not match').equals(req.body.password);
  // get errors if there are
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors
    })
  }
 else {
   var newUser = new User({
     name: name,
     email: email,
     username: username,
     password: password
   });

   // encypt the plaintext password
   bcrypt.genSalt(10, function(err, salt){
     bcrypt.hash(newUser.password, salt, function(err, hash){
       if(err) {
         console.log(err)
       }
       // replace password with new hash val
       newUser.password = hash;
       //
       newUser.save(function(err){
         if(err) {
           console.log(err)
         }
         else {
            req.flash('success', 'you have successfully registered and can now login')
            res.redirect('/users/login');
         }
       });
     });
   });
 }
});

router.get('/login', function(req, res){
  res.render('login');
})

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;

//
