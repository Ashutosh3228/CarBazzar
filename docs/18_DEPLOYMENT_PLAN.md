# 18 — Deployment Plan

> Deployment is planned for a later phase. Do not deploy during documentation-only Phase 1.

## Suggested Architecture

```text
React frontend -> Vercel or similar
Express backend -> Render/Railway or similar
MongoDB -> MongoDB Atlas
```

## Deployment Order

1. Configure MongoDB Atlas.
2. Deploy backend.
3. Configure production backend environment variables.
4. Verify API.
5. Deploy frontend.
6. Configure frontend API URL.
7. Configure CORS.
8. Configure email/SMS providers.
9. Run smoke tests.
10. Verify authentication and protected routes.

## Production Requirements

- HTTPS
- Strong JWT secret
- Secure database credentials
- Restricted CORS
- Production environment variables
- Rate limiting
- Error monitoring
- Backup strategy
- Logging without sensitive secrets
