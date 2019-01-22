module.exports = app => {
  
  // 显示参数
  app.router.get('/show/:name', app.controller.home.show);
};