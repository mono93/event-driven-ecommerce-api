# Event Driven E-commerce API

Docker files have been added to containerize the NestJS backend.

## Build and run with Docker

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Stripe secrets.

3. Build the Docker image:

   ```bash
   docker build -t event-driven-ecommerce-api .
   ```

4. Run the container:

   ```bash
   docker run --env-file .env -p 8080:8080 event-driven-ecommerce-api
   ```

## Run with Docker Compose

The repository includes a `docker-compose.yml` to start the API together with MongoDB.

1. Copy the env example:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Stripe secrets.

3. Start services:

   ```bash
   docker compose up --build
   ```

4. Visit the API at `http://localhost:8080`.
