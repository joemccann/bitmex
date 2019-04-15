# SYNOPSIS

🛠 Opinionated Bitmex client.

## USAGE

```sh
npm i -S joemccann/bitmex
```

Then, in your Node.js app:

```js
const Bitmex = require('bitmex')
const bitmex = new Bitmex() // Public client only

const { err, data } = await bitmex.request({endpoint: 'funding'})

if(err) return { err }

console.log(data)
```

## API

All requests adhere to following pattern:

```js
const params = {
  body: {
    symbol,
    filter,
    columns
  },
  endpoint,
  verb
}

const { err, data } = await bitmex.requres(params)
```

Refer to the [Bitmex API](https://www.bitmex.com/api/explorer/) for various endpoints, filters, symbols and columns.

## TESTS

```sh
npm i -D
npm test
```

## AUTHORS

- [Joe McCann](https://twitter.com/joemccann)

## LICENSE

MIT