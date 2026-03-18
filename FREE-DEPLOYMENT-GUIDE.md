# 🚀 COMPLETE FREE DEPLOYMENT GUIDE

## 🏆 BEST FREE HOSTING OPTIONS (Ranked)

### 1. **Render.com** ⭐ BEST CHOICE
- ✅ FREE forever
- ✅ Auto SSL (HTTPS)
- ✅ Easy deployment
- ✅ Supports Node.js perfectly
- ✅ Free PostgreSQL (if needed)
- ⚠️ Sleeps after 15 min inactivity (wakes on request)

### 2. **Railway.app** ⭐ GREAT ALTERNATIVE
- ✅ FREE $5 credit/month
- ✅ No sleep (always on)
- ✅ Very fast
- ✅ Easy setup
- ⚠️ Credit expires monthly

### 3. **Fly.io** ⭐ GOOD FOR SCALING
- ✅ FREE tier available
- ✅ Global deployment
- ✅ Fast performance
- ⚠️ Slightly complex setup

---

## 📋 STEP-BY-STEP: Deploy to Render.com (RECOMMENDED)

### PREPARATION (5 minutes)

#### Step 1: Create `.gitignore` file

Create a file named `.gitignore` in your project root:

```gitignore
# Dependencies
node_modules/

# Environment variables (IMPORTANT - don't commit secrets!)
.env
.env.local

# Database
*.db
*.sqlite
*.sqlite3

# Uploads (keep folder structure)
uploads/*
!uploads/.gitkeep

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Build files
dist/
build/
```

#### Step 2: Create `uploads/.gitkeep` file

Create the folder structure:
```bash
mkdir uploads
echo. > uploads/.gitkeep
```

This keeps the uploads folder in git but ignores files.

#### Step 3: Prepare your code

Make sure you have:
- ✅ All files saved
- ✅ `package.json` exists
- ✅ `server.js` is the main file
- ✅ `.gitignore` created

---

### DEPLOYMENT (15 minutes)

#### Step 4: Create GitHub Account (if you don't have one)

1. Go to: https://github.com
2. Click "Sign up"
3. Create free account
4. Verify email

#### Step 5: Upload Code to GitHub

**Option A: Using GitHub Website (Easiest)**

1. Go to: https://github.com/new
2. Repository name: `neet-biology-360`
3. Description: "NEET UG Biology 360 E-Commerce Platform"
4. Choose: **Private** (recommended) or Public
5. **DON'T** check "Initialize with README"
6. Click "Create repository"

7. **Upload files:**
   - Scroll down to "uploading an existing file"
   - Drag and drop ALL your project files
   - **EXCEPT**: `node_modules/`, `.env`, `neet.db`
   - Click "Commit changes"

**Option B: Using Git Command Line**

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - NEET Biology 360"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/neet-biology-360.git
git push -u origin main
```

#### Step 6: Deploy to Render.com

1. **Sign up for Render:**
   - Go to: https://render.com
   - Click "Get Started for Free"
   - Sign up with GitHub (recommended) or Email
   - Verify email if needed

2. **Create New Web Service:**
   - Click "New +" button (top right)
   - Select "Web Service"
   - Click "Connect account" next to GitHub
   - Authorize Render to access GitHub
   - Select your repository: `neet-biology-360`
   - Click "Connect"

3. **Configure Service:**
   ```
   Name: neet-biology-360
   Region: Singapore (closest to India) or Frankfurt
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Select Plan:**
   - Choose: **Free** (FREE forever)
   - Click "Create Web Service"

