const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getPublicCars,
  getCarById,
  createListing,
  getMyListings,
  updateCarStatus,
  updateListing,
  deleteListing,
} = require('../controllers/carController');
const { protect } = require('../middleware/auth');

// Optional auth helper: populates req.user if token is present, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'carbazaar_super_secret_jwt_key_2026'
      );
      req.user = await User.findById(decoded.id);
    } catch (e) {
      // Ignore token errors for public routes
    }
  }
  next();
};

router.get('/', getPublicCars);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', optionalAuth, getCarById);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.patch('/:id/status', protect, updateCarStatus);

module.exports = router;
