const Notification = require('../models/Notification');

/**
 * Notification Controller
 * Manages notification retrieval and status updates.
 * Assigned Issue #50: [Notification] Create Notification Model & API Integration
 */

/**
 * @desc    Get logged-in user notifications with pagination & unread count
 * @route   GET /api/notifications
 * @access  Private
 */
async function getUserNotifications(req, res) {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : req.query.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to view notifications'
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const filter = { user: userId };

    if (req.query.unreadOnly === 'true') {
      filter.read = false;
    }

    // Query unread count and paginated items in parallel
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: userId, read: false })
    ]);

    return res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message
    });
  }
}

/**
 * @desc    Mark a specific notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user._id || req.user.id) : req.body.userId;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (userId && notification.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification status',
      error: error.message
    });
  }
}

/**
 * @desc    Mark all notifications as read for current user
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
async function markAllAsRead(req, res) {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to update notifications'
      });
    }

    const result = await Notification.updateMany(
      { user: userId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        modifiedCount: result.modifiedCount || 0
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
}

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user._id || req.user.id) : req.query.userId;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (userId && notification.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
}

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
