const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const ejslayout = require('express-ejs-layouts');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require('express-session');
const { sessionKeySecret } = require('./config');

const { I18n } = require('i18n');
const { Router } = require('express');

/**
 * create a new instance with it's configuration
 */
const i18n = new I18n({
  locales: ['en', 'pl'],
  register: global,
  cookie: 'locale',
  defaultLocale: 'en',
  directory: path.join(__dirname, '/locales'),
  objectNotation: true
})

// Mongoose connection
require('./db/mongoose');

app.use(session({
  secret: sessionKeySecret,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  resave: true
}))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(i18n.init);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/../views'));
app.use(ejslayout);
app.set('layout', 'layouts/main');
app.use(express.static('public'));
app.use('/img', express.static('img'));

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware
app.use('/', require("./middleware/view.variables"));
// app.use('/admin', require("./middleware/is.auth.logged"));

// Routes
app.use(require('./routes/web'));

module.exports = app;