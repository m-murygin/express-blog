'use strict';

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/add', function(req, res) {
  req.db
    .get('categories')
    .find({})
    .then(cats => {
      res.render('add_post', {
        title: 'Add Post',
        categories: cats,
      });
    });
});

router.post('/add', function (req, res) {
  // get the form values
  let title = req.body.post_title;
  let category = req.body.category;
  let body = req.body.body;
  let author = req.body.author;
  let date = new Date();
  
  if (req.files.mainimage) {
    var mainImageOriginalName = req.files.mainimage.originName;
    var mainImageName = req.files.mainimage.name;
    var mainImageMime = req.files.mainimage.mimetype;
    var mainImagePath = req.files.mainimage.path;
    var mainImageExt = req.files.mainimage.extension;
    var mainImageSize = req.files.mainimage.size;
  } else {
    var mainImageName = 'noimage.png';
  }

  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('body', 'Body field is required');

  let errors = req.validationErrors();
  if (errors) {
    res.render('add_post', {
      errors: errors,
      body: body,
      post_title: title,
      title: 'Add Post',
    });

    return;
  }

  let posts = req.db.get('posts');

  posts.insert({
    title: title,
    category: category,
    body: body,
    author: author,
    date: date,
  }, function (err, post) {
    if (err) {
      res.send('There was an issue submitting the post');
    } else {
      req.flash('success', 'Post Submitted');
      res.location('/');
      res.redirect('/');
    }
  });
});

module.exports = router;
