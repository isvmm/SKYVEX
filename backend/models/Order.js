const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  estimatedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON, // Array of objects: [{ productId, name, price, quantity, size, color, image }]
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  couponApplied: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('COD', 'CARD', 'UPI'),
    allowNull: false,
    defaultValue: 'COD'
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending', // Pending, Paid, Failed
    allowNull: false
  },
  orderStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending', // Pending, Processing, Shipped, Delivered, Cancelled
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Order;
