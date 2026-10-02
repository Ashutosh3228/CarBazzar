# 16 — Environment Variables

## Backend

Planned variables:

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
```

## Email

```env
EMAIL_SERVICE=
EMAIL_USER=
EMAIL_PASSWORD=
```

## SMS

```env
SMS_PROVIDER=
SMS_API_KEY=
SMS_API_SECRET=
```

## Image Service

If an external image service is selected:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Rules

- Never commit `.env`.
- Commit `.env.example` with empty/placeholders only when implementation begins.
- Never place secrets in React source code.
- Rotate credentials if exposed.
