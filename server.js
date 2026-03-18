const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const axios = require('axios');
require('dotenv').config();

// Clear sessions on startup
require('./clear-sessions');

// Security middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

// Admin contact details for notifications
// Primary admin: kavirani576@gmail.com (also used for control panel)
// Secondary admin: rchhaba644@gmail.com
const ADMIN_PHONE = process.env.ADMIN_PHONE || '9513102159';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ||
  'kavirani576@gmail.com,rchhaba644@gmail.com')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean);

// Email Configuration
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

let transporter = null;

// Configure email transporter
function setupEmailTransporter() {
  if (emailUser && emailPass &&
    emailUser !== 'your-email@gmail.com' &&
    emailPass !== 'your-app-password-here' &&
    emailPass.length > 0) {

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('Email transporter verification failed:', error);
        transporter = null;
      } else {
        console.log('✅ Email service configured and verified');
      }
    });
  } else {
    console.warn('⚠️  Email service not configured. Set EMAIL_USER and EMAIL_PASS in .env file');
    console.warn('   To get Gmail App Password: https://myaccount.google.com/apppasswords');
  }
}

setupEmailTransporter();

// SMS Notification using Fast2SMS (India) - FREE 20 SMS/day on trial
async function sendSMSNotification(phone, message) {
  try {
    const fast2smsApiKey = process.env.FAST2SMS_API_KEY;

    if (!fast2smsApiKey || fast2smsApiKey === 'your-fast2sms-api-key') {
      console.log('⚠️  SMS not configured. Get FREE API key from https://www.fast2sms.com');
      return { success: false, error: 'SMS API not configured' };
    }

    console.log('📱 Sending SMS to:', phone);
    console.log('📝 Message:', message.substring(0, 50) + '...');

    // Using Fast2SMS API with promotional route (no transaction required)
    const response = await axios.get('https://www.fast2sms.com/dev/bulk', {
      params: {
        authorization: fast2smsApiKey,
        sender_id: 'FSTSMS',
        message: message,
        language: 'english',
        route: 'p',  // 'p' for promotional (no transaction required)
        numbers: phone
      }
    });

    console.log('✅ SMS sent successfully to:', phone);
    console.log('📊 Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Failed to send SMS:', error.message);
    if (error.response) {
      console.error('❌ SMS API Response:', error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// WhatsApp Notification using WhatsApp Business API or CallMeBot (FREE)
async function sendWhatsAppNotification(phone, message) {
  try {
    // Using CallMeBot API (FREE - sends WhatsApp via WhatsApp Web)
    const encodedMessage = encodeURIComponent(message);
    const callMeBotApiKey = process.env.CALLMEBOT_API_KEY;

    if (!callMeBotApiKey || callMeBotApiKey === 'your-callmebot-api-key') {
      console.log('⚠️  WhatsApp not configured. Get API key from https://www.callmebot.com');
      return { success: false, error: 'WhatsApp API not configured' };
    }

    console.log('💬 Sending WhatsApp to:', phone);

    const response = await axios.get(
      `https://api.callmebot.com/whatsapp.php?phone=91${phone}&text=${encodedMessage}&apikey=${callMeBotApiKey}`
    );

    console.log('✅ WhatsApp message sent to:', phone);
    console.log('📊 Response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Failed to send WhatsApp:', error.message);
    if (error.response) {
      console.error('❌ WhatsApp API Response:', error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Send notification to admin (Email + SMS + WhatsApp)
async function sendAdminNotification(type, data) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Prepare messages based on notification type
  let emailSubject = '';
  let emailBody = '';
  let smsMessage = '';
  let whatsappMessage = '';

  switch (type) {
    case 'NEW_USER':
      emailSubject = '🎉 New User Registration - NEET Biology 360';
      emailBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #2563eb;">🎉 New User Registration!</h2>
          <p>A new student just registered on NEET UG Biology 360.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>👤 Name:</strong> ${data.full_name}</p>
            <p><strong>🆔 Username:</strong> ${data.username}</p>
            <p><strong>📧 Email:</strong> ${data.email}</p>
            <p><strong>📱 Phone:</strong> ${data.phone}</p>
            <p><strong>📍 State:</strong> ${data.state}</p>
            <p><strong>⏰ Time:</strong> ${timestamp}</p>
          </div>
          <p style="color: #666; font-size: 12px;">This is an automated notification from NEET UG Biology 360.</p>
        </div>
      `;
      smsMessage = `NEET Bio 360: New user registered! Name: ${data.full_name}, Phone: ${data.phone}, Email: ${data.email}. Time: ${timestamp}`;
      whatsappMessage = `*NEET UG Biology 360 - New Registration*\n\n👤 *Name:* ${data.full_name}\n🆔 *Username:* ${data.username}\n📧 *Email:* ${data.email}\n📱 *Phone:* ${data.phone}\n📍 *State:* ${data.state}\n⏰ *Time:* ${timestamp}\n\nLogin to admin panel to view details.`;
      break;

    case 'NEW_PAYMENT':
      emailSubject = '💰 New Payment Received - NEET Biology 360';
      emailBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #16a34a;">💰 New Payment Received!</h2>
          <p>A new payment has been received.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>👤 User:</strong> ${data.user_name}</p>
            <p><strong>📧 Email:</strong> ${data.user_email}</p>
            <p><strong>💵 Amount:</strong> ₹${data.amount}</p>
            <p><strong>📦 Plan:</strong> ${data.plan_name}</p>
            <p><strong>🆔 Transaction ID:</strong> ${data.transaction_id}</p>
            <p><strong>⏰ Time:</strong> ${timestamp}</p>
          </div>
        </div>
      `;
      smsMessage = `NEET Bio 360: Payment received! Amount: Rs.${data.amount}, User: ${data.user_name}, Plan: ${data.plan_name}. Time: ${timestamp}`;
      whatsappMessage = `*NEET UG Biology 360 - Payment Received*\n\n💰 *Amount:* ₹${data.amount}\n👤 *User:* ${data.user_name}\n📧 *Email:* ${data.user_email}\n📦 *Plan:* ${data.plan_name}\n🆔 *Transaction ID:* ${data.transaction_id}\n⏰ *Time:* ${timestamp}`;
      break;

    case 'USER_LOGIN':
      emailSubject = '🔔 User Login - NEET Biology 360';
      emailBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">🔔 User Login</h2>
          <p><strong>${data.username}</strong> just logged in.</p>
          <p>Time: ${timestamp}</p>
        </div>
      `;
      smsMessage = `NEET Bio 360: ${data.username} logged in at ${timestamp}`;
      whatsappMessage = `*NEET UG Biology 360*\n\n🔔 *User Login*\n👤 ${data.username} just logged in.\n⏰ ${timestamp}`;
      break;

    case 'USER_LOGOUT':
      emailSubject = '🚪 User Logout - NEET Biology 360';
      emailBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #dc2626;">🚪 User Logout</h2>
          <p><strong>${data.username}</strong> just logged out.</p>
          <p>Time: ${timestamp}</p>
        </div>
      `;
      smsMessage = `NEET Bio 360: ${data.username} logged out at ${timestamp}`;
      whatsappMessage = `*NEET UG Biology 360*\n\n🚪 *User Logout*\n👤 ${data.username} just logged out.\n⏰ ${timestamp}`;
      break;
  }

  // Send Email to all configured admin emails
  if (transporter && ADMIN_EMAILS.length > 0) {
    for (const adminEmail of ADMIN_EMAILS) {
      try {
        await transporter.sendMail({
          from: `"NEET UG Biology 360" <${emailUser}>`,
          to: adminEmail,
          subject: emailSubject,
          html: emailBody
        });
        console.log('✅ Email notification sent to:', adminEmail);
      } catch (error) {
        console.error('❌ Email failed for', adminEmail, ':', error.message);
      }
    }
  }

  // Send SMS
  await sendSMSNotification(ADMIN_PHONE, smsMessage);

  // Send WhatsApp
  await sendWhatsAppNotification(ADMIN_PHONE, whatsappMessage);
}

// Legacy function for backward compatibility
async function sendSignupNotification(userData) {
  await sendAdminNotification('NEW_USER', userData);
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;

    // Check if user is valid and fetch additional user data
    db.get('SELECT * FROM users WHERE id = ?', [user.userId], (err, userData) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!userData) {
        return res.status(403).json({ error: 'User not found' });
      }

      req.userData = userData;
      next();
    });
  });
};

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://polyfill.io", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "https://www.gstatic.com", "https://www.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'", "https://api.callmebot.com", "https://www.fast2sms.com"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NEET Backend is running' });
});

// Authentication Routes
// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, phone, full_name, state, address } = req.body;

    // Input validation
    if (!username || !email || !password || !phone || !full_name || !state) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password with higher salt rounds for production
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert new user
      db.run('INSERT INTO users (username, email, password, phone, full_name, state) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, phone, full_name, state],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          // Trigger notification to admin
          sendSignupNotification({ username, email, phone, full_name, state });

          const token = jwt.sign(
            { userId: this.lastID, username, email },
            process.env.JWT_SECRET || 'neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890',
            { expiresIn: '2h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: this.lastID, username, email, phone, full_name, state }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        // Log failed login attempt
        logSystem('WARNING', `Failed login attempt for email: ${email}`, `IP: ${req.ip}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        // Log failed login attempt
        logSystem('WARNING', `Failed login attempt for user: ${user.username}`, `IP: ${req.ip}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET || 'neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890',
        { expiresIn: '2h' }
      );

      // Log successful login
      logUserActivity(user.id, 'LOGIN', `User logged in from IP: ${req.ip}`, req);

      // Create real-time session record
      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours from now
      db.run(
        'INSERT INTO user_sessions (user_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
        [user.id, token, req.ip, req.get('User-Agent'), expiresAt],
        (sessionErr) => {
          if (sessionErr) {
            console.error('Failed to create user session:', sessionErr);
          }
        }
      );

      // Real-time admin notification for user login
      sendAdminNotification('USER_LOGIN', {
        username: user.username,
        email: user.email,
        ip: req.ip
      });

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Google Login Verification (Enforces Pre-Registration)
app.post('/api/login-google', (req, res) => {
  try {
    const { email, googleUid, displayName } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // IMPORTANT: Only allow login if user exists in the local database
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        // Log failed Google login attempt (User not in database)
        logSystem('WARNING', `Google login attempt blocked - User not registered: ${email}`, `IP: ${req.ip}`);
        return res.status(403).json({
          error: 'You must sign up/register first with this email before using Google Login!'
        });
      }

      // Check if user is suspended
      if (user.suspended) {
        return res.status(403).json({ error: 'Your account has been suspended' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email, provider: 'google' },
        process.env.JWT_SECRET || 'neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890',
        { expiresIn: '2h' }
      );

      // Log successful Google login
      logUserActivity(user.id, 'LOGIN_GOOGLE', `User logged in via Google from IP: ${req.ip}`, req);

      res.json({
        message: 'Google login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout - ends current session and logs activity
app.post('/api/logout', authenticateToken, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ error: 'Access token is required for logout' });
    }

    // Remove session record
    db.run(
      'DELETE FROM user_sessions WHERE user_id = ? AND token = ?',
      [req.user.userId, token],
      (err) => {
        if (err) {
          console.error('Failed to delete user session on logout:', err);
        }
      }
    );

    // Log logout activity
    logUserActivity(req.user.userId, 'LOGOUT', `User logged out from IP: ${req.ip}`, req);

    // Optional real-time notification to admin
    sendAdminNotification('USER_LOGOUT', {
      username: req.user.username,
      email: req.user.email,
      ip: req.ip
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify JWT token


// Middleware to verify premium access
const requirePremiumAccess = (req, res, next) => {
  if (!req.userData) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user has premium access
  if (req.userData.is_premium) {
    // Check if premium subscription is still valid
    if (req.userData.premium_expiry) {
      const now = new Date();
      const expiry = new Date(req.userData.premium_expiry);

      if (now > expiry) {
        // Subscription expired, update user status
        db.run('UPDATE users SET is_premium = 0 WHERE id = ?', [req.user.userId], (err) => {
          if (err) console.error('Error updating premium status:', err);
        });
        return res.status(403).json({ error: 'Premium subscription has expired' });
      }
    }

    // User has valid premium access
    next();
    return;
  }

  // Check for active subscription in subscriptions table
  db.get('SELECT * FROM user_subscriptions WHERE user_id = ? AND status = ? AND expiry_date > datetime("now")',
    [req.user.userId, 'active'], (err, subscription) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (subscription) {
        // Update user record to reflect premium status
        db.run('UPDATE users SET is_premium = 1, premium_expiry = ? WHERE id = ?',
          [subscription.expiry_date, req.user.userId], (err) => {
            if (err) console.error('Error updating user premium status:', err);
          });
        next();
      } else {
        res.status(403).json({
          error: 'Premium subscription required',
          message: 'Please upgrade to premium to access this content'
        });
      }
    });
};

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Check if user has premium content access
app.get('/api/user/access', authenticateToken, (req, res) => {
  const userId = req.user.id;
  // Check premium_access flag on user OR any completed payment
  db.get(
    `SELECT u.premium_access, 
            COUNT(p.id) as payment_count 
     FROM users u 
     LEFT JOIN payments p ON p.user_id = u.id AND p.status = 'completed'
     WHERE u.id = ?
     GROUP BY u.id`,
    [userId],
    (err, row) => {
      if (err) {
        // Fallback: check only premium_access column
        db.get('SELECT premium_access FROM users WHERE id = ?', [userId], (err2, userRow) => {
          if (err2 || !userRow) return res.json({ has_access: false });
          return res.json({ has_access: userRow.premium_access === 1 });
        });
        return;
      }
      if (!row) return res.json({ has_access: false });
      const hasAccess = row.premium_access === 1 || row.payment_count > 0;
      res.json({ has_access: hasAccess });
    }
  );
});

// Protected content routes
app.get('/api/premium-content', authenticateToken, (req, res) => {
  res.json({
    message: 'Premium content access granted',
    content: [
      { type: 'video', title: 'Advanced Cell Biology', duration: '45 min' },
      { type: 'notes', title: 'Complete NCERT Solutions', pages: 250 },
      { type: 'test', title: 'Full Syllabus Mock Test', questions: 180 }
    ]
  });
});

// User progress tracking
app.post('/api/progress', authenticateToken, (req, res) => {
  const { chapterId, progress } = req.body;

  // Store progress in database
  db.run('INSERT OR REPLACE INTO user_progress (user_id, chapter_id, progress, updated_at) VALUES (?, ?, ?, ?)',
    [req.user.userId, chapterId, progress, new Date().toISOString()],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save progress' });
      }
      res.json({ message: 'Progress saved successfully' });
    }
  );
});

// Get user progress
app.get('/api/progress', authenticateToken, (req, res) => {
  db.all('SELECT * FROM user_progress WHERE user_id = ?', [req.user.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch progress' });
    }
    res.json({ progress: rows });
  });
});

// Admin Authentication Routes
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Hardcoded Master Admin Check
    if ((email === 'rchhaba644@gmail.com' && password === 'rohit12345') ||
      (email === 'kavirani576@gmail.com' && password === 'kavirani567')) {
      const token = jwt.sign(
        { userId: 999999, username: 'Master Admin', email: email, role: 'admin' },
        process.env.JWT_SECRET || 'neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890',
        { expiresIn: '2h' }
      );

      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: 999999, username: 'Master Admin', email: email, role: 'admin' },
        admin: { id: 999999, username: 'Master Admin', email: email, role: 'admin' }
      });
    }

    db.get('SELECT * FROM admin_users WHERE email = ?', [email], async (err, admin) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!admin) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      // Compare password
      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      const token = jwt.sign(
        { userId: admin.id, username: admin.username, email: admin.email, role: 'admin' },
        process.env.JWT_SECRET || 'neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890',
        { expiresIn: '2h' }
      );

      res.json({
        message: 'Admin login successful',
        token,
        admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Admin token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890', (err, user) => {
    if (err || user.role !== 'admin') {
      return res.status(403).json({ error: 'Invalid or insufficient admin privileges' });
    }
    req.admin = user;
    next();
  });
};

// Admin API Routes
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  db.all('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC', (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json({ users });
  });
});

