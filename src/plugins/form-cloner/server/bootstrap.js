'use strict';

const formClonerActions = {
  actions: [
    {
      // Generate magic links
      section: 'plugins',
      displayName: 'Fully clone a form',
      uid: 'form-cloner.start',
      subCategory: 'Form',
      pluginName: 'form-cloner',
    },
  ],
};

module.exports = async ({ strapi }) => {
  await strapi.admin.services.permission.actionProvider.registerMany(
    formClonerActions.actions
  );
};
