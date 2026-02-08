const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // 'student' or 'staff'
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profilePic: {
     type: DataTypes.BLOB('long') // Base64 or URL
  },
  details: {
    type: DataTypes.JSON, // Department, Year, Batch, DOB, etc.
    allowNull: true
  }
});

module.exports = User;
