'use strict';

const pluginId = require('../../pluginId');

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/generate',
      handler: 'magicLink.generate',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'plugin::content-manager.hasPermissions',
            config: { actions: [`plugin::${pluginId}.magic-link.access`] },
          },
        ],
      },
    },
  ],
};
