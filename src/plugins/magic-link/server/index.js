"use strict"

const routes = require("./routes");
const policies = require("./policies");
const controllers = require("./controllers");
const bootstrap = require("./bootstrap");

module.exports = {
  bootstrap,
  controllers,
  policies,
  routes,
};
