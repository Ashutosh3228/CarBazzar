const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Inquiry must have a buyer'],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Inquiry must have a seller'],
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Inquiry must be linked to a car'],
    },

    message: {
      type: String,
      required: [true, 'Please provide an inquiry message'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },

    status: {
      type: String,
      enum: ['pending', 'responded', 'closed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Fast seller dashboard lookup
inquirySchema.index({ seller: 1, createdAt: -1 });

// Fast buyer inquiry lookup
inquirySchema.index({ buyer: 1, createdAt: -1 });

// Avoid model re-registration during development
const Inquiry =
  mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;