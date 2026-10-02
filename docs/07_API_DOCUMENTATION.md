# 07 — API Documentation

Base URL:

```text
/api
```

## Authentication

```text
POST /auth/register
POST /auth/verify-email-otp
POST /auth/verify-mobile-otp
POST /auth/resend-otp
POST /auth/login
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

## Profile

```text
GET /users/profile
PUT /users/profile
PUT /users/change-password
```

## Brands

```text
GET    /brands
GET    /brands/:id
POST   /brands
PUT    /brands/:id
DELETE /brands/:id
```

## Cars

```text
GET    /cars
GET    /cars/:id
POST   /cars
PUT    /cars/:id
DELETE /cars/:id
GET    /cars/my-listings
PATCH  /cars/:id/status
```

Example:

```text
GET /api/cars?brand=Tata&model=Nexon&minPrice=500000&maxPrice=1200000&page=1&limit=12
```

## Favorites

```text
GET    /favorites
POST   /favorites/:carId
DELETE /favorites/:carId
```

## Inquiries

```text
POST  /inquiries
GET   /inquiries/sent
GET   /inquiries/received
PATCH /inquiries/:id
```

## Admin

```text
GET    /admin/users
GET    /admin/cars
PATCH  /admin/cars/:id/approve
PATCH  /admin/cars/:id/reject
DELETE /admin/users/:id
```

## Response Convention

Success:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Unable to complete request"
}
```

Use appropriate HTTP status codes including 200, 201, 400, 401, 403, 404 and 500.

Every protected endpoint must document its authentication and role requirements.
