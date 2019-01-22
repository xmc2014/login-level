'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 引用模块接口
  require('./route/home')(app);
  require('./route/user')(app);

  
};
