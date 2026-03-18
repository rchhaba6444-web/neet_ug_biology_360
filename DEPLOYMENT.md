# NEET UG Biology 360 - Cross-Platform Deployment Guide

## 🚀 Quick Setup for Any Laptop/PC

### Prerequisites
- Node.js (v14 or higher)
- Git (optional, for version control)
- Any modern browser (Edge, Chrome, Firefox, Safari)

---

## 📋 Step-by-Step Setup

### 1. Download/Clone the Project
```bash
# If using Git
git clone <repository-url>
cd neet

# OR download and extract the ZIP file
# Navigate to the project folder
```

### 2. Install Dependencies
```bash
# Install all required packages
npm install

# If you encounter permission issues, try:
npm install --no-optional
```

### 3. Environment Configuration
Create or update the `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./neet.db

# JWT Secret (change this for production)
JWT_SECRET=your-secure-jwt-secret-key-here

# Email Configuration (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Development Settings
NODB_UPDATE=true
```

**Important Notes:**
- Replace `your-email@gmail.com` with your actual Gmail
- For Gmail, use an "App Password" instead of your regular password
- Generate App Password: Google Account → Security → App Passwords

### 4. Database Setup
The SQLite database will be created automatically on first run.

If you want to reset the database:
```bash
# Delete existing database (if any)
rm neet.db

# Run the server (will create fresh database)
npm start
```

### 5. Start the Application
```bash
# For development
npm run dev

# For production
npm start
```

### 6. Access the Application
Open your browser and navigate to:
- **Local:** `http://localhost:3000`
- **Network:** `http://YOUR_IP:3000` (for other devices on same network)

---

## 🔧 Cross-Platform Compatibility

### Windows Users
1. Use PowerShell or Command Prompt
2. Run as Administrator if you get permission errors
3. Windows Defender might block the app - allow it

### macOS Users
1. Use Terminal app
2. If you get permission errors, use: `sudo npm install`
3. Allow the app through firewall if prompted

### Linux Users
1. Use your preferred terminal
2. Install Node.js if not present: `sudo apt install nodejs npm`
3. Fix permissions if needed: `sudo chown -R $USER:$(id -gn $USER) ~/.npm`

---

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ Microsoft Edge (all versions)
- ✅ Google Chrome (v90+)
- ✅ Mozilla Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Brave Browser

### Browser-Specific Fixes
The application includes automatic browser detection and fixes:
- **Edge:** CSS Grid, Flexbox, and animation fixes
- **Brave:** Ad-blocker compatibility
- **Mobile:** Touch event optimization
- **IE:** Limited support with polyfills

---

## 📱 Mobile & Tablet Support

### Responsive Design
- Mobile-first approach
- Touch-optimized interface
- Automatic viewport adjustment

### Mobile Browser Testing
1. Open browser on mobile device
2. Navigate to `http://YOUR_PC_IP:3000`
3. Ensure both devices are on same WiFi network

---

## 🚨 Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# OR use different port
PORT=3001 npm start
```

### Database Permission Errors
```bash
# Linux/macOS
sudo chown $USER:$USER neet.db
chmod 664 neet.db

# Windows (run as Administrator)
# Right-click → Run as Administrator
```

### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Update Node.js (recommended method: use nvm)
# Install nvm first, then:
nvm install --lts
nvm use --lts
```

### Email Service Not Working
1. Check Gmail App Password setup
2. Verify EMAIL_USER and EMAIL_PASS in .env
3. Check internet connection
4. See server console for error messages

---

## 🌍 Network Setup

### Access from Other Devices
1. Find your IP address:
   - Windows: `ipconfig`
   - macOS/Linux: `ifconfig` or `ip addr`

2. Start server with network binding:
   ```bash
   npm start  # Automatically binds to 0.0.0.0
   ```

3. Access from other devices:
   `http://YOUR_IP:3000`

### Firewall Configuration
- **Windows:** Allow Node.js through Windows Defender Firewall
- **macOS:** Allow in System Preferences → Security & Privacy → Firewall
- **Linux:** Configure ufw or iptables if needed

---

## 🔄 Production Deployment

### Environment Setup
```env
NODE_ENV=production
PORT=80
DB_PATH=/var/www/neet/neet.db
```

### Using PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "neet-app"

# View status
pm2 status

# Restart
pm2 restart neet-app

# View logs
pm2 logs neet-app
```

### Docker Deployment (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📊 Performance Optimization

### Enable Compression
```bash
npm install compression
```

Add to server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

### Static File Caching
```javascript
app.use(express.static(__dirname, {
  maxAge: '1d'
}));
```

---

## 🛡️ Security Considerations

1. **Change JWT Secret** in production
2. **Use HTTPS** in production (Let's Encrypt recommended)
3. **Update Dependencies** regularly: `npm audit fix`
4. **Backup Database** regularly
5. **Monitor Logs** for suspicious activity

---

## 📞 Troubleshooting Help

### Debug Mode
Enable detailed logging:
```env
DEBUG=*
NODE_ENV=development
npm start
```

### Common Console Errors
- **EADDRINUSE:** Port in use → Change port or kill process
- **ENOENT:** File not found → Check file paths and permissions
- **EACCES:** Permission denied → Run as admin or fix permissions
- **Database locked:** Another process is using the DB → Restart server

### Get Help
1. Check the console output for specific error messages
2. Verify all steps in this guide were followed
3. Ensure Node.js and npm are up to date
4. Test with a different browser if needed

---

## ✅ Verification Checklist

Before going live, verify:
- [ ] All dependencies installed successfully
- [ ] Environment variables configured correctly
- [ ] Database created and accessible
- [ ] Server starts without errors
- [ ] Application loads in browser
- [ ] All pages load correctly
- [ ] Forms and interactions work
- [ ] Mobile responsive design works
- [ ] Email notifications (if configured)
- [ ] Cross-browser compatibility tested

---

## 🚀 Ready to Go!

Once you've completed these steps, your NEET UG Biology 360 application should work seamlessly across:
- All Windows laptops/PCs
- All macOS devices
- All Linux distributions
- All mobile and tablet devices
- All modern browsers including Edge

The application is now **cross-platform compatible** and ready for use! 🎉
