'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  async list() {
    const { ctx } = this;
    // ctx.service.[service目录下要调用的文件名称]
    let userList = await ctx.service.user.queryUserList();
    ctx.body = userList;
  }

  async login(){
    const {ctx} = this;
    console.log('===========请求参数=============',ctx.request.body);
    let res = await ctx.service.user.login(ctx.request.body);
    ctx.body = res;
  }

  async register(){
    const {ctx} = this;
    console.log('===========请求参数=============',ctx.request.body);
    let res = await ctx.service.user.register(ctx.request.body);
    ctx.body = res;  
  }

  async delUser(){
    const {ctx} = this;
    console.log('===========请求参数=============',ctx.request.body);
    let res = await ctx.service.user.delUser(ctx.request.body);
    ctx.body = res;
  }

  async authByGithub(){
    const {ctx} = this;
    let res = await ctx.service.user.authByGithub();
    ctx.body = res;
  } 

  async logout(){
    const {ctx} = this;
    let res = await ctx.service.user.logout();
    ctx.body = res;
  }
}

module.exports = UserController;