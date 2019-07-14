const Koa = require('koa')
const router = require('./src/routes')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')

const app = new Koa()

app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
