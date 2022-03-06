const util = require('util');
module.exports = (plugin) => {
  // override default users/me controller
  const currentMeController = plugin.controllers.user.me;
  plugin.controllers.user.me = async (ctx) => {
    await currentMeController(ctx);
    const isOwner = strapi.service('api::form.form').isFormOwner(ctx.state.user);
    if (isOwner) {
      // get all owned forms of this client
      ctx.body.ownedForms = await strapi.service('api::form.form').getOwnedForms(ctx.state.user.id);
    }
    ctx.body.isOwner = isOwner;
  };

  return plugin;
};