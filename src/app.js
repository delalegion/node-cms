const express = require('express');
const app = express();
const path = require('path');
const ejslayout = require('express-ejs-layouts');
const cookieParser = require("cookie-parser");

const { I18n } = require('i18n');
const { getLocale } = require('i18n');

/**
 * create a new instance with it's configuration
 */
const i18n = new I18n({
  locales: ['en', 'pl'],
  register: global,
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales'),
  objectNotation: true
})

// Mongoose connection
require('./db/mongoose');

app.use(cookieParser());
app.use(i18n.init)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/../views'));
app.use(ejslayout);
app.set('layout', 'layouts/main');
app.use(express.static('public'));

// body parser
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use('/', require("./middleware/view.variables"));

// Routes
app.use(require('./routes/web'));

module.exports = app;