'use strict';

/**
 *  form-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

async function populateSubmission(strapi, id) {
  const submission = await strapi.db.query('api::form-submission.form-submission').findOne({
    where: { id },
    populate: ['subscriber', 'form', 'category'],
  })
  return submission
}

module.exports = createCoreController('api::form-submission.form-submission', ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);
    // populate all the fields of created submission
    return {
      data: await populateSubmission(strapi, response.data.id),
      meta: response.meta,
    }
  },
  async update(ctx) {
    const response = await super.update(ctx);
    // populate all the fields of updated submission
    return {
      data: await populateSubmission(strapi, response.data.id),
      meta: response.meta,
    }
  },
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
