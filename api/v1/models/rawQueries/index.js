require('dotenv').config()
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '../../../config/config.json')[env]
let seq
if (config.use_env_variable) {
  seq = new Sequelize(process.env[config.use_env_variable], config)
} else {
  seq = new Sequelize(config.database, config.username, config.password, config)
}

module.exports = seq
