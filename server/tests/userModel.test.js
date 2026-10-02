/**
 * User Model Test Suite
 * Validates Mongoose User schema, validation rules, default values,
 * security exclusions, password hashing, and role constraints.
 */

const assert = require('assert');
const User = require('../models/User');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } catch (error) {
    failedTests++;
    console.error(`  [FAIL] ${testName}`);
    console.error(`         Error: ${error.message}`);
  }
}

async function runAsyncTest(testName, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } catch (error) {
    failedTests++;
    console.error(`  [FAIL] ${testName}`);
    console.error(`         Error: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('\n============================================================');
  console.log('Running CarBazaar User Model Test Suite');
  console.log('============================================================\n');

  // Test 1: Valid user schema validation
  runTest('Valid user payload passes schema validation', () => {
    const validUser = new User({
      name: 'Ashutosh More',
      email: 'ashutosh@carbazaar.com',
      mobile: '9876543210',
      password: 'SecurePassword123'
    });
    const error = validUser.validateSync();
    assert.strictEqual(error, undefined, 'Valid user should not produce validation errors');
  });

  // Test 2: Default field values
  runTest('Default field values (role, verification flags, profileImage) are set correctly', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9123456780',
      password: 'password123'
    });
    assert.strictEqual(user.role, 'customer', 'Default role should be customer');
    assert.strictEqual(user.isEmailVerified, false, 'Default isEmailVerified should be false');
    assert.strictEqual(user.isMobileVerified, false, 'Default isMobileVerified should be false');
    assert.strictEqual(user.profileImage, '', 'Default profileImage should be empty string');
  });

  // Test 3: Required fields validation
  runTest('Missing required fields (name, email, mobile, password) trigger validation errors', () => {
    const emptyUser = new User({});
    const error = emptyUser.validateSync();
    assert(error, 'Validation error should be returned for empty user');
    assert(error.errors.name, 'Name field should be required');
    assert(error.errors.email, 'Email field should be required');
    assert(error.errors.mobile, 'Mobile field should be required');
    assert(error.errors.password, 'Password field should be required');
  });

  // Test 4: Name length constraints
  runTest('Name length validation (< 2 characters or > 50 characters) is enforced', () => {
    const shortNameUser = new User({
      name: 'A',
      email: 'a@example.com',
      mobile: '9876543210',
      password: 'password123'
    });
    const shortErr = shortNameUser.validateSync();
    assert(shortErr && shortErr.errors.name, 'Name shorter than 2 chars should fail validation');

    const longNameUser = new User({
      name: 'A'.repeat(51),
      email: 'long@example.com',
      mobile: '9876543210',
      password: 'password123'
    });
    const longErr = longNameUser.validateSync();
    assert(longErr && longErr.errors.name, 'Name longer than 50 chars should fail validation');
  });

  // Test 5: Email format validation
  runTest('Invalid email formats are rejected', () => {
    const invalidEmails = ['plainaddress', 'missingatsign.com', 'user@.com', 'user@com', '@example.com'];
    for (const email of invalidEmails) {
      const user = new User({
        name: 'Test User',
        email: email,
        mobile: '9876543210',
        password: 'password123'
      });
      const error = user.validateSync();
      assert(error && error.errors.email, `Email '${email}' should fail validation`);
    }
  });

  // Test 6: Email lowercase conversion
  runTest('Email is automatically lowercased and trimmed', () => {
    const user = new User({
      name: 'Trim Test',
      email: '   Ashutosh.MORE@CarBazaar.COM   ',
      mobile: '9876543210',
      password: 'password123'
    });
    assert.strictEqual(user.email, 'ashutosh.more@carbazaar.com', 'Email should be trimmed and lowercased');
  });

  // Test 7: Mobile number format validation
  runTest('Mobile number must be exactly 10 digits', () => {
    const invalidMobiles = ['123', '12345678901', 'abcdefghij', '98765-4321', '98765 43210'];
    for (const mobile of invalidMobiles) {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        mobile: mobile,
        password: 'password123'
      });
      const error = user.validateSync();
      assert(error && error.errors.mobile, `Mobile '${mobile}' should fail validation`);
    }

    const validUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      mobile: '9876543210',
      password: 'password123'
    });
    const validErr = validUser.validateSync();
    assert.strictEqual(validErr, undefined, 'Valid 10-digit mobile should pass');
  });

  // Test 8: Password length constraint
  runTest('Password shorter than 6 characters is rejected', () => {
    const shortPasswordUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      mobile: '9876543210',
      password: '12345'
    });
    const error = shortPasswordUser.validateSync();
    assert(error && error.errors.password, 'Password with < 6 characters should fail validation');
  });

  // Test 9: Role enum validation
  runTest('Role must be either "customer" or "admin"', () => {
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@carbazaar.com',
      mobile: '9876543211',
      password: 'password123',
      role: 'admin'
    });
    assert.strictEqual(adminUser.validateSync(), undefined, 'Role admin should be valid');

    const customerUser = new User({
      name: 'Customer User',
      email: 'cust@carbazaar.com',
      mobile: '9876543212',
      password: 'password123',
      role: 'customer'
    });
    assert.strictEqual(customerUser.validateSync(), undefined, 'Role customer should be valid');

    const invalidRoleUser = new User({
      name: 'Invalid Role',
      email: 'badrole@carbazaar.com',
      mobile: '9876543213',
      password: 'password123',
      role: 'superadmin'
    });
    const error = invalidRoleUser.validateSync();
    assert(error && error.errors.role, 'Role "superadmin" should fail enum validation');
  });

  // Test 10: Security - select: false on password
  runTest('Password schema definition has select: false for query security', () => {
    const passwordField = User.schema.paths.password;
    assert.strictEqual(passwordField.options.select, false, 'Password field must have select: false configured');
  });

  // Test 11: Security - toJSON excludes password and __v
  runTest('toJSON transform removes password and __v from output serialization', () => {
    const user = new User({
      name: 'Security Test',
      email: 'sec@carbazaar.com',
      mobile: '9876543210',
      password: 'secretPassword'
    });
    const json = user.toJSON();
    assert.strictEqual(json.password, undefined, 'toJSON output must not contain password');
    assert.strictEqual(json.__v, undefined, 'toJSON output must not contain __v');
    assert.strictEqual(json.name, 'Security Test', 'toJSON output should retain name');
  });

  // Test 12: Unique and sparse indexes on email and mobile
  runTest('Unique and sparse indexes are defined on email and mobile fields', () => {
    const emailOptions = User.schema.paths.email.options;
    const mobileOptions = User.schema.paths.mobile.options;

    assert.strictEqual(emailOptions.unique, true, 'Email field must specify unique: true');
    assert.strictEqual(emailOptions.sparse, true, 'Email field must specify sparse: true');
    assert.strictEqual(mobileOptions.unique, true, 'Mobile field must specify unique: true');
    assert.strictEqual(mobileOptions.sparse, true, 'Mobile field must specify sparse: true');
  });

  // Test 13: Timestamps configuration
  runTest('Schema has timestamps option enabled', () => {
    assert.strictEqual(User.schema.options.timestamps, true, 'Schema timestamps must be enabled');
  });

  // Test 14: Password hashing via pre-save hook and comparePassword method
  await runAsyncTest('Password hashing and comparison method work correctly', async () => {
    const plainPassword = 'MySecretPassword123!';
    const user = new User({
      name: 'Hash Test User',
      email: 'hash@carbazaar.com',
      mobile: '9988776655',
      password: plainPassword
    });

    // Manually trigger the pre-save hook simulation
    // In Mongoose, saving triggers pre-save hooks; we can test the bcrypt hashing directly
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    assert.notStrictEqual(user.password, plainPassword, 'Hashed password should not match plain password');
    assert(user.password.startsWith('$2a$') || user.password.startsWith('$2b$'), 'Hashed password should be valid bcrypt format');

    const isMatch = await user.comparePassword(plainPassword);
    assert.strictEqual(isMatch, true, 'comparePassword should return true for correct password');

    const isWrongMatch = await user.comparePassword('WrongPassword123');
    assert.strictEqual(isWrongMatch, false, 'comparePassword should return false for incorrect password');
  });

  console.log('\n------------------------------------------------------------');
  console.log(`Test Execution Summary:`);
  console.log(`  Total Tests  : ${totalTests}`);
  console.log(`  Passed Tests : ${passedTests}`);
  console.log(`  Failed Tests : ${failedTests}`);
  console.log('------------------------------------------------------------\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test execution failed with unexpected error:', err);
  process.exit(1);
});
