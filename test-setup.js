const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Chat App Setup...\n');

// Check if all required files exist
const requiredFiles = [
  'backend/package.json',
  'backend/src/main.ts',
  'backend/src/app.module.ts',
  'backend/src/chat/chat.gateway.ts',
  'backend/src/chat/chat.service.ts',
  'backend/prisma/schema.prisma',
  'backend/ecosystem.config.js',
  'backend/Dockerfile',
  'frontend/package.json',
  'frontend/src/App.js',
  'frontend/src/index.js',
  'frontend/Dockerfile',
  'frontend/nginx.conf',
  'docker-compose.yml',
  'README.md'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n✅ All required files are present!');
} else {
  console.log('\n❌ Some files are missing. Please check the setup.');
  process.exit(1);
}

// Check if .env file exists
console.log('\n🔧 Checking environment configuration...');
if (fs.existsSync(path.join(__dirname, 'backend/.env'))) {
  console.log('✅ Backend .env file exists');
} else {
  console.log('⚠️  Backend .env file missing - you need to create it with your MongoDB Atlas connection string');
}

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
const backendPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/package.json'), 'utf8'));
const frontendPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'frontend/package.json'), 'utf8'));

const requiredBackendDeps = ['@nestjs/common', '@nestjs/websockets', 'socket.io', '@prisma/client'];
const requiredFrontendDeps = ['react', 'socket.io-client'];

console.log('Backend dependencies:');
requiredBackendDeps.forEach(dep => {
  if (backendPackage.dependencies[dep]) {
    console.log(`✅ ${dep}@${backendPackage.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
  }
});

console.log('\nFrontend dependencies:');
requiredFrontendDeps.forEach(dep => {
  if (frontendPackage.dependencies[dep]) {
    console.log(`✅ ${dep}@${frontendPackage.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
  }
});

console.log('\n🎉 Setup verification complete!');
console.log('\n📋 Next steps:');
console.log('1. Create a .env file in the backend directory with your MongoDB Atlas connection string');
console.log('2. Run: docker-compose up --build');
console.log('3. Open http://localhost:3001 in your browser');
console.log('4. Test the real-time chat functionality');

