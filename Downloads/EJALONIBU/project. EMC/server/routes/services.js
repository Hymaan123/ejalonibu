const express = require('express');
const { query, validationResult } = require('express-validator');
const Service = require('../models/Service');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services with filtering and pagination
// @access  Public
router.get('/', [
  query('category').optional().isIn([
    'metal-construction', 'wrought-iron', 'aluminum-works', 
    'security-fence', 'heavy-duty-gates', 'car-park-installation'
  ]).withMessage('Invalid category'),
  query('complexity').optional().isIn(['basic', 'intermediate', 'advanced']).withMessage('Invalid complexity'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search term too long')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build filter
    let where = { isActive: true };
    
    if (req.query.category) {
      where.category = req.query.category;
    }
    
    if (req.query.complexity) {
      where.complexity = req.query.complexity;
    }
    
    if (req.query.search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } },
        { shortDescription: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    const { count, rows: services } = await Service.findAndCountAll({
      where,
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          current: page,
          pages: Math.ceil(count / limit),
          total: count,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services'
    });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const service = await Service.findOne({
      where: {
        id: req.params.id,
        isActive: true
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: { service }
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service'
    });
  }
});

// @route   GET /api/services/category/:category
// @desc    Get services by category
// @access  Public
router.get('/category/:category', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const validCategories = [
      'metal-construction', 'wrought-iron', 'aluminum-works', 
      'security-fence', 'heavy-duty-gates', 'car-park-installation'
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service category'
      });
    }

    const { count, rows: services } = await Service.findAndCountAll({
      where: {
        category,
        isActive: true
      },
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: {
        category,
        services,
        pagination: {
          current: page,
          pages: Math.ceil(count / limit),
          total: count,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services'
    });
  }
});

module.exports = router;