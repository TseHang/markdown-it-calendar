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
  return 1~7, 1 = SUN, 2 = MON, ... , 7 = SAT
*/
function zeller(month, year) {
  const day = 1;
  if (month < 3) {
    month += 12;
    year -= 1;
  }
  return (1 + ((day + parseInt(((month + 1) * 26) / 10) + year + parseInt(year / 4) + 6 * parseInt(year / 100) + parseInt(year / 400) - 1) % 7));
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

// Fill every month's days
function fillInMonthDays(month, year) {
  const monthTotalDay = getMonthDays(month, year);
  const firstDay = zeller(month, year);

  for ( let i = firstDay; i < (firstDay + monthTotalDay); i++ ) {
    console.log("22");
    document.getElementById(`${month}_${year}_dates_${i}`).innerHTML = ( (i - firstDay + 1) + '<br>' );
  }
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

function calendarTableCreate(month, year) {
  const tbl = document.createElement('table');
  const monthTotalDay = getMonthDays(month, year);
  const firstDay = zeller(month, year);

  let countDay = 1;
  let countDescription = 1;

  tbl.setAttribute('id', `calendar_${month}_${year}`);
  tbl.setAttribute('class', 'markdown-it-calendar');

  document.body.appendChild(tbl);

  for (let i = 0; i < 49; i++) {
    const tr = tbl.insertRow();

    for (let j = 0; j < 7; j++) {
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

          countDay += 1; // Grid num + 1
        }
        // Description, colspan for 7
        else if (i !== 1 && i !== 2 && i !== 10 && i !== 18 && i !== 26 && i !== 34 && i !== 42) {
          td.setAttribute('colSpan', '7');
          td.setAttribute('class', 'calendar_desciption');
          td.setAttribute('id', month + '_' + year + '_des_' + (countDescription++));
        }

      }
    }
  }
  setCalendarTable(month, year);

  return tbl;
}


function setCalendarTable(month, year) {
  closeDescription(month, year);
  fillInMonthDays(month, year);
  datesClickEvent(month, year);
}

function addCalendarEvent(tbl, month, year, date, tag, description) {
  const firstDay = zeller(month, year);

  // The minus 1 ,cause input is date, begin as 1.
  document.getElementById(`${month}_${year}_tags_` + (date + firstDay - 1)).innerHTML += ` ${tag}<br>`;
  document.getElementById(`${month}_${year}_des_` + (date + firstDay - 1)).innerHTML += ` <span class="des-tag">${tag}</span> - ${description}<br>`;
}