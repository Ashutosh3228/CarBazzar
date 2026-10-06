const assert = require('assert');
const mongoose = require('mongoose');
const Notification = require('../server/models/Notification');
const {
  createNotification,
  notifyListingApproved,
  notifyListingRejected,
  notifyInquiryReceived
} = require('../server/utils/notificationHelper');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} = require('../server/controllers/notificationController');

async function runTests() {
  console.log('--- Running Notification Model & Feature Tests (Issue #50) ---\n');
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

  const dummyUserId = new mongoose.Types.ObjectId();
  const dummyCarId = new mongoose.Types.ObjectId();
  const dummyBuyerId = new mongoose.Types.ObjectId();

  // Test 1: Valid Notification instance passes validation
  await test('Valid Notification instance passes schema validation', async () => {
    const notification = new Notification({
      user: dummyUserId,
      type: 'listing_approved',
      title: 'Listing Approved',
      message: 'Your listing for Honda City has been approved.',
      data: { carId: dummyCarId }
    });
    await notification.validate();
  });

  // Test 2: Missing required user field fails
  await test('Missing recipient user fails validation with required error', async () => {
    const notification = new Notification({
      type: 'system',
      title: 'System Alert',
      message: 'System maintenance scheduled.'
    });
    try {
      await notification.validate();
      assert.fail('Expected validation error for missing user');
    } catch (error) {
      assert.ok(error.errors.user, 'Expected error on user field');
      assert.strictEqual(error.errors.user.message, 'User recipient ID is required');
    }
  });

  // Test 3: Missing required type field fails
  await test('Missing type fails validation with required error', async () => {
    const notification = new Notification({
      user: dummyUserId,
      title: 'Alert',
      message: 'Test message.'
    });
    try {
      await notification.validate();
      assert.fail('Expected validation error for missing type');
    } catch (error) {
      assert.ok(error.errors.type, 'Expected error on type field');
      assert.strictEqual(error.errors.type.message, 'Notification type is required');
    }
  });

  // Test 4: Invalid notification type fails enum validation
  await test('Invalid notification type fails enum validation', async () => {
    const notification = new Notification({
      user: dummyUserId,
      type: 'invalid_type_abc',
      title: 'Alert',
      message: 'Test message.'
    });
    try {
      await notification.validate();
      assert.fail('Expected enum validation error for invalid type');
    } catch (error) {
      assert.ok(error.errors.type, 'Expected error on type field');
      assert.ok(error.errors.type.message.includes('not a supported notification type'));
    }
  });

  // Test 5: Missing required title fails
  await test('Missing title fails validation with required error', async () => {
    const notification = new Notification({
      user: dummyUserId,
      type: 'inquiry_received',
      message: 'Someone sent an inquiry.'
    });
    try {
      await notification.validate();
      assert.fail('Expected validation error for missing title');
    } catch (error) {
      assert.ok(error.errors.title, 'Expected error on title field');
      assert.strictEqual(error.errors.title.message, 'Notification title is required');
    }
  });

  // Test 6: Title length limits
  await test('Title shorter than 2 chars or longer than 120 chars fails validation', async () => {
    const shortNotif = new Notification({
      user: dummyUserId,
      type: 'system',
      title: 'A',
      message: 'Valid message content.'
    });
    try {
      await shortNotif.validate();
      assert.fail('Expected minlength error');
    } catch (error) {
      assert.ok(error.errors.title, 'Expected minlength error on title');
    }

    const longNotif = new Notification({
      user: dummyUserId,
      type: 'system',
      title: 'X'.repeat(121),
      message: 'Valid message content.'
    });
    try {
      await longNotif.validate();
      assert.fail('Expected maxlength error');
    } catch (error) {
      assert.ok(error.errors.title, 'Expected maxlength error on title');
    }
  });

  // Test 7: Missing message fails
  await test('Missing message fails validation with required error', async () => {
    const notification = new Notification({
      user: dummyUserId,
      type: 'listing_rejected',
      title: 'Listing Update'
    });
    try {
      await notification.validate();
      assert.fail('Expected validation error for missing message');
    } catch (error) {
      assert.ok(error.errors.message, 'Expected error on message field');
      assert.strictEqual(error.errors.message.message, 'Notification message is required');
    }
  });

  // Test 8: Default read flag is false
  await test('Default read flag is false and virtual isRead matches', async () => {
    const notification = new Notification({
      user: dummyUserId,
      type: 'price_drop',
      title: 'Price Drop Alert',
      message: 'A car in your favorites dropped in price.'
    });
    assert.strictEqual(notification.read, false, 'Default read must be false');
    assert.strictEqual(notification.isRead, false, 'Virtual isRead must be false');
    
    notification.isRead = true;
    assert.strictEqual(notification.read, true, 'Setting isRead must update read');
  });

  // Test 9: markAsRead instance method updates read flag
  await test('markAsRead method toggles read flag to true', async () => {
    const notification = new Notification({
      user: dummyUserId,
      type: 'system',
      title: 'Account Update',
      message: 'Your profile has been updated.',
      read: false
    });
    assert.strictEqual(notification.read, false);
    await notification.markAsRead();
    assert.strictEqual(notification.read, true, 'read flag must be updated to true');
  });

  // Test 10: Helper createNotification creates valid instance
  await test('createNotification utility validates and returns notification', async () => {
    const result = await createNotification({
      user: dummyUserId,
      type: 'system',
      title: 'Welcome',
      message: 'Welcome to CarBazaar marketplace!'
    });
    assert.strictEqual(result.title, 'Welcome');
    assert.strictEqual(result.read, false);
    assert.strictEqual(result.user.toString(), dummyUserId.toString());
  });

  // Test 11: notifyListingApproved automated trigger
  await test('notifyListingApproved creates valid notification for seller', async () => {
    const car = {
      _id: dummyCarId,
      brand: 'Tata',
      model: 'Harrier',
      year: 2023
    };
    const notif = await notifyListingApproved(dummyUserId, car);
    assert.strictEqual(notif.type, 'listing_approved');
    assert.strictEqual(notif.user.toString(), dummyUserId.toString());
    assert.ok(notif.message.includes('Tata Harrier 2023'));
    assert.ok(notif.message.includes('approved'));
    assert.strictEqual(notif.data.carId.toString(), dummyCarId.toString());
  });

  // Test 12: notifyListingRejected automated trigger with reason
  await test('notifyListingRejected creates notification with rejection reason for seller', async () => {
    const car = {
      _id: dummyCarId,
      brand: 'Mahindra',
      model: 'XUV700',
      year: 2022
    };
    const reason = 'Vehicle documentation blur; please re-upload clear RC.';
    const notif = await notifyListingRejected(dummyUserId, car, reason);
    assert.strictEqual(notif.type, 'listing_rejected');
    assert.strictEqual(notif.user.toString(), dummyUserId.toString());
    assert.ok(notif.message.includes(reason), 'Rejection reason must be included in message');
    assert.strictEqual(notif.data.reason, reason);
  });

  // Test 13: notifyInquiryReceived automated trigger
  await test('notifyInquiryReceived creates notification with buyer and car details', async () => {
    const buyer = {
      _id: dummyBuyerId,
      name: 'Rohan Sharma'
    };
    const car = {
      _id: dummyCarId,
      brand: 'Hyundai',
      model: 'Creta'
    };
    const message = 'Is this car available for immediate test drive?';
    const notif = await notifyInquiryReceived(dummyUserId, buyer, car, message);
    assert.strictEqual(notif.type, 'inquiry_received');
    assert.ok(notif.message.includes('Rohan Sharma'));
    assert.ok(notif.message.includes('Hyundai Creta'));
    assert.ok(notif.message.includes('immediate test drive'));
    assert.strictEqual(notif.data.buyerId.toString(), dummyBuyerId.toString());
  });

  // Test 14: Controller getUserNotifications returns 401 without auth
  await test('Controller getUserNotifications returns 401 without user authentication', async () => {
    let responseStatus = 0;
    let responseJson = null;
    const req = { query: {} };
    const res = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json(payload) {
        responseJson = payload;
        return this;
      }
    };
    await getUserNotifications(req, res);
    assert.strictEqual(responseStatus, 401);
    assert.strictEqual(responseJson.success, false);
  });

  // Test 15: Controller markAllAsRead returns 401 without auth
  await test('Controller markAllAsRead returns 401 without user authentication', async () => {
    let responseStatus = 0;
    let responseJson = null;
    const req = { body: {} };
    const res = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json(payload) {
        responseJson = payload;
        return this;
      }
    };
    await markAllAsRead(req, res);
    assert.strictEqual(responseStatus, 401);
    assert.strictEqual(responseJson.success, false);
  });

  console.log(`\n--- Test Summary: ${passed} passed, ${failed} failed ---\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
