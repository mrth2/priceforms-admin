'use strict';

const formClonerRoutes = require('./routes');

module.exports = {
  type: 'admin',
  routes: [...formClonerRoutes],
};