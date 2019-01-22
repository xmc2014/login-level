module.exports = app =>{
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    //账号状态
    const StatusSchema = new Schema({
        statusId:{type:Number,unique:true,required:true},
        userId:{type:Number,unique:true,required:true},  // 用户id
        status:{type:String,unique:true,required:true}, //状态，0：已删除 1：正常 2：未绑定手机号码 3：禁用
    });

    return mongoose.model("Status",StatusSchema, 'p_status');
}