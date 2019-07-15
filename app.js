const Koa = require('koa')
const router = require('./src/routes')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const formidable = require('koa2-formidable')
const app = new Koa()

app
  .use(bodyParser({
    jsonLimit: '70mb',
    formLimit: '70mb'
  }))
  .use(formidable())
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
