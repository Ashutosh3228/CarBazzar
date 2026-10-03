/**
 * Zero-dependency Static Verification for User Model
 * Verifies that User.js contains all required fields, validations, constraints,
 * defaults, hooks, and methods as specified in CarBazaar documentation.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log(' Zero-Dependency Static Verification: User.js       ');
console.log('====================================================\n');

const userFilePath = path.join(__dirname, '../models/User.js');
assert(fs.existsSync(userFilePath), 'models/User.js must exist');

const content = fs.readFileSync(userFilePath, 'utf8');

let passed = 0;
let failed = 0;

function check(name, condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${message}`);
    failed++;
  }
}

// 1. Required dependencies
check('Requires mongoose', content.includes("require('mongoose')"), 'Must import mongoose');
check('Requires bcryptjs', content.includes("require('bcryptjs')"), 'Must import bcryptjs');

// 2. Documentation fields check (docs/06_DATABASE_DESIGN.md)
check('Contains "name" with required & trim', /name:\s*\{\s*type:\s*String,\s*required:/.test(content) && content.includes('trim: true'), 'name must be required String with trim');
check('Contains "email" with required, unique, lowercase, regex match', /email:\s*\{\s*type:\s*String,\s*required:/.test(content) && content.includes('unique: true') && content.includes('lowercase: true') && content.includes('match:'), 'email must be unique, lowercase, required, validated');
check('Contains "mobile" with sparse index', /mobile:\s*\{[\s\S]*?sparse:\s*true/.test(content), 'mobile must support sparse unique/optional indexing');
check('Contains "password" with select: false for security', /password:\s*\{\s*type:\s*String,\s*required:/.test(content) && content.includes('select: false'), 'password must be hidden by default');
check('Contains "role" with enum ["customer", "admin"]', content.includes("'customer'") && content.includes("'admin'") && /default:\s*'customer'/.test(content), 'role must support customer and admin with default customer');
check('Contains "isEmailVerified" default false', /isEmailVerified:\s*\{\s*type:\s*Boolean,\s*default:\s*false/.test(content), 'isEmailVerified must default to false');
check('Contains "isMobileVerified" default false', /isMobileVerified:\s*\{\s*type:\s*Boolean,\s*default:\s*false/.test(content), 'isMobileVerified must default to false');
check('Contains "profileImage" default empty string', /profileImage:\s*\{\s*type:\s*String,\s*default:\s*''/.test(content), 'profileImage must be String defaulting to empty string');
check('Enables timestamps (createdAt, updatedAt)', /timestamps:\s*true/.test(content), 'Schema must enable timestamps: true');

// 3. Security hooks & methods (docs/14_SECURITY_REQUIREMENTS.md)
check('Has pre-save hook for bcrypt password hashing', content.includes("userSchema.pre('save'") && content.includes('bcrypt.hash'), 'Must hash password in pre-save hook');
check('Has matchPassword method using bcrypt.compare', content.includes('userSchema.methods.matchPassword') && content.includes('bcrypt.compare'), 'Must provide matchPassword method');

// 4. Exports model
check('Exports Mongoose User model', content.includes("module.exports = User") && content.includes("mongoose.model('User'"), 'Must export mongoose model User');

console.log('\n----------------------------------------------------');
console.log(` Summary: ${passed} passed, ${failed} failed`);
console.log('----------------------------------------------------\n');

if (failed > 0) {
  process.exit(1);
}
