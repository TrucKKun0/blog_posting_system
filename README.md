# Blog System Microservices

This repository contains a microservices-based blog system implemented as separate Node.js services.

## Overview

The architecture is divided into several services, each responsible for a focused domain:

- `api-gateway` - Routes requests to backend microservices and handles proxying, authentication, rate limiting, and CORS.
- `feed-service` - Manages user feeds, trending content, and feed generation.
- `identity-service` - Handles user authentication, registration, login, and identity management.
- `interaction-service` - Tracks likes, comments, follows, and other user interactions.
- `media-service` - Manages media uploads, storage, and retrieval.
- `post-service` - Handles blog post creation, updates, deletion, and publishing operations.
- `profile-service` - Manages user profiles, settings, and profile updates.
- `search-service` - Provides search functionality across posts, users, and other resources.
- `social-service` - Manages social connections, follows, and user relationships.

## Repository Structure

```
api-gateway/
feed-service/
identity-service/
interaction-service/
media-service/
post-service/
profile-service/
search-service/
social-service/
```

Each service contains its own `package.json` and application entry point under `src/server.js`.

## Getting Started

### Install dependencies

For each service:

```bash
cd <service-folder>
npm install
```

Example:

```bash
cd api-gateway
npm install
```

### Run a service

Run a service from its folder using Node:

```bash
cd <service-folder>
node src/server.js
```

Example:

```bash
cd identity-service
node src/server.js
```

> Note: Many services rely on environment variables, MongoDB, RabbitMQ, Redis, and other infrastructure. Be sure to configure each service's `.env` file and supporting services before starting.

## Notes

- The repository does not include a root orchestration script.
- Services are intended to run independently during development.
- For production deployment, consider using Docker, Kubernetes, or another orchestrator.


