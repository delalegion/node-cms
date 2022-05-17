const express = require('express');
const app = express();
const path = require('path');
const ejslayout = require('express-ejs-layouts');

// Mongoose connection
require('./db/mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/../views'));
app.use(ejslayout);
app.set('layout', 'layouts/main');
app.use(express.static('public'));

// Routes
app.use(require('./routes/web'));

module.exports = app;