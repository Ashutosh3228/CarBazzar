const Car = require('../models/Car');
const Brand = require('../models/Brand');
const Favorite = require('../models/Favorite');
const Inquiry = require('../models/Inquiry');

// @desc    Get all public approved cars (Browse / Search / Filter)
// @route   GET /api/cars
// @access  Public
const getPublicCars = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuelType,
      transmission,
      condition,
      location,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Strict marketplace rule: only approved and available cars appear publicly
    const query = {
      approvalStatus: 'approved',
      status: 'available',
    };

    // Keyword search across title, model, location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Brand filter (can be Brand ObjectId or Brand name)
    if (brand) {
      if (brand.match(/^[0-9a-fA-F]{24}$/)) {
        query.brand = brand;
      } else {
        const foundBrand = await Brand.findOne({ name: { $regex: `^${brand}$`, $options: 'i' } });
        if (foundBrand) {
          query.brand = foundBrand._id;
        } else {
          // Non-existent brand -> return empty results properly
          return res.status(200).json({
            success: true,
            message: 'No cars found for brand',
            data: [],
            pagination: { page: Number(page), limit: Number(limit), total: 0, totalPages: 0 },
          });
        }
      }
    }

    if (model) {
      query.model = { $regex: model, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (fuelType) {
      query.fuelType = fuelType;
    }

    if (transmission) {
      query.transmission = transmission;
    }

    if (condition) {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = Number(minYear);
      if (maxYear) query.year.$lte = Number(maxYear);
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Car.countDocuments(query);
    const cars = await Car.find(query)
      .populate('brand', 'name logo')
      .populate('owner', 'name profileImage')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Cars retrieved successfully',
      data: cars,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get car details by ID
// @route   GET /api/cars/:id
// @access  Public (Pending/Rejected require ownership or admin)
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('brand', 'name logo description')
      .populate('owner', 'name email profileImage createdAt');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    // If car is not approved, only owner or admin can view
    if (car.approvalStatus !== 'approved') {
      const isOwner = req.user && car.owner._id.toString() === req.user._id.toString();
      const isAdmin = req.user && req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'This listing is pending admin approval and is not publicly accessible',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Car details retrieved successfully',
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new car listing
// @route   POST /api/cars
// @access  Private (Seller/Customer)
const createListing = async (req, res, next) => {
  try {
    const {
      title,
      brand,
      model,
      variant,
      year,
      price,
      fuelType,
      transmission,
      kilometers,
      color,
      location,
      description,
      images,
      condition,
    } = req.body;

    // Validate brand exists
    const brandDoc = await Brand.findById(brand);
    if (!brandDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand ID provided',
      });
    }

    const car = await Car.create({
      title,
      brand,
      model,
      variant,
      year,
      price,
      fuelType,
      transmission,
      kilometers,
      color,
      location,
      description,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60'],
      owner: req.user._id,
      condition: condition || 'Used',
      status: 'available',
      approvalStatus: 'pending', // Strictly pending until admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Car listing submitted successfully! It is now pending admin review and approval.',
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's listings
// @route   GET /api/cars/my-listings
// @access  Private
const getMyListings = async (req, res, next) => {
  try {
    const cars = await Car.find({ owner: req.user._id })
      .populate('brand', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'My listings retrieved successfully',
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update car status (e.g. mark as sold or inactive)
// @route   PATCH /api/cars/:id/status
// @access  Private (Owner or Admin)
const updateCarStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
    }

    car.status = status;
    await car.save();

    res.status(200).json({
      success: true,
      message: `Car status updated to ${status}`,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own car listing
// @route   PUT /api/cars/:id
// @access  Private (Owner or Admin)
const updateListing = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
    }

    const {
      title,
      price,
      kilometers,
      fuelType,
      transmission,
      color,
      location,
      description,
      images,
      condition,
    } = req.body;

    if (title) car.title = title;
    if (price) car.price = Number(price);
    if (kilometers !== undefined) car.kilometers = Number(kilometers);
    if (fuelType) car.fuelType = fuelType;
    if (transmission) car.transmission = transmission;
    if (color !== undefined) car.color = color;
    if (location) car.location = location;
    if (description !== undefined) car.description = description;
    if (images && images.length) car.images = images;
    if (condition) car.condition = condition;

    // If listing was rejected, editing it resubmits it for review
    if (car.approvalStatus === 'rejected') {
      car.approvalStatus = 'pending';
    }

    await car.save();

    const populated = await Car.findById(car._id)
      .populate('brand', 'name logo')
      .populate('owner', 'name email');

    res.status(200).json({
      success: true,
      message: 'Car listing updated successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete car listing
// @route   DELETE /api/cars/:id
// @access  Private (Owner or Admin)
const deleteListing = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    if (car.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await Car.findByIdAndDelete(req.params.id);

    // Clean up related favorites and inquiries
    await Favorite.deleteMany({ car: req.params.id });
    await Inquiry.deleteMany({ car: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Car listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicCars,
  getCarById,
  createListing,
  getMyListings,
  updateCarStatus,
  updateListing,
  deleteListing,
};
