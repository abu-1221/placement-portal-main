const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const Result = sequelize.define('Result', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  testId: {
    type: DataTypes.BIGINT, // Match Test ID type
    allowNull: false
  },
  testName: {
    type: DataTypes.STRING,
  },
  company: {
     type: DataTypes.STRING,
  },
  score: {
    type: DataTypes.FLOAT, // Percentage
    allowNull: false
  },
  status: {
    type: DataTypes.STRING, // 'passed' or 'failed'
  },
  answers: {
    type: DataTypes.JSON // { qId: answer }
  }
});

module.exports = Result;
