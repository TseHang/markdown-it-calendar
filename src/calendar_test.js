// const calendarData = {
//   "Date": { "year": "2016", "month": "04" },
//   "Content": [{ "date": "04", "day": "Mon", "month": "Apr",  "events": [{ "title": "", "description": "" }, { "title": "1", "description": "2" }, { "title": "7:00~9:03", "description": " 吃早餐" }, { "title": "9:00~", "description": " 跑步" }, { "title": "~10:10", "description": " 洗澡" }, { "title": "2", "description": "123123" }]}, { "date": "08", "day": "Fri", "month": "Apr", "events": [{ "title": "洗澡", "description": " 每日必做！" }] }]
// }

const calendarData = {
  "Date": { "year": "2016", "month": "04" },
  "Content": { "Mon Apr 04 2016 00:00:00 GMT+0800 (CST)": [{ "title": "2", "description": "2" }, { "title": "1", "description": "2" }]  }
};

const calendarData_1 = {
  "Date": { "year": "2016", "month": "06" },
  "Content": { "Mon Apr 04 2016 00:00:00 GMT+0800 (CST)": [{ "title": "tag1", "description": "des1" }, { "title": "tag2", "description": "des2" }, { "title": "tag3", "description": "des3" }, { "title": "tag4", "description": "des4" }, { "title": "tag5", "description": "des5" }, { "title": "tag6", "description": "des6" }], "Fri Apr 20 2016 00:00:00 GMT+0800 (CST)": [{ "title": "tag7", "description": "des7" }] }
};

const data = [];
const month = parseInt(calendarData_1.Date.month);
const year = parseInt(calendarData_1.Date.year);
for (let localTime in calendarData_1.Content){
    const time = new Date(localTime);
    const date = time.getDate();
    const event = calendarData_1.Content[localTime];

    event.forEach((value)=>{
        data.push({
          date: date,
          tag: value.title,
          des: value.description,
        });
    })
}
// data[0~n] = [date,title,description]

console.log(data);
var tbl = calendarTableCreate(month, year, data);

