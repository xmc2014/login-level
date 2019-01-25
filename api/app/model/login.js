module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
 
  // 定义了表数据的类型
  const LoginSchema = new Schema({
    userId:{type:String,unique:true,required:true},
    authId: {type: String,unique:true,required:true},
    token: {type: String,unique:true,required:true},
    loginTime:{type: String }
  });
  
  // model(参数1，参数2，参数3）参数3是你数据表中需要操作的表的名字，
  // 比如我现在要操作的是名字叫mongoTest里面的叫userInfo的表
  return mongoose.model('Login', LoginSchema,'p_login');
}