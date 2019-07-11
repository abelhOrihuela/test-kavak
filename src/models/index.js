const Sequelize = require('sequelize')

const sequelize = new Sequelize('test_kavak', 'root', '123456789', {
  host: 'localhost',
  dialect: 'mysql'
})

let User = sequelize.define('users', {
  id: { type: Sequelize.SMALLINT, primaryKey: true },
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: Sequelize.STRING,
  pass: Sequelize.STRING
})

let Task = sequelize.define('tasks', {
  id: { type: Sequelize.SMALLINT, primaryKey: true },
  name: Sequelize.STRING,
  description: Sequelize.STRING
})

const db = {
  user: User,
  task: Task
}

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
