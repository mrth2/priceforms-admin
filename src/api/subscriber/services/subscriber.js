'use strict';

/**
 * subscriber service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

function getFullName(subscriber) {
  if (subscriber.firstName && subscriber.lastName) {
    return `${subscriber.firstName} ${subscriber.lastName}`;
  }
  if (subscriber.firstName) {
    return subscriber.firstName;
  }
  if (subscriber.lastName) {
    return subscriber.lastName;
  }
  if (subscriber.username) {
    return subscriber.username;
  }
  return subscriber.email;
}

module.exports = createCoreService('api::subscriber.subscriber', ({ strapi }) => ({
  getFullName
}));
