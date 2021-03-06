"use strict";
const Service = require("egg").Service;
const utils = require("../extend/tool");
const jwt = require('jsonwebtoken');
// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');  // 生成token
// var decoded = jwt.verify(token, 'shhhhh'); // 解码token

class UserService extends Service {
  // 查询用户列表
  async queryUserList() {
    return this.ctx.model.User.find({}, { _id: 0 })
      .then(res => {
        return { success: true, msg: "", code: 0, data: res };
      })
      .catch(err => {
        return { success: false, err: err };
      });
  }

  /**
   * 根据userId查询用户基本信息，要登录才能查询
   * @param {*} param 
   */
  async getUserInfoById(param){
    if(!param || !param.userId || !param.token){
      return { success: false, err:"查询用户基本信息失败,参数不完整"};
    }
    const checkTokenObj =  await this._isAuthToken(param.token);
    if(!checkTokenObj.success){
      return checkTokenObj;
    }else{ //查询用户信息
      return await this._queryUserById(param.userId);
    }
  }

  /**
   * 验证token是否失效
   */
  async _isAuthToken(token){
    return  this.ctx.model.Login.find({token:token}, { _id: 0 })
              .then(res=>{
                console.log("----isAuthToken-----model.Login.find-----:\n"+res+"\n");
                if(res.length==0){
                  return { success:false, err:"无效的token"}
                }else if(new Date().getTime()-res[0].loginTime>(30*60*1000)){ //超过30分钟token失效
                  return { success:false, err:"token失效，请重新获取"}
                }else{ //token可用，并更新token的失效时间
                  this.ctx.model.Login.update({ token: token }, { $set: { loginTime: new Date().getTime().toString() } }).then(res=>{
                    console.log("更新token的失效时间:\n",res);
                  })
                  return { success:true, data:token };
                }
              })
              .catch(err=>{
                return { success:false, err:err}
              })

  }

  // 根据用户id查询用户基本信息
  async _queryUserById(userId){
    console.log("{userId:userId}:",{userId:userId});
    return this.ctx.model.User.find({userId:userId}, { _id: 0 })
      .then(res => {
        return { success: true, msg: "查询用户基本信息成功", code: 0, data: res[0] };
      })
      .catch(err => {
        return { success: false, err: err };
      });    
  }

  // 用户登录
  async login(param) {
    console.log('-----login params-----',param)
    if(!param.authType){
      param.authType="phone";
    }
    // let tempPars = {
    //   authType: param.authType ||"phone",
    //   account:param.account,
    //   password:param.password
    // };
    return this.ctx.model.Auths.find(param,{_id:0,password:0})
      .then(res => {
        console.log('model.Auths.find-----------:\n',res+"\n");
        if (res[0] && res[0].statusId==1) { // Auths中查到记录
          // this._updataAuthStatus(res[0].authId,true); //更新用户状态
         return this._updataToken(res[0])
               .then(token=>{
                  //查询用户基本信息
                return this._queryUserById(res[0].userId)
                      .then(_queryUserByIdRes=>{
                          console.log("_queryUserByIdRes:",_queryUserByIdRes);
                          res[0].token=token;
                          let resData = {
                            mainInfo:{},
                            authInfo:res[0]
                          };
                          if(_queryUserByIdRes.success){
                            resData.mainInfo=_queryUserByIdRes.data;
                            return { success: true, msg:"登录成功", data:resData};
                          }
                        })
          })
         }else{ // 查不到记录
          return { success: false, msg:"用户名或密码错误", err: err };
         } 
      })
      .catch(err => {
        return { success: false, msg:"用户名或密码错误", err: err };
      });
  }

