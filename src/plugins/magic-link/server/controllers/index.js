"use strict"

const magicLink = require("./magic-link");
const auth = require("./auth");

module.exports = {
  auth,
  'magic-link': magicLink
};
