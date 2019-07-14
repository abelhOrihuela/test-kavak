const Sequelize = require('sequelize')
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: 'localhost',
  dialect: 'mysql'
})

let User = sequelize.define('users', {
  id: {
    type: Sequelize.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: Sequelize.STRING,
  pass: Sequelize.STRING
})

let Task = sequelize.define('tasks', {
  id: {
    type: Sequelize.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: Sequelize.STRING,
  description: Sequelize.STRING
})

let Attachment = sequelize.define('attachment', {
  id: {
    type: Sequelize.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: Sequelize.STRING,
  url: Sequelize.STRING,
  id_task: { type: Sequelize.SMALLINT, foreignKey: true }
})

const db = {
  user: User,
  task: Task,
  attachment: Attachment
}

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
