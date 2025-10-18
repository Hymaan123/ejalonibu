const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
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
      'installation',
      'maintenance'
    ),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'planning',
      'in-progress',
      'on-hold',
      'quality-check',
      'completed',
      'delivered',
      'cancelled'
    ),
    defaultValue: 'planning',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  actualCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  estimatedCompletion: {
    type: DataTypes.DATE,
  },
  actualCompletion: {
    type: DataTypes.DATE,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  specifications: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  materials: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  qualityChecks: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

const ProjectUpdate = sequelize.define('ProjectUpdate', {
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
  type: {
    type: DataTypes.ENUM('progress', 'milestone', 'issue', 'quality-check', 'delivery'),
    defaultValue: 'progress',
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  documents: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  progressPercentage: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100,
    },
  },
}, {
  timestamps: true,
});

const ProjectDocument = sequelize.define('ProjectDocument', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
  },
  mimeType: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.ENUM('drawing', 'specification', 'certificate', 'photo', 'report', 'other'),
    defaultValue: 'other',
  },
}, {
  timestamps: true,
});

// Define associations
Project.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'customerId', 
  as: 'customer' 
});

Project.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'managerId', 
  as: 'manager' 
});

Project.hasMany(ProjectUpdate, { 
  foreignKey: 'projectId', 
  as: 'updates' 
});

Project.hasMany(ProjectDocument, { 
  foreignKey: 'projectId', 
  as: 'documents' 
});

ProjectUpdate.belongsTo(Project, { 
  foreignKey: 'projectId' 
});

ProjectUpdate.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'userId', 
  as: 'user' 
});

ProjectDocument.belongsTo(Project, { 
  foreignKey: 'projectId' 
});

ProjectDocument.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'uploadedBy', 
  as: 'uploader' 
});

module.exports = { Project, ProjectUpdate, ProjectDocument };