/* eslint-disable */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const nodeModulesPath = path.join(__dirname, '../node_modules');
const pkgPath = path.join(nodeModulesPath, 'ledgerjs-hw-app-fio');
const tempPath = path.join(nodeModulesPath, '.temp-ledger-fio');

// Check if already installed
if (fs.existsSync(path.join(pkgPath, 'package.json'))) {
  console.log('ledgerjs-hw-app-fio already installed, skipping...');
  process.exit(0);
}

console.log('Installing ledgerjs-hw-app-fio from GitHub...');

// Create node_modules if it doesn't exist
if (!fs.existsSync(nodeModulesPath)) {
  fs.mkdirSync(nodeModulesPath, { recursive: true });
}

// Clone the repo to temp location
console.log('Cloning repository...');
execSync(
  `git clone --branch memo_hotfix --depth 1 https://github.com/vacuumlabs/ledger-fio.git "${tempPath}"`,
  { stdio: 'inherit' }
);

// Copy only the subdirectory we need
console.log('Extracting ledgerjs-fio subdirectory...');
const submodulePath = path.join(tempPath, 'ledgerjs-fio');

if (!fs.existsSync(submodulePath)) {
  throw new Error('ledgerjs-fio subdirectory not found in repository');
}

// Move subdirectory to node_modules
fs.renameSync(submodulePath, pkgPath);

// Clean up temp directory
fs.rmSync(tempPath, { recursive: true, force: true });

// Install dependencies
console.log('Installing dependencies in ledgerjs-hw-app-fio...');
execSync('npm i --legacy-peer-deps', { cwd: pkgPath, stdio: 'inherit' });

// Run prepublish
console.log('Running prepublish...');
execSync('npm run prepublish', { cwd: pkgPath, stdio: 'inherit' });

console.log('ledgerjs-hw-app-fio installed successfully!');
