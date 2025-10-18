const express = require('express');
const { body, validationResult, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { Quote, QuoteResponse } = require('../models/Quote');
const User = require('../models/User');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Configure multer for quote attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/quotes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt|dwg|dxf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                    file.mimetype.includes('dwg') || 
                    file.mimetype.includes('dxf') ||
                    file.mimetype.includes('document');

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, documents, and CAD files are allowed'));
    }
  }
});

// @route   POST /api/quotes
// @desc    Submit quote request
// @access  Public
router.post('/', optionalAuth, upload.array('attachments', 5), [
  body('customerType').isIn(['registered', 'guest']).withMessage('Invalid customer type'),
  body('serviceCategory').isIn([
    'metal-construction', 'wrought-iron', 'aluminum-works', 
    'security-fence', 'heavy-duty-gates', 'car-park-installation', 
    'consultation', 'other'
  ]).withMessage('Invalid service category'),
  body('serviceType').trim().isLength({ min: 1, max: 200 }).withMessage('Service type is required'),
  body('projectDetails.title').trim().isLength({ min: 5, max: 200 }).withMessage('Project title must be between 5 and 200 characters'),
  body('projectDetails.description').trim().isLength({ min: 10, max: 2000 }).withMessage('Project description must be between 10 and 2000 characters'),
  body('guestInfo.name').if(body('customerType').equals('guest')).notEmpty().withMessage('Name is required for guest quotes'),
  body('guestInfo.email').if(body('customerType').equals('guest')).isEmail().withMessage('Valid email is required for guest quotes'),
  body('guestInfo.phone').if(body('customerType').equals('guest')).optional().isMobilePhone().withMessage('Invalid phone number'),
  body('timeline').optional().trim().isLength({ max: 100 }).withMessage('Timeline too long'),
  body('estimatedBudget').optional().isNumeric().withMessage('Budget must be a number'),
  body('currency').optional().isIn(['USD', 'NGN']).withMessage('Invalid currency')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const quoteData = {
      customerType: req.body.customerType,
      serviceCategory: req.body.serviceCategory,
      serviceType: req.body.serviceType,
      projectDetails: req.body.projectDetails,
      specifications: req.body.specifications || {},
      estimatedBudget: req.body.estimatedBudget,
      currency: req.body.currency || 'USD',
      timeline: req.body.timeline,
      priority: req.body.priority || 'medium',
      source: req.body.source || 'website'
    };

    // Handle customer information
    if (req.body.customerType === 'registered') {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required for registered customer quotes'
        });
      }
      quoteData.customerId = req.user.id;
      quoteData.customerInfo = {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        company: req.user.company
      };
    } else {
      quoteData.customerInfo = {
        name: req.body.guestInfo.name,
        email: req.body.guestInfo.email,
        phone: req.body.guestInfo.phone,
        company: req.body.guestInfo.company,
        address: req.body.guestInfo.address
      };
    }

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      quoteData.attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/quotes/${file.filename}`
      }));
    }

    const quote = await Quote.create(quoteData);

    // Send confirmation email to customer
    try {
      await sendEmail({
        to: quoteData.customerInfo.email,
        subject: `Quote Request Received - ${quote.quoteNumber}`,
        template: 'quote-confirmation',
        data: {
          quoteNumber: quote.quoteNumber,
          customerName: quoteData.customerInfo.name,
          serviceCategory: quote.serviceCategory,
          serviceType: quote.serviceType,
          projectTitle: quote.projectDetails.title
        }
      });
    } catch (emailError) {
      console.error('Quote confirmation email failed:', emailError);
    }

    // Notify admin about new quote request
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@emcmetalworks.com',
        subject: `New Quote Request - ${quote.quoteNumber}`,
        template: 'new-quote-admin',
        data: {
          quoteNumber: quote.quoteNumber,
          customerName: quoteData.customerInfo.name,
          customerEmail: quoteData.customerInfo.email,
          serviceCategory: quote.serviceCategory,
          serviceType: quote.serviceType,
          projectTitle: quote.projectDetails.title,
          estimatedBudget: quote.estimatedBudget,
          currency: quote.currency
        }
      });
    } catch (emailError) {
      console.error('Admin quote notification email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: {
        quote: {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          status: quote.status,
          validUntil: quote.validUntil,
          createdAt: quote.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating quote request'
    });
  }
});

// @route   GET /api/quotes
// @desc    Get quotes (filtered by user role)
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'expired']),
  query('serviceCategory').optional().isIn([
    'metal-construction', 'wrought-iron', 'aluminum-works', 
    'security-fence', 'heavy-duty-gates', 'car-park-installation', 
    'consultation', 'other'
  ]),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
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

    // Build filter based on user role
    let where = {};
    
    if (req.user.role === 'customer') {
      where.customerId = req.user.id;
    } else if (req.user.role === 'worker') {
      where.assignedTo = req.user.id;
    }
    // Admin can see all quotes

    // Apply additional filters
    if (req.query.status) where.status = req.query.status;
    if (req.query.serviceCategory) where.serviceCategory = req.query.serviceCategory;
    if (req.query.priority) where.priority = req.query.priority;
    
    if (req.query.search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { quoteNumber: { [Op.iLike]: `%${req.query.search}%` } },
        { 'projectDetails.title': { [Op.iLike]: `%${req.query.search}%` } },
        { 'projectDetails.description': { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    const { count, rows: quotes } = await Quote.findAndCountAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone'] },
        { model: User, as: 'assignedWorker', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'quoter', attributes: ['id', 'name', 'email'] },
        { 
          model: QuoteResponse, 
          as: 'responses',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'role'] }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: {
        quotes,
        pagination: {
          current: page,
          pages: Math.ceil(count / limit),
          total: count,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quotes'
    });
  }
});

// @route   GET /api/quotes/:id
// @desc    Get single quote
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'company'] },
        { model: User, as: 'assignedWorker', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'quoter', attributes: ['id', 'name', 'email', 'role'] },
        { 
          model: QuoteResponse, 
          as: 'responses',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'role'] }],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    // Check access permissions
    const hasAccess = req.user.role === 'admin' ||
                     quote.customerId === req.user.id ||
                     quote.assignedTo === req.user.id;

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { quote }
    });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quote'
    });
  }
});

// @route   POST /api/quotes/:id/responses
// @desc    Add response to quote
// @access  Private
router.post('/:id/responses', auth, upload.array('attachments', 3), [
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters'),
  body('responseType').optional().isIn(['clarification', 'quote', 'update', 'rejection']).withMessage('Invalid response type'),
  body('quotedAmount').optional().isNumeric().withMessage('Quoted amount must be a number'),
  body('isInternal').optional().isBoolean().withMessage('isInternal must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const quote = await Quote.findByPk(req.params.id, {
      include: [{ model: User, as: 'customer', attributes: ['name', 'email'] }]
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    // Check access permissions
    const canRespond = req.user.role === 'admin' || 
                      (req.user.role === 'worker' && quote.assignedTo === req.user.id) ||
                      (req.user.role === 'customer' && quote.customerId === req.user.id);

    if (!canRespond) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Handle file attachments
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/quotes/${file.filename}`
      }));
    }

    const responseData = {
      quoteId: quote.id,
      userId: req.user.id,
      message: req.body.message,
      responseType: req.body.responseType || 'clarification',
      attachments,
      isInternal: req.body.isInternal === 'true' && req.user.role !== 'customer'
    };

    const response = await QuoteResponse.create(responseData);

    // Update quote status and quoted amount if this is a quote response
    if (req.body.responseType === 'quote' && req.body.quotedAmount) {
      quote.status = 'quoted';
      quote.quotedAmount = req.body.quotedAmount;
      quote.quotedBy = req.user.id;
      quote.quotedAt = new Date();
      await quote.save();
    } else if (quote.status === 'pending') {
      quote.status = 'reviewing';
      await quote.save();
    }

    // Send notification email to customer (if not internal response)
    if (!responseData.isInternal && req.user.role !== 'customer' && quote.customer) {
      try {
        await sendEmail({
          to: quote.customer.email,
          subject: `Response to Your Quote Request - ${quote.quoteNumber}`,
          template: 'quote-response',
          data: {
            quoteNumber: quote.quoteNumber,
            customerName: quote.customer.name,
            responderName: req.user.name,
            message: req.body.message,
            responseType: req.body.responseType,
            quotedAmount: req.body.quotedAmount,
            currency: quote.currency
          }
        });
      } catch (emailError) {
        console.error('Quote response notification email failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Response added successfully',
      data: { response }
    });
  } catch (error) {
    console.error('Add quote response error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding response'
    });
  }
});

