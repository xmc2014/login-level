module.exports = app =>{
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    // 授权登录
    const AuthsSchema = new Schema({
        authId:{type:String,unique:true,required:true},
        userId:{type:String,unique:true,required:true}, //用户id
        authType:{type:String,required:true}, //授权登录方式 phone email weixin weibo github等
        account:{type:String,unique:true,required:true},  //登录账号，可能是手机号码，或者邮箱，或者weixin weibo github
        password:{type:String},
        roleId:{type : Number,unique:true,required:true},
        statusId:{type:Number,required:true}, // 状态Id
        createTime:{type:String},
        token:{type:String},
        isLogin:{type:Boolean,required:true}
    });

    return mongoose.model("Auths",AuthsSchema, 'p_auths');
}



json={
    userId:222,
    view:[
        {
            modelId:22,
            "魔板位置":2,
            "魔板类型":"banner",
            borderColor:"#333",
            bgColor:"#dedede",
            "...":"...."
        },
        {
            modelId:33,
            "魔板位置":3,
            "魔板类型":"list",
            borderColor:"#333",
            bgColor:"#dedede",    
            "...":"...."     
        },
        {
            modelId:33,
            "魔板位置":4,
            "魔板类型":"list",
            borderColor:"#333",
            bgColor:"#dedede", 
            "...":"...."        
        }
        
    ]
}