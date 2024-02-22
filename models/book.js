const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Book = sequelize.define('book', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    borrowedDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    returnDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    returned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fine: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    actualReturnDate:{
        type : Sequelize.DATE
    },
    finePaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = Book;