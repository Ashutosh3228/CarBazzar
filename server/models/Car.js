const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a listing title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Please select a car brand'],
    },
    model: {
      type: String,
      required: [true, 'Please provide a car model'],
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: Number,
      required: [true, 'Please provide the manufacturing year'],
      min: [1990, 'Year must be 1990 or newer'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [1, 'Price must be a positive number'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please select a fuel type'],
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
      default: 'Petrol',
    },
    transmission: {
      type: String,
      required: [true, 'Please select a transmission type'],
      enum: ['Manual', 'Automatic'],
      default: 'Manual',
    },
    kilometers: {
      type: Number,
      required: [true, 'Please provide kilometers driven'],
      min: [0, 'Kilometers cannot be negative'],
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Please provide the vehicle location'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Listing must have an owner'],
    },
    condition: {
      type: String,
      enum: ['New', 'Used'],
      default: 'Used',
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'inactive'],
      default: 'available',
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and filtering per docs/13_SEARCH_FILTER_FLOW.md
carSchema.index({ approvalStatus: 1, status: 1 });
carSchema.index({ brand: 1, price: 1, year: 1 });
carSchema.index({ model: 'text', title: 'text', location: 'text' });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
