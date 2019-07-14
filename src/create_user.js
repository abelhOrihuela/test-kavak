const bcrypt = require('bcrypt')
const models = require('./models')


const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_WORK_FACTOR))
body.pass = bcrypt.hashSync(body.pass, salt)

const user = await models.user.create(body)