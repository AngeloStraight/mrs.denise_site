var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var DeniseUser = require('../models/user');


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    DeniseUser.findById(id, function(err, user){
        done(err, user);
    })
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    
    DeniseUser.findOne({'email': email}, function(err, user){
        if (err){
            return done(err);
        }
        if (user){
            return done(null, false, {message: 'Email is already in use.'})
        }
        var newUser = new DeniseUser();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(e, result){
            if (e){
                return done(e);
            }
            return done(null, newUser);
        })
    });
}));


passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    
    DeniseUser.findOne({'email': email}, function(err, user){
        if (err){
            return done(err);
        }
        if (!user){
            return done(null, false, {message: 'User not found.'});
        }
        if (!user.validPassword(password)){
            return done(null, false, {message: 'wrong password.'});
        }
        return done(null, user);
    });
}));