app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  const stats = {};

  // Get total users
  db.get('SELECT COUNT(*) as total FROM users', (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
    stats.totalUsers = row.total;

    // Get total progress records
    db.get('SELECT COUNT(*) as total FROM user_progress', (err, row) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
      stats.totalProgress = row.total;

      // Get average progress
      db.get('SELECT AVG(progress) as avg FROM user_progress', (err, row) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
        stats.averageProgress = Math.round(row.avg || 0);

        res.json(stats);
      });
    });
  });
});

const multer = require('multer');
const fs = require('fs-extra');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/admin/content', authenticateAdmin, upload.single('file'), (req, res) => {
  const { title, type, content, chapter_id, is_premium } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.run('INSERT INTO content (title, type, content, file_url, chapter_id, is_premium) VALUES (?, ?, ?, ?, ?, ?)',
    [title, type, content, fileUrl, chapter_id, is_premium],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create content' });
      }
      res.json({ message: 'Content created successfully', id: this.lastID, fileUrl });
    }
  );
});

app.get('/api/admin/content', authenticateAdmin, (req, res) => {
  const { type } = req.query;
  let query = 'SELECT * FROM content';
  const params = [];

  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, content) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch content' });
    }
    res.json({ content });
  });
});

// Public Content API - Free content only
app.get('/api/content', (req, res) => {
  const { type, chapter_id } = req.query;
  let query = 'SELECT id, title, type, content, file_url, chapter_id, is_premium, created_at FROM content WHERE is_premium = 0';
  const params = [];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  if (chapter_id) {
    query += ' AND chapter_id = ?';
    params.push(chapter_id);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, content) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch content' });
    }
    res.json({ content });
  });
});

