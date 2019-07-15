const Router = require('koa-router')
const tasks = new Router()
const { task } = require('../models')
const lov = require('lov')

tasks.get('/', async (ctx, next) => {
  const allTasks = await task.findAll()

  ctx.body = allTasks
  await next()
})

tasks.get('/search/tags', async (ctx, next) => {
  let validFields = ['name', 'status', 'id_user']

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

  const allTasks = await task.findAll({
    where: filters,
    order: sortBy
  })

  ctx.body = allTasks
  await next()
})

tasks.get('/:id', async (ctx, next) => {
  const taskDetail = await task.findByPk(ctx.params.id)
  ctx.assert(taskDetail, 404, 'Tarea no encontrado')

  ctx.body = taskDetail
  ctx.status = 200
  await next()
})

tasks.post('/', async (ctx, next) => {
  const {
    request: { body },
    state: { user }
  } = ctx

  const validations = lov.validate(body, {
    name: lov.string().required(),
    status: lov.string().required(),
    expiration_date: lov.string().required()
  })

  if (validations.error) {
    return ctx.throw(422, validations.error.message)
  }

  const taskDetail = await task.create({
    ...body,
    id_user: user.id
  })

  ctx.body = taskDetail
  ctx.status = 200
  await next()
})

tasks.patch('/:id', async (ctx, next) => {
  const {
    request: { body },
    state: { user }
  } = ctx

  const taskDetail = await task.findByPk(ctx.params.id)
  ctx.assert(taskDetail, 404, 'Tarea no encontrado')

  const validations = lov.validate(body, {
    name: lov.string().required(),
    status: lov.string().required(),
    expiration_date: lov.string().required(),
    id_user: user.id
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
  const taskDetail = await task.findByPk(ctx.params.id)
  ctx.assert(taskDetail, 404, 'Tarea no encontrado')
  const deleted = await taskDetail.destroy()

  ctx.body = deleted
  ctx.status = 200
  await next()
})

module.exports = tasks
