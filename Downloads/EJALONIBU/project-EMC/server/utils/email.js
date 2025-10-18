const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to EMC Ejalonibu Metal and Aluminium Works',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">Welcome to EMC Ejalonibu Metal and Aluminium Works, ${data.name}!</h2>
        <p>Thank you for registering with us. We're excited to help you with your metal construction needs.</p>
        <p>To complete your registration, please verify your email address by clicking the link below:</p>
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${data.verificationToken}" 
           style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email Address
        </a>
        <p>If you didn't create this account, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          EMC Metal Works Team<br>
          Email: info@ejalonibumetalworks.com<br>
          Phone: +234 (0) 123 456 7890
        </p>
      </div>
    `
  }),

  'password-reset': (data) => ({
    subject: 'Password Reset Request - EMC Ejalonibu Metal and Aluminium Works',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">Password Reset Request</h2>
        <p>Hello ${data.name},</p>
        <p>We received a request to reset your password for your EMC Ejalonibu Metal and Aluminium Works account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${data.resetToken}" 
           style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>This link will expire in 10 minutes for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          EMC Ejalonibu Metal and Aluminium Works Team
        </p>
      </div>
    `
  }),

  'enquiry-confirmation': (data) => ({
    subject: `Enquiry Received - ${data.enquiryId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">Enquiry Confirmation</h2>
        <p>Dear ${data.customerName},</p>
        <p>Thank you for your enquiry. We have received your request and will respond within 24 hours.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Enquiry Details:</h3>
          <p><strong>Enquiry ID:</strong> ${data.enquiryId}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Service Type:</strong> ${data.serviceType}</p>
        </div>
        <p>You can track the status of your enquiry by logging into your account on our website.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          EMC Metal Works Team<br>
          Email: info@ejalonibumetalworks.com<br>
          Phone: +234 (0) 123 456 7890
        </p>
      </div>
    `
  }),

  'new-enquiry-admin': (data) => ({
    subject: `New Enquiry - ${data.enquiryId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Enquiry Received</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Enquiry Details:</h3>
          <p><strong>Enquiry ID:</strong> ${data.enquiryId}</p>
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Service Type:</strong> ${data.serviceType}</p>
          <p><strong>Priority:</strong> ${data.priority}</p>
        </div>
        <a href="${process.env.ADMIN_URL}/enquiries/${data.enquiryId}" 
           style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Enquiry
        </a>
      </div>
    `
  }),

  'enquiry-response': (data) => ({
    subject: `Response to Your Enquiry - ${data.enquiryId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">Response to Your Enquiry</h2>
        <p>Dear ${data.customerName},</p>
        <p>We have responded to your enquiry <strong>${data.enquiryId}</strong>.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Response from ${data.responderName}:</h3>
          <p>${data.message}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/enquiries/${data.enquiryId}" 
           style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Full Conversation
        </a>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          EMC Ejalonibu Metal and Aluminium Works Team
        </p>
      </div>
    `
  }),

  'status-update': (data) => ({
    subject: `Enquiry Status Update - ${data.enquiryId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">Enquiry Status Update</h2>
        <p>Dear ${data.customerName},</p>
        <p>The status of your enquiry <strong>${data.enquiryId}</strong> has been updated.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>New Status:</strong> <span style="text-transform: capitalize;">${data.status}</span></p>
          <p><strong>Updated by:</strong> ${data.updatedBy}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/enquiries/${data.enquiryId}" 
           style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Enquiry
        </a>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          EMC Ejalonibu Metal and Aluminium Works Team
        </p>
      </div>
    `
  }),

  'enquiry-assignment': (data) => ({
    subject: `New Enquiry Assignment - ${data.enquiryId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">New Enquiry Assignment</h2>
        <p>Hello ${data.workerName},</p>
        <p>You have been assigned a new enquiry to handle.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Enquiry Details:</h3>
          <p><strong>Enquiry ID:</strong> ${data.enquiryId}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Service Type:</strong> ${data.serviceType}</p>
          <p><strong>Assigned by:</strong> ${data.assignedBy}</p>
        </div>
        <a href="${process.env.WORKER_URL}/enquiries/${data.enquiryId}" 
           style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Enquiry
        </a>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          EMC Ejalonibu Metal and Aluminium Works Management
        </p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();

    let emailContent = {};

    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else if (html || text) {
      emailContent = { subject, html, text };
    } else {
      throw new Error('No email content provided');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@ejalonibumetalworks.com',
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};