# Salary Management Tool

## Overview

This repository contains a Rails API backend and a React frontend for a salary management tool with employee CRUD, search, pagination, and salary insights.

## Backend Setup

1. Install Ruby dependencies:
   ```bash
   bundle install
   ```
2. Create and migrate the database:
   ```bash
   bin/rails db:create db:migrate
   ```
3. Seed 10,000 employees:
   ```bash
   bin/rails db:seed
   ```
4. Start the Rails server:
   ```bash
   bin/rails server
   ```

## Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the app in your browser at `http://localhost:5173`.

## Architecture

- Rails API-only backend using thin controllers and service objects.
- `Employee` model with validations, database indexes, and cache invalidation hooks.
- `SalaryInsightsService` executes aggregation queries using SQL and window functions.
- React frontend built with Vite, Axios, and Tailwind CSS.

## Performance Considerations

- Database indexes on `email`, `country`, `job_title`, and `[country, job_title]`.
- Pagination implemented with SQL `OFFSET` and `LIMIT`.
- Search uses case-insensitive SQL filtering.
- Salary insights use SQL aggregates rather than Ruby loops.
- Seed script uses bulk insert (`insert_all`) for fast 10,000 record creation.
- Rails cache is used for salary insights results with expiration.

## Tests

Run the backend test suite with:
```bash
bin/rails test
```

## API Endpoints

- `GET /api/v1/employees`
- `GET /api/v1/employees/:id`
- `POST /api/v1/employees`
- `PATCH /api/v1/employees/:id`
- `DELETE /api/v1/employees/:id`
- `GET /api/v1/salary_insights?country=...`
