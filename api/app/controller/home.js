'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    let title = "我是首页"; 
    // 向模板传入数据
    await this.ctx.render('index',{
      title: title
    });

  }

  async show() {
    const { ctx } = this;
    ctx.body = `welcome ${ctx.params.name}`;
  }
}

module.exports = HomeController;