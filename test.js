const test = require('tape')
const Bitmex = require('.')

const { env: {
  API_KEY,
  API_SECRET
} } = process

const bitmex = new Bitmex({ API_KEY, API_SECRET })

//
// Create a mock request and response method
//

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - API Key and Secret exists', t => {
  t.ok(API_KEY)
  t.ok(API_SECRET)
  t.end()
})

test('pass - instruments, default', async t => {
  const { err, data } = await bitmex.instruments()
  t.ok(!err)
  t.ok(data)
  t.true(Array.isArray(data))
  t.true(data.length)
  t.end()
})

test('pass - instruments, filter by XBT', async t => {
  const { err, data } = await bitmex.instruments({
    filter: 'XBT'
  })
  t.true(Array.isArray(data))
  t.equals(data.length, 5)
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('pass - instruments, exact instrument XBTU19', async t => {
  const { err, data } = await bitmex.instruments({
    instrument: 'XBTU19'
  })
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('pass - instruments, raw', async t => {
  const { err, data } = await bitmex.instruments({
    raw: true
  })
  t.ok(!err)
  t.ok(data)
  t.true(Array.isArray(data))
  t.true(data.length)
  t.end()
})

test('pass - price, .BXBT', async t => {
  const { err, data } = await bitmex.price('.BXBT')
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('pass - price, XBTUSD', async t => {
  const { err, data } = await bitmex.price('XBTUSD')
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('fail - price', async t => {
  const { err, data } = await bitmex.price('ZYABC')
  t.ok(err)
  t.ok(!data)
  t.end()
})

test('pass - book', async t => {
  const { err, data } = await bitmex.book('XBTUSD')
  t.ok(!err)
  t.ok(data)
  t.true(Array.isArray(data.bids))
  t.true(Array.isArray(data.offers))
  t.true(data.spread > 0) // spread can never be 0
  t.end()
})

test('fail - book', async t => {
  const { err, data } = await bitmex.book('ZYABC')
  t.ok(err)
  t.ok(!data)
  t.equal(err, `No results for ZYABC.`)
  t.end()
})

const endpoints = ['funding', 'instrument', 'orderBook/L2', 'quote']

test('pass - funding', async t => {
  const endpoint = endpoints[0]
  const { err, data } = await bitmex.request({ body: null, endpoint })
  t.ok(data)
  t.ok(!err)
  t.end()
})

test('pass - instrument', async t => {
  const endpoint = endpoints[1]
  const { err, data } = await bitmex.request({
    body: {
      columns: ['volume24h', 'vwap'],
      filter: { 'symbol': 'XBTUSD' }
    },
    endpoint
  })

  t.ok(!err)
  t.ok(data)
  t.end()
})

test('pass - orderBook', async t => {
  const endpoint = endpoints[2]
  const { err, data } = await bitmex.request({
    body: {
      'symbol': 'XBT'
    },
    endpoint
  })
  t.ok(!err)
  t.ok(data)
  t.end()
})

test('fail - instrument', async t => {
  const { err, data } = await bitmex.request({})
  t.ok(err)
  t.equals(err, `Not Found`)
  t.ok(!data)
  t.end()
})

test('fail - quote (is deprecated)', async t => {
  const endpoint = endpoints[3]
  const { err, data } = await bitmex.request({
    body: {
      symbol: '.BXBT'
    },
    endpoint
  })
  t.ok(!data)
  t.ok(err)
  t.equals(err, 'Forbidden')
  t.end()
})
