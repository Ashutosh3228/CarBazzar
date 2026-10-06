import mongoose from 'mongoose';

/**
 * CarBazaar User Schema
 * Implements database architecture defined in docs/06_DATABASE_DESIGN.md
 * and role-based permissions defined in docs/03_USER_ROLES.md.
 */

// Regular expression for validating email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regular expression for mobile number validation (E.164 standard / 10-15 digits)
const mobileRegex = /^\+?[1-9]\d{7,14}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid email address'],
      index: true
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [mobileRegex, 'Please provide a valid mobile phone number in E.164 format (e.g. +919876543210 or 9876543210)'],
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Protected: Do not include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'admin'],
        message: 'Invalid role: "{VALUE}". Allowed roles are: customer, admin'
      },
      default: 'customer',
      index: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isMobileVerified: {
      type: Boolean,
      default: false
    },
    profileImage: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Ensure model is compiled only once
export const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
