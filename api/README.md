# pc

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```


## 开发流程
```
 model->service->controller->route->view
```

## eggjs手脚架
```
cnpm i egg-init -g
```

## 添加mongodb数据库支持
```
# [egg-mongoose](https://github.com/eggjs/egg-mongoose)
cnpm i egg-mongoose -S
```

## 添加统一验证
```
# [egg-validate](https://github.com/eggjs/egg-validate)
cnpm i egg-validate -S
```

## 添加视图模板
```
# [egg-view-ejs](https://github.com/eggjs/egg-view-ejs)
cnpm i egg-view-ejs  -S
```

## 添加时间插件
```
# [moment](http://momentjs.com/)
cnpm i moment -S
```

## 添加生成随机数的插件
```
# [string-random](https://www.npmjs.com/package/string-random)
cnpm i string-random -S
```

##添加token插件
```
#[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
cnpm i jsonwebtoken -S
```
##登录设计流程
```
#查询根据密码账号或者第三方授权登录（只需查询account字段）查询表p_auths
#查询账号状态是否可用
#生成token，插入到数据表p_login
#查询账号基本信息p_user（返回值给前端用）
#生成登录日志，插入数据表p_login_log
```
