'use strict';

/**
 * magic-link.js controller
 *
 * @description: A set of functions called "actions" of the `magic-link` plugin.
 */

const _ = require("lodash");
module.exports = {
  generate: async (ctx) => {
    const magicLink = strapi.plugins['magic-link'].services['magic-link'];
    const { user: userService, jwt: jwtService } = strapi.plugins['users-permissions'].services;

    const params = _.assign(ctx.request.body);

    const formId = params.id;
    if (!formId) {
      return ctx.badRequest('missing.form.id');
    }

    // get form
    const form = await strapi.db.query('api::form.form').findOne({
      where: {
        id: formId,
      },
      populate: {
        owner: {
          select: ['id', 'email']
        }
      }
    });
    if (!form) {
      return ctx.badRequest('form.not.found');
    }
    // get form owner
    const owner = form.owner;
    if (!owner) {
      return ctx.badRequest('form.owner.not.found');
    }
    if (owner.blocked) {
      return ctx.badRequest('form.owner.blocked');
    }

    try {
      // 024 3723 6556
      const token = jwtService.issue({ id: owner.id });
      const url = `${strapi.service('api::form-submission.form-submission').getFormDashboardUrl(form)}/admin?magicToken=${token}`;
      return ctx.send({ url });
    } catch (err) {
      return ctx.badRequest(err);
    }
  },
};
