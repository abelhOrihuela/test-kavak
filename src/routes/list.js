const Router = require('koa-router')
const list = new Router()

list.post('/order', async (ctx, next) => {
  let {
    list,
    item
  } = ctx.request.body

  let index = list.indexOf(item)

  if (index < 0) {
    list.push(item)
    index = list.sort((a, b) => {
      return a - b
    }).indexOf(item)
  }

  ctx.body = { index: index, list }
  ctx.status = 200
  await next()
})

module.exports = list
