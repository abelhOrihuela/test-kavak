const Router = require('koa-router')
const auth = new Router()
const bcrypt = require('bcrypt')
const models = require('../models')
const jwt = require('../config/jwt')
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

  var token = jwt.sign({ email: email })

  ctx.body = {
    me: user,
    token: token
  }
  ctx.status = 200
  await next()
})

auth.post('/register', async (ctx, next) => {
  let {
    body
  } = ctx.request

  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_WORK_FACTOR))
  body.pass = bcrypt.hashSync(body.pass, salt)

  let user
  try {
    user = await models.user.create(body)
    ctx.body = user
    ctx.status = 200
  } catch (error) {
    ctx.body = error.errors.map(l => l.message)
    ctx.status = 500
  }
  await next()
})

module.exports = auth
