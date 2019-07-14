const Router = require('koa-router')
const users = new Router()
const bcrypt = require('bcrypt')
const models = require('../models')

users.get('/', async (ctx, next) => {
  const allUsers = await models.user.findAll()

  ctx.body = allUsers
  await next()
})

users.get('/:id', async (ctx, next) => {
  const user = await models.user.findByPk(ctx.params.id)

  ctx.body = user
  await next()
})

users.post('/', async (ctx, next) => {
  let {
    body
  } = ctx.request

  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_WORK_FACTOR))
  body.pass = bcrypt.hashSync(body.pass, salt)

  const user = await models.user.create(body)

  ctx.body = user
  await next()
})

users.put('/:id', async (ctx, next) => {
  const user = await models.user.findByPk(ctx.params.id)
  const updatedUser = await user.update(ctx.request.body)

  ctx.body = updatedUser
  await next()
})

users.delete('/:id', async (ctx, next) => {
  const user = await models.user.findByPk(ctx.params.id)
  const deleted = await user.destroy()

  ctx.body = deleted
  await next()
})

module.exports = users
