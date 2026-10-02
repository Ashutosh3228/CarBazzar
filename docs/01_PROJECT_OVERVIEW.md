# 01 — Project Overview

## Project

**CarBazaar — Buy. Sell. Drive.**

## Purpose

CarBazaar is a marketplace for buying and selling new and used cars. The platform is designed to provide a clean browsing experience for buyers and a structured listing workflow for sellers.

## Goals

1. Make car discovery simple.
2. Allow verified users to publish car listings.
3. Provide search, filters and brand browsing.
4. Protect accounts with password hashing, JWT and OTP verification.
5. Give administrators control over marketplace content.
6. Keep the architecture maintainable and scalable.

## Main Users

- Guest
- Customer/Seller
- Administrator

## Main Features

- Attractive home page
- Car search
- Brand browsing
- Car details
- Customer registration
- Email/mobile OTP verification
- Login/logout
- Password recovery
- Sell-car listing
- My listings
- Favorites
- Buyer-seller inquiries
- Admin dashboard
- Listing approval
- Brand management
- User management
- Reporting

## High-Level Architecture

```text
Browser
  |
  v
React + Vite + Tailwind
  |
 Axios / REST API
  |
  v
Node.js + Express
  |
  v
MongoDB + Mongoose
```

Authentication uses JWT and role-based authorization. OTP services are external integrations configured through environment variables.

## Primary Customer Journey

```text
Visit Home
 -> Search Cars
 -> Filter Results
 -> Open Car Details
 -> Register/Login
 -> Verify Account
 -> Favorite or Contact Seller
```

## Seller Journey

```text
Login
 -> Sell Your Car
 -> Enter Details
 -> Submit Listing
 -> Pending Approval
 -> Admin Review
 -> Approved
 -> Listing Published
```

## Admin Journey

```text
Admin Login
 -> Dashboard
 -> Review Users/Listings
 -> Approve or Reject Listings
 -> Manage Brands
 -> Review Reports
```

## Scope

Phase 1 covers documentation only. Application source code is intentionally excluded.
