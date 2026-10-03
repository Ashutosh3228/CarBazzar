const express = require('express');
const router = express.Router();
const {
  getAdminCars,
  approveCar,
  rejectCar,
  getAdminUsers,
  getAdminStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/cars', getAdminCars);
router.patch('/cars/:id/approve', approveCar);
router.patch('/cars/:id/reject', rejectCar);
router.get('/users', getAdminUsers);
router.get('/stats', getAdminStats);

module.exports = router;
