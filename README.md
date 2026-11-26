# School Management System API

A RESTful School Management System API built with **Node.js, Express.js, TypeScript, and PostgreSQL**. This project provides a modular backend architecture for managing school operations, including students, teachers, classes, subjects, attendance, examinations, academic results, and user accounts.

The API includes JWT authentication, Role-Based Access Control (RBAC), bcrypt password hashing, Zod request validation, centralized API response utilities, pagination, security middleware, and Swagger API documentation.

## Overview

The School Management System API is designed to simplify school administration through a structured REST API.

Administrators can manage users, student profiles, teacher profiles, classes, subjects, enrollments, attendance, examinations, and results.

The application uses PostgreSQL as its relational database and Neon as its cloud database provider.

## Features

### 1. Authentication and Authorization

- User registration
- User login
- Password hashing with bcryptjs
- JWT access token generation
- JWT token verification
- Protected API routes
- Role-Based Access Control (RBAC)
- Admin-only route protection
- User active-status verification
- Authenticated user information endpoint

### 2. User Management

- Get all users with pagination
- Get user by ID
- Update user information
- Update user active status
- Deactivate user accounts
- Duplicate email validation
- Admin self-protection

### 3. Student Management

- Create student profiles
- Get all students with pagination
- Get student by ID
- Update student information
- Delete student profiles
- Admission number validation
- Student and user relationship management

### 4. Teacher Management

- Create teacher profiles
- Get all teachers with pagination
- Get teacher by ID
- Update teacher information
- Delete teacher profiles
- Employee number validation
- Teacher and user relationship management

### 5. Profile Management

- Get authenticated user's profile
- Update profile information
- Update phone number
- Update address
- Update avatar URL
- Change account password
- Verify current password before changing it

### 6. Class Management

- Create classes
- Get all classes with pagination
- Get class by ID
- Update class information
- Assign teachers to classes
- Delete classes
- Duplicate class validation

### 7. Subject Management

- Create subjects
- Get all subjects with pagination
- Get subject by ID
- Update subjects
- Delete subjects
- Associate subjects with classes

### 8. Enrollment Management

- Enroll students into classes
- Get all enrollments with pagination
- Get enrollment by ID
- Update student enrollment
- Delete enrollments
- Prevent duplicate student enrollment in the same class

### 9. Attendance Management

- Create attendance records
- Get all attendance records with pagination
- Get attendance by ID
- Update attendance records
- Delete attendance records
- Attendance status validation

Supported attendance statuses:

- Present
- Absent
- Late
- Excused

### 10. Examination Management

- Create examinations
- Get all examinations with pagination
- Get examination by ID
- Update examination information
- Delete examinations
- Associate examinations with classes and subjects

### 11. Academic Result Management

- Create student results
- Get all results with pagination
- Get result by ID
- Update examination marks
- Update grades
- Delete results
- Prevent duplicate results for the same student and examination
- Validate obtained marks against examination total marks

### 12. Dashboard

- Total users
- Total students
- Total teachers
- Total classes
- Total subjects
- Total enrollments
- Total examinations
- Total results
- Today's attendance summary
- Recent students
- Recent teachers
- Recent examinations
- Recent results

### 13. API Security and Validation

- Helmet security headers
- CORS configuration
- JSON request body size limit
- Zod request validation
- Strict validation schemas
- Authentication rate limiting
- JWT-based protected routes
- Role-based access control
- Environment variable configuration

### 14. Error Handling and API Responses

- Centralized global error-handling middleware
- Centralized 404 Not Found middleware
- Standardized success responses
- Standardized paginated responses
- Validation error responses
- Duplicate record error handling
- Foreign key constraint error handling

### 15. API Documentation

- Swagger UI integration
- OpenAPI 3.0 specification
- Documented API endpoints
- Request body schemas
- JWT Bearer authentication support
- Interactive API testing through Swagger UI

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| TypeScript | Type Safety |
| PostgreSQL | Relational Database |
| Neon | Cloud PostgreSQL Database |
| node-postgres (pg) | Database Connection |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password Hashing |
| Zod | Request Validation |
| Helmet | Security Headers |
| express-rate-limit | Rate Limiting |
| Swagger UI Express | API Documentation |
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
│   ├── docs/
│   │   └── swagger.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── error.ts
│   │   ├── notFound.ts
│   │   ├── rateLimiter.ts
│   │   └── index.d.ts
│   │
│   ├── scripts/
│   │   └── create-admin.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── profile/
│   │   ├── classes/
│   │   ├── subjects/
│   │   ├── enrollments/
│   │   ├── attendance/
│   │   ├── exams/
│   │   ├── results/
│   │   └── dashboard/
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   └── apiResponse.ts
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

