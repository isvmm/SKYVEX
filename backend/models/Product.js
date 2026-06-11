const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON, // Stores an array of image URLs
    allowNull: false,
    defaultValue: []
  },
  sizes: {
    type: DataTypes.JSON, // Stores an array of size strings, e.g., ["S", "M", "L"]
    allowNull: false,
    defaultValue: ["S", "M", "L", "XL"]
  },
  colors: {
    type: DataTypes.JSON, // Stores an array of color strings, e.g., ["Blue", "White"]
    allowNull: false,
    defaultValue: []
  },
  isBestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isNewArrival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

module.exports = Product;
