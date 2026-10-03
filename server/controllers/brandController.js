const Brand = require('../models/Brand');

// @desc    Get all active brands
// @route   GET /api/brands
// @access  Public
const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      message: 'Brands retrieved successfully',
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get brand by ID
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Brand retrieved successfully',
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res, next) => {
  try {
    const { name, logo, description, isActive } = req.body;
    const brand = await Brand.create({ name, logo, description, isActive });
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBrands, getBrandById, createBrand };
