const {open}=require("fs/promises");
let fName=__dirname+"\\eventListExample.json";
let outFileName=__dirname+"\\parsedUsers.json";
const records = [];
const cards= new Set();
console.log("fName=",fName);
(async () => {

  try {
    var fh = await open(fName,"r");
    let data =  JSON.parse(await fh.readFile({encoding:"utf8"}));
    await fh.close();
    console.log("data.Event.length=",data.Event.length);
    for (var i = 0; i < data.Event.length; i++) {
      let e=data.Event[i];
      let card=e.CardCode;
      console.log("card=",card);
      if ( (card == "") | (! card) ) { continue };
      if (! cards.has(card) ) {
        cards.add(card);
        let user={
          name:{
            first:e.User.Name.split(" ")[1].trim(),
            second:e.User.Name.split(" ")[0].trim(),
            patronyme:""
          },
          cardCode:e.CardCode,
          uProx:{
            todayWorkTime:0,
            lastEvent: {
              date: new Date(),
              direction: 0
            },
            monthEventList:[],
          },
          telegram:{
            chatId:0,
            userName:""
          }
        };
        records.push(user);
      }
    } //for
    var fh = await open(outFileName,"w");
    await fh.writeFile(JSON.stringify(records));
    await fh.close();
  } catch (e) {
    console.error(e);
  } finally {
    console.dir(records);
  }

  //console.log(data);

})()
