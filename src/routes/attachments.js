const Router = require('koa-router')
const fs = require('fs-extra')
const attachments = new Router()
const { task, attachment } = require('../models')
const formidable = require('formidable')

attachments.get('/:task/attachments', async (ctx, next) => {
  const taskDetail = await task.findByPk(ctx.params.task)

  console.log('ctx.params', ctx.params)
  ctx.assert(taskDetail, 404, 'Tarea no encontrada')

  const allAttachments = await attachment.findAll({
    where: { id_task: ctx.params.task }
  })
  ctx.body = allAttachments
  await next()
})

attachments.get('/:task/attachments/:id', async (ctx, next) => {
  const attachmentDetail = await attachment.findByPk(ctx.params.id)
  ctx.assert(attachmentDetail, 404, 'Archivo no encontrado')

  ctx.body = attachmentDetail
  await next()
})

attachments.post('/:task/attachments/', async (ctx, next) => {
  const translationsPath = './public'
  await fs.ensureDir(translationsPath)

  const taskDetail = await task.findByPk(parseInt(ctx.params.task))
  ctx.assert(taskDetail, 404, 'Tarea no encontrada')

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
  const attachmentDetail = await attachment.create(attachmentData)

  ctx.body = attachmentDetail
  await next()
})

attachments.delete('/:task/attachments/:id', async (ctx, next) => {
  const attachmentDetail = await attachment.findByPk(ctx.params.id)
  ctx.assert(attachmentDetail, 404, 'Archivo no encontrado')
  const deleted = await attachmentDetail.destroy()

  fs.remove(attachmentDetail.url)

  ctx.body = deleted
  await next()
})

module.exports = attachments
