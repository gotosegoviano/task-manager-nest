# Task Manager API

This is a backend API for a Task Manager built with NestJS, TypeScript, and PostgreSQL.

## Features

- RESTful API with NestJS
- PostgreSQL database with TypeORM
- Environment variables management with @nestjs/config
- Code quality with ESLint and Prettier
- Dockerized PostgreSQL for easy setup

## Setup

### Requirements

- Node.js (v18+ recommended)
- Docker & Docker Compose

### Installation

```bash
git clone <repo-url>
cd task-manager
npm install

### Environment variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=task_manager_db
PORT=3000

### Running PostgreSQL with Docker
```bash
docker-compose up -d


### Run the application
```bash
npm run start:dev
The API will be available at http://localhost:3000.

### Contributing
Feel free to open issues and pull requests.