// Premium Content API - Requires authentication and premium access
app.get('/api/premium-content', authenticateToken, requirePremiumAccess, (req, res) => {
  const { type, chapter_id } = req.query;
  let query = 'SELECT id, title, type, content, file_url, chapter_id, is_premium, created_at FROM content';
  const params = [];

  // Allow filtering by type or chapter_id if provided
  if (type || chapter_id) {
    query += ' WHERE';
    if (type) {
      query += ' type = ?';
      params.push(type);
      if (chapter_id) query += ' AND';
    }
    if (chapter_id) {
      query += ' chapter_id = ?';
      params.push(chapter_id);
    }
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, content) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch premium content' });
    }
    res.json({ content });
  });
});

app.delete('/api/admin/content/:id', authenticateAdmin, (req, res) => {
  // First get the file path to delete it
  db.get('SELECT file_url FROM content WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (row && row.file_url) {
      const filePath = path.join(__dirname, row.file_url);
      fs.remove(filePath, err => {
        if (err) console.error('Failed to delete file:', err);
      });
    }

    db.run('DELETE FROM content WHERE id = ?', [req.params.id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete content' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }
      res.json({ message: 'Content deleted successfully' });
    });
  });
});

// Enhanced Admin API for Complete Control
app.get('/api/admin/dashboard', authenticateAdmin, (req, res) => {
  const dashboard = {};

  // Get comprehensive stats
  db.get('SELECT COUNT(*) as total FROM users', (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch dashboard data' });
    dashboard.totalUsers = row.total;

    db.get('SELECT COUNT(*) as total FROM admin_users', (err, row) => {
      dashboard.totalAdmins = row.total;

      db.get('SELECT COUNT(*) as total FROM content', (err, row) => {
        dashboard.totalContent = row.total;

        db.get('SELECT COUNT(*) as total FROM user_activity', (err, row) => {
          dashboard.totalActivities = row.total;

          // Get recent activities
          db.all('SELECT ua.*, u.username FROM user_activity ua JOIN users u ON ua.user_id = u.id ORDER BY ua.created_at DESC LIMIT 10', (err, activities) => {
            dashboard.recentActivities = activities || [];

            // Get active sessions
            db.all('SELECT us.*, u.username FROM user_sessions us JOIN users u ON us.user_id = u.id WHERE us.expires_at > datetime("now") ORDER BY us.created_at DESC LIMIT 10', (err, sessions) => {
              dashboard.activeSessions = sessions || [];

              // Get system logs
              db.all('SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 20', (err, logs) => {
                dashboard.systemLogs = logs || [];

                // Get user progress summary
                db.all('SELECT u.username, COUNT(up.id) as progress_count, AVG(up.progress) as avg_progress FROM users u LEFT JOIN user_progress up ON u.id = up.user_id GROUP BY u.id', (err, progressSummary) => {
                  dashboard.userProgressSummary = progressSummary || [];

                  res.json(dashboard);
                });
              });
            });
          });
        });
      });
    });
  });
});