  /**
   * 更新login表中的token信息
   * 查询表如果有数据就更新，没有就添加记录
   * @param {*} authObj 
   */
  async _updataToken(authObj) {
    let token = jwt.sign({authObjStr: JSON.stringify(authObj)}, 'shhhhh'); // 生成token
    const findLoginInfo = await this.ctx.model.Login.find({authId: authObj.authId }, {_id: 0 });
    console.log("model.Login.find-------------------------:\n"+findLoginInfo+"\n");
    if (findLoginInfo && findLoginInfo.length < 1) {
      // 添加记录
      return await this._insertLogin(authObj, token);
    } else {
      // 更新记录
      return await this._updateLogin(authObj, token);
    }
  }
  /**
   * 插入登录信息
   * @param {*} authObj 
   * @param {*} token 
   */
  async _insertLogin(authObj, token) {
    return await this.ctx.model.Login.create({
      userId: authObj.userId,
      authId: authObj.authId,
      token: token,
      loginTime: (new Date().getTime()).toString()
    }).then(res => {
      console.log("model.Login.create---------:\n",res+"\n");
      return token;
    })
  }

  /**
   * 更新登录信息
   * @param {*} authObj 
   * @param {*} token 
   */
  async _updateLogin(authObj, token) {
    return await this.ctx.model.Login.update({
      authId: authObj.authId
    }, {
      $set: {
        token: token,
        loginTime: (new Date().getTime()).toString()
      }
    }).then(res => {
      console.log("model.Login.update---------:\n",res+"\n");
      return token;
    })
  }

  //更新用户登录状态
  async _updataAuthStatus(id,isLogin){
      this.ctx.model.Auths.update({ authId: id }, { $set: { isLogin: isLogin } } )
      .then(data=>{
        if(data.nModified || data.ok==1){
          return { success: true, msg:"更新用户登录状态成功", data: true};
        }
      })
      .catch(err=>{
        return { success: false, msg:"更新用户登录状态失败", err: err };
      })
  }
  /**
   * 删除用户
   * @param {*} pars 
   */
  async delUser(pars){
    if(!pars.token){
      return this.returnTips(false,"您还没登录",null);
    }else if(!pars.userId){
      return this.returnTips(false,"要删除的用户userId不能为空",null);
    }
    let admin = await this.ctx.model.Auths.find({token:pars.token});
    if(admin&&admin.length<1 || admin&&admin[0].statusId!=1){
      return this.returnTips(false,"您还没登录,token过期，请重新登录",null);
    }
    let user = await this.ctx.model.Auths.find({userId:pars.userId});
    if(user&&user.length<1 || user&&user[0].statusId!=1){
      return this.returnTips(false,"要删除的用户不存在",null);
    }
    if(admin[0].roleId>=user[0].roleId){
      return this.returnTips(false,"您的权限不够，无法删除指定用户",null);
    }

    let userId = user[0].userId,
        ctx = this.ctx;
    return this.ctx.model.Auths.remove({userId:userId})
    .then(res=>{
      console.log('------res--------',res);
      if(res.ok){
        // 接着删除用户基本信息
        ctx.model.User.remove({userId:userId});
        return { success: true, msg: "删除用户成功", code: 0,data:{"userId":userId}};
      }else{
        return { success: true, msg: "删除用户失败", code: 0};
      }
    })
    .catch(err=>{
      return { success: false, err: err };
    });
  }

