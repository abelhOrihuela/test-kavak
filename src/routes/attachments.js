const Router = require('koa-router')
const attachments = new Router()

const models = require('../models')

attachments.get('/', async (ctx, next) => {
  const allUsers = await models.attachment.findAll()

  ctx.body = allUsers
  await next()
})

attachments.get('/:id', async (ctx, next) => {
  const user = await models.attachment.findById(ctx.params.id)

  ctx.body = user
  await next()
})

attachments.post('/', async (ctx, next) => {
  const user = await models.attachment.create(ctx.request.body)

  ctx.body = user
  await next()
})

attachments.patch('/:id', async (ctx, next) => {
  const user = await models.attachment.findById(ctx.params.id)
  const updatedUser = await user.update(ctx.request.body)

  ctx.body = updatedUser
  await next()
})

attachments.delete('/:id', async (ctx, next) => {
  const user = await models.attachment.findById(ctx.params.id)
  const deleted = await user.destroy()

  ctx.body = deleted
  await next()
})

module.exports = attachments
