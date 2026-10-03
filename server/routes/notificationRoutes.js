const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

/**
 * Notification Routes
 * Base route: /api/notifications
 * Assigned Issue #50: [Notification] Create Notification Model & API Integration
 */

// Route to get notifications for the logged-in user
router.get('/', getUserNotifications);

// Route to mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Route to mark a specific notification as read
router.patch('/:id/read', markAsRead);

// Route to delete a notification
router.delete('/:id', deleteNotification);

module.exports = router;
