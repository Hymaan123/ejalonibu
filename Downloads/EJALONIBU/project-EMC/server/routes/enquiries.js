const express = require('express');
const { body, validationResult, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Enquiry = require('../models/Enquiry');
const { auth, authorize } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/enquiries/');
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
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents are allowed'));
    }
  }
});

// @route   POST /api/enquiries
// @desc    Create new enquiry
// @access  Public
router.post('/', upload.array('attachments', 5), [
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('serviceType').isIn([
    'metal-construction', 'wrought-iron', 'aluminum-works', 'security-fence',
    'heavy-duty-gates', 'car-park-installation', 'consultation', 'maintenance', 'other'
  ]).withMessage('Invalid service type'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('customerType').isIn(['registered', 'guest']).withMessage('Invalid customer type'),
  body('guestInfo.name').if(body('customerType').equals('guest')).notEmpty().withMessage('Name is required for guest enquiries'),
  body('guestInfo.email').if(body('customerType').equals('guest')).isEmail().withMessage('Valid email is required for guest enquiries')
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

    const enquiryData = {
      subject: req.body.subject,
      serviceType: req.body.serviceType,
      description: req.body.description,
      customerType: req.body.customerType,
      priority: req.body.priority || 'medium',
      source: req.body.source || 'website'
    };

    // Handle customer information
    if (req.body.customerType === 'registered') {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required for registered customer enquiries'
        });
      }
      enquiryData.customer = req.user.id;
    } else {
      enquiryData.guestInfo = {
        name: req.body.guestInfo.name,
        email: req.body.guestInfo.email,
        phone: req.body.guestInfo.phone,
        company: req.body.guestInfo.company
      };
    }

    // Handle project details
    if (req.body.projectDetails) {
      enquiryData.projectDetails = req.body.projectDetails;
    }

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      enquiryData.attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }));
    }

    const enquiry = new Enquiry(enquiryData);
    await enquiry.save();

    // Send confirmation email
    const customerEmail = enquiry.customerType === 'registered' 
      ? req.user?.email 
      : enquiry.guestInfo.email;

    if (customerEmail) {
      try {
        await sendEmail({
          to: customerEmail,
          subject: `Enquiry Received - ${enquiry.enquiryId}`,
          template: 'enquiry-confirmation',
          data: {
            enquiryId: enquiry.enquiryId,
            customerName: enquiry.customerType === 'registered' 
              ? req.user?.name 
              : enquiry.guestInfo.name,
            subject: enquiry.subject,
            serviceType: enquiry.serviceType
          }
        });
      } catch (emailError) {
        console.error('Confirmation email failed:', emailError);
      }
    }

    // Notify admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Enquiry - ${enquiry.enquiryId}`,
        template: 'new-enquiry-admin',
        data: {
          enquiryId: enquiry.enquiryId,
          customerName: enquiry.customerName,
          customerEmail: enquiry.customerEmail,
          subject: enquiry.subject,
          serviceType: enquiry.serviceType,
          priority: enquiry.priority
        }
      });
    } catch (emailError) {
      console.error('Admin notification email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: {
        enquiry: {
          id: enquiry._id,
          enquiryId: enquiry.enquiryId,
          subject: enquiry.subject,
          status: enquiry.status,
          createdAt: enquiry.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating enquiry'
    });
  }
});

// @route   GET /api/enquiries
// @desc    Get enquiries (filtered by user role)
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['new', 'in-review', 'quoted', 'accepted', 'rejected', 'completed', 'cancelled']),
  query('serviceType').optional().isIn([
    'metal-construction', 'wrought-iron', 'aluminum-works', 'security-fence',
    'heavy-duty-gates', 'car-park-installation', 'consultation', 'maintenance', 'other'
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
    const skip = (page - 1) * limit;

    // Build filter based on user role
    let filter = {};
    
    if (req.user.role === 'customer') {
      filter.customer = req.user.id;
    } else if (req.user.role === 'worker') {
      filter.assignedTo = req.user.id;
    }
    // Admin can see all enquiries

    // Apply additional filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.serviceType) filter.serviceType = req.query.serviceType;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.search) {
      filter.$or = [
        { subject: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { enquiryId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const enquiries = await Enquiry.find(filter)
      .populate('customer', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('responses.respondedBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enquiry.countDocuments(filter);

    res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enquiries'
    });
  }
});

// @route   GET /api/enquiries/:id
// @desc    Get single enquiry
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('customer', 'name email phone company')
      .populate('assignedTo', 'name email role')
      .populate('responses.respondedBy', 'name role')
      .populate('quote.quotedBy', 'name role');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'customer' && enquiry.customer?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'worker' && enquiry.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { enquiry }
    });
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enquiry'
    });
  }
});

