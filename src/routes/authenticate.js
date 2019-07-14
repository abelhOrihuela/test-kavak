const Router = require('koa-router')
const auth = new Router()
const bcrypt = require('bcrypt')
const models = require('../models')

auth.post('/login', async (ctx, next) => {
  let {
    email,
    password
  } = ctx.request.body
  const user = await models.user.findOne({ where: { email } })
  ctx.assert(user, 404, 'Usuario no encontrado')

  let isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.pass, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })

  ctx.assert(isValid, 404, 'Contraseña incorrecta')

  ctx.body = user
  await next()
})

module.exports = auth
