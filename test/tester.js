var testtool = require('./testtool')

var fs = require('fs')

var md = require('markdown-it')().use(require('../index'))

var filename = 'test1.md'

var fileContent = fs.readFileSync('./test/fixtures/' + filename, {encoding: 'utf8'})
var rendered = md.render(fileContent)

// console.log('render content:')
// console.log(rendered)

var cals = testtool(rendered)

if (typeof describe !== 'undefined') {
  var assert = require('assert')
  describe('find calendar', function () {
    it('should contain exactly one calendar', function () {
      assert.strictEqual(cals.length, 1)
    })
    it('should be parsed successfully', function () {
      assert.ok(cals[0].parseSuccessful)
    })
    it('should contain 31 days', function () {
      assert.strictEqual(cals[0].days.length, 31, 'CalendarCalendar.days length incorrect')
      assert.strictEqual(cals[0].daysCount, 31, 'CalendarCalendar.daysCount incorrect')
    })
    it('day(6) should be days[5]', function () {
      assert.deepStrictEqual(cals[0].day(6), cals[0].days[5])
    })
    it('day(13) should contain no event', function () {
      assert.strictEqual(cals[0].day(13).eventsCount, 0)
    })
    it('should throw an error if I try get title of events[0] in day(13)', function () {
      assert.throws(function () { return cals[0].day(13).event[0].description })
    })
    it('should not have day(44)', function () {
      assert.strictEqual(cals[0].day(44), null)
    })
    it('should contain one event one event on day(4)', function () {
      assert.strictEqual(cals[0].day(4).eventsCount, 1)
    })
    it('the event on day(4) should have title', function () {
      assert.ok(cals[0].day(4).events[0].hasTitle)
    })
    it('the event on day(4) should have description', function () {
      assert.ok(cals[0].day(4).events[0].hasDescription)
    })
    it('the event on day(4) should have title "day4"', function () {
      assert.equal(cals[0].day(4).events[0].title, 'day4')
    })
    it('the event on day(4) should have description "<h3>today is day 4</h3>"', function () {
      assert.equal(cals[0].day(4).events[0].description, md.render('### today is day 4'), 'description unequal to expected render output of markdown')
      assert.equal(cals[0].day(4).events[0].description.trim(), '<h3>today is day 4</h3>', 'description unequal to expected HTML')
    })
  })
} else {
  console.log('calendars in rendered:')
  console.log(cals.length)
  console.log('days in first calendar:')
  console.log(cals[0].daysCount)
  console.log('events on 4th:')
  console.log(cals[0].day(4).eventsCount)
  cals[0].day(4).events.forEach(function (v) {
    console.log('event title:')
    console.log(v.title)
    console.log('event description:')
    console.log(v.description)
  })
}
