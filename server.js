const app = require('./app')
const db = require('./src/models')

db.sequelize.sync().then(() => {
  app.listen(3000)
})
