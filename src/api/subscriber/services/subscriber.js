'use strict';

/**
 * subscriber service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

function getFullName(subscriber) {
  if (!subscriber) return '';
  if (subscriber?.fullName) {
    return subscriber.fullName;
  }
  if (subscriber?.username) {
    return subscriber.username;
  }
  return subscriber.email;
}

module.exports = createCoreService('api::subscriber.subscriber', ({ strapi }) => ({
  getFullName
}));
