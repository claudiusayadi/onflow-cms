FROM node:22-alpine

# Install pnpm explicitly
RUN npm install -g pnpm@latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["pnpm", "dev"]
