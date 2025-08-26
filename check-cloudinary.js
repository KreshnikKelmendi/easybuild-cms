// Check Cloudinary Configuration
// Run this script to verify your Cloudinary setup

// Note: This script checks environment variables that should be set in your production environment

console.log('🔍 Checking Cloudinary Configuration...\n');

const requiredVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET'
];

let allConfigured = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== 'your_cloud_name_here' && value !== 'your_api_key_here' && value !== 'your_api_secret_here') {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: Not configured or using placeholder value`);
    allConfigured = false;
  }
});

console.log('\n📋 Summary:');
if (allConfigured) {
  console.log('✅ All Cloudinary environment variables are properly configured!');
  console.log('🚀 Your image uploads should work in production.');
} else {
  console.log('❌ Some Cloudinary environment variables are missing or using placeholder values.');
  console.log('\n🔧 To fix this:');
  console.log('1. Go to your Cloudinary Dashboard');
  console.log('2. Copy your Cloud Name, API Key, and API Secret');
  console.log('3. Add them to your .env file or production environment variables');
  console.log('4. Make sure they are NOT the placeholder values from env-template.txt');
}

console.log('\n🌐 Current NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('📁 Current working directory:', process.cwd());
