const express = require('express');
const tagsRouter = express.Router();
const { getAllTags,
        getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");
  next(); 
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();
  res.send({
    tags
  });
});


tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    try {
      let tagName = req.params.tagName;
      const posts = await getPostsByTagName(tagName)

    if(!posts) {
        next('no posts');
      }
      console.log('posts: ', posts);
    
    //This extra below trying to mimick from Preston's demo example
    // if (posts.authorId === req.user.id){
    //   res.send({posts})
    //   } else {
    //   res.status(403);
    //   next('UNAUTHORIZED posts');
    //   }
    //Conditional ends here

    } catch ({ name, message }) {
      next({ name, message })
      
    }
});

module.exports = tagsRouter;