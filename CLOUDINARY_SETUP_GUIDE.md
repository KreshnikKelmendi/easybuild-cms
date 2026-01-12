# 🚀 Cloudinary Setup Guide

## 🎯 **Why Cloudinary?**
- ✅ **No more 500 errors** - Images upload to the cloud, not your server
- ✅ **Automatic optimization** - Images are resized and optimized automatically
- ✅ **CDN delivery** - Fast image loading worldwide
- ✅ **No file system issues** - Works in any production environment
- ✅ **Free tier available** - 25GB storage and 25GB bandwidth per month

## 🔑 **Step 1: Get Your Cloudinary Credentials**

### 1.1 Sign in to Cloudinary
- Go to [cloudinary.com](https://cloudinary.com)
- Sign in to your account

### 1.2 Find Your Dashboard
- Click **"Dashboard"** in the top navigation
- Look for **"Account Details"** section

### 1.3 Copy Your Credentials
You need these **3 values**:

```
Cloud Name: your-cloud-name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz123456
```

## ⚙️ **Step 2: Install Dependencies**

```bash
cd easy
npm install cloudinary
```

## 🔧 **Step 3: Set Environment Variables**

### 3.1 Create `.env.local` file
Create a file called `.env.local` in your project root:

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

### 3.2 Replace Placeholder Values
Replace the placeholder values with your actual Cloudinary credentials from Step 1.

## 🚀 **Step 4: Deploy to Production**

### 4.1 Add Environment Variables to Your Host
- **Vercel**: Add them in your project settings → Environment Variables
- **Netlify**: Add them in Site settings → Environment variables
- **Heroku**: Use `heroku config:set` command
- **VPS/Server**: Add them to your `.env` file

### 4.2 Example for Vercel:
```bash
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

## 🧪 **Step 5: Test the Integration**

### 5.1 Test Upload
1. Go to your Banner Manager
2. Try uploading an image
3. Check the browser console for success messages
4. Verify the image appears in your Cloudinary dashboard

### 5.2 Check Cloudinary Dashboard
- Go to your Cloudinary dashboard
- Look in the **"Media Library"** section
- You should see a folder called `easybuild-banners`
- Your uploaded images will be there

## 🔍 **Troubleshooting**

### **Use the Diagnostic Endpoint**
First, check your Cloudinary configuration by visiting:
```
https://your-domain.com/api/debug-cloudinary
```

This endpoint will tell you:
- ✅ If all environment variables are set
- ✅ If credentials are valid (not placeholders)
- ✅ If connection to Cloudinary works
- ✅ If test upload succeeds
- ✅ Specific error messages and recommendations

### **Error: "Invalid credentials" or "Missing credentials"**
1. **Check the diagnostic endpoint** first: `/api/debug-cloudinary`
2. Verify all three environment variables are set:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Ensure environment variables are set in your production environment (Vercel/Netlify/etc.)
4. Verify the keys are copied exactly (no extra spaces or quotes)
5. **Redeploy** your application after setting environment variables

### **Error: "Upload failed"**
1. Check the error response - it now includes detailed error codes:
   - `INVALID_API_KEY` - API key is wrong
   - `INVALID_API_SECRET` - API secret is wrong
   - `INVALID_CLOUD_NAME` - Cloud name is wrong
   - `NETWORK_ERROR` - Cannot reach Cloudinary servers
   - `RATE_LIMIT_EXCEEDED` - Account limits exceeded
2. Check your internet connection
3. Verify Cloudinary service status: https://status.cloudinary.com
4. Check if you've exceeded free tier limits in Cloudinary dashboard
5. Review server logs for detailed error information

### **Images not showing**
- Check the returned URL in browser console
- Verify the image URL is accessible (should start with `https://res.cloudinary.com/`)
- Check if CORS is blocking the image (should not be an issue with Cloudinary)
- Verify `res.cloudinary.com` is in your `next.config.ts` remote patterns

## 📱 **Cloudinary Features You Now Have**

### **Automatic Image Optimization**
- Images are automatically resized to 1920x1080
- Quality is optimized automatically
- Format is converted to best format (WebP, AVIF, etc.)

### **CDN Delivery**
- Images load fast worldwide
- Automatic caching
- No server bandwidth usage

### **Image Management**
- All images stored in organized folders
- Easy to manage from Cloudinary dashboard
- Can delete old images to save space

## 💰 **Pricing Information**

### **Free Tier (Forever Free)**
- 25GB storage
- 25GB bandwidth per month
- 25GB transformations per month
- Perfect for small to medium projects

### **Paid Plans**
- **Advanced**: $89/month - 225GB storage, 225GB bandwidth
- **Custom**: Contact sales for enterprise needs

## 🔄 **Migration from Local Uploads**

### **What Happens to Old Images?**
- Old local images will continue to work
- New uploads go to Cloudinary
- You can gradually migrate old images if needed

### **Benefits of Migration**
- ✅ No more 500 errors
- ✅ Better performance
- ✅ Automatic optimization
- ✅ Professional image hosting
- ✅ Works in any production environment

## 📞 **Need Help?**

1. **Check Cloudinary Status**: [status.cloudinary.com](https://status.cloudinary.com)
2. **Cloudinary Documentation**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
3. **Test your credentials**: Use the diagnostic endpoint `/api/debug-cloudinary`
4. **Check environment setup**: Use `/api/debug-env` for general environment info

## 🎉 **You're All Set!**

Once you complete these steps:
- Your image uploads will work in production
- No more file system permission errors
- Professional image hosting with optimization
- Scalable solution for your growing needs

**Happy uploading! 🚀**
