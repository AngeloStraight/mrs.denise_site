var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  Bird.find(function(err,docs){
    var birdChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize){
        birdChunks.push(docs.slice(i, i + chunkSize));
        //console.log(docs.slice(i, i + chunkSize))
    }
    res.render('shop/index', { title: 'Mrs. Denise', birds: birdChunks });
  });
});


router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  console.log(typeof productId);
  Bird.findById(productId, function(err, product){
    if (err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

module.exports = router;
