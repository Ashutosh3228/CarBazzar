const mongoose = require('mongoose');

/**
 * Brand Model Schema
 * Based on CarBazaar Database Design (docs/06_DATABASE_DESIGN.md)
 * Assigned Issue #48: [Admin] Create Brand Model & Brand Management CRUD APIs
 */
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Brand name must be at least 2 characters'],
      maxlength: [50, 'Brand name cannot exceed 50 characters']
    },
    logo: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Brand description cannot exceed 500 characters'],
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for filtering active brands in marketplace searches
brandSchema.index({ isActive: 1 });

const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);

module.exports = Brand;
