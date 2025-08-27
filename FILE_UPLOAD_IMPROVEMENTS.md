# File Upload Improvements

## Overview
The admin panel has been updated to support much larger image files through an intelligent chunked upload system.

## What Changed

### Before
- Maximum file size: 4MB
- All files uploaded directly to Cloudinary
- Large files would fail with "File too large" error

### After
- **Small files (≤4MB)**: Direct upload to Cloudinary (fast)
- **Large files (>4MB)**: Automatic chunked upload (up to 200MB)
- Intelligent file size detection and routing

## Technical Details

### File Size Limits
- **Individual chunk size**: 4MB (Vercel compatibility)
- **Maximum total file size**: 200MB
- **Automatic chunking**: Files larger than 4MB are automatically split and uploaded in chunks

### Upload Flow
1. **File Selection**: User selects an image file
2. **Size Check**: System checks if file is larger than 4MB
3. **Upload Method Selection**:
   - **Small files**: Direct Cloudinary upload
   - **Large files**: Chunked upload with progress tracking
4. **Completion**: File is available for use in the admin panel

### Supported Admin Components
- ✅ Project Manager
- ✅ Service Manager  
- ✅ Banner Manager
- ✅ Woods Manager

## Environment Variables

Update your `.env` file with these values:

```env
# File Upload Configuration
MAX_FILE_SIZE=4194304          # 4MB for direct uploads
MAX_CHUNK_SIZE=4194304        # 4MB per chunk
MAX_TOTAL_FILE_SIZE=209715200 # 200MB total file size limit
```

## Benefits

1. **No More File Size Errors**: Upload images up to 200MB
2. **Automatic Optimization**: System chooses the best upload method
3. **Progress Tracking**: See upload progress for large files
4. **Production Ready**: Works reliably in production environments
5. **Backward Compatible**: Existing functionality unchanged

## Usage

### For Users
- Simply select your image file as before
- Large files will automatically use chunked upload
- Progress will be shown during upload
- No additional configuration needed

### For Developers
- The system automatically detects file size
- Chunked uploads use the `/api/upload-chunked` endpoint
- Direct uploads use the `/api/upload-image-cloudinary` endpoint
- All upload logic is centralized in the `ChunkedUploader` utility class

## Troubleshooting

### Common Issues
1. **Upload Still Fails**: Check your environment variables are set correctly
2. **Chunked Upload Slow**: This is normal for large files, progress will be shown
3. **File Not Appearing**: Check browser console for error messages

### Debug Information
- Upload progress is logged to browser console
- Chunk completion events are tracked
- File size information is displayed in success messages

## Production Notes

- Vercel's 4.5MB per-request limit is respected
- Chunked uploads are optimized for production environments
- File size limits can be adjusted via environment variables
- All uploads are logged for debugging purposes
