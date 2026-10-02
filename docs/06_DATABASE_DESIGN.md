# 06 — Database Design

## Database

MongoDB with Mongoose.

## Collections

Core collections:

```text
User
Brand
Car
Favorite
Inquiry
OTP
Notification
```

## User

```text
name
email
mobile
password
role
isEmailVerified
isMobileVerified
profileImage
createdAt
updatedAt
```

Indexes/constraints:

- Unique email where applicable
- Unique mobile where applicable
- Role validation

## Brand

```text
name
logo
description
isActive
createdAt
updatedAt
```

## Car

```text
title
brand
model
variant
year
price
fuelType
transmission
kilometers
color
location
description
images
owner
condition
status
approvalStatus
createdAt
updatedAt
```

Relationships:

```text
Car.brand -> Brand
Car.owner -> User
```

## Favorite

```text
user
car
createdAt
```

Use a unique compound constraint for user + car.

## Inquiry

```text
buyer
seller
car
message
status
createdAt
updatedAt
```

## OTP

```text
user
destination
type
otpHash
expiresAt
attempts
verified
createdAt
```

Use TTL/index strategy where appropriate for expired challenges.

## Notification

```text
user
type
title
message
read
createdAt
```

## Data Rules

- Passwords are never stored in plain text.
- OTPs are never stored in plain text.
- Price must be positive.
- Kilometers cannot be negative.
- Year must be within an acceptable range.
- References must point to valid documents.
- User ownership must be checked by the backend.
