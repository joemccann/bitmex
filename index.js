const fetch = require('node-fetch')
const crypto = require('crypto')
const qs = require('qs')

class Bitmex {
  constructor (opts = {}) {
    this.BASE_URL = `https://www.bitmex.com`
    this.API_VERSION = opts.apiVersion || '/api/v1/'
    this.API_KEY = opts.apiKey || ''
    this.API_SECRET = opts.apiSecret || ''
    this.EXPIRES = opts.expires || Math.round(Date.now() / 1000) + 60
  }

  async responseHandler (response) {
    if (!response.ok) {
      return {
        err: response.statusText
      }
    }
    const data = await response.json()
    if (!data) {
      return {
        err: `Request failed: response body was null.`
      }
    }
    return { data }
  }

  async request (params) {
    let {
      body = '',
      endpoint = null,
      verb = 'GET'
    } = params

    let query = ''

    const options = {
      'headers': {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      'method': `${verb}`
    }

    if (verb === 'GET') {
      body = qs.stringify(body)
      query = '?' + body
    } else {
      try {
        body = JSON.stringify(body)
        options.body = body
      } catch (err) {
        return { err: err.message || err }
      }
    }

    const signature = crypto.createHmac('sha256', this.API_SECRET)
      .update(verb + this.API_VERSION + endpoint + query +
        this.EXPIRES + body).digest('hex')

    if (this.API_KEY && this.API_SECRET) {
      options.headers['api-expires'] = this.EXPIRES
      options.headers['api-key'] = this.API_KEY
      options.headers['signature'] = signature
    }

    const url = this.BASE_URL + this.API_VERSION + endpoint + query

    try {
      const response = await fetch(url, options)
      return await this.responseHandler(response)
    } catch (err) {
      return { err: err.message || err }
    }
  }
}

module.exports = Bitmex