// Get all user activities
app.get('/api/admin/activities', authenticateAdmin, (req, res) => {
  const { userId, limit = 50 } = req.query;

  let query = `
    SELECT ua.*, u.username, u.email 
    FROM user_activity ua 
    JOIN users u ON ua.user_id = u.id
  `;
  const params = [];

  if (userId) {
    query += ' WHERE ua.user_id = ?';
    params.push(userId);
  }

  query += ' ORDER BY ua.created_at DESC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, activities) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch activities' });
    }
    res.json({ activities });
  });
});

// Get system logs
app.get('/api/admin/logs', authenticateAdmin, (req, res) => {
  const { level, limit = 100 } = req.query;

  let query = 'SELECT * FROM system_logs';
  const params = [];

  if (level) {
    query += ' WHERE level = ?';
    params.push(level);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, logs) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch logs' });
    }
    res.json({ logs });
  });
});

// Get active sessions
app.get('/api/admin/sessions', authenticateAdmin, (req, res) => {
  db.all(`
    SELECT us.*, u.username, u.email 
    FROM user_sessions us 
    JOIN users u ON us.user_id = u.id 
    WHERE us.expires_at > datetime("now") 
    ORDER BY us.created_at DESC
  `, (err, sessions) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
    res.json({ sessions });
  });
});

