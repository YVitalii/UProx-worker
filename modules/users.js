const mongoose = require('mongoose');
var Schema= mongoose.Schema;
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

UserShema.statics.findByCard = function (card) {
  
}
