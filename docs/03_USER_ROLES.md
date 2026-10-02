# 03 — User Roles

## Guest

### Can

- View home
- Browse approved cars
- Search
- Filter
- View brands
- View car details
- Open login/register

### Cannot

- Create listing
- Favorite a car
- Use protected inquiry features
- Access profile
- Access admin

## Customer

### Can

- Register
- Verify account
- Login/logout
- Manage profile
- Change password
- Create listings
- Edit own listings
- Delete own listings
- View own listings
- Favorite cars
- Contact sellers
- View inquiries

### Cannot

- Access admin APIs
- Modify another customer's listing
- Approve/reject listings
- Manage users

## Admin

### Can

- Access admin dashboard
- View users
- Manage users
- View all listings
- Approve/reject listings
- Delete inappropriate listings
- Manage brands
- Review reports
- View statistics

Authorization must be enforced on the backend. Hiding a page in React is not sufficient security.
