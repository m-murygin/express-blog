'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');

const db = require('../models');
const postModel = db.get('posts');
const categoryModel = db.get('categories');

router.get('/', function(req, res) {
  postModel
    .find({},{
      sort: {
        date: -1
      }
    })
    .then(posts => {
      res.render('index', {
        title: 'Post List',
        posts: posts
      });
  });
});

router.get('/category/:category', function (req, res) {
  postModel
    .find({
      category: req.params.category,
    },{
      sort: {
        date: -1
      }
    })
    .then(posts => {
      res.render('index', {
        title: 'Post List',
        posts: posts
      });
    });
});

router.get('/add', function(req, res) {
  categoryModel
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

  let mainImage = _.find(req.files, {
    fieldname: 'mainimage'
  });
  let mainImageFileName = mainImage ? mainImage.filename : null;

  postModel
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
      res.redirect('/posts');      
    }, () => {
      res.send('There was an issue submitting the post');
    });
});

module.exports = router;
