'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */

const passworlessActions = {
  actions: [
    {
      // Generate magic links
      section: 'plugins',
      displayName: 'Generate magic link',
      uid: 'magic-link.generate',
      subCategory: 'Access',
      pluginName: 'magic-link',
    },
  ],
};

module.exports = async ({ strapi }) => {
  strapi.store({
    environment: '',
    type: 'plugin',
    name: 'magic-link',
  });

  await strapi.admin.services.permission.actionProvider.registerMany(
    passworlessActions.actions
  );
};
