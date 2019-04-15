const test = require('tape')
const Bitmex = require('.')
const bitmex = new Bitmex()

//
// Create a mock request and response method
//

test('sanity', t => {
  t.ok(true)
  t.end()
})

const endpoints = ['funding', 'instrument', 'orderBook/L2']

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
