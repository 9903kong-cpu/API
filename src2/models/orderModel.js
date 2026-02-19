const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  idempotencyKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // ป้องกันการใช้ Key ซ้ำ
  }
});

Order.belongsTo(User, { foreignKey: 'userId' });
module.exports = Order;