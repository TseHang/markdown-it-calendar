const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THUS', 'FRI', 'SAT'];
const months = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];


/*
  use zeller algorithm to count the day's date of months
  zeller algorithm only usable after 15/10/1582
  return 0~6, 0 = SUN, 1 = MON, ... , 6 = SAT
*/
function zeller(month, year) {
  const day = 1;
  if (month < 3) {
    month += 12;
    year -= 1;
  }
  return  ((day + parseInt(((month + 1) * 26) / 10) + year + parseInt(year / 4) + 6 * parseInt(year / 100) + parseInt(year / 400) - 1) % 7);
}

const openDescription = (num, month, year) => {
  closeDescription();

  $(`#${month}_${year}_des_${num}`).show(250).slideDown(500);
  $(`#${month}_${year}_grid_${num}`).data('flag', 'open');
}

const closeDescription = (month, year) => {
  const monthTotalDay = getMonthDays(month, year);
  const firstDay = zeller(month, year);

  for (let i = firstDay ; i < (firstDay + monthTotalDay); i ++) {
    $(`#${month}_${year}_des_${i}`).hide();
    $(`#${month}_${year}_grid_${i}`).data('flag', 'close');
  }
}

// calculate total day of month
function getMonthDays(month, year) {
  let monthTotalDay;

  if (month === 2) {
    if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
      monthTotalDay = 29; // leap year
    } else {
      monthTotalDay = 28; // common year
    }
  } else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
    monthTotalDay = 31;
  } else if (month === 4 || month === 6 || month === 9 || month === 11) {
    monthTotalDay = 30;
  }

  return monthTotalDay;
}


function datesClickEvent(month, year) {
  const firstDay = zeller(month, year);
  const monthTotalDay = getMonthDays(month, year);

  for (let i = firstDay; i < (firstDay + monthTotalDay); i++) {
    $('#' + month + '_' + year + '_grid_' + i).click(function() {
      console.log('you click' + month + '__' + year + '_' + i);      

      // Open selected and close all others
      ($('#' + month + '_' + year + '_grid_' + i).data('flag') === 'close' )
      ? openDescription(i, month, year)
      : closeDescription(month, year);
    });
  }
}

function calendarTableCreate(month, year, data) {
  const tbl = document.createElement('table');
  let countDay = 1;
  let countDescription = 1;
  let fillDay = 1;

  tbl.setAttribute('id', `calendar_${month}_${year}`);
  tbl.setAttribute('class', 'markdown-it-calendar');
  tbl.setAttribute('border', '2');
   //document.body.appendChild(tbl);

  for (let i = 0; i < 49; i++) {
    const tr = tbl.insertRow();
    const monthTotalDay = getMonthDays(month, year);
    const firstDay = zeller(month, year); 

    for (let j = 0; j < 7; j++) {
      // if the cell no use, dont generate
      if((monthTotalDay + firstDay) < countDay ){
        break;
      }
      // for date and text which need to colspan
      if (i !== 1 && i !== 2 && i !== 10 && i !== 18 && i !== 26 && i !== 34 && i !== 42 && j > 0) {
        break;
      } else {
        const td = tr.insertCell();
        const tags = document.createElement('p');
        const dates = document.createElement('p');

        // calendar_title
        if (i === 0 && j === 0) {
          td.setAttribute('colSpan', '7');
          td.setAttribute('class', 'calendar_title');
          td.innerHTML = months[month - 1] + ` ${year}`;
        }
        // Week
        else if (i === 1) {
          td.setAttribute('class', 'week');
          td.innerHTML = weeks[j];
        }
        // Day
        else if (i === 2 || i === 10 || i === 18 || i === 26 || i === 34 || i === 42) {
          td.setAttribute('class', 'day');
          td.setAttribute('id', month + '_' + year + '_grid_' + countDay);
          td.appendChild(dates).setAttribute('id', `${month}_${year}_dates_${countDay}`);
          td.appendChild(tags).setAttribute('id', `${month}_${year}_tags_${countDay}` );
          dates.setAttribute('class', 'dates');
          tags.setAttribute('class', 'tags');
          //tags.innerHTML = "wtf";

          // fill in day of month
          console.log("count = " + countDay);
          console.log("first = " + fillDay + "<br>");
          

          if((countDay > firstDay) ){
            if(fillDay > monthTotalDay){
                break;
            }
            else{
                dates.innerHTML = fillDay++;
            }
          }
          
          // fill up tags
          for(let k in data){
            if((data[k][0] + firstDay) == countDay){
              tags.innerHTML += data[k][1] + "<br>";
            }
          }
 
          countDay += 1; // Grid num + 1
        }
        // Description, colspan for 7
        else if (i !== 1 && i !== 2 && i !== 10 && i !== 18 && i !== 26 && i !== 34 && i !== 42) {
          td.setAttribute('colSpan', '7');
          td.setAttribute('class', 'calendar_desciption');
          td.setAttribute('id', month + '_' + year + '_des_' + (countDescription));
          //fill in description of each day

            for(let k in data){
              if((data[k][0] + firstDay) == countDescription){
                td.innerHTML += data[k][2] + "<br>";
              }
            }
            countDescription++;
        }
      }
    }
  }

  setCalendarTable(month, year, data);

  //convert Dom to html
  var DomToString = tbl.outerHTML;
  console.log(DomToString);

  return DomToString;
}


function setCalendarTable(month, year) {
   // closeDescription(month, year);
   // datesClickEvent(month, year);
}
