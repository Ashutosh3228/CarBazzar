# 05 — OTP Verification

## Supported Channels

- Email OTP
- Mobile OTP

The implementation should use a provider abstraction so the provider can be changed without rewriting authentication logic.

## Email Verification

```text
Register
 -> Generate OTP
 -> Hash OTP
 -> Store challenge
 -> Send email
 -> User enters OTP
 -> Compare securely
 -> Mark email verified
```

## Mobile Verification

```text
Register
 -> Generate OTP
 -> Hash OTP
 -> Store challenge
 -> Send SMS
 -> User enters OTP
 -> Compare securely
 -> Mark mobile verified
```

## OTP Rules

Recommended initial policy:

- 6-digit OTP
- Short expiration window
- Limited verification attempts
- Resend cooldown
- Limited resend frequency
- Invalidate previous OTP when a new OTP is generated
- Never expose OTP in API responses
- Never log OTP values

Exact limits should be configurable.

## Data

Store an OTP challenge containing:

- User reference
- Destination
- Type
- Hashed OTP
- Expiration
- Attempts
- Verification status
- Created time

## Security

- Hash OTP values before persistence.
- Rate-limit generation and verification.
- Avoid account enumeration through error messages.
- Use provider credentials only through environment variables.
- Never commit provider credentials to GitHub.

## Provider Abstraction

Possible future providers may include:

- SMTP/email provider
- SMS provider

The project should not hard-code a provider in business logic.
