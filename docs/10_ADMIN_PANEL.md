# 10 — Admin Panel

## Access

Only authenticated admin users can access admin routes.

## Dashboard

Display:

- Total users
- Total cars
- Pending listings
- Approved listings
- Rejected listings
- Sold listings
- Basic recent activity

## Users

Admin can:

- View
- Search
- Filter
- Deactivate/reactivate where supported
- Review account status

## Cars

Admin can:

- View
- Search
- Filter
- Approve
- Reject
- Delete
- Change status

## Brands

Admin can:

- Add
- Edit
- Delete
- Activate
- Deactivate

## Reports

Allow review of reported listings/users where implemented.

## Admin Security

Every admin API must validate:

1. Valid JWT
2. User identity
3. Admin role

Frontend route protection is only a UX layer and must not replace backend authorization.
