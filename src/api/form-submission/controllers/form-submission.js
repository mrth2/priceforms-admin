'use strict';

/**
 *  form-submission controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

async function populateSubmission(strapi, id) {
  const submission = await strapi.db.query('api::form-submission.form-submission').findOne({
    where: { id },
    populate: ['subscriber', 'form', 'category', 'categories'],
  });
  return submission;
}

async function getFormOwnerId(strapi, ctx) {
  const form = await strapi.db.query('api::form.form').findOne({
    where: {
      id: ctx.request.body.data.form?.id || ctx.request.body.data.form
    },
    populate: ['owner'],
  });
  ctx.request.body.data.owner = form.owner.id;
  // also set the request ip address
  const ipAddress = ctx.request.headers['x-forwarded-for']?.split(',')[0] || ctx.request.socket.remoteAddress || ctx.request.ip;
  ctx.request.body.data.ipAddress = ipAddress;
}

module.exports = createCoreController('api::form-submission.form-submission', ({ strapi }) => ({
  async create(ctx) {
    // overwrite body data with owner Id
    await getFormOwnerId(strapi, ctx);
    // check if there is submission already submitted from this ip address
    // ignore local ip
    const ipAddress = ctx.request.body.data.ipAddress;
    if (ipAddress !== '127.0.0.1') {
      const existingSubmission = await strapi.db.query('api::form-submission.form-submission').findOne({
        where: {
          ipAddress: ipAddress,
          form: ctx.request.body.data.form?.id || ctx.request.body.data.form,
        },
      });
      if (existingSubmission) {
        return ctx.badRequest('You have already submitted this form');
      }
    }
    try {
      const response = await super.create(ctx);
      console.log(response);
      // populate all the fields of created submission
      return {
        data: await populateSubmission(strapi, response.data.id),
        meta: response.meta,
      }
    } catch (e) {
      return ctx.badRequest(e);
    }
  },
  async update(ctx) {
    await getFormOwnerId(strapi, ctx);
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
