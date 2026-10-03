const Favorite = require('../models/Favorite');
const Car = require('../models/Car');

// @desc    Get current user's favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'car',
        populate: {
          path: 'brand',
          select: 'name logo',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Favorites retrieved successfully',
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add car to favorites
// @route   POST /api/favorites/:carId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    // Only public marketplace cars can be favorited
    if (
      car.approvalStatus !== 'approved' ||
      car.status !== 'available'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Only approved and available cars can be added to favorites',
      });
    }

    // Seller cannot favorite their own listing
    if (car.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot favorite your own car listing',
      });
    }

    // Prevent duplicate favorites
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      car: carId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Car is already in your favorites',
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      car: carId,
    });

    const populatedFavorite = await Favorite.findById(favorite._id)
      .populate({
        path: 'car',
        populate: {
          path: 'brand',
          select: 'name logo',
        },
      });

    res.status(201).json({
      success: true,
      message: 'Car added to favorites',
      data: populatedFavorite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove car from favorites
// @route   DELETE /api/favorites/:carId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      car: carId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};