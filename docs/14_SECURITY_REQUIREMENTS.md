# 14 — Security Requirements

## Authentication

- Hash passwords with bcrypt.
- Use JWT for authenticated requests.
- Protect sensitive routes.
- Validate token expiration.
- Enforce roles server-side.

## OTP

- Hash OTPs before storage.
- Expire OTPs.
- Limit attempts.
- Rate-limit generation and verification.
- Do not log OTP values.
- Do not return OTPs in API responses.

## Authorization

- Admin middleware for admin endpoints.
- Ownership checks for customer listings.
- Never rely only on React route protection.

## Input Validation

Validate on both frontend and backend.

## Database

- Validate Mongoose schemas.
- Use unique indexes where required.
- Avoid accepting arbitrary fields.
- Use safe query construction.

## Secrets

Never commit:

- JWT secrets
- MongoDB credentials
- Email credentials
- SMS credentials
- Cloud storage credentials

Use environment variables.

## API

Consider:

- CORS restrictions
- Rate limiting
- Request size limits
- Centralized error handling
- Security headers
- Audit logging for sensitive admin actions

## Privacy

Collect only data needed for marketplace functionality and clearly document privacy practices.
