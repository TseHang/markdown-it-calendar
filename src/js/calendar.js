const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const createCalendarHTML = (data) => {
  const year = data.Date.year
  const month = data.Date.month

  let iterDate = new Date(year, month, 0)
  const daysNum = iterDate.getDate()
  iterDate.setDate(1)

  const firstDay = iterDate.getDay()
  const calendar = document.createElement('table')
  const th = document.createElement('th')
  let tr, td
  calendar.className = 'calendar table table-responsive container-fluid'
  calendar.setAttribute('year', year)
  calendar.setAttribute('month', month)

  // init title
  tr = calendar.insertRow()
  tr.appendChild(th)
  th.colSpan = '7'
  th.className = 'calendar-title'
  th.innerHTML = months[parseInt(month) - 1] + '<span class="calendar-title-year"> ' + year + '</span>'

  // week name row
  tr = calendar.insertRow()
  for (let i = 0; i < 7; ++i) {
    td = tr.insertCell()
    td.innerHTML = weeks[i]
    td.className = 'calendar-week'
  }

  // blank days
  for (let i = 0; i < firstDay; ++i) {
    if (i % 7 === 0) {
      tr = calendar.insertRow()
    }
    td = tr.insertCell()
  }

  // general days
  for (let i = firstDay; i < daysNum + firstDay; ++i) {
    const date = document.createElement('p');
    const tag = document.createElement('div');
    const event = document.createElement('p');
    const today = i - firstDay + 1

    if (i % 7 === 0) {
      tr = calendar.insertRow()
    }
    td = tr.insertCell()
    td.className = 'calendar-day'
    iterDate.setDate(today)

    date.innerHTML = today
    date.className = 'calendar-date'
    td.appendChild(date)

    if (data.Content[iterDate]) {
      data.Content[iterDate].forEach((e, index) => {
        tag.innerHTML += e.title + ':' + e.description + '<br>'
        tag.className = 'tag'
        td.appendChild(tag)
      })
    }
  }


  // blank days
  for (let i = daysNum + firstDay; i % 7 !== 0; ++i) {
    td = tr.insertCell()
  }

  return calendar.outerHTML
}

export default createCalendarHTML