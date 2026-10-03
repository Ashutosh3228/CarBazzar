const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['email', 'mobile', 'reset'],
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '10m' }, // TTL index auto-deleting expired OTPs
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