  // 添加用户基本信息
  async _addUser(pars){
    console.log("_addUser-------pars:\n",pars);
    let userId = utils.UUId(),
        tempPars = {
          userId:userId,
          nickName: pars.nickName,
          sex:pars.sex || "男",
          headImg:pars.headImg
    }
    // tempPars = Object.assign(tempPars,pars);
    return this.ctx.model.User.create(tempPars)
    .then(res=>{
      console.log('_addUser------res--------',res);
      if(res){
        return { success: true, msg: "添加用户基本信息成功", code: 0, data:tempPars};
      }else{
        return { success: true, msg: "添加用户基本信息失败", code: 0};
      }
    })
    .catch(err=>{
      console.log('_addUser------err--------',err);
      return { success: false, err: err };
    });
  }
  //添加登录信息
  async _addAuth(pars){
    console.log("_addAuth-------pars:\n",pars);
    let tempPars = {
      authId:utils.UUId(),
      userId:pars.userId, //用户id
      authType:pars.authType, //授权登录方式 phone email weixin weibo github等
      account:pars.account,  //登录账号，可能是手机号码，或者邮箱，或者weixin weibo github
      password:pars.pars || "",
      roleId:pars.roleId || 1,
      statusId:pars.statusId || 1, // 状态Id
      createTime:new Date().getTime(),
      token:pars.token || "",
      isLogin:pars.isLogin || false
    };
    return await this.ctx.model.Auths.create(tempPars)
    .then(res=>{
      console.log('_addAuth------res--------',res);
      return { success: true, msg: "添加登录信息成功", code: 0, data:tempPars};
    })
    .catch(err=>{
      console.log("_addAuth-------------------err:",err)
      return { success: false, err: err };
    })
  }

  /**
   *  注册用户 
   * 先添加用户基本信息(user),在添加登录信息（auth)
   * @param {*} pars 
   */
  async register(pars){
    let userPars = pars.userPars,
        authPars = pars.authPars;
    let userRes = await this._addUser(userPars);
    if(!userRes.success){
      return { success: false, msg: "注册失败",data:null}
    }

    console.log("---------------------------------userRes:",userRes);
    authPars.userId=userRes.data.userId;
    let authRes = await this._addAuth(authPars);
    if(!authRes.success){
      return { success: false, msg: "注册失败",data:null}
    }
    let data = Object.assign({},userPars,authPars);
    return { success: true, msg: "注册成功",data:data}
  }

  //查询授权登录账号信息
  async _getAuthInfo(pars){
    return this.ctx.model.Auths.find(pars)
    .then(res=>{
      console.log("_getAuthInfo res---------:\n",res);
      return { success: true, msg: "登录账号查询成功", code: 0,data:res};
    }).catch(err=>{
      return { success: false, err: err };
    })
  }

  //github授权登录
  async authByGithub(){
    const ctx = this.ctx;
    if (ctx.isAuthenticated()) {
      console.log("github授权成功")
      console.log("github授权回调数据:\n",ctx.user);
      let githubUser = ctx.user,
          pars={
                authType:"github",
                account:githubUser.id
              };
      const authsInfo = await this._getAuthInfo(pars);
      //数据库里有值直接返回
      if(authsInfo.success && authsInfo.data.length>0){
        return { success: true, msg:"github授权登录成功", data: authsInfo.data[0]};
      }else{ // 先注册（添加数据到数据库在返回值）
        let userPars = {
                        nickName:githubUser.name,
                        headImg:githubUser.photo
                      },
            authPars = {
              authType:"github", //授权登录方式 phone email weixin weibo github等
              account:githubUser.id,  //登录账号，可能是手机号码，或者邮箱，或者weixin weibo github
              password:"",
              roleId:1,
              statusId:1, // 状态Id
              createTime:new Date().getTime(),
              token:githubUser.accessToken,
              passportObj:JSON.stringify(githubUser),
              isLogin:true
            };  
        const regRes = await this.register({"userPars":userPars,"authPars":authPars});
        if(!regRes.success){
          return { success: false, msg:"github授权登录失败", data: regRes.data};
        }else{
          return { success: true, msg:"github授权登录成功", data: regRes.data};
        }
      }

    }else{
      return '<a href="/passport/github">Github</a>';
      // return { success: false, msg:"github授权登录失败", data: null};
    }
  }

  async logout(){
    const ctx = this.ctx;
    ctx.logout();
    return { success: true, msg:"退出登录成功", data: 1};
  }

  _isLogin(){
    const ctx = this.ctx;
    return ctx.isAuthenticated();
  }

  returnTips(isSuccess,msg,data){
     return { success: isSuccess, msg:msg, data:data||null};
  }
}

module.exports = UserService;
