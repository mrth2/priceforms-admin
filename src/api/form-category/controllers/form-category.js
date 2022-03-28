'use strict';

/**
 *  form-category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

async function countCategorySubmission(category) {
  const count = await strapi.db.query('api::form-submission.form-submission').count({
    where: {
      category: category.id,
    }
  });
  category.count = count;
}

module.exports = createCoreController('api::form-category.form-category', ({ strapi }) => ({
  async popular(ctx) {
    if (!ctx.state.user) return ctx.unauthorized();

    const isOwner = strapi.service('api::form.form').isFormOwner(ctx.state.user);
    if (!isOwner) return ctx.forbidden();

    // get all category first
    const categories = await strapi.db.query('api::form-category.form-category').findMany({
      select: ['id', 'title'],
      where: {
        form: {
          owner: ctx.state.user.id
        }
      },
      populate: {
        icon: {
          select: ['url'],
        }
      },
      pagination: {
        pageSize: 100
      }
    });

    const requests = [];
    for (const category of categories) {
      requests.push(countCategorySubmission(category));
    }
    await Promise.all(requests);

    ctx.send({
      // count,
      categories: categories.sort((a, b) => b.count - a.count).slice(0, 5),
    });
  }
}));
