# 11 — Car Listing Flow

## Lifecycle

```text
Customer Login
 -> Sell Your Car
 -> Enter Details
 -> Add Images
 -> Submit
 -> Pending Approval
 -> Admin Review
 -> Approved
 -> Published
```

## Rejection

```text
Pending
 -> Admin Rejects
 -> Customer sees status/reason
 -> Customer edits
 -> Resubmits
```

## Listing Status

```text
Available
Sold
Inactive
```

## Approval Status

```text
Pending
Approved
Rejected
```

A listing should only appear in public marketplace results when it satisfies the publication rules.

## Ownership

Only the owner can edit/delete their listing, subject to status rules.

## Admin

Admin can approve/reject listings and remove listings that violate marketplace rules.
