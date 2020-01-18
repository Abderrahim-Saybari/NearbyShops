const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const  config = require('./config/database')

// Connect to database
mongoose.connect(config.database, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

// On Connection
mongoose.connection.on('Connected', () => {
    console.log('Connected to database '+config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
    console.log('database error : ' + err);
});

const app = express();

const users = require('./routes/users');

// Port number
const port = 3000;

// cors middleware
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// bodyParser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session());

require('./config/passport')(passport);
 
app.use('/users', users);

// index Route start server
app.get('/', (req, res) => {
    res.send('Invalid endpoint');
});

// start server
app.listen(port, () => {
    console.log('Server started on '+port);
});
