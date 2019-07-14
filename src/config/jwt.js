const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRATION = process.env.JWT_EXPIRATION

module.exports = {
  sign: function (data) {
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRATION })

    return token
  },

  verify: function (token) {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, JWT_SECRET, function (err, data) {
        if (err) { return reject(err) }

        resolve(data)
      })
    })
  }
}
