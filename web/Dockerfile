# syntax=docker/dockerfile:1.7
FROM node:24-bookworm-slim
# Set the working directory, where the application code will be copied to
WORKDIR /app
# enable corepack and prepare pnpm version 12.16.1
RUN corepack enable && corepack prepare pnpm@12.16.1 --activate
# Copy the package.json, pnpm-lock.yaml, and pnpm-workspace.yaml files to the working directory
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Install the dependencies using pnpm
RUN pnpm install --frozen-lockfile
# Copy the rest of the application code to the working directory
COPY . .

# Use the Compose service hostname for server-side API rewrites inside Docker.
ENV BACKEND_URL=http://server:5000

# Build the application using web/.env.local as a temporary BuildKit secret.
# Node reads the env file and passes its variables to the Next.js build process.
# The secret is not stored in an image layer.
RUN --mount=type=secret,id=web_env,target=/run/secrets/web_env \
    node --env-file=/run/secrets/web_env "$(command -v pnpm)" run build
# Configure the production runtime
ENV NODE_ENV=production
ENV PORT=3000
# Expose the port that the application will run on
EXPOSE 3000
# Start the application using pnpm
CMD ["pnpm", "run", "start"]