'use strict';

/**
 * form service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::form.form', ({strapi}) => ({
  async getOwnedForms(userId) {
    const ownedForms = await strapi.db.query('api::form.form').findMany({
      select: ['subDomain'],
      where: { owner: userId },
    });
    return ownedForms.map(form => form.subDomain);
  },
  isFormOwner(user) {
    return user.role.name === 'Form Owner';
  }
}));
