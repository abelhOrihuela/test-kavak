const Koa = require('koa')
const router = require('./src/routes')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
