# Base stage for pnpm setup
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build stage - for TypeScript compilation
FROM base AS build-app
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code and TypeScript config
COPY . .

# Build the application
RUN pnpm build

# Production dependencies stage
FROM base AS build-production
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Final production stage
FROM base AS production
WORKDIR /app

# Copy built application from build-app stage
COPY --from=build-app /app/dist ./dist

# Copy production dependencies from build-production stage
COPY --from=build-production /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "dist/index.js"] 