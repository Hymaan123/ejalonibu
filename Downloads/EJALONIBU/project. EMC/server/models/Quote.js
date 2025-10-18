const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quoteNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  customerType: {
    type: DataTypes.ENUM('registered', 'guest'),
    allowNull: false,
  },
  customerInfo: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  serviceCategory: {
    type: DataTypes.ENUM(
      'metal-construction',
      'wrought-iron',
      'aluminum-works',
      'security-fence',
      'heavy-duty-gates',
      'car-park-installation',
      'consultation',
      'other'
    ),
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectDetails: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  specifications: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  estimatedBudget: {
    type: DataTypes.DECIMAL(10, 2),
  },
  currency: {
    type: DataTypes.ENUM('USD', 'NGN'),
    defaultValue: 'USD',
  },
  timeline: {
    type: DataTypes.STRING,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'expired'),
    defaultValue: 'pending',
  },
  assignedTo: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  quotedAmount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  quotedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  quotedAt: {
    type: DataTypes.DATE,
  },
  validUntil: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  internalNotes: {
    type: DataTypes.TEXT,
  },
  source: {
    type: DataTypes.ENUM('website', 'phone', 'email', 'referral', 'walk-in'),
    defaultValue: 'website',
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (quote) => {
      // Generate unique quote number
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      quote.quoteNumber = `QT-${timestamp}-${random}`;
      
      // Set validity period (30 days from creation)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      quote.validUntil = validUntil;
    },
  },
});

const QuoteResponse = sequelize.define('QuoteResponse', {
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
  responseType: {
    type: DataTypes.ENUM('clarification', 'quote', 'update', 'rejection'),
    defaultValue: 'clarification',
  },
}, {
  timestamps: true,
});

// Define associations
Quote.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'customerId', 
  as: 'customer' 
});

Quote.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'assignedTo', 
  as: 'assignedWorker' 
});

Quote.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'quotedBy', 
  as: 'quoter' 
});

Quote.hasMany(QuoteResponse, { 
  foreignKey: 'quoteId', 
  as: 'responses' 
});

QuoteResponse.belongsTo(Quote, { 
  foreignKey: 'quoteId' 
});

QuoteResponse.belongsTo(sequelize.models.User || require('./User'), { 
  foreignKey: 'userId', 
  as: 'user' 
});

module.exports = { Quote, QuoteResponse };