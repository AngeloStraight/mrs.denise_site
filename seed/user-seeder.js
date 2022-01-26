var User = require('../models/user');
var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});

const connectDB = require('../config/db');
connectDB()

var newUser = new User();
newUser.email = "angelo@gmail.com";
newUser.password = newUser.encryptPassword("asdfsdjfhjdahjd");
newUser.save(function(e, result){
    if (e){
        return done(e);
    }
    return done(null, newUser);
})

function exit(){
    mongoose.disconnect()
}