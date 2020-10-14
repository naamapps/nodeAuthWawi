const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Imports routes 
const users = require('./routes/users.route');

require('dotenv').config()

// Connect to the db
let dev_db_url = 'mongodb://127.0.0.1:27017/Singit';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define web server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Define routing
app.use('/users', users);

let port = 1234;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});


