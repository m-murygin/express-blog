'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');

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

  // let mainImageName;
  // if (req.files.mainimage) {
  //   var mainImageOriginalName = req.files.mainimage.originName;
  //   mainImageName = req.files.mainimage.name;
  //   var mainImageMime = req.files.mainimage.mimetype;
  //   var mainImagePath = req.files.mainimage.path;
  //   var mainImageExt = req.files.mainimage.extension;
  //   var mainImageSize = req.files.mainimage.size;
  // } else {
  //   mainImageName = 'noimage.png';
  // }

  req.checkBody('post_title', 'Title field is required').notEmpty();
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

  let mainImage = _.find(req.files, {
    fieldname: 'mainimage'
  });
  let mainImageFileName = mainImage ? mainImage.filename : null;

  posts
    .insert({
      title: title,
      category: category,
      body: body,
      author: author,
      date: date,
      mainImage: mainImageFileName
    })
    .then(() => {
      req.flash('success', 'Post Submitted');
      res.location('/');
      res.redirect('/');      
    }, () => {
      res.send('There was an issue submitting the post');
    });
});

module.exports = router;
