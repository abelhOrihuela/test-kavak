const Router = require('koa-router')
const tasks = new Router()
const models = require('../models')
const lov = require('lov')

tasks.get('/', async (ctx, next) => {
  const allTasks = await models.task.findAll()

  ctx.body = allTasks
  await next()
})

tasks.get('/search/tags', async (ctx, next) => {
  let validFields = ['name', 'status', 'user']

  let filters = {}
  let sortBy = []

  for (let field of validFields) {
    if (ctx.request.query[field]) {
      filters[field] = ctx.request.query[field]
    }
  }

  let { sort } = ctx.request.query

  if (sort) {
    let asc = sort.search('-')
    sortBy.push([
      sort.replace('-', ''),
      asc > -1 ? 'ASC' : 'DESC'
    ])
  }

  const allTasks = await models.task.findAll({
    where: filters,
    order: sortBy
  })

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
  const {
    body
  } = ctx.request

  const validations = lov.validate(body, {
    name: lov.string().required(),
    description: lov.string().required(),
    expiration_date: lov.string().required()
  })

  if (validations.error) {
    return ctx.throw(422, validations.error.message)
  }

  const task = await models.task.create({
    name: body.name,
    description: body.description,
    expiration_date: body.expiration_date
  })

  ctx.body = task
  ctx.status = 200
  await next()
})

tasks.patch('/:id', async (ctx, next) => {
  const {
    body
  } = ctx.request
  const task = await models.task.findByPk(ctx.params.id)
  ctx.assert(task, 404, 'Tarea no encontrado')

  const validations = lov.validate(body, {
    name: lov.string().required(),
    description: lov.string().required(),
    expiration_date: lov.string().required()
  })

  if (validations.error) {
    return ctx.throw(422, validations.error.message)
  }

  const updatedTask = await task.update(body)

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
