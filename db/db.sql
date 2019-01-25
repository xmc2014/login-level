use blend;
// 用户表，只保存简单信息---------------------------------
db.p_user.drop();
db.createCollection("p_user",{autoIndexId:true});
db.p_user.insert([
    {
      "userId":"1",
      "nickName": "admin",
      "sex":"男",
      "headImg":""
    },
    {
      "userId":"2",
      "nickName": "don",
      "sex":"男",
      "headImg":""
    },
    {
      "userId":"3",
      "nickName": "xiaomc",
      "sex":"男",
      "headImg":""
    }
]);

// 用户鉴权表，也就是用于登录验证的表---------------------------------
db.p_auths.drop();
db.createCollection("p_auths",{autoIndexId:true});
db.p_auths.insert([
    {
        authId:"1",
        userId:"1",
        authType:"email", //授权登录方式 phone email weixin weibo github等
        account:"admin.foxmail.com",  //登录账号，可能是手机号码，或者邮箱，或者weixin weibo github
        password:"admin",
        roleId:1,
        statusId:1, // 状态Id
        createTime:new Date().getTime(),
        token:""
    },
    {
        authId:"2",
        userId:"2",
        authType:"email", //授权登录方式 phone email weixin weibo github等
        account:"don.foxmail.com",  //登录账号，可能是手机号码，或者邮箱，或者weixin weibo github
        password:"123456",
        roleId:1,
        statusId:1, // 状态Id
        createTime:new Date().getTime(),
        token:""
    },
    {
        authId:"3",
        userId:"3",
        authType:"phone", //授权登录方式 phone email weixin weibo github等
        account:"13714522589",  //登录账号，可能是手机号码，或者邮箱，或者weixin weibo github
        password:"123456",
        roleId:1,
        statusId:1, // 状态Id
        createTime:new Date().getTime(),
        token:""
    }
]);


//账号状态---------------------------------
db.p_status.drop();
db.createCollection("p_status",{autoIndexId:true});
db.p_status.insert([
    {
        statusId:1,
        userId:1,  // 用户id
        status:"正常", //状态，0：已删除 1：正常 2：未绑定手机号码 3：禁用    
    },
    {
        statusId:3,
        userId:2,  // 用户id
        status:"正常", //状态，0：已删除 1：正常 2：未绑定手机号码 3：禁用    
    },
    {
        statusId:3,
        userId:3,  // 用户id
        status:"正常", //状态，0：已删除 1：正常 2：未绑定手机号码 3：禁用    
    },
]);

// 用户账号类型---------------------------------
db.p_role.drop();
db.createCollection("p_role",{autoIndexId:true});
db.p_role.insert([
    {
        "roleId" : 0, "name" : "超级管理员"
    }，
    {
        "roleId" : 1, "name" : "系统管理员"
    }，
    {
        "roleId" : 2, "name" : "普通用户"
    }
]);

// 登录表---------------------------------
db.p_login.drop();
db.createCollection("p_login",{autoIndexId:true});
db.p_login.insert([
    {
        token:"tokentokentokentokentokentoken",
        userId:"1",
        authId:"1",
        loginTime:"1548126723277"
    }
]);


// 登录日志---------------------------------
db.p_loginLog.drop();
db.createCollection("p_loginLog",{autoIndexId:true});
db.p_loginLog.insert([
    {
        logId:1,
        userId:"3",
        time:new Date().getTime(),
        address:"127.0.0.1",
        device:"pc",
        browser:"",
        network:""  
    }
]);


show collections;