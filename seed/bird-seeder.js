var Bird = require('../models/bird');
var mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({path: './config/config.env'})

const connectDB = require('../config/db');
connectDB()

var birds = [
    new Bird({
        name:"Dove",
        sex:"male",
        age:1,
        price:150,
        image: "/images/birdsoncage.PNG",
        createdAt: Date.now()
    }),
    new Bird({
        name:"Dove",
        sex:"female",
        age:3,
        price:150,
        image: "/images/birdonbooks.JPG",
        createdAt: Date.now()
    }),
    new Bird({
        name:"Dove",
        sex:"male",
        age:10,
        price:150,
        image: "/images/birdsonfridge.JPG",
        createdAt: Date.now()
    }),
];

var done = 0;
for (var i = 0; i < birds.length; ++i){
    birds[i].save(function(err, result){
        done++;
        if (done === birds.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect()
}
