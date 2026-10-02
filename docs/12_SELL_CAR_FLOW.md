# 12 — Sell Car Flow

## Entry

Customer selects:

**Sell Your Car**

Authentication is required.

## Form

Fields:

- Brand
- Model
- Variant
- Year
- Price
- Fuel type
- Transmission
- Kilometers
- Color
- Location
- Description
- Images

## Validation

- Required fields
- Positive price
- Non-negative kilometers
- Valid year
- Valid brand
- Valid enum values
- Reasonable image type/size
- Description length

## Submission

```text
Validate frontend
 -> Submit API
 -> Validate backend
 -> Verify authenticated owner
 -> Save listing
 -> Set approvalStatus = Pending
 -> Return result
```

## Edit

Customer can edit their own listing. Changes that materially affect a published listing may require re-approval according to final business rules.

## Delete

Show confirmation before deleting. Backend validates ownership.
