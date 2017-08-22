# rmc-calendar
---

React Mobile Calendar Component (web and react-native)


[![NPM version][npm-image]][npm-url]
![react-native](https://img.shields.io/badge/react--native-%3E%3D_0.30.0-green.svg)
![react](https://img.shields.io/badge/react-%3E%3D_15.2.0-green.svg)
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-calendar.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-calendar
[travis-image]: https://img.shields.io/travis/react-component/m-calendar.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-calendar
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-calendar.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-calendar?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-calendar.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-calendar
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-calendar.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-calendar

## Screenshots

<!-- <img src="https://os.alipayobjects.com/rmsportal/fOaDvpIJukLYznc.png" width="288"/> -->


## Development

```
npm i
npm start
```

## Example

http://localhost:8000/examples/

online example: http://react-component.github.io/m-calendar/

## react-native

```
./node_modules/rc-tools run react-native-init
npm run watch-tsc
react-native start
react-native run-ios
```

## install

[![rmc-calendar](https://nodei.co/npm/rmc-calendar.png)](https://npmjs.org/package/rmc-calendar)


# docs

## Usage
```jsx
<Calendar
    visible={this.state.show}
    onCancel={() => {
    }}
    onConfirm={(startTime, endTime) => {
    }}
    getDateExtra={(date) => {
        return extra[+date];
    }}
    minDate={new Date(+new Date - 60 * 24 * 3600 * 1000)}
    maxDate={new Date(+new Date + 365 * 24 * 3600 * 1000)}
/>
```

## API

### Calendar props

### DatePicker props

## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rmc-calendar is released under the MIT license.
