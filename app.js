const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const sequelize = require('./sequelize');

sequelize.start(config.database);
const app =  express();
app.use(bodyParser.json());

require('./routes/public')(app);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(config.port, function () {
  console.log('listening port: ' + config.port)
});

module.exports = app;