// Control user - suspend/delete
app.post('/api/admin/users/:id/control', authenticateAdmin, (req, res) => {
  const { action } = req.body; // suspend, delete, reset_password
  const userId = req.params.id;

  switch (action) {
    case 'suspend':
      // Mark user as suspended (you'd add a suspended column to users table)
      db.run('UPDATE users SET suspended = 1 WHERE id = ?', [userId], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to suspend user' });
        res.json({ message: 'User suspended successfully' });
      });
      break;

    case 'delete':
      db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to delete user' });
        if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
      });
      break;

    case 'reset_password':
      const newPassword = 'temp123';
      const bcrypt = require('bcryptjs');
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: 'Failed to reset password' });
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function (err) {
          if (err) return res.status(500).json({ error: 'Failed to reset password' });
          res.json({ message: 'Password reset successfully', newPassword });
        });
      });
      break;

    default:
      res.status(400).json({ error: 'Invalid action' });
  }
});

// Log user activity
function logUserActivity(userId, action, details, req) {
  db.run('INSERT INTO user_activity (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
    [userId, action, details, req.ip, req.get('User-Agent')],
    (err) => {
      if (err) console.error('Failed to log user activity:', err);
    }
  );
}

// Log system events
function logSystem(level, message, details) {
  db.run('INSERT INTO system_logs (level, message, details) VALUES (?, ?, ?)',
    [level, message, details],
    (err) => {
      if (err) console.error('Failed to log system event:', err);
    }
  );
}

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Sample API endpoints for NEET data
app.get('/api/mcqs', (req, res) => {
  const { chapter_id } = req.query;

  if (!chapter_id) {
    return res.status(400).json({ error: 'chapter_id is required' });
  }

  db.all('SELECT * FROM mcqs WHERE chapter_id = ? ORDER BY id ASC', [chapter_id], (err, mcqs) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch MCQs' });
    }

    // Parse JSON options
    const formattedMcqs = mcqs.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));

    res.json({ questions: formattedMcqs });
  });
});

app.get('/api/chapters', (req, res) => {
  db.all('SELECT * FROM chapters ORDER BY id ASC', (err, chapters) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch chapters' });
    }
    res.json({ chapters });
  });
});

// --- Admin Dashboard Endpoint ---
app.get('/api/admin/dashboard', authenticateAdmin, (req, res) => {
  const stats = {};

  // Get counts in parallel
  const queries = [
    new Promise(resolve => db.get('SELECT COUNT(*) as count FROM users', (err, row) => resolve(row ? row.count : 0))),
    new Promise(resolve => db.all('SELECT a.*, u.username FROM user_activity a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 20', (err, rows) => resolve(rows || []))),
    new Promise(resolve => db.all('SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 30', (err, rows) => resolve(rows || []))),
    new Promise(resolve => {
      // Mock active sessions as we don't have a sessions table yet, but we can use recent login activity
      db.all('SELECT u.username, u.email, a.created_at FROM user_activity a JOIN users u ON a.user_id = u.id WHERE a.action = "LOGIN" ORDER BY a.created_at DESC LIMIT 5', (err, rows) => resolve(rows || []));
    })
  ];

  Promise.all(queries).then(([totalUsers, recentActivities, systemLogs, activeSessions]) => {
    res.json({
      totalUsers,
      totalActivities: recentActivities.length,
      recentActivities,
      systemLogs,
      activeSessions
    });
  }).catch(err => {
    res.status(500).json({ error: 'Dashboard aggregation failed' });
  });
});

// --- User Management ---
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  db.all('SELECT id, username, email, is_premium, premium_expiry, suspended, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'User fetch failed' });
    res.json(rows);
  });
});