Each module follows a modular structure with separate files for:

- Interface
- Validation
- Service
- Controller
- Route

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

### 5. Create an Admin Account

Configure the following variables in `.env`:

```env
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
```

Run:

```bash
npm run create:admin
```

The script creates an administrator account with the `admin` role.

### 6. Run the Development Server

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
| `npm run create:admin` | Create an administrator account |

## API Documentation

After starting the development server, open:

```text
http://localhost:5000/api-docs
```

Swagger UI provides interactive documentation for the API.

Features include:

- View available API endpoints
- Inspect HTTP methods
- View request body schemas
- Test API endpoints
- Authorize requests using JWT Bearer tokens

### Base URL

```text
http://localhost:5000/api/v1
```

## API Endpoints

All protected endpoints require an access token in the Authorization header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 1. Authentication

Base path: `/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get authenticated user | Protected |
| GET | `/admin-test` | Test admin access | Admin |

### 2. User Management

Base path: `/users`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all users | Admin |
| GET | `/:id` | Get user by ID | Admin |
| PATCH | `/:id` | Update user | Admin |
| PATCH | `/:id/status` | Update user status | Admin |
| DELETE | `/:id` | Deactivate user | Admin |

### 3. Student Management

Base path: `/students`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all students | Admin |
| GET | `/:id` | Get student by ID | Admin |
| POST | `/` | Create student | Admin |
| PATCH | `/:id` | Update student | Admin |
| DELETE | `/:id` | Delete student profile | Admin |

### 4. Teacher Management

Base path: `/teachers`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all teachers | Admin |
| GET | `/:id` | Get teacher by ID | Admin |
| POST | `/` | Create teacher | Admin |
| PATCH | `/:id` | Update teacher | Admin |
| DELETE | `/:id` | Delete teacher profile | Admin |

### 5. Profile Management

Base path: `/profile`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/me` | Get own profile | Protected |
| PATCH | `/me` | Update own profile | Protected |
| PATCH | `/me/password` | Change password | Protected |

### 6. Class Management

Base path: `/classes`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all classes | Admin |
| GET | `/:id` | Get class by ID | Admin |
| POST | `/` | Create class | Admin |
| PATCH | `/:id` | Update class | Admin |
| DELETE | `/:id` | Delete class | Admin |

### 7. Subject Management

Base path: `/subjects`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all subjects | Admin |
| GET | `/:id` | Get subject by ID | Admin |
| POST | `/` | Create subject | Admin |
| PATCH | `/:id` | Update subject | Admin |
| DELETE | `/:id` | Delete subject | Admin |

### 8. Enrollment Management

Base path: `/enrollments`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all enrollments | Admin |
| GET | `/:id` | Get enrollment by ID | Admin |
| POST | `/` | Create enrollment | Admin |
| PATCH | `/:id` | Update enrollment | Admin |
| DELETE | `/:id` | Delete enrollment | Admin |

### 9. Attendance Management

Base path: `/attendance`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all attendance | Admin |
| GET | `/:id` | Get attendance by ID | Admin |
| POST | `/` | Create attendance | Admin |
| PATCH | `/:id` | Update attendance | Admin |
| DELETE | `/:id` | Delete attendance | Admin |

### 10. Examination Management

Base path: `/exams`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all examinations | Admin |
| GET | `/:id` | Get examination by ID | Admin |
| POST | `/` | Create examination | Admin |
| PATCH | `/:id` | Update examination | Admin |
| DELETE | `/:id` | Delete examination | Admin |

### 11. Result Management

Base path: `/results`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all results | Admin |
| GET | `/:id` | Get result by ID | Admin |
| POST | `/` | Create result | Admin |
| PATCH | `/:id` | Update result | Admin |
| DELETE | `/:id` | Delete result | Admin |

