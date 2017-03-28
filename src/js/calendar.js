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

const createCalendarHTML = (md, data) => {
  // Transalate markdown syntax to HTML
  const md2HTML = (src, startLine) => {
    // Filt the paragraph tokens
    let tokens = md.parse(src, {}).filter((element) => {
      return (element.type != 'paragraph_open') && (element.type != 'paragraph_close')
    })
    // remap tokens
    tokens = tokens.map((token)=>{
      if (token.map){
        token.map[0] += startLine
        token.map[1] += startLine
      }
      return token
    })
    return md.renderer.render(tokens, {html: false})
  }

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
  th.className = 'calendar-time'
  th.innerHTML = months[parseInt(month) - 1] + '<span class="calendar-year"> ' + year + '</span>'

  // week name row
  tr = calendar.insertRow()
  for (let i = 0; i < 7; ++i) {
    td = tr.insertCell()
    td.innerHTML = weeks[i]
    td.className = 'calendar-week-name'
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
    td.className = 'calendar-cell'
    iterDate.setDate(today)

    cellContentDate.innerHTML = today
    cellContentDate.className = 'calendar-cell-date'
    td.appendChild(cellContentDate)

    if (days[iterDate] !== undefined) {
      const events = days[iterDate].events

      const cellContent = document.createElement('div')
      const dayOverview = document.createElement('div')

      // Insert Titles
      if (days[iterDate].title !== undefined) {
        const cellContentTitle = document.createElement('div')
        const dayOverviewTitleHTML = md2HTML(days[iterDate].title, days[iterDate].startLine)
        const dayOverviewTitle = document.createElement('div')

        // insert cellContent Title
        cellContentTitle.innerHTML = `${dayOverviewTitleHTML}`
        cellContentTitle.className = 'calendar-cell-title'
        td.appendChild(cellContentTitle)

        // insert dayOverview title
        dayOverviewTitle.innerHTML = dayOverviewTitleHTML
        dayOverviewTitle.className = 'calendar-overview-title'
        dayOverview.appendChild(dayOverviewTitle)
      }

      if (events) {
        events.forEach((e) => {
          const cellContentTag = document.createElement('div')
          const dayOverviewEvent = document.createElement('div')

          const tagHTML = md2HTML(e.tag, e.startLine)
          const descriptionHTML = md2HTML(e.description, e.startLine)

          // Make hackmd parser work
          cellContentTag.innerHTML = tagHTML

          // If no description, it won't have hover-div.
          if (e.description && e.description.length) {
            cellContentTag.innerHTML += `<div class="calendar-content-tag-hover">${descriptionHTML}</div>`
          }
          cellContentTag.className = 'calendar-content-tag'
          cellContent.appendChild(cellContentTag)

          // Add event into dayOverview
          const dayOverviewTagHTML = (e.description && e.description.length) ? (tagHTML + ' : ') : tagHTML
          dayOverviewEvent.innerHTML = `<span class="calendar-overview-tag">${dayOverviewTagHTML} </span> ${descriptionHTML}`
          dayOverview.appendChild(dayOverviewEvent)
        })
      }

      const dayOverviewDate = document.createElement('p')
      dayOverviewDate.innerHTML = `${year}.${month}.${today}`
      dayOverviewDate.className = 'calendar-overview-date'
      dayOverview.appendChild(dayOverviewDate)

      cellContent.className = 'calendar-content'
      dayOverview.className = 'calendar-overview'

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
