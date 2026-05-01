# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json tsconfig.build.json ./
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
RUN npm prune --production

EXPOSE 8080
CMD ["node", "dist/main"]
