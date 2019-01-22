'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1545363397110_3339';
  
  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    }
   }

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/blend',
    options: {},
  };

  config.view = {
    mapping: {'.html': 'ejs'} // 左边写成.html后缀，会自动渲染.html文件
  };

  config.passportGithub = {
    key: '9f101ea54988a093c701',
    secret: 'fd7e1030e822279e5d94837aa33396de7a4f9653',
    callbackURL: '/passport/github/callback',
    // proxy: false,
  };
  return config;
};