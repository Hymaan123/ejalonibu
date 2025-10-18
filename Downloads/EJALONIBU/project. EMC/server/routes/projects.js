const express = require('express');
const { body, validationResult, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for project file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/projects/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|dwg|dxf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.includes('dwg') || file.mimetype.includes('dxf');

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, documents, and CAD files are allowed'));
    }
  }
});

// @route   GET /api/projects
// @desc    Get projects (filtered by user role)
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['planning', 'in-progress', 'quality-check', 'completed', 'on-hold', 'cancelled']),
  query('category').optional().isIn([
    'metal-construction', 'wrought-iron', 'aluminum-works', 'security-fence',
    'heavy-duty-gates', 'car-park-installation'
  ])
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
      filter.$or = [
        { projectManager: req.user.id },
        { 'assignedWorkers.worker': req.user.id }
      ];
    }
    // Admin can see all projects

    // Apply additional filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { projectId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .populate('customer', 'name email phone')
      .populate('projectManager', 'name email')
      .populate('assignedWorkers.worker', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('customer', 'name email phone company')
      .populate('projectManager', 'name email role')
      .populate('assignedWorkers.worker', 'name email role')
      .populate('updates.updatedBy', 'name role')
      .populate('documents.uploadedBy', 'name role')
      .populate('qualityChecks.inspector', 'name role')
      .populate('notes.addedBy', 'name role');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check access permissions
    const hasAccess = req.user.role === 'admin' ||
                     project.customer?.toString() === req.user.id ||
                     project.projectManager?.toString() === req.user.id ||
                     project.assignedWorkers.some(worker => worker.worker.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Filter sensitive information for customers
    if (req.user.role === 'customer') {
      project.updates = project.updates.filter(update => update.isPublic);
      project.documents = project.documents.filter(doc => doc.isPublic);
      project.notes = project.notes.filter(note => !note.isPrivate);
    }

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post('/', auth, authorize(['admin']), [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('customer').isMongoId().withMessage('Valid customer ID is required'),
  body('category').isIn([
    'metal-construction', 'wrought-iron', 'aluminum-works', 'security-fence',
    'heavy-duty-gates', 'car-park-installation'
  ]).withMessage('Invalid category'),
  body('timeline.startDate').isISO8601().withMessage('Valid start date is required'),
  body('timeline.estimatedCompletion').isISO8601().withMessage('Valid estimated completion date is required'),
  body('budget.estimated').isNumeric().withMessage('Valid estimated budget is required'),
  body('location.address').notEmpty().withMessage('Project address is required'),
  body('projectManager').isMongoId().withMessage('Valid project manager ID is required')
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

    // Verify customer exists
    const customer = await User.findOne({ _id: req.body.customer, role: 'customer' });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Verify project manager exists
    const projectManager = await User.findOne({ 
      _id: req.body.projectManager, 
      role: { $in: ['admin', 'worker'] } 
    });
    if (!projectManager) {
      return res.status(404).json({
        success: false,
        message: 'Project manager not found'
      });
    }

    const projectData = {
      title: req.body.title,
      description: req.body.description,
      customer: req.body.customer,
      enquiry: req.body.enquiry,
      category: req.body.category,
      priority: req.body.priority || 'medium',
      timeline: req.body.timeline,
      budget: req.body.budget,
      location: req.body.location,
      projectManager: req.body.projectManager,
      specifications: req.body.specifications || {},
      milestones: req.body.milestones || []
    };

    const project = new Project(projectData);
    await project.save();

    // Populate the created project
    await project.populate([
      { path: 'customer', select: 'name email' },
      { path: 'projectManager', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
});

// @route   POST /api/projects/:id/updates
// @desc    Add project update
// @access  Private (Project team only)
router.post('/:id/updates', auth, upload.array('images', 5), [
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
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

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user can add updates
    const canUpdate = req.user.role === 'admin' ||
                     project.projectManager?.toString() === req.user.id ||
                     project.assignedWorkers.some(worker => worker.worker.toString() === req.user.id);

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/projects/${file.filename}`);
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      progress: req.body.progress ? parseInt(req.body.progress) : undefined,
      images,
      location: req.body.location ? JSON.parse(req.body.location) : undefined,
      updatedBy: req.user.id,
      isPublic: req.body.isPublic !== 'false' // Default to true unless explicitly false
    };

    await project.addUpdate(updateData);

    res.json({
      success: true,
      message: 'Project update added successfully'
    });
  } catch (error) {
    console.error('Add project update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding project update'
    });
  }
});

// @route   POST /api/projects/:id/documents
// @desc    Upload project document
// @access  Private (Project team only)
router.post('/:id/documents', auth, upload.single('document'), [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Document name is required'),
  body('type').isIn(['contract', 'permit', 'drawing', 'specification', 'certificate', 'invoice', 'other'])
    .withMessage('Invalid document type'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user can upload documents
    const canUpload = req.user.role === 'admin' ||
                     project.projectManager?.toString() === req.user.id ||
                     project.assignedWorkers.some(worker => worker.worker.toString() === req.user.id);

    if (!canUpload) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const document = {
      name: req.body.name,
      type: req.body.type,
      filename: req.file.filename,
      path: `/uploads/projects/${req.file.filename}`,
      uploadedBy: req.user.id,
      isPublic: req.body.isPublic === 'true'
    };

    project.documents.push(document);
    await project.save();

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: { document }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading document'
    });
  }
});

// @route   PUT /api/projects/:id/status
// @desc    Update project status
// @access  Private (Project manager/Admin only)
router.put('/:id/status', auth, [
  body('status').isIn(['planning', 'in-progress', 'quality-check', 'completed', 'on-hold', 'cancelled'])
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

    const project = await Project.findById(req.params.id)
      .populate('customer', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const canUpdate = req.user.role === 'admin' ||
                     project.projectManager?.toString() === req.user.id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    project.status = req.body.status;
    
    if (req.body.status === 'completed') {
      project.timeline.actualCompletion = new Date();
      project.progress = 100;
    }

    await project.save();

    res.json({
      success: true,
      message: 'Project status updated successfully'
    });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project status'
    });
  }
});

// @route   POST /api/projects/:id/workers
// @desc    Assign worker to project
// @access  Private (Project manager/Admin only)
router.post('/:id/workers', auth, [
  body('workerId').isMongoId().withMessage('Valid worker ID is required'),
  body('role').optional().trim().isLength({ max: 100 }).withMessage('Role too long')
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

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const canAssign = req.user.role === 'admin' ||
                     project.projectManager?.toString() === req.user.id;

    if (!canAssign) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify worker exists
    const worker = await User.findOne({ _id: req.body.workerId, role: 'worker' });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // Check if worker is already assigned
    const isAlreadyAssigned = project.assignedWorkers.some(
      assigned => assigned.worker.toString() === req.body.workerId
    );

    if (isAlreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Worker is already assigned to this project'
      });
    }

    project.assignedWorkers.push({
      worker: req.body.workerId,
      role: req.body.role || 'Team Member'
    });

    await project.save();

    res.json({
      success: true,
      message: 'Worker assigned to project successfully'
    });
  } catch (error) {
    console.error('Assign worker error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning worker'
    });
  }
});

module.exports = router;