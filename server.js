require('dotenv').config()
const app = require('./app')
const db = require('./src/models')
db.sequelize.sync().then(() => {
  console.info('server on port 3000')
  app.listen(3000)
})
