const Router = require('koa-router')
const tasks = new Router()

const models = require('../models')

tasks.get('/', async (ctx, next) => {
  const allTasks = await models.task.findAll()

  ctx.body = allTasks
  await next()
})

tasks.get('/:id', async (ctx, next) => {
  const task = await models.task.findByPk(ctx.params.id)
  ctx.assert(task, 404, 'Tarea no encontrado')

  ctx.body = task
  ctx.status = 200
  await next()
})

tasks.post('/', async (ctx, next) => {
  const task = await models.task.create(ctx.request.body)

  ctx.body = task
  ctx.status = 200
  await next()
})

tasks.patch('/:id', async (ctx, next) => {
  const task = await models.task.findByPk(ctx.params.id)
  ctx.assert(task, 404, 'Tarea no encontrado')
  const updatedTask = await task.update(ctx.request.body)

  ctx.body = updatedTask
  ctx.status = 200
  await next()
})

tasks.delete('/:id', async (ctx, next) => {
  const task = await models.task.findByPk(ctx.params.id)
  ctx.assert(task, 404, 'Tarea no encontrado')
  const deleted = await task.destroy()

  ctx.body = deleted
  ctx.status = 200
  await next()
})

module.exports = tasks
