const Router = require('koa-router')
const router = new Router()

const auth = require('./authenticate')
const users = require('./users')
const tasks = require('./tasks')
const attachments = require('./attachments')

router.use('/auth', auth.routes())
router.use('/users', users.routes())
router.use('/tasks', tasks.routes())
router.use('/tasks/:id/attachments', attachments.routes())

module.exports = router
