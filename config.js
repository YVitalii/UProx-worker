let config={
 "user": "admin",
 "pwdHash": "0549E27CEAD73CF1B3FE03AFB6598545",  // 08304 = md5(md5((md5(config.pwd).toUpperCase()+'F593B01C562548C6B7A31B30884BDE53')).toUpperCase()).toUpperCase()
 "url":"http://192.168.1.77:40001/json", // адрес сервера
 "authenticate":"/Authenticate", // адрес аутентификации
 "logout":"/Logout", // адрес для выхода
 "sygnalR":"/sygnalr",
 "inputDirection": 1384, // код входной двери
 "otputDirection" : 1385, // код выходной двери

}
config["db"]={
  url:"mongodb://express:Danya@localhost:27017/workersDB?authSource=WorkersDB&readPreference=primary&appname=Express&ssl=false",
  options:{useNewUrlParser: true, useUnifiedTopology:true ,useFindAndModify:false}
}
module.exports=config;