app.post('/api/admin/users/:id/control', authenticateAdmin, (req, res) => {
  const { action } = req.body;
  const userId = req.params.id;

  if (action === 'suspend') {
    db.run('UPDATE users SET suspended = 1 WHERE id = ?', [userId], err => {
      if (err) return res.status(500).json({ error: 'Suspension failed' });
      res.json({ message: 'User suspended' });
    });
  } else if (action === 'unsuspend') {
    db.run('UPDATE users SET suspended = 0 WHERE id = ?', [userId], err => {
      if (err) return res.status(500).json({ error: 'Unsuspension failed' });
      res.json({ message: 'User unsuspended' });
    });
  } else if (action === 'delete') {
    db.run('DELETE FROM users WHERE id = ?', [userId], err => {
      if (err) return res.status(500).json({ error: 'Deletion failed' });
      res.json({ message: 'User deleted' });
    });
  } else if (action === 'make_premium') {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year premium

    db.run('UPDATE users SET is_premium = 1, premium_expiry = ? WHERE id = ?', [expiryDate.toISOString(), userId], err => {
      if (err) return res.status(500).json({ error: 'Failed to update premium status' });
      res.json({ message: 'User made premium' });
    });
  } else if (action === 'remove_premium') {
    db.run('UPDATE users SET is_premium = 0, premium_expiry = NULL WHERE id = ?', [userId], err => {
      if (err) return res.status(500).json({ error: 'Failed to remove premium status' });
      res.json({ message: 'User premium status removed' });
    });
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

// User Subscription Management
app.get('/api/user/subscription', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  // Get user subscription status
  db.get(`SELECT u.is_premium, u.premium_expiry, s.subscription_type, s.start_date, s.expiry_date, s.status, s.amount_paid 
         FROM users u 
         LEFT JOIN user_subscriptions s ON u.id = s.user_id AND s.status = 'active'
         WHERE u.id = ?`, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch subscription status' });

    // Check if premium has expired
    if (result && result.is_premium && result.premium_expiry) {
      const now = new Date();
      const expiry = new Date(result.premium_expiry);

      if (now > expiry) {
        // Update user status to non-premium
        db.run('UPDATE users SET is_premium = 0 WHERE id = ?', [userId], updateErr => {
          if (!updateErr) {
            result.is_premium = 0;
            result.premium_expiry = null;
          }
        });
      }
    }

    res.json({ subscription: result });
  });
});

app.post('/api/user/subscribe', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { subscription_type, amount, transaction_id } = req.body;

  if (!subscription_type || !amount) {
    return res.status(400).json({ error: 'Subscription type and amount are required' });
  }

  // Calculate expiry date based on subscription type
  const startDate = new Date();
  const expiryDate = new Date();

  switch (subscription_type.toLowerCase()) {
    case 'monthly':
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      break;
    case 'quarterly':
      expiryDate.setMonth(expiryDate.getMonth() + 3);
      break;
    case 'yearly':
    case 'annual':
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      break;
    default:
      return res.status(400).json({ error: 'Invalid subscription type. Use monthly, quarterly, or yearly.' });
  }

  // Insert subscription record
  db.run(`INSERT INTO user_subscriptions (user_id, subscription_type, start_date, expiry_date, amount_paid, transaction_id, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, subscription_type, startDate.toISOString(), expiryDate.toISOString(), amount, transaction_id, 'active'],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create subscription' });

      // Update user to premium
      db.run('UPDATE users SET is_premium = 1, premium_expiry = ? WHERE id = ?',
        [expiryDate.toISOString(), userId], updateErr => {
          if (updateErr) {
            return res.status(500).json({ error: 'Failed to update user premium status' });
          }

          res.json({
            message: 'Subscription created successfully',
            subscription_id: this.lastID,
            expiry_date: expiryDate.toISOString()
          });
        });
    });
});

// --- MCQ Management ---
app.post('/api/admin/mcqs', authenticateAdmin, (req, res) => {
  const { chapter_id, question, options, correct_answer, category, solution, difficulty } = req.body;

  db.run(`INSERT INTO mcqs (chapter_id, question, options, correct_answer, category, solution, difficulty) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [chapter_id, question, options, correct_answer, category, solution, difficulty || 'medium'],
    function (err) {
      if (err) return res.status(500).json({ error: 'MCQ creation failed' });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put('/api/admin/mcqs/:id', authenticateAdmin, (req, res) => {
  const { question, options, correct_answer, category, solution, difficulty } = req.body;

  db.run(`UPDATE mcqs SET question = ?, options = ?, correct_answer = ?, category = ?, solution = ?, difficulty = ?
          WHERE id = ?`,
    [question, options, correct_answer, category, solution, difficulty, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: 'MCQ update failed' });
      res.json({ message: 'MCQ updated' });
    }
  );
});

app.delete('/api/admin/mcqs/:id', authenticateAdmin, (req, res) => {
  db.run('DELETE FROM mcqs WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'MCQ deletion failed' });
    res.json({ message: 'MCQ deleted' });
  });
});

// Get MCQs for authenticated users (free access to limited questions)
app.get('/api/mcqs', authenticateToken, (req, res) => {
  const { chapter_id } = req.query;

  // Free users get limited access - only first 10 questions per chapter
  let query = 'SELECT id, chapter_id, question, options, correct_answer, category, solution, difficulty FROM mcqs WHERE 1=1';
  const params = [];

  if (chapter_id) {
    query += ' AND chapter_id = ?';
    params.push(chapter_id);
  }

  query += ' ORDER BY id ASC LIMIT 10';

  db.all(query, params, (err, mcqs) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch MCQs' });
    }

    // Parse JSON options
    const formattedMcqs = mcqs.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));

    res.json({ questions: formattedMcqs });
  });
});

// Get all MCQs for premium users
app.get('/api/premium-mcqs', authenticateToken, requirePremiumAccess, (req, res) => {
  const { chapter_id } = req.query;

  let query = 'SELECT id, chapter_id, question, options, correct_answer, category, solution, difficulty FROM mcqs WHERE 1=1';
  const params = [];

  if (chapter_id) {
    query += ' AND chapter_id = ?';
    params.push(chapter_id);
  }

  query += ' ORDER BY id ASC';

  db.all(query, params, (err, mcqs) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch premium MCQs' });
    }

    // Parse JSON options
    const formattedMcqs = mcqs.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));

    res.json({ questions: formattedMcqs });
  });
});

// Admin Chapter Management
app.post('/api/admin/chapters', authenticateAdmin, (req, res) => {
  const { name, unit, subject } = req.body;
  if (!name || !unit) {
    return res.status(400).json({ error: 'Name and unit are required' });
  }

  db.run('INSERT INTO chapters (name, unit, subject) VALUES (?, ?, ?)',
    [name, unit, subject || 'Biology'],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create chapter' });
      res.status(201).json({ message: 'Chapter created', id: this.lastID });
    }
  );
});

app.put('/api/admin/chapters/:id', authenticateAdmin, (req, res) => {
  const { name, unit, subject } = req.body;
  if (!name || !unit) {
    return res.status(400).json({ error: 'Name and unit are required' });
  }

  db.run('UPDATE chapters SET name = ?, unit = ?, subject = ? WHERE id = ?',
    [name, unit, subject || 'Biology', req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update chapter' });
      res.json({ message: 'Chapter updated' });
    }
  );
});

app.delete('/api/admin/chapters/:id', authenticateAdmin, (req, res) => {
  db.run('DELETE FROM chapters WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete chapter' });
    res.json({ message: 'Chapter deleted' });
  });
});

// MCQ Management Endpoints
app.get('/api/admin/mcqs', authenticateAdmin, (req, res) => {
  const { chapter_id, category } = req.query;
  let query = 'SELECT * FROM mcqs';
  const params = [];

  if (chapter_id) {
    query += ' WHERE chapter_id = ?';
    params.push(chapter_id);
  } else if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY id ASC';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch MCQs' });
    res.json({ questions: rows });
  });
});

