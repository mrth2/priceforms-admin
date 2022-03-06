'use strict';

/**
 *  form-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::form-submission.form-submission', ({ strapi }) => ({
  async find(ctx) {
    if (!ctx.state.user) return ctx.unauthorized();

    const isOwner = strapi.service('api::form.form').isFormOwner(ctx.state.user);
    if (!isOwner) return ctx.forbidden();

    // always append the form owner id to the query
    if (!ctx.request.query.filters) ctx.request.query.filters = {};
    ctx.request.query.filters.owner = ctx.state.user.id;
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
  async findOne(ctx) {
    if (!ctx.state.user) return ctx.unauthorized();

    const isOwner = strapi.service('api::form.form').isFormOwner(ctx.state.user);
    if (!isOwner) return ctx.forbidden();
    return await super.findOne(ctx);
  }
}));
