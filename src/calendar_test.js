// const calendarData = {
//   "Date": { "year": "2016", "month": "04" },
//   "Content": [{ "date": "04", "day": "Mon", "month": "Apr",  "events": [{ "title": "", "description": "" }, { "title": "1", "description": "2" }, { "title": "7:00~9:03", "description": " 吃早餐" }, { "title": "9:00~", "description": " 跑步" }, { "title": "~10:10", "description": " 洗澡" }, { "title": "2", "description": "123123" }]}, { "date": "08", "day": "Fri", "month": "Apr", "events": [{ "title": "洗澡", "description": " 每日必做！" }] }]
// }

const calendarData = {
  "Date": { "year": "2016", "month": "04" },
  "Content": { "Mon Apr 04 2016 00:00:00 GMT+0800 (CST)": [{ "title": "2", "description": "2" }, { "title": "1", "description": "2" }]  }
};

const calendarData_1 = {
  "Date": { "year": "2016", "month": "04" },
  "Content": { "Mon Apr 04 2016 00:00:00 GMT+0800 (CST)": [{ "title": "", "description": "" }, { "title": "two", "description": "two = dua" }, { "title": "breakfast", "description": " sarapan" }, { "title": "sleep", "description": "tidur" }, { "title": "~10:10", "description": " 洗澡" }, { "title": "2", "description": "123123" }], "Fri Apr 08 2016 00:00:00 GMT+0800 (CST)": [{ "title": "洗澡", "description": " 每日必做！" }] }
};

const month = parseInt(calendarData_1.Date.month);
const year = parseInt(calendarData_1.Date.year);

//資料存進data
const data = new Array();

for (let localTime in calendarData_1.Content){
    var i = 0;
    const time = new Date(localTime);
    const date = time.getDate();
    const event = calendarData_1.Content[localTime];

    event.forEach((value)=>{
        //date value.title value.description
        data[i] = new Array(date, value.title, value.description);
//        console.log("i = " + i);
//        console.log("data = " + data[i++]);
    })
}
//data[0~n] = [date,title,description]


//把data帶進去
var tbl = calendarTableCreate(month, year, data);

/*
for (let localTime in calendarData_1.Content){
  const time = new Date(localTime);
  const date = time.getDate();
  const event = calendarData_1.Content[localTime];
  console.log("time = "+time);
  console.log("date = "+date);
  console.log("localtime = "+localTime);
  //localtime = time , date = day
  
  console.log("event = " + event);

  event.forEach( (value) => {
    console.log("value = "+value);
    addCalendarEvent(tbl, month, year, date, value.title, value.description)
  })

}
*/
// calendarData.Content.forEach((value, index) => {
//   const date = parseInt(value.date);
//   value.des.forEach((value, index) => {
//     addCalendarEvent(month, year, date, value.title, value.description);
//   })
// })
