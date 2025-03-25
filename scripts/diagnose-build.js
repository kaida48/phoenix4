const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// First fix the working directory to be the project root
// The script is in scripts/ subfolder but we need paths relative to project root
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

console.log('Phoenix Roleplay Diagnostic Tool');
console.log('===============================');
console.log(`Running from directory: ${process.cwd()}`);

// Check for common issues
console.log('\n🔍 Checking for common issues...');

// Check Next.js version
console.log('\n📦 Checking Next.js version:');
try {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`Installed Next.js version: ${packageJson.dependencies.next}`);
    console.log(`React version: ${packageJson.dependencies.react}`);
    console.log(`React DOM version: ${packageJson.dependencies["react-dom"]}`);
    
    // Check compatibility
    if (packageJson.dependencies.next.startsWith('15') && 
        !packageJson.dependencies.react.startsWith('19')) {
      console.log('⚠️  WARNING: Next.js 15 requires React 19. You should update your React version.');
    }
  } else {
    console.log(`❌ package.json not found at: ${packageJsonPath}`);
  }
} catch (e) {
  console.log('❌ Error reading package.json:', e.message);
}

// Check for syntax errors in problematic files
console.log('\n🔎 Checking for syntax errors in specific files:');
const filesToCheck = [
  path.join(projectRoot, 'src/app/admin/users/[id]/page.tsx'),
  path.join(projectRoot, 'src/app/admin/characters/pending/page.tsx')
];

filesToCheck.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      console.log(`Checking ${path.relative(projectRoot, file)}...`);
      const content = fs.readFileSync(file, 'utf8');
      // Look for common JSX errors
      const openTags = (content.match(/<[a-zA-Z][^\/> ]*[^>]*>/g) || []).length;
      const closeTags = (content.match(/<\/[a-zA-Z][^>]*>/g) || []).length;
      
      if (openTags !== closeTags) {
        console.log(`⚠️  WARNING: Potential unclosed JSX tags in ${path.basename(file)}. Found ${openTags} opening tags and ${closeTags} closing tags.`);
      } else {
        console.log(`✓ ${path.basename(file)} has balanced JSX tags.`);
      }
    } else {
      console.log(`⚠️ File not found: ${path.relative(projectRoot, file)}`);
    }
  } catch (e) {
    console.log(`❌ Error checking ${path.basename(file)}:`, e.message);
  }
});

// Check for TurboCache issues
console.log('\n🔄 Checking TurboCache:');
const turboCacheDir = path.join(projectRoot, '.next/cache');
try {
  if (fs.existsSync(turboCacheDir)) {
    console.log('TurboCache exists. Clearing it might help with build issues.');
    console.log('Run: rm -rf .next/cache');
  } else {
    console.log('No TurboCache directory found.');
  }
} catch (e) {
  console.log('Error checking TurboCache:', e.message);
}

// Check environment variables
console.log('\n🔐 Checking environment variables:');
try {
  const envPath = path.join(projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    console.log('✓ .env file exists');
    // Check for essential variables without displaying their values
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        console.log(`✓ ${varName} is defined`);
      } else {
        console.log(`❌ Missing required env var: ${varName}`);
      }
    });
  } else {
    console.log('❌ No .env file found');
  }
} catch (e) {
  console.log('Error checking environment variables:', e.message);
}

// Check directory structure
console.log('\n📁 Checking directory structure:');
const criticalDirs = [
  path.join(projectRoot, 'src/app'),
  path.join(projectRoot, 'src/components'),
  path.join(projectRoot, 'src/lib'),
];

criticalDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✓ ${path.relative(projectRoot, dir)} exists`);
  } else {
    console.log(`❌ Critical directory missing: ${path.relative(projectRoot, dir)}`);
  }
});

// Check the batch file itself
console.log('\n📄 Checking batch file:');
const diagnoseBatPath = path.join(projectRoot, 'scripts/diagnose.bat');
try {
  if (fs.existsSync(diagnoseBatPath)) {
    const batContent = fs.readFileSync(diagnoseBatPath, 'utf8');
    console.log('Batch file content:');
    console.log(batContent);
    
    // Check if the batch file is using correct paths
    if (batContent.includes('cd "%~dp0"')) {
      console.log('⚠️ Warning: The batch file changes directory to the script directory, which might cause path issues');
      console.log('Consider updating it to: cd "%~dp0\\.."');
    }
  } else {
    console.log('❌ diagnose.bat not found');
  }
} catch (e) {
  console.log('Error checking batch file:', e.message);
}

console.log('\n✅ Diagnostic check complete!');
console.log('\nSuggested fixes:');
console.log('1. Run `rm -rf .next` to clear Next.js build cache');
console.log('2. Fix any syntax errors in your components');
console.log('3. Check all JSX tags are properly closed');
console.log('4. Run `npm run dev --turbopack` to start development with Turbopack');
