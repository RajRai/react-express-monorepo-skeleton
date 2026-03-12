# React / Express Monorepo Skeleton

Minimal monorepo skeleton with:
- Vite React client
- Express server
- Vite dev proxy for `/api` and `/ws`
- Same-origin static hosting in production
- Multi-stage Docker build

## Development

```bash
npm install
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:8080

In development, the client talks to the server through the Vite proxy.
In production, the Express server hosts `client/dist` and serves the SPA directly.

## Production build

```bash
npm run build
npm run start
```

## Docker

```bash
npm run docker:build
npm run docker:run
```
