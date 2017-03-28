require('./calendar.css')
import createCalendarHTML from './calendar'

module.exports = function calendarPlugin (md, options) {
  options = options || {}

  let name = 'calendar',
    startMarkerStr = options.startMarker || `:::${name}`,
    endMarkerStr = options.endMarker || ':::',
    PARAMS_REGEX = options.PARAMS_REGEX || /^(\((.*)\)){0,1}\s+(\d+)[ ]+(\d+)\s*$/,
    DATE_REGEX = options.DATE_REGEX || /^[+*-]\s+(\d{1,2})(\s(.*))?$/,
    EVENT_REGEX = options.EVENT_REGEX || /^[-*+]\s*\[(.*?)\]\s*(.*)$/

  let render = options.render || renderDefault
  /*************************************************************
   * Default validate and render function
   */

  function renderDefault (tokens, idx, _options, env, self) {
    const data = tokens[idx].info
    const table = createCalendarHTML(md, data)
    const style = data.Style === 'dark' ? 'dark' : ''
    return `<div class="markdown-it-calendar ${style}">` + table + '</div>'
  }

  /*************************************************************
   * Helper functions
   */

  // time structure must be {year: 2017, month: 12, date: 30, time: "13:14"}
  function isValidDate (d) {
    try {
      let result = new Date(d.year, d.month - 1, d.date)
      result.setFullYear(d.year) // ensure every year can be used
      let valid = d.year === result.getFullYear() &&
              d.month === (result.getMonth() + 1) &&
              d.date === result.getDate()
      return valid ? result : false
    } catch (err) {
      return false
    }
    return false
  }

  // return true if params is valid
  function parseParams (params) {
    params = params.match(PARAMS_REGEX)

    if (params) {
      try {
        let style = params[2]
        let year = parseInt(params[3])
        let month = parseInt(params[4])
        if (year >= 0 && year <= 100000 && month >= 1 && month <= 12) {
          return {
            style: style,
            year: year,
            month: month
          }
        }
      } catch (e) {
        console.error('PARAMS_REGEX is invalid')
        return false
      }
    }

    return false
  }

  function parseStartLine (src, start, end) {
    // Return earlier if not match
    let valid = src.substring(start, start + startMarkerStr.length).toLowerCase() === startMarkerStr
    if (!valid) {
      return false
    }

    return parseParams(src.substring(start + startMarkerStr.length, end))
  }

  function parseEndLine (src, start, end) {
    return src.substring(start, end).trim() == endMarkerStr
  }

  // extract a valid Date
  function parseDate (src, start, end, params) {
    let lineStr = src.substring(start, end).trim()
    let date = lineStr.match(DATE_REGEX)
    if (date) {
      try {
        let localTime = Object.assign({}, params)
        localTime['date'] = parseInt(date[1])
        return {
          title: date[3],
          day: isValidDate(localTime)
        }
      } catch (err) {
        console.error('DATE_REGEX is invalid')
        return false
      }
    }

    return false
  }

  // extract a valid event
  function parseEvent (src, start, end) {
    let lineStr = src.substring(start, end).trim()
    let event = lineStr.match(EVENT_REGEX)
    if (event) {
      try {
        return {
          tag: event[1],
          description: event[2]
        }
      } catch (err) {
        console.error('EVENT_REGEX is invalid')
        return false
      }
    }
    return false
  }

  function pushEventContent (event, src, start, end) {
    let lineStr = src.substring(start, end)
    event.description += '\n' + lineStr
  }

  // add token helper
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

  /*************************************************************
   * Rule function
   */
  function calendarRule (state, startLine, endLine, silent) {
    let currentLine, currentDay, currentEvent,
      autoClosed = 0,
      token,
      start = state.bMarks[startLine] + state.tShift[startLine],
      end = state.eMarks[startLine],
      renderInfo = {
        Year: -1,
        Month: 0,
        Days: {}
      }

    // check the first line is correct
    let params = parseStartLine(state.src, start, end)
    if (!params) {
      return false
    }
    if (silent) {
      return true
    }

    renderInfo['Style'] = params.style
    renderInfo['Year'] = params.year
    renderInfo['Month'] = params.month

    // iterate the lines
    for (currentLine = startLine + 1; currentLine < endLine; ++currentLine) {
      start = state.bMarks[currentLine] + state.tShift[currentLine]
      end = state.eMarks[currentLine]

      // Meet day line
      let dayInfo = parseDate(state.src, start, end, params)
      if (dayInfo.day) {
        currentEvent = undefined
        // Assign current Day
        currentDay = dayInfo.day
        renderInfo['Days'][currentDay] = renderInfo['Days'][currentDay] || {}
        renderInfo['Days'][currentDay]['title'] = dayInfo.title
        renderInfo['Days'][currentDay]['startLine'] = currentLine
        continue
      }

      // Meet event line
      event = parseEvent(state.src, start, end)
      if (currentDay && event) {
        // Assign current event
        currentEvent = event
        currentEvent['startLine'] = currentLine
        renderInfo['Days'][currentDay]['events'] = renderInfo['Days'][currentDay]['events'] || []
        renderInfo['Days'][currentDay]['events'].push(event)
        continue
      }

      // Meet End of line
      if (state.src[start] === endMarkerStr[0] && parseEndLine(state.src, start, end)) {
        autoClosed = 1
        break
      }

      // Meet another words
      if (currentEvent) {
        pushEventContent(currentEvent, state.src, start, end)
      }
    } // end for (iterate the lines)

    state.line = currentLine + autoClosed
    // add token(calendar_open) to [tokens ...]
    renderInfo['startLine'] = startLine
    renderInfo['endLine'] = currentLine
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
    alt: ['paragraph', 'blockquote']
  })
  md.renderer.rules[name] = renderDefault
}
