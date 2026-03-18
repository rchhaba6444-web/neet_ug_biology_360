# ⚡ RENDER.COM - QUICK START (10 MINUTES)

## 🎯 FASTEST WAY TO DEPLOY

---

## STEP 1: Upload to GitHub (3 min)

1. Go to: https://github.com/new
2. Name: `neet-biology-360`
3. Click "Create repository"
4. Click "uploading an existing file"
5. **Drag ALL your files** (except `node_modules`, `.env`, `neet.db`)
6. Click "Commit changes"

---

## STEP 2: Deploy to Render (5 min)

1. Go to: https://render.com
2. Click "Get Started for Free"
3. Click "Sign up with GitHub"
4. Click "New +" → "Web Service"
5. Connect your repo: `neet-biology-360`
6. Configure:
   ```
   Name: neet-biology-360
   Region: Singapore
   Build: npm install
   Start: npm start
   Plan: Free
   ```
7. Click "Create Web Service"

---

## STEP 3: Add Environment Variables (2 min)

In Render dashboard → Environment tab, add:

```
PORT = 3000
NODE_ENV = production
DB_PATH = ./neet.db
JWT_SECRET = neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890
EMAIL_USER = kavirani576@gmail.com
EMAIL_PASS = (get from Gmail - see below)
ADMIN_EMAIL = kavirani576@gmail.com
ADMIN_PHONE = 9513102159
RAZORPAY_KEY_ID = rzp_test_your_key_id
RAZORPAY_KEY_SECRET = your_razorpay_key_secret
```

---

## STEP 4: Get Gmail Password (2 min)

1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if needed)
3. Generate password for "Mail"
4. Copy 16-character password
5. Add to Render as `EMAIL_PASS`

---

## ✅ DONE!

**Your site:** `https://neet-biology-360.onrender.com`

**Wait 5-10 minutes for first deployment!**

---

## 🧪 TEST

1. Visit your URL
2. Test registration
3. Test login
4. Test admin: `/admin-login.html`
   - Email: `kavirani576@gmail.com`
   - Password: `kavirani567`

---

## 🆘 PROBLEMS?

**Build fails?**
- Check logs in Render
- Verify `package.json` uploaded

**Site error?**
- Check environment variables
- Review logs

**Need help?**
- Render docs: https://render.com/docs
- Your contact: +91 95131 02159

---

**🎉 You're live! Start earning! 💰**
