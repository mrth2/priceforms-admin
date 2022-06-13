'use strict';

const embedCodeActions = {
  actions: [
    {
      // Generate magic links
      section: 'plugins',
      displayName: 'Get embed code',
      uid: 'embed-code.generate',
      subCategory: 'Embed',
      pluginName: 'embed-code',
    },
  ],
};

module.exports = async ({ strapi }) => {
  await strapi.admin.services.permission.actionProvider.registerMany(
    embedCodeActions.actions
  );
};
