const { PORT = 3000 } = process.env
const express = require('express');
const server = express();
//May not need jwt required below. It is currently already on API/index.js and API/users.js
// const jwt = require('jsonwebtoken');
require('dotenv').config();


const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));


const { client } = require('./db');
client.connect();

const apiRouter = require('./api');
server.use('/api', apiRouter);


server.use((req, res, next) => {
    next();
  });


server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});