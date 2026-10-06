const assert = require('assert');
const Brand = require('../server/models/Brand');

async function runTests() {
  console.log('--- Running Brand Model Tests (Issue #48) ---\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  FAIL: ${name}`);
      console.error(`        Error: ${err.message}`);
      failed++;
    }
  }

  // Test 1: Valid Brand instance
  await test('Valid Brand instance passes schema validation', async () => {
    const brand = new Brand({
      name: 'Hyundai',
      logo: 'https://example.com/hyundai-logo.png',
      description: 'South Korean multinational automotive manufacturer',
      isActive: true
    });
    await brand.validate();
  });

  // Test 2: Missing required name
  await test('Missing name fails validation with required error message', async () => {
    const brand = new Brand({
      logo: 'https://example.com/logo.png'
    });
    try {
      await brand.validate();
      assert.fail('Expected validation error for missing name');
    } catch (error) {
      assert.ok(error.errors.name, 'Expected error on name field');
      assert.strictEqual(error.errors.name.message, 'Brand name is required');
    }
  });

  // Test 3: Name minimum length constraint
  await test('Name shorter than 2 characters fails minlength validation', async () => {
    const brand = new Brand({
      name: 'H'
    });
    try {
      await brand.validate();
      assert.fail('Expected validation error for short name');
    } catch (error) {
      assert.ok(error.errors.name, 'Expected error on name field');
      assert.strictEqual(error.errors.name.message, 'Brand name must be at least 2 characters');
    }
  });

  // Test 4: Name maximum length constraint
  await test('Name longer than 50 characters fails maxlength validation', async () => {
    const longName = 'A'.repeat(51);
    const brand = new Brand({
      name: longName
    });
    try {
      await brand.validate();
      assert.fail('Expected validation error for long name');
    } catch (error) {
      assert.ok(error.errors.name, 'Expected error on name field');
      assert.strictEqual(error.errors.name.message, 'Brand name cannot exceed 50 characters');
    }
  });

  // Test 5: Description maximum length constraint
  await test('Description longer than 500 characters fails maxlength validation', async () => {
    const longDesc = 'A'.repeat(501);
    const brand = new Brand({
      name: 'Toyota',
      description: longDesc
    });
    try {
      await brand.validate();
      assert.fail('Expected validation error for long description');
    } catch (error) {
      assert.ok(error.errors.description, 'Expected error on description field');
      assert.strictEqual(error.errors.description.message, 'Brand description cannot exceed 500 characters');
    }
  });

  // Test 6: Default values
  await test('Defaults are correctly applied (isActive = true, logo = "", description = "")', async () => {
    const brand = new Brand({
      name: 'Tata Motors'
    });
    assert.strictEqual(brand.isActive, true, 'isActive should default to true');
    assert.strictEqual(brand.logo, '', 'logo should default to empty string');
    assert.strictEqual(brand.description, '', 'description should default to empty string');
  });

  // Test 7: Trimming of name and description
  await test('Trimming whitespace from name and description', async () => {
    const brand = new Brand({
      name: '   Mahindra   ',
      description: '   Leading SUV manufacturer   '
    });
    assert.strictEqual(brand.name, 'Mahindra', 'name should be trimmed');
    assert.strictEqual(brand.description, 'Leading SUV manufacturer', 'description should be trimmed');
  });

  // Test 8: Timestamps schema option
  await test('Schema options include timestamps (createdAt, updatedAt)', async () => {
    assert.strictEqual(Brand.schema.options.timestamps, true, 'Timestamps option should be enabled');
  });

  // Test 9: Name unique index definition
  await test('Unique index is configured on name field', async () => {
    const namePath = Brand.schema.path('name');
    assert.strictEqual(namePath.options.unique, true, 'Name should have unique: true option');
  });

  console.log(`\n--- Test Summary: ${passed} passed, ${failed} failed ---\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
