const jwt = require('../config/jwt')

module.exports = async function (ctx, next) {
  let {
    authorization
  } = ctx.req.headers
  if (authorization) {
    const token = authorization.split(' ')[1]

    try {
      await jwt.verify(token)
    } catch (e) {
      ctx.throw(401, 'Invalid JWT')
    }
    await next()
  } else {
    ctx.throw(401, 'Invalid JWT')
  }
}
