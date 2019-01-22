module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
 
  // 定义了表数据的类型
  const LoginLogSchema = new Schema({
    logId:{type:Number,unique:true,required:true},
    userId:{type:Number,unique:true,required:true},
    time: {type: String },
    address: {type: String},
    device:{type : String},
    browser:{type : String},
    network:{type : String}
  });
  
  // model(参数1，参数2，参数3）参数3是你数据表中需要操作的表的名字，
  // 比如我现在要操作的是名字叫mongoTest里面的叫userInfo的表
  return mongoose.model('LoginLog', LoginLogSchema,'p_loginLog');
}