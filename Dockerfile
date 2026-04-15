FROM node:20-alpine

WORKDIR /app

# Copy package files for dependency caching
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev && npm cache clean --force

# Copy application code
COPY . .

# Port is defined by Link Loom Cloud config — do NOT set ENV PORT here
# HEALTHCHECK should be configured per-project with the correct port

CMD ["node", "app.js"]
