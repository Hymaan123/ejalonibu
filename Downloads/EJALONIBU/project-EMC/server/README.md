# EMC Metal Works Backend API

A comprehensive backend system for EMC Metal Works with authentication, enquiry management, and project tracking.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Customer, Worker, Admin)
  - Password reset and email verification
  - Account lockout protection

- **Enquiry Management**
  - Customer enquiry submission (registered and guest users)
  - File attachments support
  - Response system with notifications
  - Status tracking and assignment
  - Email notifications

- **Project Management**
  - Project creation and tracking
  - Progress updates with images
  - Document management
  - Worker assignment
  - Quality checks and milestones

- **Admin Dashboard**
  - User management
  - Analytics and reporting
  - Data export functionality
  - System monitoring

## Installation

1. **Clone and setup**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   - Install MongoDB
   - Update MONGODB_URI in .env

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar
- `PUT /api/users/password` - Change password
- `PUT /api/users/preferences` - Update preferences
- `DELETE /api/users/account` - Deactivate account

### Enquiries
- `POST /api/enquiries` - Create enquiry
- `GET /api/enquiries` - Get enquiries (filtered by role)
- `GET /api/enquiries/:id` - Get single enquiry
- `POST /api/enquiries/:id/responses` - Add response
- `PUT /api/enquiries/:id/status` - Update status (Admin/Worker)
- `PUT /api/enquiries/:id/assign` - Assign to worker (Admin)

### Projects
- `GET /api/projects` - Get projects (filtered by role)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Admin)
- `POST /api/projects/:id/updates` - Add update
- `POST /api/projects/:id/documents` - Upload document
- `PUT /api/projects/:id/status` - Update status
- `POST /api/projects/:id/workers` - Assign worker

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/enquiries/analytics` - Enquiry analytics
- `GET /api/admin/reports/export` - Export data

## User Roles

### Customer
- Submit enquiries
- View own projects and enquiries
- Respond to enquiries
- Update profile and preferences

### Worker
- View assigned enquiries and projects
- Add responses and updates
- Upload project documents
- Update project progress

### Admin
- Full system access
- User management
- Enquiry assignment
- Project creation and management
- Analytics and reporting

## File Uploads

- **Enquiry attachments**: `/uploads/enquiries/`
- **Project documents**: `/uploads/projects/`
- **User avatars**: `/uploads/avatars/`

Supported formats:
- Images: JPEG, JPG, PNG
- Documents: PDF, DOC, DOCX, TXT
- CAD files: DWG, DXF (for projects)

## Email Notifications

The system sends automated emails for:
- User registration and verification
- Password reset
- Enquiry confirmations
- Status updates
- Worker assignments
- Project updates

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation and sanitization
- File upload restrictions
- Account lockout protection
- CORS configuration
- Helmet security headers

## Default Admin Account

On first startup, a default admin account is created:
- **Email**: admin@emcmetalworks.com
- **Password**: admin123456

**Important**: Change the default password immediately in production!

## Environment Variables

Key environment variables to configure:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/emc_metalworks

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin
ADMIN_EMAIL=admin@emcmetalworks.com
ADMIN_PASSWORD=admin123456

# Server
PORT=5000
NODE_ENV=development
```

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up email service
4. Configure file upload storage
5. Set up reverse proxy (nginx)
6. Enable SSL/TLS
7. Set up monitoring and logging

## API Documentation

For detailed API documentation with request/response examples, see the Postman collection or use tools like Swagger for interactive documentation.

## Support

For technical support or questions about the API, contact the development team.