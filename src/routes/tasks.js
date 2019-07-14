const Router = require('koa-router')
const tasks = new Router()

const models = require('../models')

tasks.get('/', async (ctx, next) => {
  const alltasks = await models.task.findAll()

  ctx.body = alltasks
  await next()
})

tasks.get('/:id', async (ctx, next) => {
  const user = await models.task.findById(ctx.params.id)

  ctx.body = user
  await next()
})

tasks.post('/', async (ctx, next) => {
  const user = await models.task.create(ctx.request.body)

  ctx.body = user
  await next()
})

tasks.patch('/:id', async (ctx, next) => {
  const user = await models.task.findById(ctx.params.id)
  const updatedUser = await user.update(ctx.request.body)

  ctx.body = updatedUser
  await next()
})

tasks.delete('/:id', async (ctx, next) => {
  const user = await models.task.findById(ctx.params.id)
  const deleted = await user.destroy()

  ctx.body = deleted
  await next()
})

module.exports = tasks
