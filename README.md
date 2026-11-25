# School Management System API

A RESTful School Management System API built with **Node.js, Express.js, TypeScript, and PostgreSQL**. This project is designed to manage school operations with a modular backend architecture, secure authentication, and role-based access control.

## Overview

The School Management System API provides the backend foundation for managing students, teachers, classes, subjects, attendance, examinations, and academic results.

The application uses JWT-based authentication and Role-Based Access Control (RBAC) to manage access for different user roles.

## Features

### Implemented

- User registration
- User login
- Password hashing with bcrypt
- JWT access token generation
- JWT token verification
- Protected API routes
- Role-based access control (RBAC)
- Admin-only route protection
- User account active-status verification
- Request validation using Zod
- PostgreSQL database connection
- Automatic database table creation
- Environment variable configuration
- TypeScript strict mode

### Planned Features

- Admin management
- Teacher management
- Student management
- Student profiles
- Class management
- Subject management
- Student enrollment
- Attendance management
- Examination management
- Academic result management

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| TypeScript | Type Safety |
| PostgreSQL | Relational Database |
| Neon | Cloud PostgreSQL Database |
| node-postgres (pg) | Database Connection |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Zod | Request Validation |
| dotenv | Environment Variables |
| CORS | Cross-Origin Resource Sharing |
| cookie-parser | Cookie Parsing |

## Project Structure

```text
school-management/
│
├── src/
│   ├── config/
│   │   └── index.ts
│   │
│   ├── db/
│   │   ├── index.ts
│   │   └── migrate.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── index.d.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.route.ts
│   │   │
│   │   ├── users/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── profile/
│   │   ├── classes/
│   │   ├── subjects/
│   │   ├── attendance/
│   │   ├── exams/
│   │   └── results/
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jahir002201/school-management.git
```

### 2. Navigate to the Project

```bash
cd school-management
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory.

```env
PORT=5000

DATABASE_URL="YOUR_NEON_DATABASE_URL"

JWT_SECRET=your_long_random_secret_key_at_least_32_characters

JWT_EXPIRES_IN=1d
```

Replace `YOUR_NEON_DATABASE_URL` with your Neon PostgreSQL connection string.

Generate a secure random JWT secret before running the application.

**Important:** Never share or commit your `.env` file.

### 5. Run the Development Server

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

The application connects to PostgreSQL and creates the required database tables during server startup.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript into JavaScript |
| `npm start` | Run the compiled application |

## API Endpoints

Base URL:

```text
http://localhost:5000/api/v1
```

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get authenticated user | Protected |
| GET | `/auth/admin-test` | Test admin-only access | Admin |

### Registration Request

```http
POST /api/v1/auth/register
```

Request Body:

```json
{
  "name": "Jahirul",
  "email": "jahir@example.com",
  "password": "password123"
}
```

### Login Request

```http
POST /api/v1/auth/login
```

Request Body:

```json
{
  "email": "jahir@example.com",
  "password": "password123"
}
```

A successful login returns a JWT access token.

### Get Authenticated User

```http
GET /api/v1/auth/me
```

Request Header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Admin-Only Test Route

```http
GET /api/v1/auth/admin-test
```

Only authenticated users with the `admin` role can access this endpoint.

## User Roles

The system currently supports three user roles:

| Role | Description |
|---|---|
| Admin | Full system management access (planned) |
| Teacher | Academic and student management access (planned) |
| Student | Personal academic information access (planned) |

Registration assigns the default `student` role. Public registration does not allow users to choose an admin or teacher role.

## Database Design

The project currently creates the following PostgreSQL tables:

1. users
2. profiles
3. students
4. teachers
5. classes
6. subjects
7. enrollments
8. attendance
9. exams
10. results

The database uses primary keys, foreign keys, unique constraints, and cascading relationships where appropriate.

## Authentication and Security

- Passwords are hashed using bcryptjs.
- JWT tokens are used for authentication.
- Protected routes require a valid Bearer token.
- User account status is checked against the database.
- Role-based access control restricts unauthorized access.
- Zod validates registration and login input.
- Environment variables keep sensitive configuration outside source code.

## Testing

API endpoints can be tested using **Postman** or any REST API client.

Recommended testing sequence:

1. Register a student account.
2. Login with the registered credentials.
3. Copy the returned access token.
4. Access `/api/v1/auth/me` using the Bearer token.
5. Access `/api/v1/auth/admin-test` using a student token and verify that the API returns `403 Forbidden`.

## Current Development Status

The project is under active development.

The initial backend setup, PostgreSQL connection, database table creation, authentication, JWT middleware, and basic role-based route protection have been implemented.

Additional school management modules and CRUD operations will be developed in upcoming phases.

## Future Improvements

- Complete CRUD operations for all modules
- Secure admin account management
- Teacher and student management
- Attendance tracking
- Examination and result processing
- Profile management
- Improved error handling
- API documentation with Swagger
- Automated testing
- Production deployment

## Contributing

Contributions, suggestions, and improvements are welcome.

If you find a bug or have an idea for improvement, feel free to open an issue or submit a pull request.

## Author

**Jahirul**

GitHub: https://github.com/jahir002201

## License

This project is currently developed for learning and educational purposes.