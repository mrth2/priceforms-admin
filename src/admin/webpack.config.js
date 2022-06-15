'use strict';

/* eslint-disable no-unused-vars */
module.exports = (config, webpack) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config
  // Important: return the modified config
  const definePlugin = new webpack.DefinePlugin({
    FRONTEND_DOMAIN: JSON.stringify(process.env.FRONTEND_DOMAIN),
  });
  config.plugins.push(definePlugin);
  return config;
};
