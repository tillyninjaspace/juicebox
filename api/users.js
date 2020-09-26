// api/users.js
const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { getAllUsers } = require('../db');
const { getUserByUsername } = require('../db');

//Yoyo! last item before committing for Part 2, Day 2 -- Tilly
const { createUser } = require('../db');

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
});

//Previous users.Router Code 
// usersRouter.post('/login', async (req, res, next) => {
//   console.log(req.body);
//   res.end();
// });


//Updated users.Router Code from Part 2, Day 2 on Sept 24 -- Tilly
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      // create token & return to user


//Sign an object (something like jwt.sign({/* user data */}, process.env.JWT_SECRET)) with both the id and username from the user object with the secret in process.env.JWT_SECRET
//Add a key of token, with the token returned from step 2, to the object passed to res.send()

      const token = jwt.sign( user , JWT_SECRET, { expiresIn: '7d' });
      console.log('the token:', token);
//Ask Redzuan about expiresIn: and how to return it with the message in res.send below

      res.send({ message: "you're logged in now!", "token": token });
      
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});


//YoYO! Last thing to add with createUser deconstructe above! 
usersRouter.post('/register', async (req, res, next) => {
  const { username, password, name, location } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    }

    const user = await createUser({
      username,
      password,
      name,
      location,
    });

    const token = jwt.sign({ 
      id: user.id, 
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({ 
      message: "thank you for signing up",
      token 
    });
  } catch ({ name, message }) {
    next({ name, message })
  } 
});




module.exports = usersRouter;