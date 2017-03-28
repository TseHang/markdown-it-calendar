# markdown-it-calendar
[![NPM version][npm-image]][npm-url] [![Standard - JavaScript Style Guide][standardjs-image]][standardjs-url]

> Plugin for using markdown syntax to make a beautiful calendar for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser. 


With this plugin you can create a calendar `<div>`  using markdown like:
```
:::calendar 2017 4
** Write your to-do-things. **
:::
```

![Imgur](http://i.imgur.com/UQwFMVS.png)


#### Prerequire
- [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).
- [markdown-it](https://github.com/markdown-it/markdown-it)


## Installation

```bash
npm install markdown-it-calendar --save
```

## Use

#### in script

```javascript
const md = require('markdown-it')
md.use(require('markdown-it-calendar'))
```

#### in markdown
1. Set **Year**, **Month** (ex: 2017 04), then it will render the correct calendar.
```
:::calendar year month
:::
```

2. Write your **day-schedule**
- Using `-`, `+`, `*` be a marker, just like writting `ul` (no-sequence list).
- Using `[` ,`]` add **EventTitle**, then you can add **Description** after one space `' '` of eventTitle.
- If the day has a big event or important meanings, you can **add DayTitle after Date**.

```
:::calendar Year Month
- Date DayTitle
  - [EventTitle1] Description1
  - [EventTitle2] Description2
:::
```
##### **Support original markdown syntax in calendar.

## Syntax Example

#### Basic syntax
```
:::calendar 2017 4
- 1 today is good
    - [Title1] Description1
    - [Title2] Description2

- 23
    - [Title3] Description4
:::
```

#### Travel, Todo calendar
```
:::calendar 2017 4
- 1 Day1
    - [checking] 8:00 at Taipei Taoyuan airport
    - [arrive] 5-stars hotel.

- 2 Day2
    - [shopping] NO BUDGET!!!
    - [dinner] NO on a diet!!!

- 3 Day3
  - [Back] I love home~
:::
```


#### Support original markdown syntax.
```
:::calendar 2017 4

- 3 ## Publish
    - [markdown-it-calendar] That's a amazing tool from [markdown-it](https://github.com/markdown-it/markdown-it).

- 10 [Update!!](https://www.npmjs.com/package/markdown-it-calendar)
    - [**v1.5.0**] **OMG!**
      - Add style dark.
      - Fix markdown original syntax bug.
:::
```

## Config
Configs can be set directly in your markdown parser as per above examples, like this:

```javascript
const md = require('markdown-it')
md.use(require('markdown-it-calendar'), {
  startMarker: "any marker you want"
})
```

**Options**
- **startMarker** (default = `:::calendar`)
- **endMarker** (default = `:::`)
- **PARAMS_REGEX** (set regex for **` Year Month`** , default = `/^(\((.*)\)){0,1}\s+(\d+)[ ]+(\d+)\s*$/`)
- **DATE_REGEX** (set regex for **`- Date DayTitle`**, default = `/^[+*-]\s+(\d{1,2})(\s(.*))?$/`)
- **EVENT_REGEX** (set regex for **`- [EventTitle1] Description1`**, default = `/^[-*+]\s*\[(.*?)\]\s*(.*)$/`)



## License
© [MIT](./LICENSE.md)


[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[standardjs-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg

[standardjs-url]: https://standardjs.com
[npm-image]: https://badge.fury.io/js/markdown-it-calendar.svg
[npm-url]: https://www.npmjs.com/package/markdown-it-calendar