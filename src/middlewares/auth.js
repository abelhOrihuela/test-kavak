const jwt = require('../config/jwt')
const models = require('../models')

module.exports = async function (ctx, next) {
  let {
    authorization
  } = ctx.req.headers
  if (authorization) {
    const token = authorization.split(' ')[1]

    try {
      let data = await jwt.verify(token)
      let user = await models.user.findOne({
        where: {
          email: data.email
        }
      })
      ctx.state.user = {
        id: user.dataValues.id,
        email: user.dataValues.email
      }
    } catch (e) {
      ctx.throw(401, 'Invalid JWT')
    }
    await next()
  } else {
    ctx.throw(401, 'Invalid JWT')
  }
}
