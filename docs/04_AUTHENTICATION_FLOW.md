# 04 — Authentication Flow

## Registration

```text
User opens Register
 -> Enters name/email/mobile/password
 -> Frontend validates
 -> Backend validates
 -> Password is hashed
 -> Account is created as unverified
 -> OTP is generated
 -> OTP is sent
 -> User verifies OTP
 -> Account becomes verified
```

## Login

```text
Email/mobile + password
 -> Backend validates credentials
 -> Check account verification
 -> Generate JWT
 -> Return authentication result
 -> Frontend stores authentication state
 -> User accesses protected features
```

## Logout

- Clear frontend authentication state.
- Remove stored authentication token according to the selected token-storage strategy.
- Redirect to public area.

## Forgot Password

```text
Request reset
 -> Verify email/mobile
 -> Generate short-lived OTP/reset challenge
 -> Verify challenge
 -> Set new password
```

## JWT

JWT should contain only the minimum identity/authorization information needed, such as user ID and role.

JWT secret must be stored in an environment variable.

## Middleware

Planned middleware:

- Authentication middleware
- Admin middleware
- Validation middleware
- Error middleware
- Rate limiting where required

## Ownership

Backend must verify that a customer owns a listing before allowing edit/delete operations.
