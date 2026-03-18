# NEET UG Biology 360 - Complete E-Commerce Platform

A fully functional e-commerce website for NEET UG Biology preparation with complete payment integration, user management, and content delivery system.

## ✨ Features

### 🛒 E-Commerce Features
- ✅ Complete payment integration with Razorpay
- ✅ Multiple subscription plans (Basic, Popular, Premium)
- ✅ Individual course purchases
- ✅ Payment verification and subscription activation
- ✅ Email/SMS/WhatsApp notifications on purchase

### 👥 User Management
- ✅ User registration and authentication
- ✅ Google OAuth login
- ✅ User dashboard with subscription status
- ✅ Progress tracking
- ✅ Profile management

### 📚 Content Management
- ✅ NCERT Notes (32 chapters)
- ✅ 2100+ MCQ Questions
- ✅ Mock Tests (20+ full-length tests)
- ✅ NCERT Exercise + Exemplar
- ✅ Diagram Booklet (500+ diagrams)
- ✅ Chapter-wise organization

### 🔐 Admin Features
- ✅ Complete admin dashboard
- ✅ User management (view, suspend, delete)
- ✅ Content management (MCQs, chapters, content)
- ✅ Payment tracking
- ✅ System logs and activity monitoring
- ✅ File upload system

### 🔒 Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ XSS protection
- ✅ SQL injection protection
- ✅ Helmet.js security headers

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
1. Copy `env.example` to `.env`
2. Fill in your API keys (see SETUP-GUIDE.md for details)

### 3. Start Server
```bash
npm start
```

Visit: http://localhost:3000

## 📋 Default Credentials

### Admin Login
- **Email**: kavirani576@gmail.com
- **Password**: kavirani567

OR

- **Email**: rchhaba644@gmail.com  
- **Password**: rohit12345

## 💳 Payment Plans

### Basic Plan - ₹5,200
- Mock Tests (20+)
- NCERT Exercise + Exemplar
- Live Classes (2 sessions + 1 FREE Demo)
- Performance Analytics

### Popular Plan - ₹8,400
- MCQ Questions (2100+)
- NCERT Notes (Digital)
- Diagram Booklet (FREE)
- Live Classes (6 sessions + 1 FREE Demo)
- Previous Year Questions

### Premium Plan - ₹13,600
- All Content (NCERT Notes, MCQs, Mock Tests, Exercise)
- Complete Diagram Booklet
- Live Classes (10 sessions + 1 FREE Demo)
- 1-on-1 Doubt Sessions
- Personal Study Plan
- 24/7 Priority Support

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT, bcrypt
- **Payment**: Razorpay
- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Security**: Helmet.js, xss-clean, express-rate-limit

## 📁 Project Structure

```
neet/
├── server.js              # Express server
├── database.js            # Database setup
├── package.json           # Dependencies
├── env.example            # Environment variables template
├── index.html             # Homepage
├── auth.html             # Login/Signup
├── pricing.html           # Pricing page
├── dashboard.html         # User dashboard
├── admin.html             # Admin dashboard
├── js/                    # Frontend JavaScript
├── css/                   # Stylesheets
├── images/                # Images
└── uploads/               # File uploads
```

## 🔧 Configuration

### Required Environment Variables

```env
PORT=3000
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=kavirani576@gmail.com
ADMIN_PHONE=9513102159
```

See `SETUP-GUIDE.md` for detailed configuration instructions.

## 📡 API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - User login
- `POST /api/login-google` - Google OAuth login
- `POST /api/admin/login` - Admin login

### Payments
- `POST /api/create-order` - Create Razorpay order
- `POST /api/verify-payment` - Verify payment

### Content
- `GET /api/chapters` - Get all chapters
- `GET /api/mcqs?chapter_id=X` - Get MCQs
- `GET /api/premium-mcqs` - Get all MCQs (premium)
- `GET /api/mock-test-questions` - Get mock test

### User
- `GET /api/profile` - Get user profile
- `GET /api/user/subscription` - Get subscription
- `POST /api/user/subscribe` - Create subscription

## 🐛 Troubleshooting

### Database Issues
- Delete `neet.db` and restart to recreate
- Check file permissions

### Payment Not Working
- Verify Razorpay keys in `.env`
- Check Razorpay dashboard
- Use test mode for development

### Email/SMS Not Sending
- Verify API keys in `.env`
- Check API quotas
- Review server logs

## 📞 Support

- **Phone**: +91 95131 02159
- **Email**: kavirani576@gmail.com
- **WhatsApp**: https://wa.me/919513102159

## 📄 License

MIT License

## 🎯 Status

✅ **Fully Functional** - All features implemented and tested
✅ **Production Ready** - Ready for deployment
✅ **No Errors** - All syntax errors fixed
✅ **Complete Documentation** - Setup guide included

---

**Made with ❤️ for NEET UG Biology Students**
