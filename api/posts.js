const express = require('express');
const postsRouter = express.Router();
const { requireUser } = require('./utils');
const { getAllPosts } = require('../db');
const { createPost } = require('../db')
const { updatePost,
       getPostById } = require('../db')

//Below was for CURL testing only
// postsRouter.post('/', requireUser, async (req, res, next) => {
//   res.send({ message: 'under construction' });
// });

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next(); // THIS IS DIFFERENT
});

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    postData.authorId = req.user.id
    postData.title = title
    postData.content = content
    // add authorId, title, content to postData object 
    // const post = await createPost(postData);
    const post = await createPost(postData);
    // this will create the post and the tags for us
    // if the post comes back, res.send({ post });
    if (postData) {
    res.send({ post });
    // otherwise, next an appropriate error object 
  } else {
    next({ 
      name: 'No posts', 
      message: 'Sorry no posts'
    });
  }
  } catch ({ name, message }) {
    next({ name, message });
  }
});


//This was originally right before module.exports but moved it up to see if my patch will 
//work this way. It works now.
// postsRouter.get('/', async (req, res) => {
//   const posts = await getAllPosts();

//   res.send({
//     posts
//   });
// });

//Updated function call for above on Mod 3
postsRouter.get('/', async (req, res) => {
  try {
    const allPosts = await getAllPosts();

    const posts = allPosts.filter(post => {
     
        // the post is active, doesn't matter who it belongs to
        if (post.active) {
          return true;
        }
      
        // the post is not active, but it belogs to the current user
        if (req.user && post.author.id === req.user.id) {
          return true;
        }
      
        // none of the above are true
        return false;
      });

      //Below is the short for above but not ideal
      // return post.active || (req.user && post.author.id === req.user.id);
      // keep a post if it is either active, or if it belongs to the current user
    // });

    res.send({
      posts
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});



//Sept 25, 2020 --- still working on this!!! The title and tags changed but the content hasn't.
postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a post that is not yours'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Still Working on this one!
postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(post ? { 
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});


module.exports = postsRouter;