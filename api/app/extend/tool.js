'use strict';

const random = require('string-random');
const moment = require("moment");

// 生成唯一标识
exports.UUId=(n=8,obj={})=>{
   return random(n,obj);
}

// 格式化时间
exports.FormatDate = (rule) => moment().format(rule);