app.post('/api/admin/mcqs', authenticateAdmin, (req, res) => {
  const { chapter_id, question, options, correct_answer, category, solution, difficulty } = req.body;

  if (!chapter_id || !question || !options || correct_answer === undefined) {
    return res.status(400).json({ error: 'Chapter ID, question, options, and correct answer are required' });
  }

  // Ensure options is a JSON string
  const optionsStr = typeof options === 'string' ? options : JSON.stringify(options);

  db.run(`INSERT INTO mcqs (chapter_id, question, options, correct_answer, category, solution, difficulty) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [chapter_id, question, optionsStr, correct_answer, category || 'single', solution || '', difficulty || 'medium'],
    function (err) {
      if (err) return res.status(500).json({ error: 'MCQ creation failed' });
      res.status(201).json({ id: this.lastID, message: 'MCQ created successfully' });
    }
  );
});

app.put('/api/admin/mcqs/:id', authenticateAdmin, (req, res) => {
  const { question, options, correct_answer, category, solution, difficulty } = req.body;

  // Ensure options is a JSON string
  const optionsStr = typeof options === 'string' ? options : JSON.stringify(options);

  db.run(`UPDATE mcqs SET question = ?, options = ?, correct_answer = ?, category = ?, solution = ?, difficulty = ?
          WHERE id = ?`,
    [question, optionsStr, correct_answer, category, solution, difficulty, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'MCQ update failed' });
      res.json({ message: 'MCQ updated successfully' });
    }
  );
});

app.delete('/api/admin/mcqs/:id', authenticateAdmin, (req, res) => {
  db.run('DELETE FROM mcqs WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'MCQ deletion failed' });
    res.json({ message: 'MCQ deleted successfully' });
  });
});

app.get('/api/mcq-questions', (req, res) => {
  const { chapter, difficulty } = req.query;
  res.json({
    questions: [
      {
        id: 1,
        question: 'What is the basic unit of life?',
        options: ['Cell', 'Tissue', 'Organ', 'Organism'],
        correct: 0,
        chapter: chapter || 1,
        difficulty: difficulty || 'easy'
      }
    ]
  });
});

// Mock Test API endpoint - serves 90 real MCQ questions for the mock test
app.get('/api/mock-test-questions', authenticateToken, requirePremiumAccess, (req, res) => {
  // Try to get questions from the database first
  db.all('SELECT * FROM mcqs ORDER BY RANDOM() LIMIT 90', [], (err, rows) => {
    if (!err && rows && rows.length >= 10) {
      // Format DB questions for the mock test
      const questions = rows.map((q, index) => {
        let options = [];
        try {
          options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
        } catch (e) {
          options = ['Option A', 'Option B', 'Option C', 'Option D'];
        }
        return {
          id: index + 1,
          question: q.question_text || q.question || `Question ${index + 1}`,
          options: Array.isArray(options) ? options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: typeof q.correct_answer === 'number' ? q.correct_answer : (parseInt(q.correct_answer) || 0),
          explanation: q.solution || q.explanation || 'Refer to NCERT textbook for explanation.',
          topic: q.category || 'Biology',
          difficulty: q.difficulty || (index < 30 ? 'Easy' : index < 60 ? 'Medium' : 'Hard')
        };
      });
      return res.json({ questions });
    }

    // Fallback: generate 90 NEET Biology questions if DB is empty
    const topics = [
      'Cell Biology', 'Genetics', 'Evolution', 'Ecology',
      'Plant Physiology', 'Animal Physiology', 'Reproduction',
      'Biotechnology', 'Human Health', 'Biodiversity',
      'Biomolecules', 'Cell Division', 'Plant Kingdom', 'Animal Kingdom',
      'Morphology', 'Anatomy', 'Digestion', 'Respiration', 'Circulation', 'Excretion'
    ];

    const sampleQs = [
      { q: 'Which organelle is known as the powerhouse of the cell?', opts: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi body'], ans: 0 },
      { q: 'DNA replication occurs during which phase of the cell cycle?', opts: ['G1 phase', 'S phase', 'G2 phase', 'M phase'], ans: 1 },
      { q: 'Which of the following is NOT a nitrogenous base found in DNA?', opts: ['Adenine', 'Uracil', 'Guanine', 'Cytosine'], ans: 1 },
      { q: 'Photosynthesis occurs in which part of the plant cell?', opts: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Vacuole'], ans: 1 },
      { q: 'Which blood type is known as the universal donor?', opts: ['A', 'B', 'AB', 'O'], ans: 3 },
      { q: 'The functional unit of the kidney is called:', opts: ['Alveolus', 'Nephron', 'Neuron', 'Villus'], ans: 1 },
      { q: 'Which hormone is responsible for the fight-or-flight response?', opts: ['Insulin', 'Adrenaline', 'Thyroxine', 'Oxytocin'], ans: 1 },
      { q: 'Mendel\'s Law of Segregation states that:', opts: ['Genes assort independently', 'Alleles separate during meiosis', 'Dominant alleles mask recessive', 'Genes are on chromosomes'], ans: 1 },
      { q: 'Which of the following is an example of an autotroph?', opts: ['Mushroom', 'Grasshopper', 'Algae', 'Tapeworm'], ans: 2 },
      { q: 'The process by which plants lose water through their leaves is called:', opts: ['Respiration', 'Transpiration', 'Evaporation', 'Guttation'], ans: 1 },
    ];

    const questions = [];
    for (let i = 0; i < 90; i++) {
      const sample = sampleQs[i % sampleQs.length];
      const topic = topics[i % topics.length];
      questions.push({
        id: i + 1,
        question: i < sampleQs.length ? sample.q : `Q${i + 1}: [${topic}] Which of the following statements about ${topic.toLowerCase()} is CORRECT according to NCERT?`,
        options: i < sampleQs.length ? sample.opts : [
          `${topic} process A - Correct statement from NCERT`,
          `${topic} process B - Incorrect statement`,
          `${topic} process C - Incorrect statement`,
          `${topic} process D - Incorrect statement`
        ],
        correctAnswer: i < sampleQs.length ? sample.ans : 0,
        explanation: `This question tests your knowledge of ${topic}. Refer to NCERT Biology for Class 11 and 12 for detailed explanation.`,
        topic: topic,
        difficulty: i < 30 ? 'Easy' : i < 60 ? 'Medium' : 'Hard'
      });
    }
    res.json({ questions });
  });
});

// File upload endpoint for admin
app.post('/api/admin/upload', authenticateAdmin, upload.single('file'), (req, res) => {
  try {
    const { testId, diagramId, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${file.filename}`;

    if (type === 'mocktest' && testId) {
      db.run(
        'UPDATE content SET file_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND type = ?',
        [fileUrl, testId, 'mocktest'],
        function (err) {
          if (err) {
            console.error('File update error:', err);
            return res.status(500).json({ error: 'Failed to update file information' });
          }
          res.json({
            message: 'File uploaded successfully',
            fileId: testId,
            fileName: file.originalname,
            filePath: fileUrl
          });
        }
      );
    } else if (type === 'diagram' && diagramId) {
      db.run(
        'UPDATE content SET file_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND type = ?',
        [fileUrl, diagramId, 'diagrams'],
        function (err) {
          if (err) {
            console.error('File update error:', err);
            return res.status(500).json({ error: 'Failed to update file information' });
          }
          res.json({
            message: 'File uploaded successfully',
            fileId: diagramId,
            fileName: file.originalname,
            filePath: fileUrl
          });
        }
      );
    } else {
      // Insert new content
      db.run(
        'INSERT INTO content (title, type, file_url, is_premium, created_at) VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)',
        [file.originalname, type || 'file', fileUrl],
        function (err) {
          if (err) {
            console.error('File insert error:', err);
            return res.status(500).json({ error: 'Failed to save file information' });
          }
          res.json({
            message: 'File uploaded successfully',
            fileId: this.lastID,
            fileName: file.originalname,
            filePath: fileUrl
          });
        }
      );
    }
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
});

// ============================================
// RAZORPAY PAYMENT GATEWAY INTEGRATION
// ============================================

// Initialize Razorpay
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_your_key_id') {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay payment gateway configured');
  } else {
    console.warn('⚠️  Razorpay not configured. Get FREE test keys from https://dashboard.razorpay.com');
  }
} catch (error) {
  console.error('❌ Razorpay initialization failed:', error.message);
}

