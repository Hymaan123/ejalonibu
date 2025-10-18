const express = require('express');
const { query, body, validationResult } = require('express-validator');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const Project = require('../models/Project');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(auth);
router.use(authorize(['admin']));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalWorkers,
      totalEnquiries,
      newEnquiries,
      totalProjects,
      activeProjects,
      completedProjects
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'worker' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Project.countDocuments(),
      Project.countDocuments({ status: { $in: ['planning', 'in-progress'] } }),
      Project.countDocuments({ status: 'completed' })
    ]);

    // Get recent enquiries
    const recentEnquiries = await Enquiry.find()
      .populate('customer', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent projects
    const recentProjects = await Project.find()
      .populate('customer', 'name email')
      .populate('projectManager', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get enquiry status distribution
    const enquiryStats = await Enquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get service type distribution
    const serviceStats = await Enquiry.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly enquiry trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Enquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalCustomers,
          totalWorkers,
          totalEnquiries,
          newEnquiries,
          totalProjects,
          activeProjects,
          completedProjects
        },
        recentEnquiries,
        recentProjects,
        statistics: {
          enquiryStats,
          serviceStats,
          monthlyTrends
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin only)
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['customer', 'worker', 'admin']).withMessage('Invalid role'),
  query('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
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

    // Build filter
    let filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin only)
router.put('/users/:id/status', [
  body('status').isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
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

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id && req.body.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    user.status = req.body.status;
    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
});

// @route   GET /api/admin/enquiries/analytics
// @desc    Get enquiry analytics
// @access  Private (Admin only)
router.get('/enquiries/analytics', async (req, res) => {
  try {
    // Response time analytics
    const responseTimeStats = await Enquiry.aggregate([
      {
        $match: {
          responses: { $exists: true, $ne: [] }
        }
      },
      {
        $addFields: {
          firstResponseTime: {
            $subtract: [
              { $arrayElemAt: ['$responses.respondedAt', 0] },
              '$createdAt'
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$firstResponseTime' },
          minResponseTime: { $min: '$firstResponseTime' },
          maxResponseTime: { $max: '$firstResponseTime' }
        }
      }
    ]);

    // Conversion rate (enquiries to projects)
    const totalEnquiries = await Enquiry.countDocuments();
    const acceptedEnquiries = await Enquiry.countDocuments({ status: 'accepted' });
    const conversionRate = totalEnquiries > 0 ? (acceptedEnquiries / totalEnquiries) * 100 : 0;

    // Worker performance
    const workerPerformance = await Enquiry.aggregate([
      {
        $match: {
          assignedTo: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          avgResponseTime: {
            $avg: {
              $cond: [
                { $gt: [{ $size: '$responses' }, 0] },
                {
                  $subtract: [
                    { $arrayElemAt: ['$responses.respondedAt', 0] },
                    '$createdAt'
                  ]
                },
                null
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'worker'
        }
      },
      {
        $unwind: '$worker'
      },
      {
        $project: {
          workerName: '$worker.name',
          totalAssigned: 1,
          completed: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completed', '$totalAssigned'] },
              100
            ]
          },
          avgResponseTime: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        responseTimeStats: responseTimeStats[0] || {},
        conversionRate,
        workerPerformance
      }
    });
  } catch (error) {
    console.error('Enquiry analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/admin/reports/export
// @desc    Export data for reports
// @access  Private (Admin only)
router.get('/reports/export', [
  query('type').isIn(['enquiries', 'users', 'projects']).withMessage('Invalid export type'),
  query('format').optional().isIn(['json', 'csv']).withMessage('Invalid format'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
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

    const { type, format = 'json', startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    let data;
    switch (type) {
      case 'enquiries':
        data = await Enquiry.find(dateFilter)
          .populate('customer', 'name email')
          .populate('assignedTo', 'name')
          .select('-responses -attachments')
          .sort({ createdAt: -1 });
        break;
      case 'users':
        data = await User.find(dateFilter)
          .select('-password -emailVerificationToken -passwordResetToken')
          .sort({ createdAt: -1 });
        break;
      case 'projects':
        data = await Project.find(dateFilter)
          .populate('customer', 'name email')
          .populate('projectManager', 'name')
          .select('-updates -documents -notes')
          .sort({ createdAt: -1 });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-export.csv"`);
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: {
          type,
          count: data.length,
          exportedAt: new Date(),
          data
        }
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting data'
    });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0].toObject ? data[0].toObject() : data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(item => {
    const obj = item.toObject ? item.toObject() : item;
    return headers.map(header => {
      const value = obj[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

module.exports = router;