// @route   POST /api/enquiries/:id/responses
// @desc    Add response to enquiry
// @access  Private
router.post('/:id/responses', auth, upload.array('attachments', 3), [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
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

    const enquiry = await Enquiry.findById(req.params.id)
      .populate('customer', 'name email');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Check access permissions
    const canRespond = req.user.role === 'admin' || 
                      (req.user.role === 'worker' && enquiry.assignedTo?.toString() === req.user.id) ||
                      (req.user.role === 'customer' && enquiry.customer?.toString() === req.user.id);

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
        path: file.path
      }));
    }

    const isInternal = req.body.isInternal === 'true' && req.user.role !== 'customer';

    await enquiry.addResponse(
      req.user.id,
      req.body.message,
      attachments,
      isInternal
    );

    // Update enquiry status if needed
    if (enquiry.status === 'new') {
      enquiry.status = 'in-review';
      await enquiry.save();
    }

    // Send notification email to customer (if not internal response)
    if (!isInternal && req.user.role !== 'customer' && enquiry.customer) {
      try {
        await sendEmail({
          to: enquiry.customer.email,
          subject: `Response to Your Enquiry - ${enquiry.enquiryId}`,
          template: 'enquiry-response',
          data: {
            enquiryId: enquiry.enquiryId,
            customerName: enquiry.customer.name,
            responderName: req.user.name,
            message: req.body.message
          }
        });
      } catch (emailError) {
        console.error('Response notification email failed:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Response added successfully'
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding response'
    });
  }
});

// @route   PUT /api/enquiries/:id/status
// @desc    Update enquiry status
// @access  Private (Admin/Worker only)
router.put('/:id/status', auth, authorize(['admin', 'worker']), [
  body('status').isIn(['new', 'in-review', 'quoted', 'accepted', 'rejected', 'completed', 'cancelled'])
    .withMessage('Invalid status')
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

    const enquiry = await Enquiry.findById(req.params.id)
      .populate('customer', 'name email');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Check if worker is assigned to this enquiry
    if (req.user.role === 'worker' && enquiry.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await enquiry.updateStatus(req.body.status, req.user.id);

    // Send notification email to customer
    if (enquiry.customer) {
      try {
        await sendEmail({
          to: enquiry.customer.email,
          subject: `Enquiry Status Update - ${enquiry.enquiryId}`,
          template: 'status-update',
          data: {
            enquiryId: enquiry.enquiryId,
            customerName: enquiry.customer.name,
            status: req.body.status,
            updatedBy: req.user.name
          }
        });
      } catch (emailError) {
        console.error('Status update email failed:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Status updated successfully'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status'
    });
  }
});

// @route   PUT /api/enquiries/:id/assign
// @desc    Assign enquiry to worker
// @access  Private (Admin only)
router.put('/:id/assign', auth, authorize(['admin']), [
  body('workerId').isMongoId().withMessage('Valid worker ID is required')
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

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // Verify worker exists and has correct role
    const worker = await User.findOne({ _id: req.body.workerId, role: 'worker' });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    enquiry.assignedTo = req.body.workerId;
    if (enquiry.status === 'new') {
      enquiry.status = 'in-review';
    }
    await enquiry.save();

    // Send notification email to worker
    try {
      await sendEmail({
        to: worker.email,
        subject: `New Enquiry Assignment - ${enquiry.enquiryId}`,
        template: 'enquiry-assignment',
        data: {
          workerName: worker.name,
          enquiryId: enquiry.enquiryId,
          subject: enquiry.subject,
          serviceType: enquiry.serviceType,
          assignedBy: req.user.name
        }
      });
    } catch (emailError) {
      console.error('Assignment notification email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Enquiry assigned successfully'
    });
  } catch (error) {
    console.error('Assign enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning enquiry'
    });
  }
});

module.exports = router;