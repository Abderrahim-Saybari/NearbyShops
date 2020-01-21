const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {

    let newUser = new User ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        preferredShops_id: []
    });
    User.addUser(newUser, (err) => {
        if(err){
            res.json({"success": false, "msg":'Failed to register user'});
        }else{
            res.json({ "success": true, "msg": 'User registered' });
        }
    });

});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err,user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'user not found'});
        }
        User.comparePassword(password, user.password, (err, isMath) => {
            if(err) throw err;
            if(isMath){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        preferredShops_id: user.preferredShops_id
                    }
                });
            }else{
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});
// preferredShops
router.put('/preferredShops/:shop_id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let shop_id = req.params.shop_id;
    let user = JSON.parse(req.body.user);
    let shopIndex = user.preferredShops_id.indexOf(shop_id);

    if(shopIndex != -1){
      user.preferredShops_id = user.preferredShops_id.filter((id) => id != shop_id);
    }else{
      user.preferredShops_id.push(shop_id);
    }
    console.log(user);
    User.findOne({'_id': user._id}, (err, doc) => {
      if (doc){
        doc.preferredShops_id = user.preferredShops_id;
        doc.save();
        res.json({user: doc});
      }
      if(err)
      console.log(err);
    });
});


// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // res.send('PROFILE');
    res.json({user: req.user});
});




// exports the module
module.exports = router;
