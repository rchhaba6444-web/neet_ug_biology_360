# 🚀 COMPLETE RENDER.COM DEPLOYMENT GUIDE

## ✅ STEP-BY-STEP: Deploy to Render.com

---

## 📋 PREPARATION (5 minutes)

### Step 1: Check Your Files

Make sure you have these files in your project:
- ✅ `server.js` (main server file)
- ✅ `package.json` (dependencies)
- ✅ `database.js` (database setup)
- ✅ All HTML files
- ✅ `js/` folder
- ✅ `css/` folder
- ✅ `.gitignore` file (already created)

### Step 2: Prepare GitHub Account

**If you DON'T have GitHub account:**
1. Go to: https://github.com
2. Click "Sign up"
3. Create free account
4. Verify your email

**If you HAVE GitHub account:**
- Just login and continue

---

## 📤 STEP 1: Upload Code to GitHub (10 minutes)

### Option A: Using GitHub Website (EASIEST - No Git needed)

1. **Create New Repository:**
   - Go to: https://github.com/new
   - Repository name: `neet-biology-360`
   - Description: "NEET UG Biology 360 E-Commerce Platform"
   - Choose: **Private** (recommended) or Public
   - **DON'T** check "Initialize with README"
   - **DON'T** add .gitignore (we already have one)
   - **DON'T** choose license
   - Click "Create repository"

2. **Upload Files:**
   - You'll see a page with "Quick setup"
   - Scroll down to find "uploading an existing file"
   - Click "uploading an existing file" link
   - **Drag and drop ALL your project files:**
   
   **UPLOAD THESE:**
   - ✅ `css/` folder (entire folder)
   - ✅ `js/` folder (entire folder)
   - ✅ `images/` folder (if exists)
   - ✅ `ncert-notes/` folder (if exists)
   - ✅ All `.html` files (index.html, auth.html, pricing.html, etc.)
   - ✅ `server.js`
   - ✅ `database.js`
   - ✅ `package.json`
   - ✅ `package-lock.json`
   - ✅ `clear-sessions.js`
   - ✅ `.gitignore`
   - ✅ `uploads/.gitkeep` (the file, not folder contents)
   - ✅ All `.md` files (README.md, etc.)
   
   **DO NOT UPLOAD:**
   - ❌ `node_modules/` folder
   - ❌ `.env` file
   - ❌ `neet.db` file
   - ❌ `uploads/` folder contents (except `.gitkeep`)

3. **Commit Files:**
   - Scroll to bottom
   - Commit message: "Initial commit - NEET Biology 360"
   - Click "Commit changes"
   - Wait for upload to complete

4. **Verify:**
   - You should see all your files in the repository
   - Repository URL: `https://github.com/YOUR-USERNAME/neet-biology-360`

### Option B: Using Git Command Line (Advanced)

If you prefer command line:

