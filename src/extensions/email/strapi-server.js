'use strict';

const { isNil } = require('lodash/fp');
const { ApplicationError } = require('@strapi/utils').errors;

module.exports = (plugin) => {
  // overwrite test email
  plugin.controllers.email.test = async (ctx) => {
    const { to } = ctx.request.body;

    if (isNil(to)) {
      throw new ApplicationError('No recipient(s) are given');
    }

    const adminUrl = strapi.config.get('server.url') || `http://${strapi.config.get('server.host')}:${strapi.config.get('server.port')}`;
    const email = {
      to,
      template_id: 'd-666eb7c3184940459756f38e981d134f',
      dynamic_template_data: {
        client: {
          name: "John Doe"
        },
        form: {
          name: "Catania",
          case: "Motor Vehicle Accident"
        },
        user: {
          name: "Modric",
          email: "modric@footballer.com"
        },
        submissionURL: `${adminUrl}/admin/submissions`
      }
    };

    try {
      await strapi
        .plugin('email')
        .service('email')
        .send(email);
    } catch (e) {
      if (e.statusCode === 400) {
        throw new ApplicationError(e.message);
      } else {
        throw new Error(`Couldn't send test email: ${e.message}.`);
      }
    }

    // Send 200 `ok`
    ctx.send({});
  };

  return plugin;
};