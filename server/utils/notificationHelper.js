const Notification = require('../models/Notification');

/**
 * Notification Helper Utility
 * Centralized notification triggers and dispatchers.
 * Assigned Issue #50: [Notification] Create Notification Model & API Integration
 */

/**
 * Base helper to create a Notification document
 * @param {Object} options
 * @param {string|mongoose.Types.ObjectId} options.user - Recipient User ID
 * @param {string} options.type - Notification type
 * @param {string} options.title - Short descriptive title
 * @param {string} options.message - Notification message body
 * @param {Object} [options.data] - Contextual metadata (carId, inquiryId, reason, etc.)
 * @returns {Promise<Notification>}
 */
async function createNotification({ user, type, title, message, data = {} }) {
  if (!user) {
    throw new Error('Recipient user ID is required to create a notification');
  }
  if (!type) {
    throw new Error('Notification type is required');
  }
  if (!title) {
    throw new Error('Notification title is required');
  }
  if (!message) {
    throw new Error('Notification message is required');
  }

  const notification = new Notification({
    user,
    type,
    title,
    message,
    read: false,
    data
  });

  const mongoose = require('mongoose');
  // If running with active database connection, save to MongoDB
  if (mongoose.connection && mongoose.connection.readyState === 1 && typeof notification.save === 'function') {
    return await notification.save();
  }

  await notification.validate();
  return notification;
}

/**
 * Triggered automatically when an admin approves a car listing.
 * Sends a positive alert to the seller.
 * @param {string|mongoose.Types.ObjectId} sellerId
 * @param {Object} car
 * @returns {Promise<Notification>}
 */
async function notifyListingApproved(sellerId, car = {}) {
  const carTitle = [car.brand, car.model, car.year].filter(Boolean).join(' ') || car.title || 'your vehicle';

  return await createNotification({
    user: sellerId,
    type: 'listing_approved',
    title: 'Listing Approved',
    message: `Great news! Your listing for ${carTitle} has been approved and is now live on CarBazaar.`,
    data: {
      carId: car._id,
      action: 'listing_approved'
    }
  });
}

/**
 * Triggered automatically when an admin rejects a car listing.
 * Sends an explanatory alert to the seller with the rejection reason.
 * @param {string|mongoose.Types.ObjectId} sellerId
 * @param {Object} car
 * @param {string} reason
 * @returns {Promise<Notification>}
 */
async function notifyListingRejected(sellerId, car = {}, reason = '') {
  const carTitle = [car.brand, car.model, car.year].filter(Boolean).join(' ') || car.title || 'your vehicle';
  const reasonText = reason && reason.trim() ? reason.trim() : 'Listing does not comply with marketplace standards.';

  return await createNotification({
    user: sellerId,
    type: 'listing_rejected',
    title: 'Listing Requires Revision',
    message: `Your listing for ${carTitle} was not approved. Reason: ${reasonText}`,
    data: {
      carId: car._id,
      reason: reasonText,
      action: 'listing_rejected'
    }
  });
}

/**
 * Triggered automatically when a buyer submits an inquiry for a seller's listing.
 * @param {string|mongoose.Types.ObjectId} sellerId
 * @param {Object} buyer
 * @param {Object} car
 * @param {string} inquiryMessage
 * @returns {Promise<Notification>}
 */
async function notifyInquiryReceived(sellerId, buyer = {}, car = {}, inquiryMessage = '') {
  const buyerName = buyer.name || buyer.email || 'A buyer';
  const carTitle = [car.brand, car.model, car.year].filter(Boolean).join(' ') || car.title || 'your vehicle';
  const preview = inquiryMessage && inquiryMessage.trim()
    ? `"${inquiryMessage.slice(0, 80)}${inquiryMessage.length > 80 ? '...' : ''}"`
    : 'is interested in details.';

  return await createNotification({
    user: sellerId,
    type: 'inquiry_received',
    title: 'New Buyer Inquiry',
    message: `${buyerName} sent an inquiry on ${carTitle}: ${preview}`,
    data: {
      carId: car._id,
      buyerId: buyer._id,
      action: 'inquiry_received'
    }
  });
}

module.exports = {
  createNotification,
  notifyListingApproved,
  notifyListingRejected,
  notifyInquiryReceived
};
