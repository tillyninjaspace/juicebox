const express = require('express');
const apiRouter = express.Router();

// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = process.env;

// server.use(async (req, res, next) => {
//     const prefix = 'Bearer '
//     const auth = req.headers['Authorization'];
  
//     if (!auth) {
//       next(); // don't set req.user, no token was passed in
//     }
  
  
//     if (auth.startsWith(prefix)) {
//       // recover the token
//       const token = auth.slice(prefix.length);
//       try {
//         // recover the data
//         const { id } = jwt.verify(data, 'secret message');
  
//         // get the user from the database
//         const user = await getUserById(id);
//         // note: this might be a user or it might be null depending on if it exists
  
//         // attach the user and move on
//         req.user = user;
  
//         next();
//       } catch (error) {
//         // there are a few types of errors here
//       }
//     }
//   })

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;





// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

//Second middleware for this page. This is for above JWT.
apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
    //Below was just a test during a help meeting. It causes
    //http errors later so I had to comment it out
    // res.send({ message: "Working message..." })
  }

  next();
});





const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);

const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);


//This error handler is MIDDLEware -- note by Tilly
apiRouter.use((error, req, res, next) => {
    res.send(error);
  });


console.log('api router yoyo!')

module.exports =  apiRouter;
                    