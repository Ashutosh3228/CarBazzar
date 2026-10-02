# 13 — Search & Filter Flow

## Search

Support:

- Keyword
- Brand
- Model
- Location

## Filters

- Minimum price
- Maximum price
- Brand
- Model
- Minimum year
- Maximum year
- Fuel type
- Transmission
- Maximum kilometers
- Condition

## Sorting

- Price low to high
- Price high to low
- Newest
- Oldest

## Pagination

Use server-side pagination.

Example:

```text
GET /api/cars?page=1&limit=12
```

Response should include:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0
  }
}
```

## Backend Filtering

Filtering must happen on the backend/database. Do not load the entire marketplace into the browser just to filter it.

## Empty Results

Display a helpful message and allow users to clear filters.
