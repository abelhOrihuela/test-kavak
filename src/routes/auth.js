const Router = require('koa-router')
const auth = new Router()
const bcrypt = require('bcrypt')
const models = require('../models')
const jwt = require('../config/jwt')
const lov = require('lov')

auth.post('/login', async (ctx, next) => {
  const {
    body
  } = ctx.request

  const validations = lov.validate(body, {
    email: lov.string().required(),
    password: lov.string().required()
  })

  if (validations.error) {
    return ctx.throw(422, validations.error.message)
  }

  const user = await models.user.findOne({ where: { email: body.email } })
  ctx.assert(user, 400, 'Usuario no encontrado')

  let isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(body.password, user.password, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })

  ctx.assert(isValid, 400, 'Contraseña incorrecta')

  var token = jwt.sign({ email: user.email })

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

  const validations = lov.validate(body, {
    firstname: lov.string().required(),
    lastname: lov.string().required(),
    email: lov.string().required(),
    password: lov.string().required()
  })

  if (validations.error) {
    return ctx.throw(422, validations.error.message)
  }

  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_WORK_FACTOR))
  body.password = bcrypt.hashSync(body.password, salt)

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
