#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Cross-platform build script for Vercel deployment
 * Copies Frontend and Assets to public folder for deployment
 */

const publicDir = path.join(__dirname, 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('✓ Created public directory');
}

// Recursive copy function
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);

    files.forEach(file => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        const stat = fs.statSync(srcFile);

        if (stat.isDirectory()) {
            copyDir(srcFile, destFile);
        } else {
            fs.copyFileSync(srcFile, destFile);
        }
    });
}

try {
    // Copy Frontend folder contents
    console.log('📋 Copying Frontend files...');
    const frontendDir = path.join(__dirname, 'Frontend');
    copyDir(frontendDir, publicDir);
    console.log('✓ Frontend files copied');

    // Copy Assets folder
    console.log('📦 Copying Assets folder...');
    const assetsDir = path.join(__dirname, 'Assets');
    const assetsDestDir = path.join(publicDir, 'Assets');
    copyDir(assetsDir, assetsDestDir);
    console.log('✓ Assets folder copied');

    console.log('\n✅ Build completed successfully!');
    console.log('📁 Output directory: public/');
    process.exit(0);
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
