const Router = require('koa-router')
const router = new Router()

const auth = require('./auth')
const users = require('./users')
const tasks = require('./tasks')
const attachments = require('./attachments')
const middlewareAuth = require('../middlewares/auth')

router.use('/auth', auth.routes())
router.use('/users', middlewareAuth, users.routes())
router.use('/tasks', middlewareAuth, tasks.routes())
router.use('/tasks', middlewareAuth, attachments.routes())

module.exports = router
