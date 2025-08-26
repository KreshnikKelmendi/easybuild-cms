# 🚀 Production Deployment Guide

## 🎯 Overview

This guide will help you deploy your EasyBuild Next.js application to production with working image uploads using Cloudinary.

## 🔑 Prerequisites

### 1. Cloudinary Account Setup
1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. From your dashboard, note down:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

### 2. Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=easybuild

# Next.js Configuration
NODE_ENV=production
```

⚠️ **IMPORTANT**: Replace the placeholder values with your actual credentials!

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project → Settings → Environment Variables
   - Add all the environment variables from your `.env.local` file

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop your `.next` folder to Netlify
   - Or use Netlify CLI

3. **Set Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all required environment variables

### Option 3: Traditional VPS/Server

1. **Build the application**:
   ```bash
   npm run build
   npm start
   ```

2. **Set environment variables** in your production environment

3. **Use PM2 or similar** for process management

## 🔧 Configuration Steps

### 1. Verify Cloudinary Setup
Run the configuration check:
```bash
node check-cloudinary.js
```

### 2. Test Image Uploads
1. Deploy your application
2. Go to the admin panel (`/dashboard`)
3. Try uploading an image
4. Check the browser console for any errors

### 3. Monitor Uploads
- Check Cloudinary dashboard for uploaded images
- Verify images are accessible via their URLs

## 🐛 Troubleshooting

### Common Issues

#### Issue: "All upload locations are inaccessible"
**Cause**: The app is trying to use local file storage instead of Cloudinary
**Solution**: 
- Ensure all admin components use `/api/upload-image-cloudinary`
- Verify Cloudinary environment variables are set correctly

#### Issue: "Cloudinary credentials are invalid"
**Cause**: Wrong or missing API credentials
**Solution**:
- Double-check your Cloudinary credentials
- Ensure they're set in your production environment
- Verify the credentials work in the Cloudinary dashboard

#### Issue: Images not displaying
**Cause**: Next.js image optimization not configured for Cloudinary
**Solution**: 
- Ensure `res.cloudinary.com` is in your `next.config.ts` remote patterns
- Check that image URLs are accessible

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   node check-cloudinary.js
   ```

2. **Test API Endpoint**:
   Visit `/api/debug-env` in your production app

3. **Check Browser Console**:
   Look for detailed error messages during upload

4. **Verify Cloudinary Dashboard**:
   Check if images are actually being uploaded

## 📱 Testing Your Deployment

### 1. Basic Functionality
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Admin panel accessible
- [ ] Authentication works

### 2. Image Uploads
- [ ] Can upload images in admin panel
- [ ] Images display correctly
- [ ] No "inaccessible" errors
- [ ] Images persist between sessions

### 3. Content Management
- [ ] Can create/edit projects
- [ ] Can create/edit services
- [ ] Can create/edit woods
- [ ] Can manage banners

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **API Keys**: Keep your Cloudinary API keys secure
3. **CORS**: Configure CORS properly for your domain
4. **File Validation**: Ensure only images are uploaded

## 📊 Monitoring

### 1. Cloudinary Usage
- Monitor your Cloudinary usage in the dashboard
- Free tier includes 25 GB storage and 25 GB bandwidth/month

### 2. Application Performance
- Monitor your application's performance
- Check for any upload failures or errors

### 3. Error Logging
- Implement proper error logging in production
- Monitor for any recurring issues

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check the troubleshooting guide**: `IMAGE_UPLOAD_TROUBLESHOOTING.md`
2. **Run the debug script**: `node debug-production.js`
3. **Verify your deployment platform** and its limitations
4. **Check Cloudinary documentation** for API issues
5. **Review your environment variables** and configuration

## 🎉 Success Checklist

- [ ] Application deployed successfully
- [ ] Environment variables configured
- [ ] Cloudinary credentials working
- [ ] Image uploads functional
- [ ] Admin panel working
- [ ] Images displaying correctly
- [ ] No "inaccessible" errors
- [ ] Application responsive and fast

---

**Remember**: The key to fixing the "All upload locations are inaccessible" error is switching from local file storage to Cloudinary. Once configured properly, your image uploads should work seamlessly in production!
