'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  const db = req.db;
  let dbPosts = db.get('posts');
  dbPosts.find({}, {}, function (err, posts) {
    res.render('index', {
      title: 'Post List',
      posts: posts
    });
  });
});

module.exports = router;
