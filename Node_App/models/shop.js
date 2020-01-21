const mongoose = require('mongoose');
const config = require('../config/database');


// User schema
const ShopSchema = mongoose.Schema({
    // _id: {
    //   type: mongoose.Types.ObjectId
    // },
    name: {
        type: String,
        unique: true
    },
    image_url: {
        type: String
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
});

const user = module.exports = mongoose.model('shop', ShopSchema);
