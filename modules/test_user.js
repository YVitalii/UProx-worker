const mongoose = require('mongoose');
const User= require('./usersShema.js');
const conf=require('../config.js').db;
// ------------ логгер  --------------------
const log = require('../tools/log.js'); // логер
let logName="<"+(__filename.replace(__dirname,"")).slice(1)+">:";
let gTrace=0; //=1 глобальная трассировка (трассируется все)
// ----------- настройки логгера локальные --------------
// let logN=logName+"описание:";
// let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
// trace ? log("i",logN,"Started") : null;

//console.log(conf);

if (! module.parent) {
  const config = require('../config');
  var db
  // mongoose.connection.on('error', err => {
  //   console.log("--------------------\n MongoDB connect  error ! \n--------------------");
  //   console.log(err.message);
  //  });
  (async function () {
    try {
    db = await mongoose.connect(conf.url, conf.options);
    console.dir();;
    } catch (error) {
      console.log("--------------------\n MongoDB connect  error ! \n--------------------");
      console.log(error.message);
      new Error("Could not connect to base");
      process.exitCode=1;
      process.exit();
    };
    console.log("--------------------\n MongoDB connected ! \n--------------------");
    const user=new User(  {
        "name": {
          "first": "Ден",
          "second": "Куюк",
          "patronyme": ""
        },
        "cardCode": "2A99B3B82B",
        "uProx": {
          "todayWorkTime": 0,
          "lastEvent": {
            "date": "2021-08-06T12:47:48.467Z",
            "direction": 0
          },
          "monthEventList": []
        },
        "telegram": {
          "chatId": 0,
          "userName": ""
        }
      } );
      user.save((err,user) => {
        if (err) {
            console.log('err', err)
            }
            console.log('saved user', user)
      });
      
    //let res.
    // try {
    //   console.log("findByCard");
    //   let res= await User.findOne({cardCode:"3200204A2B"});//.then((res)=>);
    //   console.log("User=");
    //   console.dir(res);
    // } catch (e) {
    //
    // } finally {
    //
    // };
    //  try create some users
    // var user= new User(
    //   {
    //     email:"1235@ukr.net"
    //     ,nickname:"chief2"
    //     ,pwd:"12345"
    //     ,person: {
    //        name: "Вол"
    //        ,surname:"Зин"
    //        ,patronymic:"Николаевич"}
    //   }
    // ); // создаем обьект
    //console.log("--->"+user);
   // user.save(
   //   (err)=>{
   //     if (err) {
   //       console.log(err.errmsg);
   //       return
   //     };
   //     console.log("Записано в базу пользователя:" + user.email);
   // }  ); //save
  //  User.addUser(user,(err,person)=>{
  //    if (err) {console.error("User: "+user.email+". Cant be added, because:"+err.errmsg);return};
  //    if (person) {
  //      console.log("Added:");
  //      console.log(person);
  //      return ;
  //     }
  //    console.log("No person added.");
  //  });
  //
  // User.findByEmail("ss@ukr.net",(err,person)=>{
  //   if (err) {console.error(err);return};
  //   if (person) {
  //     console.log("Finded:");
  //     console.log(person);
  //     return ;
  //    }
  //   console.log("No person finded.");
  //
  // });

}) ();
  //start();


}
