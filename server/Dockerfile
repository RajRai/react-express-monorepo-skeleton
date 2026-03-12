# ---------- client build ----------
FROM node:22-alpine AS client_build
WORKDIR /client

# Copy from repo root context
COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# ---------- server deps (prod only) ----------
FROM node:22-alpine AS server_deps
WORKDIR /server

COPY server/package*.json ./
RUN npm ci --omit=dev

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV COOKIE_SECURE=false
ENV PORT=8080
ENV SESSION_COOKIE_NAME=app.sid

# Proper signal handling
RUN apk add --no-cache tini

# Server code + deps
COPY --from=server_deps /server/node_modules ./server/node_modules
COPY server/ ./server/

# Client dist where app.js expects it:
# server/src/app.js resolves ../../client/dist from /server/src
# -> /app/client/dist
COPY --from=client_build /client/dist ./client/dist

EXPOSE 8080

CMD ["node", "server/src/app.js"]
