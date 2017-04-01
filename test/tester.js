var testtool = require('./testtool')

var fs = require('fs')

var md = require('markdown-it')().use(require('../index'))

var filename = 'tests.txt'

var fileContent = fs.readFileSync('./test/' + filename, {encoding: 'utf8'})
var rendered = md.render(fileContent)

console.log('render content:')
console.log(rendered)

var cals = testtool(rendered)

console.log('calendars in rendered:')
console.log(cals.length)

console.log('days in first calendar:')
console.log(cals[0].days_count)
console.log('events on 4th:')
console.log(cals[0].day(4).events_count)
cals[0].day(4).events.forEach(function (v) {
  console.log('event_title:')
  console.log(v.title)
  console.log('event_description:')
  console.log(v.description)
})
