const Inquiry = require('../models/Inquiry');
const Car = require('../models/Car');

// @desc    Submit inquiry for an approved car
// @route   POST /api/inquiries
// @access  Private
const createInquiry = async (req, res, next) => {
  try {
    const { carId, message } = req.body;

    if (!carId || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both car ID and an inquiry message',
      });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    // Inquiry is allowed only for public marketplace cars
    if (
      car.approvalStatus !== 'approved' ||
      car.status !== 'available'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot submit an inquiry for an unapproved or unavailable car listing',
      });
    }

    // Seller cannot inquire about their own car
    if (car.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit an inquiry for your own car listing',
      });
    }

    const inquiry = await Inquiry.create({
      buyer: req.user._id,
      seller: car.owner,
      car: car._id,
      message: message.trim(),
      status: 'pending',
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('buyer', 'name email mobile')
      .populate('seller', 'name email')
      .populate({
        path: 'car',
        select: 'title model year price images',
        populate: {
          path: 'brand',
          select: 'name logo',
        },
      });

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully to the seller!',
      data: populatedInquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiries received by seller
// @route   GET /api/inquiries/received
// @access  Private
const getReceivedInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({
      seller: req.user._id,
    })
      .populate('buyer', 'name email mobile')
      .populate({
        path: 'car',
        select: 'title model price year images',
        populate: {
          path: 'brand',
          select: 'name logo',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Received seller inquiries retrieved successfully',
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiries sent by buyer
// @route   GET /api/inquiries/sent
// @access  Private
const getSentInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({
      buyer: req.user._id,
    })
      .populate('seller', 'name email')
      .populate({
        path: 'car',
        select: 'title model price year images',
        populate: {
          path: 'brand',
          select: 'name logo',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Sent inquiries retrieved successfully',
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/inquiries/:id
// @access  Private (Seller)
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'pending',
      'responded',
      'closed',
    ];

    // Validate requested status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid inquiry status. Allowed values are pending, responded, and closed.',
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Only the seller who received the inquiry can update it
    if (
      inquiry.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry',
      });
    }

    inquiry.status = status;

    await inquiry.save();

    // Return complete updated inquiry
    const updatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('buyer', 'name email mobile')
      .populate({
        path: 'car',
        select: 'title model price year images',
        populate: {
          path: 'brand',
          select: 'name logo',
        },
      });

    res.status(200).json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      data: updatedInquiry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getReceivedInquiries,
  getSentInquiries,
  updateInquiryStatus,
};