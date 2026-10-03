import assert from 'node:assert';
import mongoose from 'mongoose';
import User from '../models/User.js';

console.log('--- Starting CarBazaar User Model Validation Test Suite ---');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ PASS: ${testName}`);
    passedTests++;
  } catch (error) {
    console.error(`✗ FAIL: ${testName}`);
    console.error(error);
  }
}

// TEST 1: Valid Customer User Document
runTest('Should successfully validate a valid customer user document', () => {
  const validData = {
    name: 'Pradnya Patil',
    email: 'pradnya@carbazaar.com',
    mobile: '+919876543210',
    password: 'SecurePassword123!',
    role: 'customer'
  };

  const user = new User(validData);
  const error = user.validateSync();
  assert.strictEqual(error, undefined, 'Valid user should not produce validation errors');
  assert.strictEqual(user.isEmailVerified, false, 'isEmailVerified should default to false');
  assert.strictEqual(user.isMobileVerified, false, 'isMobileVerified should default to false');
  assert.strictEqual(user.role, 'customer', 'role should default to customer');
});

// TEST 2: Valid Admin User Document
runTest('Should successfully validate a valid admin user document', () => {
  const adminData = {
    name: 'CarBazaar Admin',
    email: 'admin@carbazaar.com',
    mobile: '+919822334455',
    password: 'AdminPassword123!',
    role: 'admin'
  };

  const user = new User(adminData);
  const error = user.validateSync();
  assert.strictEqual(error, undefined, 'Valid admin should pass validation');
  assert.strictEqual(user.role, 'admin');
});

// TEST 3: Missing Required Fields
runTest('Should fail validation when required fields are missing', () => {
  const emptyUser = new User({});
  const error = emptyUser.validateSync();

  assert.ok(error, 'Validation error should be raised');
  assert.ok(error.errors.name, 'Name should be required');
  assert.ok(error.errors.email, 'Email should be required');
  assert.ok(error.errors.mobile, 'Mobile should be required');
  assert.ok(error.errors.password, 'Password should be required');
});

// TEST 4: Invalid Email Formats
runTest('Should reject invalid email formats', () => {
  const invalidEmails = [
    'plainaddress',
    'missing@domain',
    '@nodomain.com',
    'spaces in@email.com'
  ];

  invalidEmails.forEach((email) => {
    const user = new User({
      name: 'Test User',
      email,
      mobile: '+919876543210',
      password: 'ValidPassword123!'
    });
    const error = user.validateSync();
    assert.ok(error?.errors?.email, `Email "${email}" should fail validation`);
  });
});

// TEST 5: Invalid Mobile Formats
runTest('Should reject invalid mobile formats', () => {
  const invalidMobiles = [
    '123',
    'abcd123456',
    '000-000-0000',
    '+0123'
  ];

  invalidMobiles.forEach((mobile) => {
    const user = new User({
      name: 'Test User',
      email: 'valid@carbazaar.com',
      mobile,
      password: 'ValidPassword123!'
    });
    const error = user.validateSync();
    assert.ok(error?.errors?.mobile, `Mobile "${mobile}" should fail validation`);
  });
});

// TEST 6: Role Enum Enforcement
runTest('Should reject unauthorized user roles', () => {
  const unauthorizedRoles = ['superadmin', 'guest', 'dealer', 'moderator'];

  unauthorizedRoles.forEach((role) => {
    const user = new User({
      name: 'Role Test',
      email: 'role@carbazaar.com',
      mobile: '+919876543210',
      password: 'ValidPassword123!',
      role
    });
    const error = user.validateSync();
    assert.ok(error?.errors?.role, `Role "${role}" should fail enum validation`);
  });
});

// TEST 7: Short Password Rejection
runTest('Should reject passwords shorter than 8 characters', () => {
  const user = new User({
    name: 'Short Pass',
    email: 'shortpass@carbazaar.com',
    mobile: '+919876543210',
    password: 'short'
  });
  const error = user.validateSync();
  assert.ok(error?.errors?.password, 'Password under 8 characters should fail validation');
});

// TEST 8: Password and Version Sanitization via toJSON
runTest('Should strip password and __v in toJSON serialization', () => {
  const user = new User({
    name: 'Security Test',
    email: 'secure@carbazaar.com',
    mobile: '+919876543210',
    password: 'SuperSecretPassword!',
    role: 'customer'
  });

  const json = user.toJSON();
  assert.strictEqual(json.password, undefined, 'Password must never be exposed in toJSON');
  assert.strictEqual(json.__v, undefined, '__v should be stripped in toJSON');
  assert.strictEqual(json.email, 'secure@carbazaar.com');
  assert.strictEqual(json.role, 'customer');
});

console.log(`\n--- Test Summary: ${passedTests}/${totalTests} Tests Passed ---`);

if (passedTests === totalTests) {
  console.log('ALL CARBAZAAR USER MODEL TESTS PASSED SUCCESSFULLY! ✓');
  process.exit(0);
} else {
  console.error('SOME TESTS FAILED! ✗');
  process.exit(1);
}
