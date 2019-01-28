module.exports = app => {
  // 查询所有用户信息
  app.router.get('/api/v1/getUserList', app.controller.user.list);
  //根据用户UserId查询用户基本信息
  app.router.get('/api/v1/getUserInfoById', app.controller.user.getUserInfoById);
  // 用户登录
  app.router.post('/api/v1/login', app.controller.user.login);
  
  // 添加用户/注册信息
  app.router.post('/api/v1/addUser', app.controller.user.register);
  app.router.post('/api/v1/register', app.controller.user.register);

  //删除用户，级别高账号删除级别低的账户
  app.router.post('/api/v1/delUser',app.controller.user.delUser);

  // github授权登录
  app.passport.mount('github');
  app.router.get('/api/v1/auth/github',app.controller.user.authByGithub);
  // 退出登录
  app.router.get('/api/v1/auth/logout',app.controller.user.logout);

};