let config={
 "user": "admin",
 "pwdHash": "0549E27CEAD73CF1B3FE03AFB6598545",  // 08304 = md5(md5((md5(config.pwd).toUpperCase()+'F593B01C562548C6B7A31B30884BDE53')).toUpperCase()).toUpperCase()
 "url":"http://192.168.1.77:40001/json",
 "authenticate":"/Authenticate",
 "logout":"/Logout",
 "sygnalR":"/sygnalr"
}

module.exports=config;
