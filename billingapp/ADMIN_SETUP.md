# Admin Setup Guide

## Overview
The Billing System requires an initial admin setup before it can be used. This is a one-time process that creates the first (and only) administrator account.

## Setup Process

### 1. First Run
When you start the application for the first time:
- The system will automatically check if an admin user exists
- If no admin is found, you'll be redirected to the setup page
- The console will display setup instructions

### 2. Accessing Setup
- **URL**: `http://localhost:8080/setup`
- **Automatic Redirect**: Visit `http://localhost:8080` and you'll be redirected if setup is needed

### 3. Creating Admin Account
Fill out the admin setup form with:
- **Username**: Choose a unique username (3-50 characters)
- **Password**: Minimum 6 characters (password strength indicator included)
- **Confirm Password**: Must match the password
- **Full Name**: Your complete name
- **Email**: Valid email address
- **Phone**: Optional phone number

### 4. After Setup
- The admin account is created with `ROLE_ADMIN` privileges
- You'll be automatically logged in
- Redirected to the dashboard
- The system is now ready for use

## Security Features

### One Admin Only
- Only one admin account can exist in the system
- Additional admin creation is prevented
- This ensures system security and accountability

### Password Requirements
- Minimum 6 characters
- Password strength indicator
- Confirmation validation
- Encrypted storage using BCrypt

### Role Management
- Admin users get `ROLE_ADMIN` privileges
- Regular users get `ROLE_USER` privileges
- Role-based access control throughout the system

## API Endpoints

### Setup Status
```
GET /api/setup/status
```
Returns:
```json
{
  "setupRequired": true/false,
  "adminExists": true/false
}
```

### Create Admin (API)
```
POST /api/setup/admin
Content-Type: application/json

{
  "username": "admin",
  "password": "password123",
  "confirmPassword": "password123",
  "fullName": "Admin User",
  "email": "admin@example.com",
  "phone": "1234567890"
}
```

## Troubleshooting

### Setup Already Completed
If you try to access `/setup` after admin creation:
- You'll be redirected to login page
- Error message: "Setup already completed"

### Database Issues
If roles don't exist:
- The system automatically creates `ROLE_ADMIN` and `ROLE_USER`
- Check console logs for role creation messages

### Password Issues
- Ensure passwords match
- Minimum 6 characters required
- Check password strength indicator

## Console Messages

### Startup Messages
```
=== Billing System Startup ===
✅ Admin user found - System is ready for use
🌐 Access the application at: http://localhost:8080
=== Startup Complete ===
```

### Setup Required
```
=== Billing System Startup ===
⚠️  No admin user found - Setup required
🔧 Please visit: http://localhost:8080/setup to create the first admin account
📝 This is a one-time setup process
=== Startup Complete ===
```

## Important Notes

1. **Backup Credentials**: Store admin credentials securely
2. **One-Time Setup**: This process only needs to be done once
3. **No Recovery**: There's no built-in admin recovery mechanism
4. **Database Backup**: Consider backing up the database after setup
5. **Production**: Change default credentials in production environments

## Next Steps

After admin setup:
1. Login with your admin credentials
2. Access the dashboard
3. Create additional user accounts (non-admin)
4. Configure system settings
5. Start using the billing features
