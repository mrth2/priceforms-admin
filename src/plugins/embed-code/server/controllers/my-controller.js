'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('embed-code')
      .service('myService')
      .getWelcomeMessage();
  },
};
