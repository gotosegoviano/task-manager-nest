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
```

### Environment variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=task_manager_db
PORT=3000
```

### Running PostgreSQL with Docker
```bash
docker-compose up -d
```

### Ejecutar las Migraciones
Para crear y aplicar el esquema de la base de datos, ejecuta el siguiente comando:
```bash
npm run migration:run
```

### Run the application
```bash
npm run start:dev
The API will be available at http://localhost:3000
```
# 📊 Analytics Module

This module provides a set of endpoints to gain deep insights into task status and team efficiency. It is designed to deliver key metrics that support decision-making and project monitoring.

---

## 1. Task Status Analytics

**Endpoint**: `GET /analytics/tasks/status`

This endpoint is essential for visual management and tracking overall project progress. It provides a summary of all tasks, categorized by their current status.

### Task Status Categories:
- **Active**: Tasks that are in progress and not yet completed.
- **Completed**: Tasks that have been successfully finished.
- **Overdue**: Tasks still active but past their due date.

### 📦 Example Response:

```json
{
  "activeTasksCount": 5,
  "activeTasksPercentage": 62.5,
  "completedTasksCount": 2,
  "completedTasksPercentage": 25,
  "overdueTasksCount": 1,
  "overdueTasksPercentage": 12.5,
  "totalTasksCount": 8
}
```

## 2. User Efficiency Analytics
**Endpoint**: `GET /analytics/users/efficiency`

Description: This endpoint evaluates each team member’s performance based on their assigned tasks.

### 📊 Metrics Provided:
- **assignedTasksCount**: Total number of tasks assigned to the user.
- **completedTasksCount**: Number of tasks the user has completed.
- **onTimeCompletedTasksCount**: Number of completed tasks delivered on or before their due date.
- **overdueCompletedTasksCount**: Number of completed tasks delivered after their due date.

### 📦 Example Response:
```json
[
  {
    "userId": "eefb153e-e9a8-4d2d-a069-19a1295d9f3d",
    "userName": "Juan Pérez",
    "assignedTasksCount": 3,
    "completedTasksCount": 2,
    "onTimeCompletedTasksCount": 1,
    "overdueCompletedTasksCount": 1
  },
  {
    "userId": "d72d6a3c-1b7f-4f0e-8c3b-7f3c4c8e7b9a",
    "userName": "Ana García",
    "assignedTasksCount": 5,
    "completedTasksCount": 3,
    "onTimeCompletedTasksCount": 3,
    "overdueCompletedTasksCount": 0
  }
]
```
