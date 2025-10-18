const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enquiry = sequelize.define('Enquiry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'fabrication',
      'welding',
      'machining',
      'repair',
      'consultation',
      'other'
    ),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-review', 'quoted', 'approved', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
  },
  timeline: {
    type: DataTypes.STRING,
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  customerInfo: {
    type: DataTypes.JSON,
  },
  assignedTo: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
  },
  actualCost: {
    type: DataTypes.DECIMAL(10, 2),
  },
  completedAt: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

const EnquiryResponse = sequelize.define('EnquiryResponse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isInternal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

// Define associations
Enquiry.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'customerId', 
  as: 'customer' 
});

Enquiry.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'assignedTo', 
  as: 'assignedWorker' 
});

Enquiry.hasMany(EnquiryResponse, { 
  foreignKey: 'enquiryId', 
  as: 'responses' 
});

EnquiryResponse.belongsTo(Enquiry, { 
  foreignKey: 'enquiryId' 
});

EnquiryResponse.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'userId', 
  as: 'user' 
});

module.exports = { Enquiry, EnquiryResponse };