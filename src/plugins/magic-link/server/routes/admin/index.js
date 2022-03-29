'use strict';

const generateRoutes = require('./generate');

module.exports = {
  type: 'admin',
  routes: [...generateRoutes],
};