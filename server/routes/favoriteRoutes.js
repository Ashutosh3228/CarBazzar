const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getFavorites);
router.post('/:carId', addFavorite);
router.delete('/:carId', removeFavorite);

module.exports = router;
