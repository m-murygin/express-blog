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

router.get('/show/:id', function (req, res) {
  postModel
    .findById(req.params.id)
    .then(post => {
      res.render('post', {
        post: post,
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

router.post('/addcomment', function (req, res) {
  let id = req.body.postid;
  let name  = req.body.name;
  let email  = req.body.email;
  let body  = req.body.body;
  let commentDate = new Date();

  req.checkBody('name', 'Name should be not empty').notEmpty();
  req.checkBody('email', 'Email should be not empty').notEmpty();
  req.checkBody('email', 'Email should be correct').isEmail();
  req.checkBody('body', 'Comment should be not empty').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    return postModel
      .findById(id)
      .then(post => {
        res.render('post', {
          title: 'Post',
          errors: errors,
          post: post,
          name: name,
          email: email,
          body: body,
        });
      });      
  }

  postModel
    .update({
      _id: id,
    }, {
      $push: {
        comments: {
          name: name,
          email: email,
          body: body,
          created: commentDate,
        },
      }
    })
    .then(() => {
      req.flash('success', 'Comment was added');
      res.redirect('/posts/show/' + id);
    });
});

module.exports = router;
