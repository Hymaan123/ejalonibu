const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'metal-construction',
      'wrought-iron',
      'aluminum-works',
      'security-fence',
      'heavy-duty-gates',
      'car-park-installation'
    ),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  specifications: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  priceRange: {
    type: DataTypes.JSON,
    defaultValue: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
  },
  duration: {
    type: DataTypes.STRING,
  },
  complexity: {
    type: DataTypes.ENUM('basic', 'intermediate', 'advanced'),
    defaultValue: 'basic',
  },
  image: {
    type: DataTypes.STRING,
  },
  gallery: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  seoTitle: {
    type: DataTypes.STRING,
  },
  seoDescription: {
    type: DataTypes.TEXT,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = Service;