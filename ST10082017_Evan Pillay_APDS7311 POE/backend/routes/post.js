const express = require('express')
const router = express.Router();
const Post = require('../models/post')
const checkauth = require('../check-auth')

router.post('',checkauth,(req, res)=>{
    const post = new Post(
        {
            id:req.body.id,
            name: req.body.name
        }
    )
    post.save().then(()=>{
        res.status(201).json({
            message: 'Post made',
            post:post
    })
    })
});

router.get('', (req, res) => {
    Post.find()
      .then((posts) => {
        if (posts) {
          res.status(200).json({
            message: 'All posts retrieved',
            posts: posts,
          })
        } else {
          res.status(404).json({
            message: 'No posts found',
          })
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          error: 'An error occurred while fetching posts.',
        });
      });
  });

  router.delete('/:postId', checkauth, (req, res) => {
    const postId = req.params.postId;
  
    Post.findByIdAndDelete(postId)
      .then(() => {
        res.status(200).json({
          message: 'Post deleted',
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          error: 'An error occurred while deleting the post.',
        });
      });
  });


module.exports = router