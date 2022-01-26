var express = require('express');
var router = express.Router();
var csrf = require('csurf');
const passport = require('passport');
var Bird = require('../models/bird');
const { body, validationResult } = require('express-validator');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next){
    res.render('user/profile');
  });

router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();
    res.redirect('/')
})

router.use('/', notLoggedIn, function(req, res, next){
    next();
});

router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signup',
      body('email').isEmail().normalizeEmail().withMessage('must be valid email'),
      body('password').isLength({min: 6 }).withMessage('password must be 6 characters long'),
      (req, res) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              var messages = []
              errors['errors'].forEach(function(error){
                messages.push(error.msg)  
              });
              res.redirect('/user/signup',false, req.flash('error', messages));
              // return done(null, false, req.flash('error', messages));
          }else{
            passport.authenticate('local.signup', {
                    successRedirect: '/user/profile',
                    failureRedirect: '/user/signup',
                    failureFlash: true
                  })(req,res)
          }
  });
  
  router.get('/signin', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signin',
      body('email').isEmail().normalizeEmail().withMessage('must be valid email'),
      body('password').notEmpty().withMessage('enter password'),
      (req, res) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              var messages = []
              errors['errors'].forEach(function(error){
                messages.push(error.msg)  
              });
              res.redirect('/user/signin',false, req.flash('error', messages));
              // return done(null, false, req.flash('error', messages));
          }else{
            passport.authenticate('local.signin', {
                    successRedirect: '/user/profile',
                    failureRedirect: '/user/signin',
                    failureFlash: true
                  })(req,res)
          }
  });

  module.exports = router;

  function isLoggedIn(req, res, next){
      if (req.isAuthenticated()){
          return next();
      }
      res.redirect('/');
  }

  function notLoggedIn(req, res, next){
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}