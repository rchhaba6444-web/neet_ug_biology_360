# 🔧 RENDER.COM - ENVIRONMENT VARIABLES GUIDE

## 📋 Complete List of Environment Variables for Render

When you deploy to Render.com, you need to add these environment variables in the Render dashboard.

---

## 🎯 HOW TO ADD IN RENDER

1. Go to your Render dashboard
2. Click on your service (neet-biology-360)
3. Click "Environment" tab (left sidebar)
4. Click "Add Environment Variable" for each one
5. Copy-paste the Key and Value
6. Click "Save Changes"

---

## ✅ REQUIRED ENVIRONMENT VARIABLES

### 1. PORT
```
Key: PORT
Value: 3000
```
**Why:** Tells Render which port to use

---

### 2. NODE_ENV
```
Key: NODE_ENV
Value: production
```
**Why:** Sets production mode for better performance

---

### 3. DB_PATH
```
Key: DB_PATH
Value: ./neet.db
```
**Why:** Where to store the database file

---

### 4. JWT_SECRET
```
Key: JWT_SECRET
Value: neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890
```
**Why:** Secret key for user authentication tokens

**⚠️ IMPORTANT:** You can use the value above OR generate a new one at: https://randomkeygen.com
- Use "CodeIgniter Encryption Keys"
- Copy a 32+ character string

---

### 5. EMAIL_USER
```
Key: EMAIL_USER
Value: kavirani576@gmail.com
```
**Why:** Gmail address for sending email notifications

---

### 6. EMAIL_PASS
```
Key: EMAIL_PASS
Value: (your-gmail-app-password-here)
```
**Why:** Gmail App Password for sending emails

**How to get:**
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if not enabled)
3. Generate password for "Mail"
4. Copy the 16-character password (remove spaces)
5. Paste here

**Example:** `abcdefghijklmnop` (16 characters, no spaces)

---

### 7. ADMIN_EMAIL
```
Key: ADMIN_EMAIL
Value: kavirani576@gmail.com
```
**Why:** Email where admin notifications are sent

---

### 8. ADMIN_PHONE
```
Key: ADMIN_PHONE
Value: 9513102159
```
**Why:** Phone number for SMS/WhatsApp notifications

---

### 9. RAZORPAY_KEY_ID
```
Key: RAZORPAY_KEY_ID
Value: rzp_test_your_key_id
```
**Why:** Razorpay API Key ID for payments

**For Testing (Now):**
- Use: `rzp_test_your_key_id` (test key)
- Get from: https://dashboard.razorpay.com (test mode)

**For Production (Later):**
- Use: `rzp_live_xxxxxxxxxxxxx` (live key)
- Get from: https://dashboard.razorpay.com (after KYC)

---

### 10. RAZORPAY_KEY_SECRET
```
Key: RAZORPAY_KEY_SECRET
Value: your_razorpay_key_secret
```
**Why:** Razorpay Secret Key for payment verification

**For Testing (Now):**
- Use test secret key from Razorpay dashboard

**For Production (Later):**
- Use live secret key from Razorpay dashboard

---

## 🔵 OPTIONAL ENVIRONMENT VARIABLES

These are optional but recommended:

### 11. FAST2SMS_API_KEY (Optional)
```
Key: FAST2SMS_API_KEY
Value: your-fast2sms-api-key
```
**Why:** For SMS notifications (FREE 20 SMS/day)

**How to get:**
1. Sign up at: https://www.fast2sms.com
2. Get API key from dashboard
3. Add here

**If not added:** SMS notifications won't work (but site still works)

---

### 12. CALLMEBOT_API_KEY (Optional)
```
Key: CALLMEBOT_API_KEY
Value: your-callmebot-api-key
```
**Why:** For WhatsApp notifications (FREE)

**How to get:**
1. Sign up at: https://www.callmebot.com
2. Get API key
3. Add here

**If not added:** WhatsApp notifications won't work (but site still works)

---

