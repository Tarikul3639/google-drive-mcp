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
# Build the application with a larger Node.js heap
RUN NODE_OPTIONS=--max-old-space-size=4096 pnpm run build
# Set the environment variable to production
ENV NODE_ENV=production
# Expose the port that the application will run on
EXPOSE 3000
# Start the application using pnpm
CMD ["pnpm", "run", "start:prod"]