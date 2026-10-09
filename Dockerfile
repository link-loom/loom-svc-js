FROM node:22-alpine

WORKDIR /app

# Port used only by the container HEALTHCHECK. The listening port comes from Link Loom Cloud
# (server.port); do NOT set ENV PORT, it would override that config. Each service passes its
# port at build time (--build-arg HEALTHCHECK_PORT=<port>) or changes the default below.
ARG HEALTHCHECK_PORT=8080
ENV HEALTHCHECK_PORT=${HEALTHCHECK_PORT}

# Copy package files for dependency caching
COPY package*.json ./

# Install production dependencies only
RUN rm -f package-lock.json && npm install --omit=dev && npm cache clean --force

# Copy application code
COPY . .

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${HEALTHCHECK_PORT}/system/health || exit 1

CMD ["node", "app.js"]
