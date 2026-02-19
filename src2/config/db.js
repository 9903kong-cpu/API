const { Sequelize } = require('sequelize');
const path = require('path');

// สร้างการเชื่อมต่อฐานข้อมูลชื่อ
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); 
    console.log('SQLite Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };