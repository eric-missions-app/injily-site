# 🚀 Quick Start Guide - MissionsApp Website

## Get Your Site Live in 10 Minutes

### Step 1: Setup GitHub Repository

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name it: `missionsapp-website`
   - Make it **Public** or **Private**
   - Don't initialize with README (you already have one)
   - Click "Create repository"

2. **Upload your code**:
   ```bash
   # In your local project folder
   git init
   git add .
   git commit -m "Initial commit - MissionsApp website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/missionsapp-website.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
   - Sign up/Login with GitHub

2. **Import your project**:
   - Click "Add New..." → "Project"
   - Select your `missionsapp-website` repository
   - Click "Import"

3. **Configure (auto-detected)**:
   - Framework Preset: **Next.js** ✅
   - Root Directory: `./` ✅
   - Build Command: `next build` ✅
   - Click **"Deploy"**

4. **Wait 2-3 minutes** ⏱️
   - Vercel will build and deploy your site
   - You'll get a URL like: `missionsapp-website.vercel.app`

### Step 3: Add Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project → "Settings" → "Domains"
   - Add `missions-app.com`

2. **Configure DNS** (at your domain provider):
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.21.21`

3. **SSL Certificate**: Automatic ✅ (takes ~5 minutes)

---

## 🎨 Making Changes

### Update Content
1. Edit files in `src/components/`
2. Save changes
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update hero section"
   git push
   ```
4. **Auto-deploys** to Vercel! 🎉

### Test Locally First
```bash
npm run dev
# Visit http://localhost:3000
```

---

## ✅ Checklist After Deployment

- [ ] Site loads at Vercel URL
- [ ] All images display correctly
- [ ] Mobile responsive (test on phone)
- [ ] Links work properly
- [ ] Update contact information
- [ ] Add Google Analytics (optional)
- [ ] Set up contact form (optional)
- [ ] Configure custom domain (optional)
- [ ] Test on multiple browsers

---

## 🆘 Need Help?

**Common Issues:**

1. **Build fails**: Check package.json syntax
2. **Images 404**: Verify image URLs in next.config.js
3. **Styles broken**: Clear cache, rebuild

**Still stuck?** 
- Check [Vercel Docs](https://vercel.com/docs)
- Review the full README.md

---

## 📞 Environment Variables (if needed later)

In Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_GA_ID` - Google Analytics
- `NEXT_PUBLIC_FORM_ENDPOINT` - Contact form API
- etc.

---

**That's it! Your site is live! 🎊**
