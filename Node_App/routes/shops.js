const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Shop = require('../models/shop');
const config = require('../config/database');


// all shops
router.get('/all', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // res.send('places');
    Shop.find((err, shops) => {
      if (err)
        res.status(500).json({err: err});
    res.status(200).json({shops: shops});
    });
});
// all shops
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // res.send('places');
    Shop.findOne({'_id':req.params.id},(err, shop) => {
      if (err)
        res.status(500).json({err: err});
    res.status(200).json({shop: shop});
    });
});


// just preferenceShops
// router.get('/preferenceShops', passport.authenticate('jwt', {session: false}), (req, res, next) => {
//     // res.send('places');
//     res.json({shop: req.shops});
// });



// exports the module
module.exports = router;
