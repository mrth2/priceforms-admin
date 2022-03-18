'use strict';

/**
 *  subscriber controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscriber.subscriber', ({ strapi }) => ({
  async replace(ctx) {
    const { email, phone, firstName, lastName } = ctx.request.body;

    const subscriber = await strapi.db.query('api::subscriber.subscriber').findOne({
      where: { email },
    });

    let entity;
    const payload = {
      email,
      phone,
      firstName,
      lastName,
    };
    // if subscriber exist, update
    if (subscriber) {
      entity = await strapi.db.query('api::subscriber.subscriber').update({
        where: {
          id: subscriber.id
        },
        data: payload
      });
    }
    // else, create new subscriber
    else {
      entity = await strapi.db.query('api::subscriber.subscriber').create({
        data: payload
      });
    }

    ctx.send(entity);
  }
}));
