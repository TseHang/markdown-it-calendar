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

// Transalate markdown syntax to HTML
const md2HTML = (md, src) => {
  // Filt the paragraph tokens
  let tokens = md.parse(src, {}).filter((element) => {
    return (element.type != 'paragraph_open') && (element.type != 'paragraph_close')
  })
  return md.renderer.render(tokens, {html: false})
}

const createCalendarHTML = (md, data) => {
  const year = data.Year
  const month = data.Month
  const days = data.Days

  let iterDate = new Date(year, month, 0)
  iterDate.setFullYear(year) // ensure every year can be used
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
    const cellContentDate = document.createElement('p')
    const today = i - firstDay + 1

    if (i % 7 === 0) {
      tr = calendar.insertRow()
    }
    td = tr.insertCell()
    td.className = 'calendar-day'
    iterDate.setDate(today)

    cellContentDate.innerHTML = today
    cellContentDate.className = 'calendar-date'
    td.appendChild(cellContentDate)

    if (days[iterDate] !== undefined) {
      const events = days[iterDate].events

      const cellContent = document.createElement('div')
      const dayOverview = document.createElement('div')

      // Insert Titles
      if (days[iterDate].title !== undefined) {
        const cellContentTitle = document.createElement('div')
        const dayOverviewTitleHTML = md2HTML(md, days[iterDate].title)
        const dayOverviewTitle = document.createElement('div')

        // insert cellContent Title
        cellContentTitle.setAttribute('class', 'calendar-dayTitle calendar-content-title')
        cellContentTitle.innerHTML = `${dayOverviewTitleHTML}`
        td.appendChild(cellContentTitle)

        // insert dayOverview title
        dayOverviewTitle.innerHTML = dayOverviewTitleHTML
        dayOverviewTitle.className = 'calendar-des-title'
        dayOverview.appendChild(dayOverviewTitle)
      }

      if (events) {
        events.forEach((e) => {
          const cellContentTag = document.createElement('div')
          const dayOverviewEvent = document.createElement('div')

          const tagHTML = md2HTML(md, e.tag)
          const descriptionHTML = md2HTML(md, e.description)

          // Add event into cellContent
          // This part has weird logic, but can work and I don't understand...
          cellContentTag.innerHTML = tagHTML
          if (e.description && e.description.length) {
            cellContentTag.innerHTML += `<div class="calendar-tag-hover">${descriptionHTML}</div>`
          }
          cellContentTag.className = 'calendar-tag'
          cellContent.appendChild(cellContentTag)

          // Add event into dayOverview
          const dayOverviewTagHTML = (e.description && e.description.length) ? (tagHTML + ' : ') : tagHTML
          dayOverviewEvent.innerHTML = `<span class="calendar-des-tag">${dayOverviewTagHTML} </span> ${descriptionHTML}`
          dayOverview.appendChild(dayOverviewEvent)
        })
      }

      const dayOverviewDate = document.createElement('p')
      dayOverviewDate.innerHTML = `${year}.${month}.${today}`
      dayOverviewDate.className = 'calendar-des-date'
      dayOverview.appendChild(dayOverviewDate)

      // why you always set className after setting innerHTML???
      cellContent.className = 'calendar-content'
      dayOverview.className = 'calendar-description'

      td.appendChild(cellContent)
      td.appendChild(dayOverview)
    }
  }

  // blank days
  for (let i = daysNum + firstDay; i % 7 !== 0; ++i) {
    td = tr.insertCell()
  }

  return calendar.outerHTML
}

export default createCalendarHTML
