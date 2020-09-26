const express = require('express');
const tagsRouter = express.Router();
const { getAllTags,
        getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); // THIS IS DIFFERENT
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();
  res.send({
    tags
  });
});


//It shows up in the return information but not the browser
tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    try {
      let tagName = req.params.tagName
      const posts = await getPostsByTagName(tagName)
      // use our method to get posts by tag name from the db
    if(!posts) {
        next('no posts');
      }
      console.log('posts: ', posts);
    
    if (posts.authorId === req.user.id){
      res.send({posts})
      } else {
      res.status(403);
      next('UNAUTHORIZED posts');
      }

    } catch ({ name, message }) {
      next()
      // next({ name, message });
      // forward the name and message to the error handler
    }
});

module.exports = tagsRouter;