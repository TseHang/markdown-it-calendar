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
    "Content": { "Mon Apr 04 2016 00:00:00 GMT+0800 (CST)": [{ "title": "tag1", "description": "des1" }, { "title": "tag2", "description": "des2" }, { "title": "tag3", "description": "des3" }, { "title": "tag4", "description": "des4" }, { "title": "tag5", "description": "des5" }, { "title": "tag6", "description": "des6" }], "Fri Apr 08 2016 00:00:00 GMT+0800 (CST)": [{ "title": "tag7", "description": "des7" }] }
};

var month = parseInt(calendarData_1.Date.month);
var year = parseInt(calendarData_1.Date.year);

//資料存進data
var data = new Array();

var i = 0;

var _loop = function _loop(localTime) {
    var time = new Date(localTime);
    var date = time.getDate();
    var event = calendarData_1.Content[localTime];

    event.forEach(function (value) {
        //date value.title value.description
        data[i++] = new Array(date, value.title, value.description);
    });
};

for (var localTime in calendarData_1.Content) {
    _loop(localTime);
}
//data[0~n] = [date,title,description]

console.log("data = " + data);

//把data帶進去
var tbl = calendarTableCreate(month, year, data);