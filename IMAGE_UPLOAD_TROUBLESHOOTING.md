# Image Upload Troubleshooting Guide

## 🚨 Problem: 500 Error When Uploading Images in Production

If you're getting a 500 error when trying to upload images in production, this guide will help you diagnose and fix the issue.

## 🔍 Quick Diagnosis

### 1. Test the Debug Endpoint
Visit `/api/debug-env` in your production app to see:
- File system permissions
- Directory access
- Environment information

### 2. Check Browser Console
Look for detailed error messages in the browser's developer console.

### 3. Check Server Logs
Look for error messages in your production server logs.

## 🛠️ Common Solutions

### Solution 1: File System Permissions
**Problem**: The server doesn't have write permissions to the upload directories.

**Fix**:
```bash
# On Linux/Mac servers
chmod 755 public/
chmod 755 public/assets/
chmod 755 public/uploads/
chmod 755 tmp/

# On Windows servers
# Ensure the application has write access to the directories
```

### Solution 2: Directory Creation
**Problem**: Upload directories don't exist.

**Fix**: The updated code now automatically creates directories, but ensure the base `public` directory exists.

### Solution 3: Container/Cloud Platform Issues
**Problem**: Running in Docker, Vercel, Netlify, or similar platforms with read-only file systems.

**Solutions**:
- **Docker**: Mount a volume for uploads
- **Vercel**: Use Vercel Blob or external storage
- **Netlify**: Use external storage service
- **Heroku**: Use external storage service

## 🧪 Testing Steps

### Step 1: Run Debug Script
```bash
node debug-production.js
```

### Step 2: Test API Endpoint
```bash
curl -X GET https://yourdomain.com/api/debug-env
```

### Step 3: Test File Upload
Try uploading a small image file (< 1MB) to see if the issue is file size related.

## 🔧 Alternative Solutions

### Option 1: Use Cloud Storage
Instead of local file storage, use:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Cloudinary
- Vercel Blob

### Option 2: Database Storage
Store images as base64 strings in your MongoDB database (for small images only).

### Option 3: External Upload Service
Use services like:
- ImgBB
- Imgur API
- PostImage

## 📋 Production Checklist

- [ ] File system has write permissions
- [ ] Upload directories exist and are writable
- [ ] File size limits are appropriate
- [ ] Error handling is comprehensive
- [ ] Logging is enabled for debugging
- [ ] CORS headers are configured correctly

## 🚀 Deployment Considerations

### Vercel
- File uploads don't persist between deployments
- Use Vercel Blob or external storage

### Netlify
- Serverless functions have read-only file systems
- Use external storage service

### Docker
- Ensure volumes are mounted correctly
- Check container user permissions

### Traditional VPS/Server
- Verify file permissions
- Check disk space
- Ensure proper user ownership

## 📞 Getting Help

If you're still having issues:

1. **Check the debug endpoint**: `/api/debug-env`
2. **Run the debug script**: `node debug-production.js`
3. **Check server logs** for specific error messages
4. **Verify your deployment platform** and its limitations
5. **Consider switching to cloud storage** for production

## 🔄 Recent Updates

The image upload system has been updated with:
- ✅ Multiple fallback upload locations
- ✅ Better error handling and messages
- ✅ File size validation
- ✅ Permission checking
- ✅ Comprehensive logging
- ✅ CORS configuration

## 📝 Example Error Messages

- **"Server file system permission error"** → Check file permissions
- **"Server directory creation failed"** → Check directory access
- **"All upload locations are inaccessible"** → Consider cloud storage
- **"File too large"** → Reduce file size or increase limits
