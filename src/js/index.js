require('./calendar.css')
import createCalendarHTML from './calendar'

module.exports = function calendarPlugin(md, options) {
  let name = 'calendar',
    startMarkerStr = '#[' + name + '=',
    endMarkerStr = '#[/' + name + ']',
    DATE_REGEX = /<!--\s*(\d+)\s*-->/,
    EVENT_REGEX = /@\[(.*?)\](.*)/

/*************************************************************
 * Default validate and render function
 */

  function validateParamsDefault (params) {
    // return true if params is valid
    params = params.trim().split(' ')
    try {
      let year = parseInt(params[0])
      let month = parseInt(params[1])

      return month <= 12 && month >= 1
    } catch (err) {
      return false
    }
  }

  function renderDefault (tokens, idx, _options, env, self) {
    const data = tokens[idx].info
    const table = createCalendarHTML(data)
    return '<div class="markdown-it-calendar">' + table + '</div>'
  }

  /*************************************************************
   * Helper functions
   */
  function isValidDate (d) {
    // time structure must be {year: 2017, month: 12, date: 30, time: "13:14"}
    try {
      let result = new Date(d.year, d.month - 1, d.date)
      let valid = d.year === result.getFullYear() &&
              d.month === (result.getMonth() + 1) &&
              d.date === result.getDate()

      return valid ? result : false
    } catch (err) {
      return false
    }
    return false
  }

  function isValidTime (str) {
    // input str must be "xx:xx"
    try {
      str = str.split(':')
      let hour = parseInt(str[0])
      let minute = parseInt(str[1])
      return hour < 24 && hour > -1 && minute < 60 && minute > -1
    } catch (err) {
      return false
    }
  }

  function parseStartLine (src, start, end, validateFunc) {
    // Return earlier if not match
    let valid = src[end - 1] === ']'
    if (!valid) {
      return false
    }

    valid = src.substring(start, start + startMarkerStr.length) === startMarkerStr
    if (!valid) {
      return false
    }

    valid = validateFunc(src.substring(start + startMarkerStr.length, end - 1))
    if (!valid) {
      return false
    }

    let params = src.substring(start + startMarkerStr.length, end - 1).trim().split(' ')
    return {
      year: parseInt(params[0]),
      month: parseInt(params[1])
    }
  }

  function parseEndLine (src, start, end) {
    return src.substring(start, end).trim() == endMarkerStr
  }

  function parseDate (src, start, end, time) {
    // extract a valid Date
    let lineStr = src.substring(start, end).trim()
    try {
      let date = lineStr.match(DATE_REGEX)
      let localTime = Object.assign({}, time)
      localTime['date'] = parseInt(date[1])
      return isValidDate(localTime)
    } catch (err) {
      return false
    }
    return false
  }

  function parseEvent (src, start, end) {
    let lineStr = src.substring(start, end).trim()
    try {
      let event = lineStr.match(EVENT_REGEX)
      return {
        title: event[1],
        description: event[2]
      }
    } catch (err) {
      return false
    }
    return false
  }

  function addToken (state, params) {
    let token = state.push(params.type, params.tag || 'div', params.nesting)
    token.markup = params.markup || ''
    token.block = params.block || true
    token.content = params.content || ''
    if ('info' in params) {
      token.info = params.info
    }
    if ('map' in params) {
      token.map = params.map
    }
    return token
  }

  /*************************************************************/

  options = options || {}

  let validateParam = options.validateParam || validateParamsDefault,
    render = options.render || renderDefault

  /*************************************************************
   * Rule function
   */
  function calendarRule (state, startLine, endLine, silent) {
    let currentLine, currentDay,
      autoClosed = 0,
      token,
      start = state.bMarks[startLine] + state.tShift[startLine],
      end = state.eMarks[startLine],
      renderInfo = {
        Date: {},
        Content: {}
      }

    // check the first line is correct
    let date = parseStartLine(state.src, start, end, validateParam)
    if (date === false) {
      return false
    }
    if (silent) {
      return true
    }

    renderInfo['Date'] = date

    // iterate the lines
    for (currentLine = startLine + 1; currentLine < endLine; ++currentLine) {
      start = state.bMarks[currentLine] + state.tShift[currentLine]
      end = state.eMarks[currentLine]

      // Meet day line
      let day = parseDate(state.src, start, end, date)
      if (day) {
        currentDay = day
        continue
      } // ======================================================

      // Meet event line
      event = parseEvent(state.src, start, end)
      if (currentDay && event) {
        renderInfo['Content'][currentDay] = renderInfo['Content'][currentDay] || []
        renderInfo['Content'][currentDay].push(event)
        continue
      } // ======================================================

      // Meet End of line
      if (state.src[start] === endMarkerStr[0] && parseEndLine(state.src, start, end)) {
        autoClosed = 1
        break
      } // ======================================================
    } // end for (iterate the lines)

    state.line = currentLine + autoClosed
    // add token(calendar_open) to [tokens ...]
    token = addToken(state, {
      type: name,
      nesting: 0,
      markup: startMarkerStr,
      info: renderInfo,
      map: [startLine, state.line],
      content: ''
    })

    return true
  }

  md.block.ruler.before('fence', name, calendarRule, {
    alt: ['paragraph', 'blockquote', 'list']
  })
  md.renderer.rules[name] = renderDefault
}
