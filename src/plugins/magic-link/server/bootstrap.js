'use strict';

const permissionsActions = require('./permissions-actions');

module.exports = async ({ strapi }) => {
  // bootstrap phase
  // boostrap plugin permissions
  await strapi.admin.services.permission.actionProvider.registerMany(
    permissionsActions.actions
  );
};
