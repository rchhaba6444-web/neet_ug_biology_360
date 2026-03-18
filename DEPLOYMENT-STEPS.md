# 🚀 Step-by-Step Deployment Guide

## Quick Deployment to Render.com (FREE)

### Step 1: Prepare Your Code

1. **Create `.env` file** (don't commit this to git):
   ```bash
   # Copy env.example to .env
   cp env.example .env
   ```

2. **Create `.gitignore`** (if not exists):
   ```
   node_modules/
   .env
   neet.db
   uploads/*
   !uploads/.gitkeep
   .DS_Store
   ```

3. **Initialize Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

### Step 2: Deploy to Render.com

1. **Sign up**: Go to https://render.com (FREE)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub/GitLab (or use Render's Git)
   - Select your repository

3. **Configure Service**:
   ```
   Name: neet-biology-360
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables** in Render Dashboard:
   - Go to Environment tab
   - Add all variables from your `.env` file
   - **IMPORTANT**: Add Razorpay LIVE keys here

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your site will be live at: `your-app.onrender.com`

### Step 3: Get Custom Domain (Optional)

1. Buy domain from GoDaddy/Namecheap
2. In Render: Settings → Custom Domain
3. Add your domain
4. Update DNS records as shown
5. SSL certificate auto-generated (FREE)

---

## Alternative: Deploy to Railway.app (FREE)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables
6. Deploy automatically

---

## Alternative: Deploy to Vercel (FREE)

**Note**: Vercel is better for static sites. For Node.js backend:

1. Go to https://vercel.com
2. Import your repository
3. Configure:
   - Framework: Other
   - Build Command: `npm install`
   - Output Directory: `.`
4. Add environment variables
5. Deploy

---

## After Deployment

### 1. Test Your Site
- Visit your live URL
- Test registration
- Test login
- Test payment (with ₹1 first!)

### 2. Update Razorpay Webhook (Important!)

In Razorpay Dashboard:
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/verify-payment`
3. Enable events: `payment.captured`

### 3. Monitor
- Check Render/Railway logs
- Monitor Razorpay dashboard
- Check email notifications

---

## Cost Breakdown

**FREE Option (Render.com):**
- Hosting: FREE
- Domain: ₹500-1000/year (optional)
- SSL: FREE
- **Total: ₹0-1000/year**

**Paid Option (Better Performance):**
- DigitalOcean: $5/month (₹400/month)
- Domain: ₹500-1000/year
- **Total: ₹5,300-6,300/year**

---

## Troubleshooting

### Payment Not Working?
- Check Razorpay keys are LIVE (not test)
- Verify webhook URL is correct
- Check server logs for errors

### Content Not Uploading?
- Check `uploads/` folder permissions
- Verify file size limits
- Check admin authentication

### Site Not Loading?
- Check environment variables
- Verify database path
- Check server logs in Render dashboard

---

## Next Steps After Deployment

1. ✅ Test everything
2. ✅ Upload initial content
3. ✅ Share with friends for testing
4. ✅ Start marketing
5. ✅ Monitor payments
6. ✅ Scale up!

---

**You're all set! 🎉**
