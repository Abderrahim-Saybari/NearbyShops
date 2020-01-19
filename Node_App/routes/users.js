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
        password: req.body.password
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
                        password: user.password
                    }
                });
            }else{
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // res.send('PROFILE');
    res.json({user: req.user});
});


// exports the module
module.exports = router;