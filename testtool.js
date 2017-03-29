require('jsdom-global')();

var className_calendar = 'markdown-it-calendar';
var className_calendar_table = 'calendar';
var className_day = 'calendar-cell';
var className_event_container = 'calendar-content';
var className_event = 'calendar-content-tag';
var className_event_description = 'calendar-content-tag-hover';

function get_innerHTML(html)
{
 return work_as_dom(html,function(v){
    return v.querySelector('div > *').innerHTML;
  });
}
function apply_selector_all(html,selector)
{
  if(html.constructor === Array)
  {
    console.log('apply_selector_all called with:');
    console.log('html:');
    console.log(html);
    console.log('selector:');
    console.log(selector);
  }
  var cont = document.createElement('div');
  cont.innerHTML = html;
  var rtn = [];
  //console.log('cont:');
  //console.log(cont.outerHTML);
  [].forEach.call(cont.querySelectorAll(selector),function(v){rtn = rtn.concat(v.outerHTML);});
  return rtn;
}
function work_as_dom(html,func)
{
  var dom = document.createElement('div');
  dom.innerHTML = html;
  return func(dom);
}


function Calendar_event(html)
{
  if(!this || !this.constructor || this.constructor !== Calendar_event)
    return new Calendar_event(html);
  var selfelem = apply_selector_all(html,'.'+className_event);
  this.title="";
  this.description="";
  this.has_title = false;
  this.has_description = false;
  this.parseSuccessful = true;

  if(selfelem.length==0)
  {
    this.parseSuccessful = false;
    return;
  }
  selfelem = selfelem[0];
  switch(apply_selector_all(selfelem,'.'+className_event_description).length)
  {
    case 0:
      break;
    case 1:
      this.has_description = true;
      this.description = get_innerHTML(apply_selector_all(selfelem,'.'+className_event_description)[0]);
      selfelem = work_as_dom(selfelem,function(v){v.querySelectorAll('.'+className_event_description).forEach(function(v){v.remove();});return v.querySelector('.'+className_event).innerHTML;});
      break;
    default:
      this.parseSuccessful = false;
      selfelem = work_as_dom(selfelem,function(v){v.querySelectorAll('.'+className_event_description).forEach(function(v){v.remove();});return v.innerHTML;});
      break;
  }
  if(selfelem.length)
  {
    this.has_title = true;
    this.title = selfelem;
  }
  this.parseSuccessful = this.parseSuccessful && (this.has_title || this.has_description);
  return;
}//done?

function Calendar_day(html)
{
  if(!this || !this.constructor || this.constructor !== Calendar_day)
    return new Calendar_day(html);

  this.events = [];
  this.events_count = 0;
  this.parseSuccessful = true;

  var today = apply_selector_all(html,'.calendar-cell-date');
  if(today.length!==1)
  {
    this.parseSuccessful = false;
    return;
  }
  today = html;//today is html of today
  var eventCont = apply_selector_all(today,'.'+className_event_container);
  switch(eventCont.length)
  {
    case 0:
      return;
    case 1:
      break;
    default:
      this.parseSuccessful = false;
      return;
  }
  eventCont = eventCont[0];
  var that = this;
  apply_selector_all(eventCont,'.'+className_event).forEach(function(v){
    var ev = Calendar_event(v);
    if(ev.parseSuccessful)
    {
      that.events = that.events.concat(ev);
    }
    else
      that.parseSuccessful = false;
  });
  that.events_count = that.events.length;
  return;
}
Calendar_day.prototype.has_event = function(){return this.events_count>0;}

function Calendar_Calendar(html)
{
  
  if(!this || !this.constructor || this.constructor !== Calendar_Calendar)
    return new Calendar_Calendar(html);

  this.days=[];
  this.days_count = 0;
  this.parseSuccessful = true;
  var tmpCalendarTableArr = apply_selector_all(html,'.'+className_calendar_table);
  switch(tmpCalendarTableArr.length)
  {
    case 0:
      this.parseSuccessful = false;
      return;
    case 1:
      break;
    default:
      this.parseSuccessful = false;
      return;
  }
  //tmpCalendarTableArr has only one table
  var calendarTable = tmpCalendarTableArr[0];

  var that = this;

  apply_selector_all(calendarTable,'.'+className_day).forEach(function(v){
    var tmpday = Calendar_day(v);
    that.days = that.days.concat(tmpday);
    ++that.days_count;
  });
  return;
}
Calendar_Calendar.prototype.day = function(n){if(n>this.days_count || n<=0)return null;return this.days[n-1];}


function getCalendars(render_result)
{
  var calsArr = apply_selector_all(render_result,'.'+className_calendar);
  var rtn = [];
  calsArr.forEach(function(v){
    rtn = rtn.concat(new Calendar_Calendar(v));
  });
  return rtn;
}

module.exports = getCalendars;
