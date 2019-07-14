const Router = require('koa-router')
const attachments = new Router()

const models = require('../models')

attachments.get('/:task/attachments/', async (ctx, next) => {
  const task = await models.task.findByPk(ctx.params.id)
  ctx.assert(task, 404, 'Tarea no encontrado')

  const allAttachments = await models.attachment.findAll({
    where: { id_task: ctx.params.task }
  })
  ctx.body = allAttachments
  await next()
})

attachments.get('/:task/attachments/:id', async (ctx, next) => {
  const attachment = await models.attachment.findByPk(ctx.params.id)
  ctx.assert(attachment, 404, 'Archivo no encontrado')

  ctx.body = attachment
  await next()
})

attachments.post('/:task/attachments/', async (ctx, next) => {
  const attachment = await models.attachment.create(ctx.request.body)

  ctx.body = attachment
  await next()
})

attachments.patch('/:task/attachments/:id', async (ctx, next) => {
  const attachment = await models.attachment.findByPk(ctx.params.id)
  ctx.assert(attachment, 404, 'Archivo no encontrado')
  const updatedUser = await attachment.update(ctx.request.body)

  ctx.body = updatedUser
  await next()
})

attachments.delete('/:task/attachments/:id', async (ctx, next) => {
  const attachment = await models.attachment.findByPk(ctx.params.id)
  ctx.assert(attachment, 404, 'Archivo no encontrado')
  const deleted = await attachment.destroy()

  ctx.body = deleted
  await next()
})

module.exports = attachments
