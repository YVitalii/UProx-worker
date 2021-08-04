const {open}=require("fs/promises")
const md5 = require('md5');
const config = require('../uProx-config.js');
const axios = require('axios');
const sygnalR= require ("@microsoft/signalr");
// const connection= new signalR.HubConnectionBuilder()
//                                 .withUrl(config.url+config.sygnalR)
//                                 .build(); // подключение к sygnalR
//
// connection.on("onMessage", data => {
//     console.log(data);
// });
// //console.dir(config);
// var userSID, userToken;

// ------------ логгер  --------------------
const log = require('../tools/log.js'); // логер
let logName="<"+(__filename.replace(__dirname,"")).slice(1)+">:";
let gTrace=0; //=1 глобальная трассировка (трассируется все)
// ----------- настройки логгера локальные --------------
// let logN=logName+"описание:";
// let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
// trace ? log("i",logN,"Started") : null;

async function authenticate(user,pwdHash) {
  // ----------- настройки логгера локальные --------------
  let logN=logName+"authenticate(user:"+user+";pwdHash:"+pwdHash+"):";
  let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
  trace ? log("i",logN,"Started") : null;
  // ---------- логер -------------------------------------
  let response=""
  try {
    response = await axios({
        method:'post',
        url:config.url+config.authenticate,
        data:{
          UserName:user,
          PasswordHash: pwdHash
        }
      }); // await axios
      userSID=response.data.UserSID;
      userToken=response.data.UserToken;
      log("i","Athenticate succes. UserSID= ", userSID)
      return response.data;
  } catch (e) {
    return Promise.reject(e);
  }

};//function authenticate

async function logout() {
  // ----------- настройки логгера локальные --------------
  let logN=logName+"logout(userSID:"+userSID+"):";
  let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
  trace ? log("i",logN,"Started") : null;
  // ---------- логер -------------------------------------
  try {
    trace ? log("i",logN,"Transaction started") : null;
    let res = await axios({
        method:'post',
        url:config.url+config.logout,
        data:{
          UserSID:userSID
        }
      }); // await axios
    trace ? log("i",logN,"User logouted!" ) : null;

  } catch (e) {
    return Promise.reject(e);
  }
} // function logout()
function dateStringify(d){
  if (! d) {
    d = new Date();
  };
  let now=(new Date()).toDateString();
  d = new Date(now);
  return `\/Date(${new Date(d).getTime()}+0300)\/` //""+ (new Date(d).getTime())//
}
async function eventGetList(options) {
  /*
    "subscriptionEnabled":boolean , Признак необходимости включения подписки на события, которые будут добавлены в базу данных после выполнения операции
                                    EventGetList и дата регистрации которых будет не раньше даты IssuedFrom
    "limit":Number, Максимальное количество событий в ответе на запрос
    "startToken":Number,  Числовой идентификатор первого события в запросе
    "employees":array of [Employees],
    "issuedFrom": object Date(), Дата и время самого раннего затребованного события
    "issuedTo": object Date()? Дата и время последнего затребованного события
  */
  // ----------- настройки логгера локальные --------------
  let logN=logName+"eventGetList(userSID:"+userSID+"):";
  let trace=1;   trace = (gTrace!=0) ? gTrace : trace;
  trace ? log("i",logN,"Started") : null;
  // ---------- логер -------------------------------------
  // if (! options.limit) { options.limit = 100;}
  if (! options) { var options={} };
  options.UserSID=userSID;

  options.Limit = ( options.Limit ) ? options.Limit : 100;

  options.StartToken = ( options.StartToken ) ? options.StartToken : 0;

  options.Employees = ( options.Employees ) ? options.Employees : [];

  options.IssuedFrom = ( options.IssuedFrom ) ? dateStringify(options.IssuedFrom) : dateStringify(new Date()); // если не указана дата - то берем сегодня с 00:00


  trace ? log("i",logN,"options=",options) : null;

  try {
    trace ? log("i",logN,"EventGetList started") : null;
    let res = await axios({
        method:'post',
        url:config.url+"/EventGetList",
        data:options
      }); // await axios
    trace ? log("i",logN,"res.data.length=", res.data.Event.length ) : null;
    trace ? console.dir(res.data.Event) : null;
    // запись в файл примера лога -------------------------
    // let fh = await open("E:\\node\\U-prox\\modules\\eventListExample.json","w");
    // await fh.writeFile(JSON.stringify(res.data));
    // await fh.close();
    //
    //log("i",logN,"User (",userSID,") logouted." );
    return res.data.Event;
  } catch (e) {
    return Promise.reject(e);
  }
} // function logout()

function parseEventList( list ) {
  // ----------- настройки логгера локальные --------------
  let logN=logName+"parseEventList:";
  let trace=1;   trace = (gTrace!=0) ? gTrace : trace;
  trace ? log("i",logN,"Started") : null;
  // ---------- логер -------------------------------------

  let result = [];
  for (var i = 0; i < list.length; i++) {
    let item=list[i];
    if (! item.User.Token) { continue }
    let record ={
      user:{
        card:item.CardCode,
        name:item.User.Name,
        token:item.User.Token,
        post:item.User.Post,
      },
      door:{
        token:item.Sender.Token,
        name:item.Sender.Name
      },
      date:new Date(parseInt(item.Issued.slice(6,-2)))//))  new Date(parseInt(
    }
    trace ? log("i",logN,"Record"+i+"=",record) : null;
    result.push(record);
  }
  return result
} // parseEventList

(async () => {
  try {
    await authenticate(config.user,config.pwdHash);
    let events = await eventGetList({});
    console.log("---------- events ---------------");
    console.dir(events);
    let records = parseEventList(events);
    console.log("---------- records ---------------");
    console.dir(records);

  } catch (e) {
    console.error(e);
  } finally {
    await logout();
  }


})();

if (! module.parent) {
  (async () => {
    //let pwdHash = md5(md5((md5(config.pwd).toUpperCase()+'F593B01C562548C6B7A31B30884BDE53')).toUpperCase()).toUpperCase();
    //console.dir(await authenticate(config.user,config.pwdHash));

    // let user = await authenticate(config.user,config.pwdHash);
    // console.log("user=");console.dir(user);
  })();

  // console.log(authenticate(config.user,pwdHash));
}