```bash
# Open terminal in your project folder
cd C:\Users\Laptop\Downloads\neet

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - NEET Biology 360"

# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/neet-biology-360.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 STEP 2: Deploy to Render.com (15 minutes)

### Part 1: Sign Up for Render

1. **Go to Render:**
   - Visit: https://render.com
   - Click "Get Started for Free" (top right)

2. **Sign Up:**
   - **RECOMMENDED:** Click "Sign up with GitHub"
   - Authorize Render to access your GitHub
   - OR sign up with email (verify email if needed)

3. **Complete Profile:**
   - Fill in your name
   - Choose "Personal" account (free)
   - Click "Continue"

### Part 2: Create Web Service

1. **Start New Service:**
   - Click "New +" button (top right)
   - Select "Web Service"

2. **Connect Repository:**
   - You'll see "Connect a repository"
   - If GitHub is connected, you'll see your repos
   - Find: `neet-biology-360`
   - Click "Connect" next to it
   
   **If you don't see your repo:**
   - Click "Configure account" or "Authorize Render"
   - Grant permissions
   - Refresh page

3. **Configure Service:**
   
   Fill in these settings:
   
   ```
   Name: neet-biology-360
   (or any name you like)
   
   Region: Singapore
   (or closest to India - Singapore is best)
   
   Branch: main
   (or master if that's your branch)
   
   Root Directory: (leave empty)
   
   Runtime: Node
   
   Build Command: npm install
   
   Start Command: npm start
   
   Plan: Free
   ```

4. **Create Service:**
   - Click "Create Web Service"
   - Render will start building (this takes 5-10 minutes)

### Part 3: Add Environment Variables

**While building, add environment variables:**

1. **Go to Environment Tab:**
   - In your service dashboard
   - Click "Environment" tab (left sidebar)

2. **Add Variables:**
   
   Click "Add Environment Variable" for each:

   **Variable 1:**
   ```
   Key: PORT
   Value: 3000
   ```

   **Variable 2:**
   ```
   Key: NODE_ENV
   Value: production
   ```

   **Variable 3:**
   ```
   Key: DB_PATH
   Value: ./neet.db
   ```

   **Variable 4:**
   ```
   Key: JWT_SECRET
   Value: neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890
   ```
   *(You can use this or generate a new one at https://randomkeygen.com)*

   **Variable 5:**
   ```
   Key: EMAIL_USER
   Value: kavirani576@gmail.com
   ```

   **Variable 6:**
   ```
   Key: EMAIL_PASS
   Value: (get from Gmail - see instructions below)
   ```

   **Variable 7:**
   ```
   Key: ADMIN_EMAIL
   Value: kavirani576@gmail.com
   ```

   **Variable 8:**
   ```
   Key: ADMIN_PHONE
   Value: 9513102159
   ```

   **Variable 9:**
   ```
   Key: RAZORPAY_KEY_ID
   Value: rzp_test_your_key_id
   ```
   *(Use test keys first, then switch to live keys later)*

   **Variable 10:**
   ```
   Key: RAZORPAY_KEY_SECRET
   Value: your_razorpay_key_secret
   ```
   *(Use test keys first, then switch to live keys later)*

3. **Save:**
   - After adding all variables
   - Render will automatically redeploy

---

## 📧 STEP 3: Get Gmail App Password (5 minutes)

**Why:** For email notifications when users sign up or make payments

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Under "Signing in to Google"
   - If "2-Step Verification" is OFF, click it
   - Follow steps to enable (use phone number)

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in if needed
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Type: "NEET Website"
   - Click "Generate"

3. **Copy Password:**
   - You'll see a 16-character password
   - Example: `abcd efgh ijkl mnop`
   - Copy it (remove spaces: `abcdefghijklmnop`)

4. **Add to Render:**
   - Go back to Render dashboard
   - Environment tab
   - Update `EMAIL_PASS` variable
   - Paste the password (no spaces)
   - Save

---

## ✅ STEP 4: Wait for Deployment (5-10 minutes)

1. **Monitor Build:**
   - Watch the "Logs" tab
   - You'll see build progress
   - Wait for "Build successful"

2. **Check Status:**
   - Status will change to "Live" when ready
   - You'll see a green "Live" badge

3. **Get Your URL:**
   - Your site URL: `https://neet-biology-360.onrender.com`
   - Or: `https://your-custom-name.onrender.com`
   - Click the URL to open your site

---

## 🧪 STEP 5: Test Your Website (5 minutes)

### Test Checklist:

1. **Homepage:**
   - Visit your URL
   - Should see homepage
   - ✅ Working

2. **Registration:**
   - Click "Sign Up"
   - Create test account
   - ✅ Should work

3. **Login:**
   - Login with test account
   - ✅ Should work

4. **Admin Panel:**
   - Go to: `https://your-url.onrender.com/admin-login.html`
   - Email: `kavirani576@gmail.com`
   - Password: `kavirani567`
   - ✅ Should login

5. **Payment (Test):**
   - Try to purchase a plan
   - Use Razorpay test mode
   - ✅ Should work

---

## 🎉 SUCCESS! Your Site is Live!

**Your website is now accessible at:**
`https://neet-biology-360.onrender.com`

**Share this URL with anyone!**

---

## 🔧 TROUBLESHOOTING

### Problem: Build Fails

**Check:**
1. Go to "Logs" tab
2. Look for error messages
3. Common issues:
   - Missing `package.json` → Make sure it's uploaded
   - Wrong start command → Should be `npm start`
   - Missing dependencies → Check `package.json`

**Solution:**
- Fix the error
- Push changes to GitHub
- Render will auto-redeploy

### Problem: "Application Error"

**Check:**
1. Go to "Logs" tab
2. Look for runtime errors
3. Common causes:
   - Missing environment variables
   - Database path issue
   - Port configuration

**Solution:**
- Add missing environment variables
- Check `server.js` uses `process.env.PORT`
- Review logs for specific error

### Problem: Site Shows "Sleeping"

**This is NORMAL for free tier:**
- Site sleeps after 15 minutes of inactivity
- First request takes 30 seconds to wake up
- After that, it's fast

**Solution:**
- Wait 30 seconds on first visit
- Or upgrade to paid plan ($7/month) for always-on

### Problem: Database Not Working

**Solution:**
- SQLite works on Render
- Database file is created automatically
- If issues, check file permissions in logs

### Problem: File Uploads Not Working

**Important:** Render's file system resets on deploy

**Solution:**
- Use cloud storage (AWS S3, Cloudinary) for production
- Or store file paths in database
- For now, uploads work but reset on redeploy

---

## 📊 MONITORING YOUR SITE

### Render Dashboard Shows:

1. **Metrics:**
   - CPU usage
   - Memory usage
   - Request count
   - Response times

2. **Logs:**
   - Real-time logs
   - Error logs
   - Build logs

3. **Events:**
   - Deployments
   - Builds
   - Service updates

---

## 🔄 UPDATING YOUR SITE

### Method 1: Auto-Deploy (Recommended)

1. Make changes locally
2. Push to GitHub
3. Render auto-deploys (takes 5-10 minutes)

### Method 2: Manual Deploy

1. In Render dashboard
2. Click "Manual Deploy"
3. Choose branch
4. Click "Deploy"

---

## 🎯 NEXT STEPS

After deployment:

1. ✅ **Test Everything**
   - Test all features
   - Fix any issues

2. ✅ **Upload Content**
   - Login to admin panel
   - Upload NCERT Notes, MCQs, etc.

3. ✅ **Get Razorpay Live Keys**
   - Complete Razorpay KYC
   - Get live API keys
   - Update environment variables

4. ✅ **Start Marketing**
   - Share your URL
   - Get customers
   - Start earning! 💰

---

## 📞 NEED HELP?

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com
- Email: support@render.com

**Common Issues:**
- Check Render status: https://status.render.com
- Review logs in dashboard
- Check environment variables

**Your Contact:**
- Phone: +91 95131 02159
- Email: kavirani576@gmail.com

---

## ✅ DEPLOYMENT CHECKLIST

Before deploying:
- [ ] Code uploaded to GitHub
- [ ] All files present (except node_modules, .env, .db)
- [ ] `.gitignore` file created
- [ ] Gmail App Password ready
- [ ] Environment variables list ready

After deploying:
- [ ] Build successful
- [ ] Site shows "Live"
- [ ] Homepage loads
- [ ] Registration works
- [ ] Login works
- [ ] Admin panel accessible
- [ ] All environment variables added
- [ ] Test payment works

---

## 🎉 CONGRATULATIONS!

**Your NEET Biology 360 website is now LIVE on the internet!**

**Share it with the world and start earning money! 💰🚀**

---

## 💡 PRO TIPS

1. **Always test locally first** before pushing to GitHub
2. **Check logs regularly** for errors
3. **Backup your database** regularly
4. **Use test Razorpay keys first**, then switch to live
5. **Monitor your site** for performance
6. **Set up custom domain** for professional look

**Good Luck! 🚀**
