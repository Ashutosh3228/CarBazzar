const mongoose = require('mongoose');

/**
 * Notification Model Schema
 * Based on CarBazaar Database Design (docs/06_DATABASE_DESIGN.md)
 * Assigned Issue #50: [Notification] Create Notification Model & API Integration
 */
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User recipient ID is required']
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: {
        values: [
          'listing_approved',
          'listing_rejected',
          'inquiry_received',
          'price_drop',
          'system'
        ],
        message: '{VALUE} is not a supported notification type'
      }
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      minlength: [2, 'Notification title must be at least 2 characters'],
      maxlength: [120, 'Notification title cannot exceed 120 characters']
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      minlength: [2, 'Notification message must be at least 2 characters'],
      maxlength: [1000, 'Notification message cannot exceed 1000 characters']
    },
    read: {
      type: Boolean,
      default: false
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Fast lookup index for user notification feeds ordered by date
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

// Virtual alias for isRead
notificationSchema.virtual('isRead')
  .get(function () {
    return this.read;
  })
  .set(function (value) {
    this.read = Boolean(value);
  });

// Instance method to mark a notification as read
notificationSchema.methods.markAsRead = async function () {
  this.read = true;
  if (mongoose.connection && mongoose.connection.readyState === 1 && typeof this.save === 'function') {
    return await this.save();
  }
  return this;
};

// Static helper to create and persist a notification
notificationSchema.statics.createNotification = async function (payload) {
  return await this.create(payload);
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = Notification;
