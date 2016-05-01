'use strict';

const express = require('express');
const router = express.Router();

router.get('/add', function(req, res) {
  res.render('add_category', {
    title: 'Add Category',
  });
});

router.post('/add', function (req, res) {
  req.checkBody('title', 'Title field is required').notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    return res.render('add_category', {
      errors: errors,
      title: 'Add Category',
    });
  }

  const dbCategories = req.db.get('categories');
  dbCategories
    .insert({
      title: req.body.title,
    })
    .then(() => {
      req.flash('success', 'Category was created');
      res.redirect('/');
    });
});

module.exports = router;