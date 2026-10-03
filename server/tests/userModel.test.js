/**
 * Test Suite: User Model Verification
 * Tests schema attributes, validations, defaults, security configurations, and methods
 */

const assert = require('assert');

// Try requiring dependencies or give clear instructions
let mongoose;
let User;
let bcrypt;

try {
  mongoose = require('mongoose');
  bcrypt = require('bcryptjs');
  User = require('../models/User');
} catch (err) {
  console.log('Dependencies not yet installed in local node_modules: ' + err.message);
}

async function runTests() {
  console.log('========================================');
  console.log(' Running Tests for [Auth] User Model    ');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (error) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    ${error.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (error) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    ${error.message}`);
      failed++;
    }
  }

  if (!User) {
    console.log('Note: Run "npm install" inside the server directory to install mongoose and bcryptjs before running node tests/userModel.test.js.');
    return;
  }

  // 1. Schema Fields & Types
  test('User schema has name field of type String and required', () => {
    const namePath = User.schema.path('name');
    assert(namePath, 'Field "name" should exist on User schema');
    assert.strictEqual(namePath.instance, 'String', 'name should be of type String');
    assert(namePath.isRequired, 'name should be required');
  });

  test('User schema has email field of type String, required, and lowercase', () => {
    const emailPath = User.schema.path('email');
    assert(emailPath, 'Field "email" should exist on User schema');
    assert.strictEqual(emailPath.instance, 'String', 'email should be of type String');
    assert(emailPath.isRequired, 'email should be required');
    assert(emailPath.options.lowercase, 'email should have lowercase option');
    assert(emailPath.options.unique, 'email should have unique constraint');
  });

  test('User schema has mobile field with sparse index option', () => {
    const mobilePath = User.schema.path('mobile');
    assert(mobilePath, 'Field "mobile" should exist on User schema');
    assert.strictEqual(mobilePath.instance, 'String', 'mobile should be of type String');
    assert(mobilePath.options.sparse, 'mobile should have sparse option');
  });

  test('User schema has password field of type String, required, and select: false', () => {
    const passwordPath = User.schema.path('password');
    assert(passwordPath, 'Field "password" should exist on User schema');
    assert.strictEqual(passwordPath.instance, 'String', 'password should be of type String');
    assert(passwordPath.isRequired, 'password should be required');
    assert.strictEqual(passwordPath.options.select, false, 'password should have select: false for security');
  });

  test('User schema has role field with enum ["customer", "admin"] and default "customer"', () => {
    const rolePath = User.schema.path('role');
    assert(rolePath, 'Field "role" should exist on User schema');
    assert.strictEqual(rolePath.instance, 'String', 'role should be of type String');
    assert.deepStrictEqual(rolePath.enumValues, ['customer', 'admin'], 'role should only allow customer and admin');
    assert.strictEqual(rolePath.defaultValue, 'customer', 'role default value should be customer');
  });

  test('User schema has isEmailVerified with default false', () => {
    const isEmailVerified = User.schema.path('isEmailVerified');
    assert(isEmailVerified, 'Field "isEmailVerified" should exist on User schema');
    assert.strictEqual(isEmailVerified.instance, 'Boolean', 'isEmailVerified should be Boolean');
    assert.strictEqual(isEmailVerified.defaultValue, false, 'isEmailVerified default should be false');
  });

  test('User schema has isMobileVerified with default false', () => {
    const isMobileVerified = User.schema.path('isMobileVerified');
    assert(isMobileVerified, 'Field "isMobileVerified" should exist on User schema');
    assert.strictEqual(isMobileVerified.instance, 'Boolean', 'isMobileVerified should be Boolean');
    assert.strictEqual(isMobileVerified.defaultValue, false, 'isMobileVerified default should be false');
  });

  test('User schema has profileImage of type String with default empty string', () => {
    const profileImagePath = User.schema.path('profileImage');
    assert(profileImagePath, 'Field "profileImage" should exist on User schema');
    assert.strictEqual(profileImagePath.instance, 'String', 'profileImage should be String');
    assert.strictEqual(profileImagePath.defaultValue, '', 'profileImage default should be empty string');
  });

  test('User schema has timestamps enabled (createdAt and updatedAt)', () => {
    assert(User.schema.options.timestamps, 'Timestamps option should be enabled');
  });

  test('User schema has matchPassword method defined on methods', () => {
    assert(typeof User.prototype.matchPassword === 'function', 'matchPassword method should exist on prototype');
  });

  // 2. Validation Tests (In-memory document validation without DB connection)
  test('Validation fails when required fields are missing', () => {
    const emptyUser = new User({});
    const error = emptyUser.validateSync();
    assert(error, 'validateSync should return errors for empty user');
    assert(error.errors.name, 'name error should be present');
    assert(error.errors.email, 'email error should be present');
    assert(error.errors.password, 'password error should be present');
  });

  test('Validation fails for invalid email format', () => {
    const invalidUser = new User({
      name: 'Test User',
      email: 'not-an-email',
      password: 'password123',
    });
    const error = invalidUser.validateSync();
    assert(error, 'validateSync should return errors for invalid email');
    assert(error.errors.email, 'email error should be present');
  });

  test('Validation fails for invalid role value', () => {
    const invalidRoleUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'superadmin',
    });
    const error = invalidRoleUser.validateSync();
    assert(error, 'validateSync should return errors for invalid role');
    assert(error.errors.role, 'role error should be present');
  });

  test('Validation passes for valid user document', () => {
    const validUser = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '+91 9876543210',
      password: 'securePassword123',
      role: 'customer',
    });
    const error = validUser.validateSync();
    assert.strictEqual(error, undefined, 'Valid user should not produce validation errors');
    assert.strictEqual(validUser.isEmailVerified, false);
    assert.strictEqual(validUser.isMobileVerified, false);
    assert.strictEqual(validUser.role, 'customer');
  });

  // 3. Password Hashing and Comparison Tests
  await asyncTest('matchPassword method correctly verifies hashed passwords', async () => {
    const plainPassword = 'SecretPassword123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const userInstance = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: hashedPassword,
    });

    const isMatch = await userInstance.matchPassword(plainPassword);
    const isWrongMatch = await userInstance.matchPassword('WrongPassword123');

    assert.strictEqual(isMatch, true, 'matchPassword should return true for correct password');
    assert.strictEqual(isWrongMatch, false, 'matchPassword should return false for incorrect password');
  });

  console.log('\n----------------------------------------');
  console.log(` Summary: ${passed} passed, ${failed} failed`);
  console.log('----------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
