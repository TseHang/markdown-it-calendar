require('jsdom-global')()

var classNameCalendar = 'markdown-it-calendar'
var classNameCalendarTable = 'calendar'
var classNameDay = 'calendar-cell'
var classNameEventContainer = 'calendar-content'
var classNameEvent = 'calendar-content-tag'
var classNameEventDescription = 'calendar-content-tag-hover'

function getInnerHTML (html) {
/*
  get innerHTML of given html
  if given html has more than one element without parent
    the innerHTML of first element without parent is returned
  if given html has no element(tag)
    I expect this function to throw an error
*/
  return workAsDOM(html, function (v) {
    return v.querySelector('div > *').innerHTML
  })
}
function applySelectorAll (html, selector) {
/*
  (DOM of html).querySelectorAll( selector )
  and return the outerHTML of the result
*/
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
/*
  calls func with (DOM of html)
  and return what func returns
*/
  var dom = document.createElement('div')
  dom.innerHTML = html
  return func(dom)
}

function CalendarEvent (html) {
/*
  parse html to a CalendarEvent Object

  CalendarEvent:
    title(String):title of the event in HTML
    description(String):description of the event in HTML
    hasTitle(Boolean)
    hasDescription(Boolean)
    parseSuccessful(Boolean)

  html should contain exactly one event
*/
  if (!this || !this.constructor || this.constructor !== CalendarEvent) {
    return new CalendarEvent(html)
  }
  var selfelem = applySelectorAll(html, '.' + classNameEvent)
  this.title = ''
  this.description = ''
  this.hasTitle = false
  this.hasDescription = false
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
      this.hasDescription = true
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
    this.hasTitle = true
    this.title = selfelem
  }
  this.parseSuccessful = this.parseSuccessful && (this.hasTitle || this.hasDescription)
}

function CalendarDay (html) {
/*
  CalendarDay:
    events(Array of CalendarEvent)
    eventsCount(Number)
    parseSuccessful(Boolean)
    function has_event()

  html should contain exactly one day
*/
  if (!this || !this.constructor || this.constructor !== CalendarDay) {
    return new CalendarDay(html)
  }

  this.events = []
  this.eventsCount = 0
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
  that.eventsCount = that.events.length
}
CalendarDay.prototype.has_event = function () { return this.eventsCount > 0 }

function CalendarCalendar (html) {
/*
  CalendarCalendar:
    days(Array of CalendarDay)
    daysCount(Number)
    parseSuccessful(Boolean)
    function day( date(Number) ):return CalendarDay for date
      for example, day(4) returns days[3]
*/
  if (!this || !this.constructor || this.constructor !== CalendarCalendar) {
    return new CalendarCalendar(html)
  }

  this.days = []
  this.daysCount = 0
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
    ++that.daysCount
  })
}
CalendarCalendar.prototype.day = function (n) {
  if (n > this.daysCount || n <= 0) {
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
