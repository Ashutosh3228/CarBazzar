const Car = require('../models/Car');
const User = require('../models/User');

// @desc    Get all cars for admin review (pending, approved, rejected)
// @route   GET /api/admin/cars
// @access  Private/Admin
const getAdminCars = async (req, res, next) => {
  try {
    const { approvalStatus, status } = req.query;
    const filter = {};
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (status) filter.status = status;

    const cars = await Car.find(filter)
      .populate('brand', 'name logo')
      .populate('owner', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Admin cars retrieved successfully',
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve car listing
// @route   PATCH /api/admin/cars/:id/approve
// @access  Private/Admin
const approveCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    car.approvalStatus = 'approved';
    car.status = 'available';
    await car.save();

    const populatedCar = await Car.findById(car._id)
      .populate('brand', 'name')
      .populate('owner', 'name email');

    res.status(200).json({
      success: true,
      message: 'Car listing has been approved and is now live on the marketplace',
      data: populatedCar,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject car listing
// @route   PATCH /api/admin/cars/:id/reject
// @access  Private/Admin
const rejectCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    car.approvalStatus = 'rejected';
    await car.save();

    res.status(200).json({
      success: true,
      message: 'Car listing has been rejected',
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Admin users retrieved successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const pendingCars = await Car.countDocuments({ approvalStatus: 'pending' });
    const approvedCars = await Car.countDocuments({ approvalStatus: 'approved' });
    const rejectedCars = await Car.countDocuments({ approvalStatus: 'rejected' });
    const soldCars = await Car.countDocuments({ status: 'sold' });

    res.status(200).json({
      success: true,
      message: 'Admin statistics retrieved successfully',
      data: {
        totalUsers,
        totalCars,
        pendingCars,
        approvedCars,
        rejectedCars,
        soldCars,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminCars,
  approveCar,
  rejectCar,
  getAdminUsers,
  getAdminStats,
};
