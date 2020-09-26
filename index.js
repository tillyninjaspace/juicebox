const PORT = 3000;
const express = require('express');
const server = express();
//May not need jwt required below. It is currently already on API/index.js and API/users.js
const jwt = require('jsonwebtoken');
require('dotenv').config();



const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));


const { client } = require('./db');
client.connect();

// Preston's example in his demo is const apiRouter = require('./api);
//same  as below
const apiRouter = require('./api');
server.use('/api', apiRouter);



server.use((req, res, next) => {
    // console.log("<____Body Logger START____>");
    // console.log(req.body);
    // console.log("<_____Body Logger END_____>");
  
    next();
  });



server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});