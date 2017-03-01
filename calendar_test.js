"use strict";

// const calendarData = {
//   "Date": { "year": "2016", "month": "04" },
//   "Content": [{ "date": "04", "day": "Mon", "month": "Apr",  "events": [{ "title": "", "description": "" }, { "title": "1", "description": "2" }, { "title": "7:00~9:03", "description": " 吃早餐" }, { "title": "9:00~", "description": " 跑步" }, { "title": "~10:10", "description": " 洗澡" }, { "title": "2", "description": "123123" }]}, { "date": "08", "day": "Fri", "month": "Apr", "events": [{ "title": "洗澡", "description": " 每日必做！" }] }]
// }

var calendarData = {
  "Date": { "year": "2016", "month": "04" },
  "Content": { "Mon Apr 04 2016 00:00:00 GMT+0800 (CST)": [{ "title": "2", "description": "2" }, { "title": "1", "description": "2" }] }
};

var calendarData_1 = {
  "Date": { "year": "2016", "month": "04" },
  "Content": { "Mon Apr 04 2016 00:00:00 GMT+0800 (CST)": [{ "title": "", "description": "" }, { "title": "1", "description": "2" }, { "title": "7:00~9:03", "description": " 吃早餐" }, { "title": "9:00~", "description": " 跑步" }, { "title": "~10:10", "description": " 洗澡" }, { "title": "2", "description": "123123" }], "Fri Apr 08 2016 00:00:00 GMT+0800 (CST)": [{ "title": "洗澡", "description": " 每日必做！" }] }
};

var month = parseInt(calendarData.Date.month);
var year = parseInt(calendarData.Date.year);

var tbl = calendarTableCreate(month, year);

var _loop = function _loop(localTime) {
  var time = new Date(localTime);
  var date = time.getDate();
  var event = calendarData.Content[localTime];

  // console.log(event);
  event.forEach(function (value, index) {
    addCalendarEvent(tbl, month, year, date, value.title, value.description);
  });
};

for (var localTime in calendarData.Content) {
  _loop(localTime);
}
// calendarData.Content.forEach((value, index) => {
//   const date = parseInt(value.date);
//   value.des.forEach((value, index) => {
//     addCalendarEvent(month, year, date, value.title, value.description);
//   })
// })