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
  },
  async delete(ctx) {
    if (!ctx.state.user) return ctx.unauthorized();

    const isOwner = strapi.service('api::form.form').isFormOwner(ctx.state.user);
    if (!isOwner) return ctx.forbidden();

    const { id } = ctx.params;

    const entity = await strapi.db.query('api::form-submission.form-submission').findOne({
      where: { id },
      populate: ['form', 'owner'],
    });
    // this submission must be owned by current form owner
    if (!entity) {
      return ctx.notFound();
    }
    if (entity.owner.id !== ctx.state.user.id) {
      return ctx.forbidden();
    }
    try {
      await strapi.db.query('api::form-submission.form-submission').delete({
        where: { id },
      });
      return ctx.send({ 'message': 'Submission deleted!' });
    } catch (e) {
      return ctx.badRequest(e);
    }
  }
}));
