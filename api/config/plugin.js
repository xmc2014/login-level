'use strict';

// had enabled by egg
// exports.static = true;

// [egg-mongoose](https://github.com/eggjs/egg-mongoose)
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

// [egg-validate](https://github.com/eggjs/egg-validate)
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

module.exports.passport = {
  enable: true,
  package: 'egg-passport',
};

module.exports.passportGithub = {
  enable: true,
  package: 'egg-passport-github',
};