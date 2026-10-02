# 17 — Testing Plan

## Authentication

- Valid registration
- Duplicate email
- Duplicate mobile
- Invalid email
- Weak password
- Password mismatch
- Email OTP success
- Mobile OTP success
- Wrong OTP
- Expired OTP
- OTP resend
- OTP rate limit
- Login
- Logout
- Forgot password
- Reset password

## Authorization

- Guest cannot access protected routes
- Customer cannot access admin APIs
- Customer cannot modify another user's listing
- Admin can access admin APIs

## Listings

- Create
- Read
- Update
- Delete
- Invalid price
- Invalid year
- Invalid brand
- Invalid image
- Approval flow

## Search

- Keyword
- Brand
- Model
- Price range
- Fuel
- Transmission
- Location
- Sort
- Pagination
- No results

## UI

- Desktop
- Tablet
- Mobile
- Loading states
- Error states
- Empty states
- Forms
- Navigation
- Accessibility basics

## API

Test successful and failure responses and verify correct HTTP status codes.

## Security

Check that secrets, passwords and OTPs are not exposed in responses, logs or Git.
