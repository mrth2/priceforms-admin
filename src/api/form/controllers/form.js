'use strict';

/**
 *  form controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const util = require('util');

module.exports = createCoreController('api::form.form', ({ strapi }) => ({
  // async find(ctx) {
  //   // form listing api only allows the form owner
  //   const isOwner = strapi.service('api::form.form').isFormOwner(ctx.state.user);
  //   if (!isOwner) return ctx.forbidden();
  //   // always append the form owner id to the query
  //   if (!ctx.request.query.filters) ctx.request.query.filters = {};
  //   ctx.request.query.filters.owner = ctx.state.user.id;
  //   const { data, meta } = await super.find(ctx);
  //   return { data, meta };
  // },
  // async findOne(ctx) {
  //   // form get one api only allow form owner
  //   const isOwner = strapi.service('api::form.form').isFormOwner(ctx.state.user);
  //   if (!isOwner) return ctx.forbidden();
  //   // check if form is owned by this client
  //   const form = await strapi.db.query('api::form.form').findOne({ 
  //     where: {
  //       id: ctx.request.params.id,
  //       owner: ctx.state.user.id
  //     }
  //   });
  //   if (!form) return ctx.notFound();
  //   return form;
  // }
}));
