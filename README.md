# Event Driven E-commerce API

This repository contains a NestJS backend API designed for an event-driven e-commerce flow. The API is containerized with Docker and can be run standalone or with Docker Compose alongside MongoDB.

## What it includes

- NestJS application with modular architecture
- Order, payment, product, and user modules
- Stripe integration for payment processing
- Webhook handling endpoint for processing Stripe events
- Dockerfile + docker-compose.yml for local deployment

## Architecture overview

The API is organized into feature modules under `src/modules/`:

- `order` — endpoints and logic for order creation and retrieval
- `payment` — payment processing and webhook handling
- `product` — product listing and product-related operations
- `user` — user registration and management

Stripe webhooks are received by the payment module and used to update payment/order state asynchronously.

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

## Stripe webhook disclaimer

> This project currently uses Stripe CLI forwarding for webhook delivery during development. The webhook endpoint is still being tested through the Stripe CLI and is not yet wired to a production-facing webhook URL.

If you want to run webhooks locally, start the Stripe CLI listener and forward events to your local API:

```bash
stripe listen --forward-to http://localhost:8080/api/v1/payment/webhook
```

Then trigger events from Stripe for local webhook handling.

## Notes

- Ensure your `.env` file contains the required Stripe keys before starting the application.
- The webhook flow is intended for local development and testing with Stripe CLI.
- For production, replace CLI forwarding with a public webhook endpoint and configure Stripe to send events directly.
