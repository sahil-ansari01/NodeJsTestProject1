const Sequelize = require('sequelize');

const sequelize = new Sequelize('NodeJsTestProject1', 'root', 'sahil@664', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;