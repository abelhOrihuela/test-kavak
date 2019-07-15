const Sequelize = require('sequelize')
const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
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
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: Sequelize.STRING
})

User.prototype.toJSON = function () {
  let values = Object.assign({}, this.get())
  delete values.password
  return values
}

let Task = sequelize.define('tasks', {
  id: {
    type: Sequelize.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: Sequelize.STRING,
  status: Sequelize.STRING,
  expiration_date: Sequelize.DATE,
  id_user: { type: Sequelize.SMALLINT, foreignKey: true }
})

let Attachment = sequelize.define('attachment', {
  id: {
    type: Sequelize.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  },
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
