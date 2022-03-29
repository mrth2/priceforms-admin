'use strict';

/**
 * passwordless.js controller
 *
 * @description: A set of functions called "actions" of the `passwordless` plugin.
 */

const _ = require("lodash");
module.exports = {
  generate: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },
};
