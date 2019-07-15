const Koa = require('koa')
const router = require('./src/routes')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const app = new Koa()

app
  .use(bodyParser({
    jsonLimit: '70mb',
    formLimit: '70mb'
  }))
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
