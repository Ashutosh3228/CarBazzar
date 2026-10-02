# 08 — Frontend Pages

## Public Pages

```text
/
 /cars
 /cars/:id
 /brands
 /brands/:id
 /about
 /contact
 /login
 /register
 /verify-otp
 /forgot-password
 /reset-password
```

## Customer Pages

```text
/profile
/my-listings
/sell-car
/cars/edit/:id
/favorites
/my-inquiries
/notifications
```

## Admin Pages

```text
/admin/login
/admin
/admin/users
/admin/cars
/admin/brands
/admin/reports
```

## Home Page Sections

1. Navbar
2. Hero/search
3. Popular brands
4. Featured cars
5. How it works
6. Why CarBazaar
7. Call to action
8. Footer

## Car Details

Show:

- Gallery
- Price
- Brand/model/variant
- Year
- Fuel
- Transmission
- Kilometers
- Location
- Condition
- Description
- Seller summary
- Favorite
- Contact seller

## Sell Car

Protected page with validated form and image handling.

## Protected Navigation

Authentication state should control access to protected pages, while the backend remains the source of truth for authorization.
