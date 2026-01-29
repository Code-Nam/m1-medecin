# API -name-

**API type:** `RESTful`
**Data format:** `JSON`

This API manages the backend solution for -name-, a medical appointment scheduling application. It provides endpoints for user authentication, appointment management, and data retrieval.

## Table of Contents

## Features

- User authentication (login, registration)
- Appointment scheduling and management
- Data retrieval for users and appointments
- Role-based access control (patients, doctors)

## Project Structure

## Prerequisites

- Bun v1.0.0 or higher or Node.js v14 or higher

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Code-Nam/m1-medecin.git
   cd m1-medecin/server
   ```

2. Install dependencies:

   ```bash
   bun install
    ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=8080
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

## Running the Server

Start the server with:

```bash
bun run src/index.ts
```

The server will be running at `http://localhost:8080` (or the port you specified).

## Testing

To run tests, use:

```bash
bun run test
```

## Build

To build the project for production, use:

```bash
bun run build
```

The built files will be located in the `dist` directory.

## Run production build

To run the production build, use:

```bash
bun run start
```

## Architecture & Technical choices

- Framework: Bun with TypeScript for high performance and type safety.
- Database: PostgreSQL for robust relational data management.
- ORM: Prisma for efficient database interactions.
- Authentication: JWT for secure user sessions.
- Testing: Bun's built-in testing framework for seamless test execution.
- Deployment: Render for easy cloud deployment and scalability.

## Collaborators

| Last name             | First name |
|-----------------------|------------|
| Chiche                | Raphaël    |
| Thierry-Bellefond     | Melvyn     |
| Tran                  | Anam       |

