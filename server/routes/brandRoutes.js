const express = require('express');
const router = express.Router();
const {
  getBrands,
  getBrandById,
  createBrand,
} = require('../controllers/brandController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getBrands);
router.get('/:id', getBrandById);
router.post('/', protect, adminOnly, createBrand);

module.exports = router;
