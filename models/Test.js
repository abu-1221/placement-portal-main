const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Test = sequelize.define('Test', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
  },
  questions: {
    type: DataTypes.JSON, // Array of {q, options, answer}
    allowNull: false
  },
  createdBy: {
    type: DataTypes.STRING, // Staff username
  },
  status: {
    type: DataTypes.STRING, // 'active', 'archived', 'draft'
    defaultValue: 'active'
  }
});

module.exports = Test;
