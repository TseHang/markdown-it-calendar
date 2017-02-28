"use strict";

var calendarData = {
  "Date": { "year": "2016", "month": "04" },
  "Content": [{ "date": "04", "week": "Mon", "month": "Apr", "des": [{ "title": "", "description": "" }, { "title": "1", "description": "2" }, { "title": "7:00~9:03", "description": " 吃早餐" }, { "title": "9:00~", "description": " 跑步" }, { "title": "~10:10", "description": " 洗澡" }, { "title": "2", "description": "123123" }] }, { "date": "08", "week": "Fri", "month": "Apr", "des": [{ "title": "洗澡", "description": " 每日必做！" }] }]
};

var month = parseInt(calendarData.Date.month);
var year = parseInt(calendarData.Date.year);

calendarTableCreate(month, year);
calendarData.Content.forEach(function (value, index) {
  var date = parseInt(value.date);
  value.des.forEach(function (value, index) {
    addCalendarEvent(month, year, date, value.title, value.description);
  });
});