const Router = require('koa-router')
const users = new Router()
const models = require('../models')
const lov = require('lov')

users.get('/', async (ctx, next) => {
  const allUsers = await models.user.findAll()

  ctx.body = allUsers
  ctx.status = 200
  await next()
})

users.get('/:id', async (ctx, next) => {
  const user = await models.user.findByPk(ctx.params.id)
  ctx.assert(user, 404, 'Usuario no encontrado')
  ctx.body = user
  ctx.status = 200
  await next()
})

users.put('/:id', async (ctx, next) => {
  const user = await models.user.findByPk(ctx.params.id)
  ctx.assert(user, 404, 'Usuario no encontrado')

  let {
    body
  } = ctx.request

  const validations = lov.validate(body, {
    firstname: lov.string().required(),
    lastname: lov.string().required(),
    email: lov.string().required(),
    password: lov.string().required()
  })

  if (validations.error) {
    return ctx.throw(422, validations.error.message)
  }

  const updatedUser = await user.update(body)

  ctx.body = updatedUser
  ctx.status = 200
  await next()
})

users.delete('/:id', async (ctx, next) => {
  const user = await models.user.findByPk(ctx.params.id)
  ctx.assert(user, 404, 'Usuario no encontrado')
  const deleted = await user.destroy()

  ctx.body = deleted
  ctx.status = 200
  await next()
})

module.exports = users
