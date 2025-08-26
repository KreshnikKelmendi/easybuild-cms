#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Production Environment Debug Script');
console.log('=====================================\n');

// Environment info
console.log('📋 Environment Information:');
console.log(`  Node.js version: ${process.version}`);
console.log(`  Platform: ${process.platform}`);
console.log(`  Architecture: ${process.arch}`);
console.log(`  Current working directory: ${process.cwd()}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'not set'}\n`);

// Test directories
const testDirs = [
  'public',
  'public/assets',
  'public/uploads',
  'tmp'
];

console.log('📁 Directory Tests:');
for (const dir of testDirs) {
  const fullPath = path.join(process.cwd(), dir);
  
  try {
    const exists = fs.existsSync(fullPath);
    console.log(`  ${dir}:`);
    console.log(`    Full path: ${fullPath}`);
    console.log(`    Exists: ${exists ? '✅ Yes' : '❌ No'}`);
    
    if (exists) {
      try {
        // Test read permission
        fs.accessSync(fullPath, fs.constants.R_OK);
        console.log(`    Readable: ✅ Yes`);
      } catch {
        console.log(`    Readable: ❌ No`);
      }
      
      try {
        // Test write permission
        fs.accessSync(fullPath, fs.constants.W_OK);
        console.log(`    Writable: ✅ Yes`);
      } catch {
        console.log(`    Writable: ❌ No`);
      }
    }
    
    // Try to create directory if it doesn't exist
    if (!exists) {
      try {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`    Created: ✅ Yes`);
        
        // Test if we can write to it
        const testFile = path.join(fullPath, 'test.txt');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log(`    Write test: ✅ Passed`);
      } catch (error) {
        console.log(`    Created: ❌ No (${error.message})`);
      }
    }
    
  } catch (error) {
    console.log(`  ${dir}: ❌ Error - ${error.message}`);
  }
  
  console.log('');
}

// Test file operations
console.log('📄 File Operation Tests:');
try {
  const testFile = path.join(process.cwd(), 'tmp', 'debug-test.txt');
  const testContent = `Debug test at ${new Date().toISOString()}`;
  
  fs.writeFileSync(testFile, testContent);
  console.log(`  Write file: ✅ Success`);
  
  const readContent = fs.readFileSync(testFile, 'utf8');
  console.log(`  Read file: ✅ Success`);
  console.log(`  Content: "${readContent}"`);
  
  fs.unlinkSync(testFile);
  console.log(`  Delete file: ✅ Success`);
  
} catch (error) {
  console.log(`  File operations: ❌ Failed - ${error.message}`);
}

console.log('\n✨ Debug script completed!');
console.log('\n💡 Next steps:');
console.log('  1. Check the output above for any ❌ failures');
console.log('  2. If directories are not writable, check file permissions');
console.log('  3. If running in Docker/container, ensure volumes are mounted correctly');
console.log('  4. If on Vercel/Netlify, consider using cloud storage instead of file system');
console.log('  5. Test the /api/debug-env endpoint in your production app');
