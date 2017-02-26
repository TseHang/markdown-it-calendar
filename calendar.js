var week_name = ["SUN", "MON", "TUE", "WED", "THUS", "FRI", "SAT"];
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


/*
use zeller algorithm to count the day's date of months
zeller algorithm only usable after 15/10/1582
return 1~7, 1 = SUN, 2 = MON, ... , 7 = SAT
*/
function zeller(month, year) {
    var day = 1;
    if (month < 3) {
        month += 12;
        year -= 1;
    }
    return (1+((day + parseInt(((month + 1) * 26) / 10) + year + parseInt(year / 4) + 6 * parseInt(year / 100) + parseInt(year / 400) - 1) % 7));
}


//calculate total day of month
function count_day(month, year) {
    var total_day;

    if (month == 2) {
        if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
            total_day = 29; //leap year
        } 
        else {
            total_day = 28; //common year
        }
    } 
    else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        total_day = 31;
    } 
    else if (month == 4 || month == 6 || month == 9 || month == 11) {
        total_day = 30;
    }

    return total_day;
}

//fill in the day
function fill_month(month, year) {
  var total_day = count_day(month,year);

  //first_day record which day is the first day of months
  var first_day = zeller(month, year);

  //fill in
  for (var i = first_day; i < (first_day + total_day); i++) {
    document.getElementById(month + "_" + year + "_date_" + i).innerHTML = (i - first_day + 1) + "<br>";
  }
}

//create a calender
function calendar_create(month, year) {

    var count_day = 1;
    var count_text = 1;

    var body = document.body,
    tbl = document.createElement('table');
    tbl.setAttribute("id", "calender");
    tbl.setAttribute("border", "2");

    for (var i = 0; i < 49 ; i++) {
        var tr = tbl.insertRow();

        for (var j = 0; j < 7; j++) {
            // for date and text which need to colspan
            if (i != 1 && i != 2 && i != 10 && i != 18 && i != 26 && i != 34 && i != 42 && j > 0){
                break;
            } 
            else {
                var td = tr.insertCell();
                var tags = document.createElement("tags");
                var a = document.createElement("a");

                //date
                if (i == 0 && j == 0) {
                    td.setAttribute("colSpan", "7");
                    td.setAttribute("id", "date");
                    td.innerHTML = months[month - 1] + year;
                }
                //fill in week name
                else if (i == 1) {
                    td.setAttribute("class", "week");
                    td.innerHTML = week_name[j];
                }
                //day
                else if (i == 2 || i == 10 || i == 18 || i == 26 || i == 34 || i == 42) {
                    td.setAttribute("class", "day");
                    td.setAttribute("id", month + "_" + year + "_day_" + count_day);
                    td.appendChild(a).setAttribute("id", month + "_" + year + "_date_" + count_day);
                    td.appendChild(tags).setAttribute("id", month + "_" + year + "_tag_" + count_day++);

                    //class use for css
                    a.setAttribute("class", "dates");
                    tags.setAttribute("class", "tags");
                }
                //date and text, colspan for 7
                else if (i != 1 && i != 2 && i != 10 && i != 18 && i != 26 && i != 34 && i != 42) {
                    td.setAttribute("class", "text");
                    td.setAttribute("colSpan", "7");
                    td.setAttribute("id", month + "_" + year + "_text_" + count_text++);
                }

            }
        }
    }
    body.appendChild(tbl);

    //invisible all text
    
    for(let i = 1; i <42 ; i++){
        $("#" + month + "_" + year + "_text_" + i).hide();
    }

  //fill in date
  fill_month(month,year);

  //setting click function
  func_click(month,year);
}

/************************click**********************************/

//sliding down the contents of the date when clicking
var openDetail = function(num,month,year) {
    var first_day = zeller(month, year);
    $("#" + month + "_" + year + "_text_" + num).show();
}

//sliding up the contents of the date when clicking
var closeDetail = function(num,month,year) {
    var first_day = zeller(month, year);
    $("#"+ month + "_" + year + "_text_" + num).hide();
}

//click function
function func_click(month,year) {
    var first_day = zeller(month, year);

    //set all = close
    for (var i = first_day; i < (first_day + 32); i++) {
        $("#"+ month + "_" + year + "_day_" + i).data("flag", "close");
    }


    for (let i = first_day; i < (first_day + 32); i++) {
        $("#"+ month + "_" + year + "_day_" + i).click(function() {
            console.log("you click" + month+"__"+ year + "_" + i);

            //open selected and close all others
            if ($("#" + month + "_" + year + "_day_" + i).data("flag") == "close") {

                //closed all and set flag to close
                for (let j = 1; j <= 42; j++) {
                    closeDetail(j,month,year);
                    $("#" + month + "_" + year + "_day_" + j).data("flag", "close");
                }
                
                //open text and set flag to open
                openDetail(i,month,year);
                $("#" + month + "_" + year + "_day_" + i).data("flag", "open");
            }

            //if selected is open then close it
            else {
                closeDetail(i,month,year);
                $("#" + month + "_" + year + "_day_" + i).data("flag", "close");
            }
        });
    }
}

/*************************adding event*************************************/

function add_event(month, year, date, tag, content) {

    var first_day = zeller(month, year);

    //fill in tag
    //minus 1 becaz input is date, begin as 1
    document.getElementById(month + "_" + year + "_tag_" + (date + first_day - 1)).innerHTML = tag;
    document.getElementById(month + "_" + year + "_text_" + (date + first_day - 1)).innerHTML = content;
}

