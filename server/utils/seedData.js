const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Brand = require('../models/Brand');
const Car = require('../models/Car');

dotenv.config();

const brandsData = [
  { name: 'Tata', description: 'Leading Indian automotive manufacturer with high safety ratings', logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=100&auto=format&fit=crop&q=60' },
  { name: 'Hyundai', description: 'Global automotive manufacturer known for modern design and tech', logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=100&auto=format&fit=crop&q=60' },
  { name: 'Maruti Suzuki', description: 'Indias most popular automobile manufacturer', logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&auto=format&fit=crop&q=60' },
  { name: 'Mahindra', description: 'Pioneer of robust SUVs and electric commercial vehicles', logo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=100&auto=format&fit=crop&q=60' },
  { name: 'Toyota', description: 'Renowned for world-class reliability and hybrid tech', logo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=100&auto=format&fit=crop&q=60' },
  { name: 'Honda', description: 'Famous for smooth engines and premium sedans', logo: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=100&auto=format&fit=crop&q=60' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carbazaar');
    console.log('[MongoDB Connected for Seeding]');

    // Clear existing
    await User.deleteMany();
    await Brand.deleteMany();
    await Car.deleteMany();

    // Create Brands
    const createdBrands = await Brand.insertMany(brandsData);
    console.log(`[Seed] Created ${createdBrands.length} brands`);

    // Create Users (Admin, Seller, Buyer)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@carbazaar.com',
      mobile: '+91 9999900001',
      password: 'password123',
      role: 'admin',
      isEmailVerified: true,
      isMobileVerified: true,
    });

    const seller = await User.create({
      name: 'Rajesh Seller',
      email: 'seller@carbazaar.com',
      mobile: '+91 9999900002',
      password: 'password123',
      role: 'customer',
      isEmailVerified: true,
      isMobileVerified: true,
    });

    const buyer = await User.create({
      name: 'Priya Buyer',
      email: 'buyer@carbazaar.com',
      mobile: '+91 9999900003',
      password: 'password123',
      role: 'customer',
      isEmailVerified: true,
      isMobileVerified: true,
    });

    console.log('[Seed] Created default users: admin@carbazaar.com, seller@carbazaar.com, buyer@carbazaar.com');

    // Create Sample Cars
    const tataBrand = createdBrands.find((b) => b.name === 'Tata');
    const hyundaiBrand = createdBrands.find((b) => b.name === 'Hyundai');

    const sampleCars = [
      {
        title: '2023 Tata Nexon Fearless Plus Petrol',
        brand: tataBrand._id,
        model: 'Nexon',
        variant: 'Fearless Plus',
        year: 2023,
        price: 1150000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        kilometers: 14500,
        color: 'Daytona Grey',
        location: 'Mumbai, Maharashtra',
        description: 'Single owner, pristine condition Tata Nexon with complete service records and 5-star safety rating.',
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60'],
        owner: seller._id,
        condition: 'Used',
        status: 'available',
        approvalStatus: 'approved',
      },
      {
        title: '2022 Hyundai Creta SX (O) Turbo Diesel',
        brand: hyundaiBrand._id,
        model: 'Creta',
        variant: 'SX (O)',
        year: 2022,
        price: 1520000,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        kilometers: 28000,
        color: 'Polar White',
        location: 'Pune, Maharashtra',
        description: 'Loaded with panoramic sunroof, ventilated front seats, and Bose premium audio. Fully insured.',
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60'],
        owner: seller._id,
        condition: 'Used',
        status: 'available',
        approvalStatus: 'approved',
      },
    ];

    await Car.insertMany(sampleCars);
    console.log('[Seed] Created approved sample cars');

    console.log('[Seed Data Completed Successfully]');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Error]: ${err.message}`);
    process.exit(1);
  }
};

seedDB();
