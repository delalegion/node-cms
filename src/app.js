const express = require('express');
const app = express();
const path = require('path');
const ejslayout = require('express-ejs-layouts');

// Mongoose connection
require('./db/mongoose');

// Routes
app.use(require('./routes/web'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(ejslayout);
app.set('layout', './layouts/main');
app.use(express.static('public'));

module.exports = app;