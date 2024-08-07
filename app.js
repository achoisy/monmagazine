// Import
const dotenv = require('dotenv');
// Config files load
dotenv.config({ silent: true });
// Import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const exphbs = require('express-handlebars');
const path = require('path');

const helper = require('./lib/helper.js');

moment.locale('fr'); // 'fr'

// Compose.io Mongo url
const mongodbUrl = process.env.MONGODB_CONNECT;
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl);

// Express wrap
const app = express();

// app.use(express.static('public'));
// set the static files location for our Ember application
// app.use(express.static(path.join(__dirname + '/client')));
// app.use('/messenger/pdf', express.static(path.join(__dirname, '/imagestock')));
app.use('/messenger/pdf', express.static(path.join(__dirname, '/pdf')));
app.use('/messenger/images', express.static(path.join(__dirname, '/imagestock')));
app.use('/messenger/preview/pdf/js', express.static(path.join(__dirname, '/nginx/html/js')));
app.use('/messenger/preview/pdf/sound', express.static(path.join(__dirname, '/nginx/html/sound')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: helper,
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Routes
require('./lib/routes')(app);

//------------------------------------------------------------------------------------
// Start Server
//------------------------------------------------------------------------------------
app.listen(2368, () => {
  console.log('App listening on port 2368!');
});

process.on('SIGINT', () => {
  mongoose.connection.close();
  setTimeout(() => {
   // 300ms later the process kill it self to allow a restart
    process.exit(0);
  }, 300);
});
// expose app
exports = module.exports = app;
