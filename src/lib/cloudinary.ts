import cloudinary from 'cloudinary';

// Validate and configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Only configure if all credentials are present
if (cloudName && apiKey && apiSecret) {
  cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  
  // Log configuration status (without exposing secrets)
  console.log('Cloudinary configured:', {
    cloudName,
    apiKeyConfigured: !!apiKey,
    apiSecretConfigured: !!apiSecret,
  });
} else {
  console.warn('Cloudinary not fully configured. Missing environment variables:', {
    cloudName: !cloudName ? 'MISSING' : 'OK',
    apiKey: !apiKey ? 'MISSING' : 'OK',
    apiSecret: !apiSecret ? 'MISSING' : 'OK',
  });
}

export default cloudinary.v2;
