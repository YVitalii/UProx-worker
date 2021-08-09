const mongoose = require('mongoose');
var Schema= mongoose.Schema;
// ------------ логгер  --------------------
const log = require('../tools/log.js'); // логер
let logName="<"+(__filename.replace(__dirname,"")).slice(1)+">:";
let gTrace=0; //=1 глобальная трассировка (трассируется все)

//const workersShema = require('./workersShema.js');
//mongodb://express:Danya@localhost:27017/lazer?authSource=WorkersDB&readPreference=primary&appname=Express&ssl=false
const EventShema = new Schema ({
  token:{
    type:Number,
    required:true,
  },
  date: {
    type:Date,
    required:true,
  },
  direction:{
    type:Number,
    required:true,
  },
  directionTitle:String
});
var UserSchema= new Schema({
    name: {
      first:  { //имя
        type:String,
      },
      second:   { //фамилия
        type:String,
      },
      patronyme:   { //отчество
        type:String,
      } },
    cardCode:   { // код чип-карты
      type:String,
      unique:true,
      index:true
    },
    uProx: {
      todayWorkTime: Number,
      lastEvent: {
        date: Date,
        direction: Number
      },
      monthEventList: [EventShema]
    },
    telegram: {
      chatId: {
        type:Number,
        default:0,
      },
      userName: {
        type:String,
        default:""
      }
    }
});

UserSchema.statics.findByCard = async function (card) {
  // ----------- настройки логгера локальные --------------
  let logN=logName+"findByCard("+card+"):";
  let trace=1;   trace = (gTrace!=0) ? gTrace : trace;
  trace ? log("i",logN,"Started") : null;
  this.findOne({cardCode:card}, (err,data) => {
    trace ? log("i",logN,"err=",err) : null;
    trace ? log("i",logN,"data=",data) : null;
    if (err) return new Promise().reject(err);
    return data;
  })
  // try {
  //   let user = await this.findOne({"cardCode":card})
  //     .then((data) => {
  //       console.log(data);
  //     });
  //   trace ? log("i",logN,"user=") : null;
  //   trace ? console.dir(user) : null;
  //   return user
  // } catch (e) {
  //   console.error(e);
  //   throw(e);
  // } finally {
  //   //return 123
  // }
}

var User=mongoose.model('User',UserSchema); // создаем модель
module.exports=User;
