const Router = require('koa-router')
const fs = require('fs-extra')
const attachments = new Router()
const models = require('../models')
const formidable = require('formidable')

attachments.get('/:task/attachments', async (ctx, next) => {
  const task = await models.task.findByPk(ctx.params.task)

  console.log('ctx.params', ctx.params)
  ctx.assert(task, 404, 'Tarea no encontrada')

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
  const translationsPath = './public'
  await fs.ensureDir(translationsPath)

  const task = await models.task.findByPk(parseInt(ctx.params.task))
  ctx.assert(task, 404, 'Tarea no encontrada')

  const form = new formidable.IncomingForm()
  await new Promise((resolve, reject) => {
    form.parse(ctx.req, (err, fields, files) => {
      if (err) {
        reject(err)
      } else {
        ctx.request.body = fields
        ctx.request.files = files
        resolve()
      }
    })
  })

  if (!ctx.request.files.files) {
    return ctx.throw(422, 'Attachments is required')
  }

  let url = `${translationsPath}/${task.id}-${ctx.request.files.files.name}`
  let file = fs.readFileSync(ctx.request.files.files.path)

  fs.writeFileSync(
    url,
    file
  )

  let attachmentData = {
    url: url,
    id_task: task.id
  }
  const attachment = await models.attachment.create(attachmentData)

  ctx.body = attachment
  await next()
})

attachments.delete('/:task/attachments/:id', async (ctx, next) => {
  const attachment = await models.attachment.findByPk(ctx.params.id)
  ctx.assert(attachment, 404, 'Archivo no encontrado')
  const deleted = await attachment.destroy()

  fs.remove(attachment.url)

  ctx.body = deleted
  await next()
})

module.exports = attachments