// @route   PUT /api/quotes/:id/status
// @desc    Update quote status
// @access  Private (Admin/Worker only)
router.put('/:id/status', auth, authorize(['admin', 'worker']), [
  body('status').isIn(['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'expired'])
    .withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const quote = await Quote.findByPk(req.params.id, {
      include: [{ model: User, as: 'customer', attributes: ['name', 'email'] }]
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    // Check if worker is assigned to this quote
    if (req.user.role === 'worker' && quote.assignedTo !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const oldStatus = quote.status;
    quote.status = req.body.status;
    
    if (req.body.notes) {
      quote.notes = req.body.notes;
    }

    await quote.save();

    // Send notification email to customer if status changed
    if (oldStatus !== req.body.status && quote.customer) {
      try {
        await sendEmail({
          to: quote.customer.email,
          subject: `Quote Status Update - ${quote.quoteNumber}`,
          template: 'quote-status-update',
          data: {
            quoteNumber: quote.quoteNumber,
            customerName: quote.customer.name,
            oldStatus,
            newStatus: req.body.status,
            updatedBy: req.user.name,
            notes: req.body.notes
          }
        });
      } catch (emailError) {
        console.error('Quote status update email failed:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Quote status updated successfully'
    });
  } catch (error) {
    console.error('Update quote status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating quote status'
    });
  }
});

// @route   PUT /api/quotes/:id/assign
// @desc    Assign quote to worker
// @access  Private (Admin only)
router.put('/:id/assign', auth, authorize(['admin']), [
  body('workerId').isUUID().withMessage('Valid worker ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const quote = await Quote.findByPk(req.params.id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    // Verify worker exists and has correct role
    const worker = await User.findOne({ 
      where: { id: req.body.workerId, role: 'worker', isActive: true }
    });
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found or inactive'
      });
    }

    quote.assignedTo = req.body.workerId;
    if (quote.status === 'pending') {
      quote.status = 'reviewing';
    }
    await quote.save();

    // Send notification email to worker
    try {
      await sendEmail({
        to: worker.email,
        subject: `New Quote Assignment - ${quote.quoteNumber}`,
        template: 'quote-assignment',
        data: {
          workerName: worker.name,
          quoteNumber: quote.quoteNumber,
          serviceCategory: quote.serviceCategory,
          serviceType: quote.serviceType,
          projectTitle: quote.projectDetails.title,
          assignedBy: req.user.name
        }
      });
    } catch (emailError) {
      console.error('Quote assignment notification email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Quote assigned successfully'
    });
  } catch (error) {
    console.error('Assign quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning quote'
    });
  }
});

// @route   GET /api/quotes/public/:quoteNumber
// @desc    Get quote by quote number (for guest users)
// @access  Public
router.get('/public/:quoteNumber', async (req, res) => {
  try {
    const quote = await Quote.findOne({
      where: { quoteNumber: req.params.quoteNumber },
      include: [
        { 
          model: QuoteResponse, 
          as: 'responses',
          where: { isInternal: false },
          required: false,
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'role'] }],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    // Return limited information for public access
    const publicQuoteData = {
      quoteNumber: quote.quoteNumber,
      status: quote.status,
      serviceCategory: quote.serviceCategory,
      serviceType: quote.serviceType,
      projectTitle: quote.projectDetails.title,
      quotedAmount: quote.quotedAmount,
      currency: quote.currency,
      validUntil: quote.validUntil,
      createdAt: quote.createdAt,
      quotedAt: quote.quotedAt,
      responses: quote.responses
    };

    res.json({
      success: true,
      data: { quote: publicQuoteData }
    });
  } catch (error) {
    console.error('Get public quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quote'
    });
  }
});

module.exports = router;