const User = require('../models/User');

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL || 'admin@emcmetalworks.com' }
    });

    if (existingAdmin) {
      console.log('Default admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@emcmetalworks.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    });

    console.log('Default admin user created successfully');
    console.log(`Email: ${adminUser.email}`);
    console.log('Password: admin123456');
    console.log('Please change the default password immediately!');
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
};

module.exports = createDefaultAdmin;