### 12. Dashboard

Base path: `/dashboard`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get complete dashboard data | Admin |

### Health Check

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | API welcome message | Public |
| GET | `/health` | Server health check | Public |

## User Roles

The system currently supports three user roles:

| Role | Description |
|---|---|
| Admin | Manages school operations and administrative modules |
| Teacher | Teacher account and profile support |
| Student | Student account and profile support |

Public registration assigns the default `student` role. Users cannot select the `admin` or `teacher` role through public registration.

Currently, management endpoints are protected with Admin-only access. Dedicated teacher and student permissions are planned for future development.

## Database Design

The project creates the following PostgreSQL tables:

1. `users`
2. `profiles`
3. `students`
4. `teachers`
5. `classes`
6. `subjects`
7. `enrollments`
8. `attendance`
9. `exams`
10. `results`

The database uses:

- Primary keys
- Foreign keys
- Unique constraints
- Check constraints
- One-to-one user profile relationships
- One-to-many academic relationships
- Cascading delete relationships where configured

## Authentication and Security

- Passwords are hashed using bcryptjs.
- JWT tokens are used for authentication.
- Protected routes require a valid Bearer token.
- User account status is checked against the database.
- Role-based access control restricts unauthorized access.
- Zod validates incoming request data.
- Strict validation schemas reject unexpected request properties.
- Helmet adds HTTP security headers.
- CORS controls cross-origin access.
- Authentication endpoints use rate limiting.
- JSON request body size is limited.
- Environment variables keep sensitive configuration outside source code.
- Public registration cannot assign administrative privileges.
- Password changes require verification of the current password.

## API Response Format

Successful API responses use a standardized structure.

Example:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Paginated endpoints include pagination metadata.

Example:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Error responses use a consistent structure.

Example:

```json
{
  "success": false,
  "message": "API endpoint not found",
  "path": "/api/v1/unknown",
  "method": "GET"
}
```

Validation errors may also include field-level error details.

## Pagination

List endpoints support pagination through query parameters.

Example:

```http
GET /api/v1/students?page=1&limit=10
```

Parameters:

| Parameter | Description | Default |
|---|---|---|
| `page` | Current page number | 1 |
| `limit` | Number of records per page | 10 |

The maximum supported page size is 100.

## Error Handling

The API includes:

- Global error-handling middleware
- 404 Not Found middleware
- Zod validation error handling
- Duplicate record error handling
- Foreign key constraint error handling
- Standardized error responses

## Testing

The API has been manually tested using Postman and Swagger UI.

Tested modules include:

- Authentication
- User Management
- Student Management
- Teacher Management
- Profile Management
- Class Management
- Subject Management
- Enrollment Management
- Attendance Management
- Examination Management
- Result Management
- Dashboard

CRUD operations, pagination, standardized responses, and protected routes have been tested for the implemented modules.

Additional negative-case and automated integration testing can be expanded as the project develops.

## Current Development Status

**Backend Core and Management Modules: Implemented**

The following are currently available:

- Express.js and TypeScript backend setup
- Neon PostgreSQL database connection
- Database table creation
- JWT authentication
- Role-based access control
- Admin account creation script
- All 11 management modules
- Dashboard statistics and recent records
- Global error-handling middleware
- Centralized 404 route handling
- Security middleware
- Authentication rate limiting
- Zod request validation
- Standardized API responses
- Pagination support
- Swagger / OpenAPI documentation

The project is currently in the backend development phase.

## Planned Improvements

- Automated unit and integration tests
- Enhanced database migration management
- More advanced authorization for teachers and students
- Enrollment-based result eligibility checks
- Attendance timezone configuration
- Last-admin protection
- Token revocation after password changes
- Configurable deployment CORS settings
- React + TypeScript frontend
- Admin dashboard interface
- Teacher dashboard
- Student dashboard
- Production deployment

## Contributing

Contributions, suggestions, and improvements are welcome.

If you find a bug or have an idea for improvement, feel free to open an issue or submit a pull request.

## Author

**Jahirul**

GitHub: https://github.com/jahir002201

Repository: https://github.com/jahir002201/school-management

## License

This project is currently developed for learning and educational purposes.