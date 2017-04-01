require('jsdom-global')()

var classNameCalendar = 'markdown-it-calendar'
var classNameCalendarTable = 'calendar'
var classNameDay = 'calendar-cell'
var classNameEventContainer = 'calendar-content'
var classNameEvent = 'calendar-content-tag'
var classNameEventDescription = 'calendar-content-tag-hover'

function getInnerHTML (html) {
  return workAsDOM(html, function (v) {
    return v.querySelector('div > *').innerHTML
  })
}
function applySelectorAll (html, selector) {
  if (html.constructor === Array) {
    console.log('applySelectorAll called with:')
    console.log('html:')
    console.log(html)
    console.log('selector:')
    console.log(selector)
  }
  var cont = document.createElement('div')
  cont.innerHTML = html
  var rtn = []
  Array.prototype.forEach.call(cont.querySelectorAll(selector), function (v) { rtn = rtn.concat(v.outerHTML) })
  return rtn
}
function workAsDOM (html, func) {
  var dom = document.createElement('div')
  dom.innerHTML = html
  return func(dom)
}

function CalendarEvent (html) {
  if (!this || !this.constructor || this.constructor !== CalendarEvent) {
    return new CalendarEvent(html)
  }
  var selfelem = applySelectorAll(html, '.' + classNameEvent)
  this.title = ''
  this.description = ''
  this.has_title = false
  this.has_description = false
  this.parseSuccessful = true

  if (selfelem.length === 0) {
    this.parseSuccessful = false
    return
  }
  selfelem = selfelem[0]
  switch (applySelectorAll(selfelem, '.' + classNameEventDescription).length) {
    case 0:
      break
    case 1:
      this.has_description = true
      this.description = getInnerHTML(applySelectorAll(selfelem, '.' + classNameEventDescription)[0])
      selfelem = workAsDOM(selfelem, function (v) {
        v.querySelectorAll('.' + classNameEventDescription).forEach(function (v) {
          v.remove()
        })
        return v.querySelector('.' + classNameEvent).innerHTML
      })
      break
    default:
      this.parseSuccessful = false
      selfelem = workAsDOM(selfelem, function (v) {
        v.querySelectorAll('.' + classNameEventDescription).forEach(function (v) {
          v.remove()
        })
        return v.innerHTML
      })
      break
  }
  if (selfelem.length) {
    this.has_title = true
    this.title = selfelem
  }
  this.parseSuccessful = this.parseSuccessful && (this.has_title || this.has_description)
}

function CalendarDay (html) {
  if (!this || !this.constructor || this.constructor !== CalendarDay) {
    return new CalendarDay(html)
  }

  this.events = []
  this.events_count = 0
  this.parseSuccessful = true

  var today = applySelectorAll(html, '.calendar-cell-date')
  if (today.length !== 1) {
    this.parseSuccessful = false
    return
  }
  today = html// today is html of today
  var eventCont = applySelectorAll(today, '.' + classNameEventContainer)
  switch (eventCont.length) {
    case 0:
      return
    case 1:
      break
    default:
      this.parseSuccessful = false
      return
  }
  eventCont = eventCont[0]
  var that = this
  applySelectorAll(eventCont, '.' + classNameEvent).forEach(function (v) {
    var ev = CalendarEvent(v)
    if (ev.parseSuccessful) {
      that.events = that.events.concat(ev)
    } else {
      that.parseSuccessful = false
    }
  })
  that.events_count = that.events.length
}
CalendarDay.prototype.has_event = function () { return this.events_count > 0 }

function CalendarCalendar (html) {
  if (!this || !this.constructor || this.constructor !== CalendarCalendar) {
    return new CalendarCalendar(html)
  }

  this.days = []
  this.days_count = 0
  this.parseSuccessful = true
  var tmpCalendarTableArr = applySelectorAll(html, '.' + classNameCalendarTable)
  switch (tmpCalendarTableArr.length) {
    case 0:
      this.parseSuccessful = false
      return
    case 1:
      break
    default:
      this.parseSuccessful = false
      return
  }
  // tmpCalendarTableArr has only one table
  var calendarTable = tmpCalendarTableArr[0]

  var that = this

  applySelectorAll(calendarTable, '.' + classNameDay).forEach(function (v) {
    var tmpday = CalendarDay(v)
    that.days = that.days.concat(tmpday)
    ++that.days_count
  })
}
CalendarCalendar.prototype.day = function (n) {
  if (n > this.days_count || n <= 0) {
    return null
  }
  return this.days[n - 1]
}

function getCalendars (renderResult) {
  var calsArr = applySelectorAll(renderResult, '.' + classNameCalendar)
  var rtn = []
  calsArr.forEach(function (v) {
    rtn = rtn.concat(new CalendarCalendar(v))
  })
  return rtn
}

module.exports = getCalendars
