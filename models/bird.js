const mongoose = require('mongoose');

const BirdSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    sex:{
        type: String,
        require: true
    },
    age:{
        type: Number,
        require: true

    },
    price:{
        type: Number,
        require: true

    },
    image:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Bird', BirdSchema);