# NEET UG Biology 360 - Complete Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
1. Copy `env.example` to `.env`
2. Fill in your actual values:
   - **Razorpay Keys**: Get from https://dashboard.razorpay.com (FREE test keys available)
   - **Email**: Gmail App Password from https://myaccount.google.com/apppasswords
   - **SMS**: Fast2SMS API key from https://www.fast2sms.com (FREE 20 SMS/day)
   - **WhatsApp**: CallMeBot API key from https://www.callmebot.com (FREE)

### 3. Initialize Database
The database will be created automatically on first run. The SQLite database file `neet.db` will be created in the project root.

### 4. Start the Server
```bash
npm start
```

The website will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

## 📋 Features

### ✅ Fully Implemented
- ✅ User Authentication (Email/Password + Google Login)
- ✅ Payment Integration (Razorpay)
- ✅ Admin Dashboard
- ✅ Content Management (NCERT Notes, MCQs, Mock Tests, Diagrams)
- ✅ User Dashboard
- ✅ Subscription Management
- ✅ Email/SMS/WhatsApp Notifications
- ✅ Security Features (Rate Limiting, XSS Protection, Helmet)
- ✅ Responsive Design

### 🔐 Default Admin Credentials
- **Email**: kavirani576@gmail.com
- **Password**: kavirani567

OR

- **Email**: rchhaba644@gmail.com
- **Password**: rohit12345

## 📁 Project Structure

```
neet/
├── server.js              # Main Express server
├── database.js            # SQLite database setup
├── package.json           # Dependencies
├── index.html             # Homepage
├── auth.html             # Login/Signup page
├── pricing.html           # Pricing page
├── dashboard.html         # User dashboard
├── admin.html             # Admin dashboard
├── js/                    # Frontend JavaScript
│   ├── auth.js           # Authentication logic
│   ├── auth-ui.js        # Auth UI management
│   ├── main.js           # Main frontend logic
│   └── ...
├── css/                   # Stylesheets
├── images/                # Images
└── uploads/               # File uploads

```

## 🔧 Configuration

### Payment Gateway (Razorpay)
1. Sign up at https://razorpay.com
2. Get test keys from Dashboard → Settings → API Keys
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

### Email Notifications (Gmail)
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### SMS Notifications (Fast2SMS)
1. Sign up at https://www.fast2sms.com
2. Get API key from Dashboard
3. Add to `.env`:
   ```
   FAST2SMS_API_KEY=your-api-key
   ```

### WhatsApp Notifications (CallMeBot)
1. Sign up at https://www.callmebot.com
2. Get API key
3. Add to `.env`:
   ```
   CALLMEBOT_API_KEY=your-api-key
   ```

## 🎯 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/login-google` - Google login
- `POST /api/admin/login` - Admin login

### Payments
- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment

### Content
- `GET /api/chapters` - Get all chapters
- `GET /api/mcqs?chapter_id=X` - Get MCQs for chapter
- `GET /api/premium-mcqs` - Get all MCQs (premium)
- `GET /api/mock-test-questions` - Get mock test questions

### User
- `GET /api/profile` - Get user profile
- `GET /api/user/subscription` - Get subscription status
- `POST /api/user/subscribe` - Create subscription

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:id/control` - Control user (suspend/delete)
- `GET /api/admin/mcqs` - Get all MCQs
- `POST /api/admin/mcqs` - Create MCQ
- `PUT /api/admin/mcqs/:id` - Update MCQ
- `DELETE /api/admin/mcqs/:id` - Delete MCQ

## 🐛 Troubleshooting

### Database Issues
- Delete `neet.db` and restart server to recreate database
- Check file permissions on database file

### Payment Issues
- Ensure Razorpay keys are correct in `.env`
- Check Razorpay dashboard for transaction logs
- Test with Razorpay test cards

### Email/SMS/WhatsApp Not Working
- Check API keys in `.env`
- Verify API quotas (Fast2SMS: 20 SMS/day free)
- Check server logs for error messages

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Or kill the process using port 3000

## 📝 Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 2 hours
- Premium subscriptions last 1 year by default
- File uploads are stored in `uploads/` directory
- Database is SQLite (no separate database server needed)

## 🔒 Security Features

- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ XSS protection
- ✅ Helmet.js security headers
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ JWT authentication
- ✅ Input validation
- ✅ SQL injection protection (parameterized queries)

## 📞 Support

- **Phone**: +91 95131 02159
- **Email**: kavirani576@gmail.com
- **WhatsApp**: https://wa.me/919513102159

## 📄 License

MIT License - See LICENSE file for details
