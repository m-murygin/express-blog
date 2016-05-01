'use strict';

const db  = require('monk')('localhost/nodeblog');

module.exports = db;