// Create order endpoint
app.post('/api/create-order', authenticateToken, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        error: 'Payment gateway not configured',
        message: 'Please contact admin to enable payments'
      });
    }

    const { amount, plan_name, plan_type } = req.body;

    if (!amount || !plan_name) {
      return res.status(400).json({ error: 'Amount and plan name are required' });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}_${req.user.userId}`,
      notes: {
        user_id: req.user.userId,
        user_email: req.user.email,
        plan_name: plan_name,
        plan_type: plan_type || 'subscription'
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Verify payment endpoint
app.post('/api/verify-payment', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_name, amount } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification data' });
    }

    // Verify signature
    const crypto = require('crypto');
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Save payment to database
      db.run(
        `INSERT INTO user_subscriptions (user_id, subscription_type, amount_paid, transaction_id, status, start_date, expiry_date) 
         VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now', '+1 year'))`,
        [req.user.userId, plan_name, amount / 100, razorpay_payment_id, 'active'],
        function (err) {
          if (err) {
            console.error('Failed to save subscription:', err);
            return res.status(500).json({ error: 'Payment verified but failed to activate subscription' });
          }

          // Update user to premium
          db.run(
            'UPDATE users SET is_premium = 1, premium_expiry = datetime("now", "+1 year") WHERE id = ?',
            [req.user.userId],
            (updateErr) => {
              if (updateErr) {
                console.error('Failed to update user premium status:', updateErr);
              }
            }
          );

          // Send notification to admin
          sendAdminNotification('NEW_PAYMENT', {
            user_name: req.user.username,
            user_email: req.user.email,
            amount: amount / 100,
            plan_name: plan_name,
            transaction_id: razorpay_payment_id
          });

          res.json({
            success: true,
            message: 'Payment verified and subscription activated',
            subscription_id: this.lastID
          });
        }
      );
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Payment verification failed', details: error.message });
  }
});

// Get Razorpay key (public)
app.get('/api/razorpay-key', (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ error: 'Payment gateway not configured' });
  }
  res.json({ key_id: process.env.RAZORPAY_KEY_ID });
});

// ============================================
// REAL-TIME NOTIFICATION TEST ENDPOINT
// ============================================
app.post('/api/test-notifications', async (req, res) => {
  try {
    const testData = {
      full_name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '9999999999',
      state: 'Test State'
    };

    await sendAdminNotification('NEW_USER', testData);

    res.json({
      success: true,
      message: 'Test notifications sent to admin (Email, SMS, WhatsApp)'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 NEET Backend server running on http://localhost:${PORT}`);
  console.log(`📚 Frontend available at http://localhost:${PORT}`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💰 Payment API: http://localhost:${PORT}/api/create-order`);
  console.log(`📱 Notifications: Configure .env for SMS/WhatsApp/Email`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