## 📝 COMPLETE LIST (Copy-Paste Ready)

Here's the complete list you can copy:

```
PORT=3000
NODE_ENV=production
DB_PATH=./neet.db
JWT_SECRET=neet_biology_360_jwt_secret_key_2024_secure_random_string_here_abcdefghijklmnopqrstuvwxyz1234567890
EMAIL_USER=kavirani576@gmail.com
EMAIL_PASS=your-gmail-app-password-here
ADMIN_EMAIL=kavirani576@gmail.com
ADMIN_PHONE=9513102159
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 🎯 MINIMUM REQUIRED (To Get Started)

If you want to deploy quickly, add at least these 5:

1. ✅ `PORT` = 3000
2. ✅ `NODE_ENV` = production
3. ✅ `DB_PATH` = ./neet.db
4. ✅ `JWT_SECRET` = (any long random string)
5. ✅ `RAZORPAY_KEY_ID` = rzp_test_your_key_id (even if fake, site will work)

**You can add others later!**

---

## 📸 STEP-BY-STEP IN RENDER

### Step 1: Go to Environment Tab
1. Login to Render.com
2. Click your service: `neet-biology-360`
3. Click "Environment" tab (left sidebar)

### Step 2: Add Each Variable
1. Click "Add Environment Variable"
2. Enter Key (left side)
3. Enter Value (right side)
4. Click "Save Changes"
5. Repeat for each variable

### Step 3: Verify
- You should see all variables listed
- Render will auto-redeploy after you save

---

## ⚠️ IMPORTANT NOTES

### 1. Never Share These Values
- Keep them secret
- Don't commit to GitHub
- Only add in Render dashboard

### 2. Test Keys First
- Use Razorpay test keys initially
- Test everything works
- Then switch to live keys

### 3. Gmail App Password
- Must enable 2-Step Verification first
- Generate new password for each app
- 16 characters, no spaces

### 4. JWT Secret
- Must be long and random
- At least 32 characters
- Never change after users sign up (or they'll be logged out)

---

## 🔄 UPDATING VARIABLES

### To Update a Variable:
1. Go to Environment tab
2. Find the variable
3. Click "Edit" (pencil icon)
4. Change value
5. Click "Save"
6. Render auto-redeploys

### To Delete a Variable:
1. Find the variable
2. Click "Delete" (trash icon)
3. Confirm deletion

---

## ✅ VERIFICATION CHECKLIST

After adding all variables:

- [ ] PORT = 3000
- [ ] NODE_ENV = production
- [ ] DB_PATH = ./neet.db
- [ ] JWT_SECRET = (long random string)
- [ ] EMAIL_USER = kavirani576@gmail.com
- [ ] EMAIL_PASS = (Gmail App Password)
- [ ] ADMIN_EMAIL = kavirani576@gmail.com
- [ ] ADMIN_PHONE = 9513102159
- [ ] RAZORPAY_KEY_ID = (test or live key)
- [ ] RAZORPAY_KEY_SECRET = (test or live secret)

---

## 🆘 TROUBLESHOOTING

### Problem: Site shows "Application Error"
**Solution:** Check if all required variables are added

### Problem: Email not sending
**Solution:** 
- Verify EMAIL_PASS is correct
- Check Gmail App Password is valid
- Enable 2-Step Verification

### Problem: Payment not working
**Solution:**
- Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- Check if using test or live keys
- Verify keys in Razorpay dashboard

### Problem: Database error
**Solution:**
- Verify DB_PATH is correct
- Check Render logs for specific error

---

## 📞 NEED HELP?

**Render Support:**
- Docs: https://render.com/docs/environment-variables
- Email: support@render.com

**Your Contact:**
- Phone: +91 95131 02159
- Email: kavirani576@gmail.com

---

## 🎉 YOU'RE READY!

Once all variables are added, your site will work perfectly!

**Next:** Wait for deployment to complete, then test your site!

---

**Last Updated:** March 2026