5. **Add Environment Variables:**
   - Wait for service to be created
   - Go to "Environment" tab
   - Click "Add Environment Variable"
   - Add these one by one:

   ```
   PORT = 3000
   NODE_ENV = production
   DB_PATH = ./neet.db
   JWT_SECRET = your_very_strong_random_secret_key_min_32_characters_here
   EMAIL_USER = kavirani576@gmail.com
   EMAIL_PASS = your-gmail-app-password
   ADMIN_EMAIL = kavirani576@gmail.com
   ADMIN_PHONE = 9513102159
   RAZORPAY_KEY_ID = rzp_test_your_key_id (use test first, then live)
   RAZORPAY_KEY_SECRET = your_razorpay_key_secret
   ```

   **Important:** 
   - For JWT_SECRET, generate a random string (use: https://randomkeygen.com/)
   - For EMAIL_PASS, get Gmail App Password (see below)
   - For Razorpay, use test keys first, then switch to live

6. **Deploy:**
   - Click "Save Changes"
   - Render will automatically start building
   - Wait 5-10 minutes
   - You'll see "Live" when done

7. **Get Your URL:**
   - Your site will be at: `neet-biology-360.onrender.com`
   - Or custom name: `your-custom-name.onrender.com`

---

### POST-DEPLOYMENT (10 minutes)

#### Step 7: Test Your Website

1. Visit your URL: `https://your-app.onrender.com`
2. Test homepage loads
3. Test registration
4. Test login
5. Test admin panel: `https://your-app.onrender.com/admin-login.html`

#### Step 8: Get Gmail App Password (For Email Notifications)

1. Go to: https://myaccount.google.com
2. Click "Security" (left menu)
3. Enable "2-Step Verification" (if not enabled)
4. Go to: https://myaccount.google.com/apppasswords
5. Select app: "Mail"
6. Select device: "Other (Custom name)" → Type "NEET Website"
7. Click "Generate"
8. Copy the 16-character password
9. Add to Render environment variables as `EMAIL_PASS`

#### Step 9: Set Up Custom Domain (Optional - FREE)

1. Buy domain from:
   - GoDaddy.com (₹500-1000/year)
   - Namecheap.com
   - Google Domains

2. In Render Dashboard:
   - Go to your service
   - Click "Settings"
   - Scroll to "Custom Domains"
   - Click "Add Custom Domain"
   - Enter your domain: `neetbiology360.com`
   - Render will show DNS records to add

3. Update DNS (in your domain provider):
   - Add CNAME record:
     ```
     Type: CNAME
     Name: @ or www
     Value: your-app.onrender.com
     ```
   - Wait 24-48 hours for DNS to propagate
   - SSL certificate auto-generated (FREE)

---

## 🚀 ALTERNATIVE: Deploy to Railway.app

### Why Railway?
- ✅ No sleep (always on)
- ✅ $5 free credit/month
- ✅ Faster than Render
- ✅ Very easy setup

### Steps:

1. **Sign up:**
   - Go to: https://railway.app
   - Click "Start a New Project"
   - Sign up with GitHub

2. **Deploy:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Node.js

3. **Add Environment Variables:**
   - Click on your service
   - Go to "Variables" tab
   - Add all environment variables (same as Render)

4. **Get URL:**
   - Railway gives you a URL automatically
   - Format: `your-app.up.railway.app`

5. **Custom Domain:**
   - Settings → Domains
   - Add your domain
   - Update DNS records

**Cost:** FREE (within $5/month credit)

---

## 🔧 TROUBLESHOOTING

### Problem: Build Fails

**Solution:**
- Check build logs in Render dashboard
- Common issues:
  - Missing dependencies → Add to `package.json`
  - Wrong start command → Should be `npm start`
  - Port issue → Make sure using `process.env.PORT || 3000`

### Problem: Site Shows "Application Error"

**Solution:**
- Check logs in Render dashboard
- Common causes:
  - Missing environment variables
  - Database path issue
  - Port configuration

### Problem: Database Not Working

**Solution:**
- SQLite works on Render, but consider:
  - Use absolute path: `/opt/render/project/src/neet.db`
  - Or use Render PostgreSQL (FREE tier available)

### Problem: File Uploads Not Working

**Solution:**
- Render's file system is ephemeral (resets on deploy)
- Options:
  1. Use cloud storage (AWS S3, Cloudinary - FREE tiers)
  2. Use database to store file paths
  3. Use external file hosting

### Problem: Site Sleeps After 15 Minutes

**Solution:**
- This is normal for Render free tier
- Site wakes up automatically on first request (takes 30 seconds)
- Upgrade to paid plan ($7/month) for always-on
- Or use Railway.app (no sleep on free tier)

---

## 📊 COMPARISON TABLE

| Feature | Render.com | Railway.app | Fly.io |
|---------|-----------|-------------|--------|
| **Free Tier** | ✅ Forever | ✅ $5/month | ✅ Limited |
| **Sleep Time** | 15 min | Never | Never |
| **SSL/HTTPS** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free |
| **Database** | ✅ PostgreSQL | ✅ PostgreSQL | ✅ PostgreSQL |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Best For** | Beginners | Always-on | Scaling |

---

## ✅ DEPLOYMENT CHECKLIST

Before deploying:
- [ ] `.gitignore` file created
- [ ] `uploads/.gitkeep` file created
- [ ] Code pushed to GitHub
- [ ] Environment variables list ready
- [ ] Gmail App Password generated
- [ ] Razorpay keys ready (test or live)

After deploying:
- [ ] Website loads successfully
- [ ] Registration works
- [ ] Login works
- [ ] Admin panel accessible
- [ ] Environment variables added
- [ ] Test payment works
- [ ] Email notifications work

---

## 🎯 QUICK START COMMANDS

### If using Git:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/neet-biology-360.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Generate JWT Secret:

Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys"
- Copy a 32+ character string
- Use as JWT_SECRET

---

## 💡 PRO TIPS

1. **Start with Test Keys:**
   - Use Razorpay test keys first
   - Test everything works
   - Then switch to live keys

2. **Monitor Logs:**
   - Check Render logs regularly
   - Fix errors immediately
   - Set up error alerts

3. **Backup Database:**
   - Export database regularly
   - Use Render's PostgreSQL for better reliability
   - Or backup SQLite file manually

4. **Performance:**
   - Render free tier is slow on first request (wake-up)
   - Consider Railway for better performance
   - Or upgrade Render to paid ($7/month)

5. **Security:**
   - Never commit `.env` file
   - Use strong JWT_SECRET
   - Change default admin password
   - Enable 2FA on all accounts

---

## 🆘 NEED HELP?

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com
- Email: support@render.com

**Railway Support:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Your Contact:**
- Phone: +91 95131 02159
- Email: kavirani576@gmail.com

---

## 🎉 YOU'RE READY!

Follow these steps and your website will be live in **30 minutes**!

**Next Steps After Deployment:**
1. ✅ Test everything
2. ✅ Upload content
3. ✅ Get Razorpay live keys
4. ✅ Start earning money! 💰

**Good Luck! 🚀**
