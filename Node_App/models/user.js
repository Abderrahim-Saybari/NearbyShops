const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


// User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const user = module.exports = mongoose.model('user', UserSchema);

module.exports.getUserById = function(id, callback){
    user.findById(id, callback);
}

module.exports.getUserByEmail = function (email, callback) {
    const query = {email: email}
    user.findOne(query, callback);
}
// Register newUser
module.exports.addUser = function (newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
module.exports.comparePassword = function(condidatePassword, hash, callback){
    bcrypt.compare(condidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}
