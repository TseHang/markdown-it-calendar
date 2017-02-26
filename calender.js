var count1 = 1;
var count2 = 1;
var week_name = ["SUN", "MON", "TUE", "WED", "THUS", "FRI", "SAT"];
var keys = [0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6];
var texts = [];
var tags = [];
var month = 0;
var year = 0;

//initiail texts and tags
function init() {
  for (let i = 0; i < 32; i++) {
    texts[i] = "";
    tags[i] = "";
  }
}

/*
use zeller algorithm to count the day's date of months
zeller algorithm only usable after 15/10/1582
return 0~6, 0 = SUN, 1 = MON, ... , 6 = SAT
*/
function zeller(day, month, year) {
  if (month < 3) {
    month += 12;
    year -= 1;
  }
  var week = (day + parseInt(((month + 1) * 26) / 10) + year + parseInt(year / 4) + 6 * parseInt(year / 100) + parseInt(year / 400) - 1) % 7;
  return week;
}

function count_day() {
  //specific total day of months
  var total_day;

  //check the total day of months
  //check if February is leap year
  if (month == 2) {
    if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
      total_day = 29; //leap year
    } else {
      total_day = 28; //common year
    }
  } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
    total_day = 31;
  } else if (month == 4 || month == 6 || month == 9 || month == 11) {
    total_day = 30;
  }

  return total_day;
}

//for input months, 1 = JAN, 2 = FEB , ... and etc
//fill in the correct day
function fill_month() {
  var total_day = count_day();

  //first_day record which day is the first day of months
  var first_day = zeller(1, month, year);

  //fill in
  for (let i = (1 + first_day); i < (first_day + total_day + 1); i++) {
    document.getElementById("a_" + i).innerHTML = (i - first_day) + "<br>";
  }
}

//create a calender
function calender_create(c_month, c_year) {
  init();
  var months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER"
  ];

  month = c_month;
  year = c_year;

  var body = document.body,
    tbl = document.createElement('table');
  tbl.setAttribute("id", "calender");
  tbl.setAttribute("border", "2");

  for (var i = 0; i < 14; i++) {
    var tr = tbl.insertRow();
    for (var j = 0; j < 7; j++) {
      if ((i == 0 && j > 0) || (i == 3 && j > 0) || (i == 5 && j > 0) || (i == 7 && j > 0) || (i == 9 && j > 0) || (i == 11 && j > 0) || (i == 13 && j > 0)) {
        break;
      } else {
        var td = tr.insertCell();
        var tags = document.createElement("tags");
        var dates = document.createElement("dates");

        //set date(id=date)
        if (i == 0 && j == 0) {
          td.setAttribute("colSpan", "7");
          td.setAttribute("id", "date");
          td.innerHTML = months[c_month - 1] + " " + c_year;
        }
        //set week(class=week)	
        else if (i == 1) {
          td.setAttribute("class", "week");
          td.innerHTML = week_name[j];
        }
        //set day(id = day_N(1~31))-> for specific date in months, (class= day),
        //set tags for differening tags and date 
        else if (i == 2 || i == 4 || i == 6 || i == 8 || i == 10 || i == 12) {
          td.setAttribute("class", "day");
          td.setAttribute("id", "day_" + count1);

          td.appendChild(dates).setAttribute("id", "a_" + count1);
          td.appendChild(tags).setAttribute("id", "b_" + count1++);
          dates.setAttribute("class", "dates");
          tags.setAttribute("class", "tags");
        }
        //set text
        else if (i == 3 || i == 5 || i == 7 || i == 9 || i == 11 || i == 13) {
          td.setAttribute("class", "text");
          td.setAttribute("colSpan", "7");
          td.setAttribute("id", "text_" + count2++);
          //td.style.display = "none";
        }
      }
    }
  }
  body.appendChild(tbl);

  //invisible all text
  for (var i = 1; i < 7; i++) {
    $("#text_" + i).hide();
  }

  //fill in date
  fill_month();
  //setting click function
  func_click();
}

//sliding down the contents of the date when clicking
var openDetail = function(num) {
  //	$("text_" + num).animate({paddingBottom:"auto"});

  var first_day = zeller(1, month, year);
  document.getElementById("text_" + keys[num + first_day]).innerHTML = texts[num];
  $("#text_" + keys[num + first_day]).show(); //keys[num+first_day] because keys not follow by date
}

//sliding up the contents of the date when clicking
var closeDetail = function(num) {
  //	$("text_" + num).animate({paddingBottom:"auto"});
  var first_day = zeller(1, month, year);
  $("#text_" + keys[num + first_day]).hide();
}

//click function
//sliding up and down the content
function func_click() {
  var first_day = zeller(1, month, year);

  //set all = close
  for (let i = 1; i <= 31; i++) {
    $("#day_" + (i + first_day)).data("flag", "close");
  }
  //first_day = 3
  for (let i = 1; i <= 31; i++) {
    $("#day_" + (i + first_day)).click(function() {
      console.log("you click" + i);
      //open selected and close all others
      if ($("#day_" + (i + first_day)).data("flag") == "close") {
        //closed all and set flag to close
        for (let j = 1; j <= 42; j++) {
          closeDetail(j);
          $("#day_" + (j + first_day)).data("flag", "close");
        }
        openDetail(i); //pass text's num to function
        $("#day_" + (i + first_day)).data("flag", "open");
      }
      //if selected is open then close it
      else {
        closeDetail(i);
        $("#day_" + (i + first_day)).data("flag", "close");
      }
    });
  }
}
//for adding tags,event to specific date in a month
function add_event(date, tag, content) {
  var first_day = zeller(1, month, year);

  //fill in tag
  tags[date] = tags[date] + tag + "<br>";
  document.getElementById("b_" + (date + first_day)).innerHTML = tags[date];

  //append content into texts[]
  texts[date] = texts[date] + content + "<br>";
}
