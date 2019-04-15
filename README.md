# SYNOPSIS

🛠 Opinionated, Async/Await optimized Bitmex client.

## USAGE

```sh
npm i -S joemccann/bitmex
```

Then, in your Node.js app:

```js
const Bitmex = require('bitmex')

const { env: {
  API_KEY,
  API_SECRET
} } = process

const bitmex = new Bitmex({ API_KEY, API_SECRET })

const { err, data } = await bitmex.request({
  endpoint: 'funding'
})

if(err) return { err }

console.log(data)
```

## API

All requests adhere to following pattern:

```js
const params = {
  body: {
    columns,
    filter,
    symbol
  },
  endpoint,
  verb
}

const { err, data } = await bitmex.requres(params)
```

Refer to the [Bitmex API](https://www.bitmex.com/api/explorer/) for various endpoints, filters, symbols and columns.

## 🍭 SYNTACTIC SUGAR

Some simplified methods for common requests:

```js
//
// Returns 'data' as the current price of the asset as a float
//
const { err, data } = await bitmex.price('XBTUSD')
```

```js
//
// Returns 'data' as an object of { bids, offers, spread }
// bids is an array of order book objects w/index zero being the highest bid
// offers is an array of order book objects w/index zero being the lowest offer
// spread is the delta between the top bid and top offer as float
// an order book object is from Bitmex: { symbol, id, side, size, price }
//
const { err, data } = await bitmex.book('XBTUSD')
```

```js
//
// Returns 'data' as an array of strings of active instruments and indices
// The 'data' object may be different based on the parameters passed in.
// Refer to the source code in `index.js` for more details or check the 
// test cases in the `test.js` file.
//
const { err, data } = await bitmex.instruments({filter, instrument, raw})
```


## TESTS

```sh
npm i -D
API_KEY={YOUR-API-KEY} API_SECRET={YOUR-API-SECRET} DEBUG=bitmex:client npm test
```

## AUTHORS

- [Joe McCann](https://twitter.com/joemccann)

## LICENSE

MIT