# M1 Medecin API - Backend Server

Complete REST API for medical appointment management with multi-practitioner support, secretary management, and role-based access control.

## 📋 Table of Contents

-   [Features](#-features)
-   [Prerequisites](#-prerequisites)
-   [Installation](#-installation)
-   [Configuration](#️-configuration)
-   [Running the Server](#-running-the-server)
-   [API Documentation](#-api-documentation)
    -   [Authentication](#authentication)
    -   [Patients](#patients)
    -   [Doctors](#doctors)
    -   [Appointments](#appointments)
    -   [Secretaries](#secretaries)
    -   [Availability](#availability)
-   [Error Handling](#-error-handling)
-   [Testing](#-testing)
-   [Database](#️-database)
-   [Development](#️-development)

---

## ✨ Features

-   🔐 **JWT Authentication** - Secure authentication for patients, doctors, and secretaries
-   👥 **Patient Management** - Complete CRUD operations with profile management
-   👨‍⚕️ **Doctor Management** - Doctor profiles with specializations and schedules
-   📅 **Appointment System** - Full appointment lifecycle with status tracking
-   🏥 **Multi-Practitioner Support** - Clinic management with multiple doctors
-   👔 **Secretary Management** - Administrative staff with multi-clinic access
-   ⏰ **Availability Management** - Automated time slot generation and booking
-   📄 **Pagination** - Efficient data retrieval on all list endpoints
-   ✅ **Data Validation** - Request validation using Zod schemas
-   🛡️ **Role-Based Access Control** - Fine-grained permissions system
-   📝 **Comprehensive Logging** - Winston-based logging across all layers
-   🚨 **Centralized Error Handling** - Consistent error responses

---

## 🔧 Prerequisites

-   **Node.js 18+** or **Bun runtime**
-   **PostgreSQL 14+**
-   **npm** or **bun** package manager

---

## 📦 Installation

```bash
# Install dependencies
bun install
# or
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
bun run db:generate

# Create/update database schema
bun run db:push

# Or run migrations
bun run db:migrate
```

---

## ⚙️ Configuration

Create a `.env` file in the `server` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/m1_medecin?schema=public"

# Server
HTTP_PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

---

## 🚀 Running the Server

```bash
# Development mode (with hot reload)
bun run dev

# Production mode
bun run start

# Run tests
bun run test
```

Server will be available at: `http://localhost:3000`

---

## 📚 API Documentation

### Base URL

```text
http://localhost:3000/v1
```

### Authentication Headers

All authenticated endpoints require a JWT token:

```http
Authorization: Bearer <your_jwt_token>
```

---

## Authentication

### Register Patient

**POST** `/auth/patients/register`

Creates a new patient account.

**Request Body:**

```json
{
    "firstName": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "address": "123 Main St, City, Country"
}
```

**Response (201 Created):**

```json
{
    "user": {
        "id": "patient-uuid",
        "email": "john.doe@example.com",
        "role": "PATIENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login Patient

**POST** `/auth/patients/login`

Authenticates a patient and returns a JWT token.

**Request Body:**

```json
{
    "email": "john.doe@example.com",
    "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
    "user": {
        "id": "patient-uuid",
        "email": "john.doe@example.com",
        "role": "PATIENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login Doctor

**POST** `/auth/doctors/login`

Authenticates a doctor and returns a JWT token.

**Request Body:**

```json
{
    "email": "dr.smith@example.com",
    "password": "doctorPassword123"
}
```

**Response (200 OK):**

```json
{
    "user": {
        "id": "doctor-uuid",
        "email": "dr.smith@example.com",
        "role": "DOCTOR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login Secretary

**POST** `/auth/secretaries/login`

Authenticates a secretary and returns a JWT token.

**Request Body:**

```json
{
    "email": "secretary@clinic.com",
    "password": "secretaryPassword123"
}
```

**Response (200 OK):**

```json
{
    "user": {
        "id": "secretary-uuid",
        "email": "secretary@clinic.com",
        "role": "SECRETARY"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Patients

### Get All Patients

**GET** `/patients`

Retrieves a paginated list of patients.

**Authentication:** Required (Doctor, Secretary)

**Query Parameters:**

-   `page` (number, default: 1) - Page number
-   `limit` (number, default: 10) - Items per page

**Request:**

```http
GET /v1/patients?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "data": [
        {
            "id": "patient-uuid",
            "firstName": "John",
            "surname": "Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "dateOfBirth": "1990-01-15",
            "address": "123 Main St",
            "assigned_doctor": "doctor-uuid",
            "createdAt": "2024-01-15T10:30:00Z",
            "updatedAt": "2024-01-15T10:30:00Z"
        }
    ],
    "pagination": {
        "total": 45,
        "page": 1,
        "limit": 10,
        "totalPages": 5
    }
}
```

---

### Get Patient by ID

**GET** `/patients/:id`

Retrieves a specific patient by ID.

**Authentication:** Required (Patient themselves, Doctor, Secretary)

**Request:**

```http
GET /v1/patients/patient-uuid
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "id": "patient-uuid",
    "firstName": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "address": "123 Main St",
    "assigned_doctor": "doctor-uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### Create Patient

**POST** `/patients`

Creates a new patient (public endpoint for registration).

**Authentication:** Not required

**Request Body:**

```json
{
    "firstName": "Jane",
    "surname": "Smith",
    "email": "jane.smith@example.com",
    "password": "securePassword123",
    "phone": "+1234567891",
    "dateOfBirth": "1995-05-20",
    "address": "456 Oak Ave",
    "assigned_doctor": "doctor-uuid"
}
```

**Response (201 Created):**

```json
{
    "message": "Patient created successfully",
    "patient": {
        "id": "new-patient-uuid",
        "firstName": "Jane",
        "surname": "Smith",
        "email": "jane.smith@example.com",
        "phone": "+1234567891",
        "dateOfBirth": "1995-05-20",
        "address": "456 Oak Ave",
        "assigned_doctor": "doctor-uuid",
        "createdAt": "2024-01-15T11:00:00Z",
        "updatedAt": "2024-01-15T11:00:00Z"
    }
}
```

---

### Update Patient

**PUT** `/patients/:id`

Updates a patient's information.

**Authentication:** Required (Patient themselves, Doctor, Secretary)

**Request:**

```http
PUT /v1/patients/patient-uuid
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "phone": "+1234567899",
    "address": "789 New Address St"
}
```

**Response (200 OK):**

```json
{
    "id": "patient-uuid",
    "firstName": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567899",
    "dateOfBirth": "1990-01-15",
    "address": "789 New Address St",
    "assigned_doctor": "doctor-uuid",
    "updatedAt": "2024-01-15T12:00:00Z"
}
```

---

### Delete Patient

**DELETE** `/patients/:id`

Deletes a patient account.

**Authentication:** Required (Patient themselves, Doctor, Secretary)

**Request:**

```http
DELETE /v1/patients/patient-uuid
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## Doctors

### Get All Doctors

**GET** `/doctors`

Retrieves a paginated list of doctors.

**Authentication:** Required

**Query Parameters:**

-   `page` (number, default: 1) - Page number
-   `limit` (number, default: 10) - Items per page

**Request:**

```http
GET /v1/doctors?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "data": [
        {
            "id": "doctor-uuid",
            "firstName": "Robert",
            "surname": "Smith",
            "email": "dr.smith@example.com",
            "phone": "+1234567800",
            "title": "Dr.",
            "specialization": "Cardiology",
            "openingTime": "09:00",
            "closingTime": "17:00",
            "slotDuration": 30,
            "createdAt": "2024-01-10T08:00:00Z",
            "updatedAt": "2024-01-10T08:00:00Z"
        }
    ],
    "pagination": {
        "total": 12,
        "page": 1,
        "limit": 10,
        "totalPages": 2
    }
}
```

---

### Get All Doctors (No Pagination)

**GET** `/doctors/all`

Retrieves all doctors without pagination (for dropdown selects).

**Authentication:** Required

**Request:**

```http
GET /v1/doctors/all
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
[
    {
        "id": "doctor-uuid-1",
        "firstName": "Robert",
        "surname": "Smith",
        "specialization": "Cardiology"
    },
    {
        "id": "doctor-uuid-2",
        "firstName": "Emily",
        "surname": "Johnson",
        "specialization": "Pediatrics"
    }
]
```

---

### Get Doctor by ID

**GET** `/doctors/:id`

Retrieves a specific doctor by ID.

**Authentication:** Required

**Request:**

```http
GET /v1/doctors/doctor-uuid
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "id": "doctor-uuid",
    "firstName": "Robert",
    "surname": "Smith",
    "email": "dr.smith@example.com",
    "phone": "+1234567800",
    "title": "Dr.",
    "specialization": "Cardiology",
    "openingTime": "09:00",
    "closingTime": "17:00",
    "slotDuration": 30,
    "createdAt": "2024-01-10T08:00:00Z",
    "updatedAt": "2024-01-10T08:00:00Z"
}
```

---

### Create Doctor

**POST** `/doctors`

Creates a new doctor account.

**Authentication:** Not required (for initial setup)

**Request Body:**

```json
{
    "firstName": "Emily",
    "surname": "Johnson",
    "email": "dr.johnson@example.com",
    "password": "doctorPassword123",
    "phone": "+1234567801",
    "title": "Dr.",
    "specialization": "Pediatrics",
    "openingTime": "08:00",
    "closingTime": "16:00",
    "slotDuration": 20
}
```

**Response (201 Created):**

```json
{
    "message": "Doctor created successfully",
    "doctor": {
        "id": "new-doctor-uuid",
        "firstName": "Emily",
        "surname": "Johnson",
        "email": "dr.johnson@example.com",
        "phone": "+1234567801",
        "title": "Dr.",
        "specialization": "Pediatrics",
        "openingTime": "08:00",
        "closingTime": "16:00",
        "slotDuration": 20,
        "createdAt": "2024-01-15T09:00:00Z",
        "updatedAt": "2024-01-15T09:00:00Z"
    }
}
```

---

### Update Doctor

**PUT** `/doctors/:id`

Updates a doctor's information.

**Authentication:** Required (Doctor themselves, Secretary)

**Request:**

```http
PUT /v1/doctors/doctor-uuid
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "phone": "+1234567802",
    "openingTime": "08:30",
    "closingTime": "17:30",
    "slotDuration": 25
}
```

**Response (200 OK):**

```json
{
    "id": "doctor-uuid",
    "firstName": "Robert",
    "surname": "Smith",
    "email": "dr.smith@example.com",
    "phone": "+1234567802",
    "title": "Dr.",
    "specialization": "Cardiology",
    "openingTime": "08:30",
    "closingTime": "17:30",
    "slotDuration": 25,
    "updatedAt": "2024-01-15T13:00:00Z"
}
```

---

### Delete Doctor

**DELETE** `/doctors/:id`

Deletes a doctor account.

**Authentication:** Required (Doctor themselves, Secretary)

**Request:**

```http
DELETE /v1/doctors/doctor-uuid
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## Appointments

### Get Appointments

**GET** `/appointments`

Retrieves appointments based on user role and query parameters.

**Authentication:** Required

**Query Parameters:**

-   `doctorId` (string) - Filter by doctor ID
-   `patientId` (string) - Filter by patient ID
-   `status` (string) - Filter by status (PENDING, CONFIRMED, CANCELLED, DOCTOR_CREATED, COMPLETED)
-   `date` (string) - Filter by date (dd-MM-yyyy format)
-   `page` (number, default: 1) - Page number
-   `limit` (number, default: 10) - Items per page

**Access Control:**

-   **Patients**: Can only see their own appointments
-   **Doctors**: Can see appointments assigned to them
-   **Secretaries**: Can see all appointments

**Request:**

```http
GET /v1/appointments?doctorId=doctor-uuid&status=CONFIRMED&page=1&limit=10
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "data": [
        {
            "id": "appointment-uuid",
            "appointedPatient": "patient-uuid",
            "appointedDoctor": "doctor-uuid",
            "date": "25-01-2024",
            "time": "10:30",
            "reason": "Regular checkup",
            "status": "CONFIRMED",
            "notes": "Patient reports feeling well",
            "slotId": "slot-uuid",
            "createdAt": "2024-01-15T14:00:00Z",
            "updatedAt": "2024-01-15T14:00:00Z"
        }
    ],
    "pagination": {
        "total": 23,
        "page": 1,
        "limit": 10,
        "totalPages": 3
    }
}
```

---

### Get Appointment by ID

**GET** `/appointments/:appointmentId`

Retrieves a specific appointment by ID.

**Authentication:** Required

**Access Control:**

-   **Patients**: Can only view their own appointments
-   **Doctors**: Can view appointments assigned to them
-   **Secretaries**: Can view all appointments

**Request:**

```http
GET /v1/appointments/appointment-uuid
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "id": "appointment-uuid",
    "appointedPatient": "patient-uuid",
    "appointedDoctor": "doctor-uuid",
    "date": "25-01-2024",
    "time": "10:30",
    "reason": "Regular checkup",
    "status": "CONFIRMED",
    "notes": "Patient reports feeling well",
    "slotId": "slot-uuid",
    "patient": {
        "id": "patient-uuid",
        "firstName": "John",
        "surname": "Doe"
    },
    "doctor": {
        "id": "doctor-uuid",
        "firstName": "Robert",
        "surname": "Smith",
        "specialization": "Cardiology"
    },
    "createdAt": "2024-01-15T14:00:00Z",
    "updatedAt": "2024-01-15T14:00:00Z"
}
```

---

### Create Appointment

**POST** `/appointments`

Creates a new appointment.

**Authentication:** Required

**Request:**

```http
POST /v1/appointments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "appointedPatient": "patient-uuid",
    "appointedDoctor": "doctor-uuid",
    "date": "30-01-2024",
    "time": "14:30",
    "reason": "Follow-up consultation",
    "notes": "Bring previous test results",
    "slotId": "slot-uuid",
    "status": "PENDING"
}
```

**Response (201 Created):**

```json
{
    "message": "Appointment created successfully",
    "appointment": {
        "id": "new-appointment-uuid",
        "appointedPatient": "patient-uuid",
        "appointedDoctor": "doctor-uuid",
        "date": "30-01-2024",
        "time": "14:30",
        "reason": "Follow-up consultation",
        "status": "PENDING",
        "notes": "Bring previous test results",
        "slotId": "slot-uuid",
        "createdAt": "2024-01-15T15:00:00Z",
        "updatedAt": "2024-01-15T15:00:00Z"
    }
}
```

---

### Update Appointment

**PUT** `/appointments/:appointmentId`

Updates an existing appointment.

**Authentication:** Required

**Access Control:**

-   **Patients**: Can update their own appointments (limited fields)
-   **Doctors**: Can update appointments assigned to them
-   **Secretaries**: Can update all appointments

**Request:**

```http
PUT /v1/appointments/appointment-uuid
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "date": "31-01-2024",
    "time": "15:00",
    "status": "CONFIRMED",
    "notes": "Patient confirmed availability"
}
```

**Response (200 OK):**

```json
{
    "id": "appointment-uuid",
    "appointedPatient": "patient-uuid",
    "appointedDoctor": "doctor-uuid",
    "date": "31-01-2024",
    "time": "15:00",
    "reason": "Follow-up consultation",
    "status": "CONFIRMED",
    "notes": "Patient confirmed availability",
    "updatedAt": "2024-01-15T16:00:00Z"
}
```

---

### Delete Appointment

**DELETE** `/appointments/:appointmentId`

Deletes an appointment.

**Authentication:** Required

**Access Control:**

-   **Patients**: Can delete their own appointments
-   **Doctors**: Can delete appointments assigned to them
-   **Secretaries**: Can delete all appointments

**Request:**

```http
DELETE /v1/appointments/appointment-uuid
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## Secretaries

### Get All Secretaries

**GET** `/secretaries`

Retrieves a paginated list of secretaries.

**Authentication:** Required (Secretary, Doctor)

**Query Parameters:**

-   `page` (number, default: 1) - Page number
-   `limit` (number, default: 10) - Items per page

**Request:**

```http
GET /v1/secretaries?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "data": [
        {
            "id": "secretary-uuid",
            "firstName": "Alice",
            "surname": "Brown",
            "email": "alice.brown@clinic.com",
            "phone": "+1234567820",
            "managedDoctors": ["doctor-uuid-1", "doctor-uuid-2"],
            "createdAt": "2024-01-10T09:00:00Z",
            "updatedAt": "2024-01-10T09:00:00Z"
        }
    ],
    "pagination": {
        "total": 5,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}
```

---

### Get Secretary by ID

**GET** `/secretaries/:secretaryId`

Retrieves a specific secretary by ID.

**Authentication:** Required (Secretary, Doctor)

**Request:**

```http
GET /v1/secretaries/secretary-uuid
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "id": "secretary-uuid",
    "firstName": "Alice",
    "surname": "Brown",
    "email": "alice.brown@clinic.com",
    "phone": "+1234567820",
    "managedDoctors": ["doctor-uuid-1", "doctor-uuid-2"],
    "createdAt": "2024-01-10T09:00:00Z",
    "updatedAt": "2024-01-10T09:00:00Z"
}
```

---

### Create Secretary

**POST** `/secretaries`

Creates a new secretary account.

**Authentication:** Required (Doctor, Secretary)

**Request:**

```http
POST /v1/secretaries
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "firstName": "Sarah",
    "surname": "Williams",
    "email": "sarah.williams@clinic.com",
    "password": "secretaryPassword123",
    "phone": "+1234567821",
    "doctorIds": ["doctor-uuid-1", "doctor-uuid-2"]
}
```

**Response (201 Created):**

```json
{
    "message": "Secretary created successfully",
    "secretary": {
        "id": "new-secretary-uuid",
        "firstName": "Sarah",
        "surname": "Williams",
        "email": "sarah.williams@clinic.com",
        "phone": "+1234567821",
        "managedDoctors": ["doctor-uuid-1", "doctor-uuid-2"],
        "createdAt": "2024-01-15T17:00:00Z",
        "updatedAt": "2024-01-15T17:00:00Z"
    }
}
```

---

### Update Secretary

**PUT** `/secretaries/:secretaryId`

Updates a secretary's information.

**Authentication:** Required (Secretary themselves, Doctor)

**Request:**

```http
PUT /v1/secretaries/secretary-uuid
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "phone": "+1234567822",
    "doctorIds": ["doctor-uuid-1", "doctor-uuid-2", "doctor-uuid-3"]
}
```

**Response (200 OK):**

```json
{
    "id": "secretary-uuid",
    "firstName": "Alice",
    "surname": "Brown",
    "email": "alice.brown@clinic.com",
    "phone": "+1234567822",
    "managedDoctors": ["doctor-uuid-1", "doctor-uuid-2", "doctor-uuid-3"],
    "updatedAt": "2024-01-15T18:00:00Z"
}
```

---

### Delete Secretary

**DELETE** `/secretaries/:secretaryId`

Deletes a secretary account.

**Authentication:** Required (Secretary themselves, Doctor)

**Request:**

```http
DELETE /v1/secretaries/secretary-uuid
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## Availability

### Generate Time Slots

**POST** `/availability/:id/generate`

Generates available time slots for a doctor based on their schedule.

**Authentication:** Required (Doctor, Secretary)

**Path Parameters:**

-   `id` (string) - Doctor ID

**Request:**

```http
POST /v1/availability/doctor-uuid/generate
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "startDate": "2024-02-01",
    "endDate": "2024-02-28",
    "excludedDays": [0, 6]
}
```

**Note:**

-   `excludedDays` is an array of day numbers (0 = Sunday, 6 = Saturday)
-   Slots are generated based on doctor's `openingTime`, `closingTime`, and `slotDuration`

**Response (201 Created):**

```json
{
    "message": "Generated 160 time slots for Dr. Smith",
    "slotsCreated": 160,
    "doctorId": "doctor-uuid",
    "dateRange": {
        "start": "2024-02-01",
        "end": "2024-02-28"
    }
}
```

---

### Get Available Slots

**GET** `/availability/:id/slots`

Retrieves available (unbooked) time slots for a doctor.

**Authentication:** Not required (public endpoint)

**Path Parameters:**

-   `id` (string) - Doctor ID

**Query Parameters:**

-   `date` (string) - Filter by date (yyyy-MM-dd format)
-   `startDate` (string) - Filter from date
-   `endDate` (string) - Filter to date

**Request:**

```http
GET /v1/availability/doctor-uuid/slots?date=2024-02-15
```

**Response (200 OK):**

```json
{
    "doctorId": "doctor-uuid",
    "slots": [
        {
            "id": "slot-uuid-1",
            "doctorId": "doctor-uuid",
            "date": "2024-02-15",
            "startTime": "09:00",
            "endTime": "09:30",
            "isBooked": false,
            "createdAt": "2024-01-15T10:00:00Z"
        },
        {
            "id": "slot-uuid-2",
            "doctorId": "doctor-uuid",
            "date": "2024-02-15",
            "startTime": "09:30",
            "endTime": "10:00",
            "isBooked": false,
            "createdAt": "2024-01-15T10:00:00Z"
        }
    ],
    "total": 16
}
```

---

### Cleanup Past Slots

**POST** `/availability/cleanup`

Deletes time slots older than the current date.

**Authentication:** Required (Doctor, Secretary)

**Request:**

```http
POST /v1/availability/cleanup
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
    "message": "Cleaned up 342 past time slots",
    "deletedCount": 342
}
```

---

## 🚨 Error Handling

The API uses standardized error responses with appropriate HTTP status codes.

### Error Response Format

```json
{
    "error": {
        "message": "Error description",
        "code": "ERROR_CODE",
        "statusCode": 400
    }
}
```

### HTTP Status Codes

| Status Code | Description                                                |
| ----------- | ---------------------------------------------------------- |
| `200`       | Success - Request completed successfully                   |
| `201`       | Created - Resource created successfully                    |
| `204`       | No Content - Request successful, no content to return      |
| `400`       | Bad Request - Invalid request data or validation error     |
| `401`       | Unauthorized - Missing or invalid authentication token     |
| `403`       | Forbidden - User doesn't have permission                   |
| `404`       | Not Found - Resource not found                             |
| `409`       | Conflict - Resource already exists (e.g., duplicate email) |
| `500`       | Internal Server Error - Unexpected server error            |

### Common Error Types

#### 1. Validation Error (400)

```json
{
    "error": {
        "message": "Validation failed",
        "code": "VALIDATION_ERROR",
        "statusCode": 400,
        "details": [
            {
                "field": "email",
                "message": "Invalid email format"
            }
        ]
    }
}
```

#### 2. Authentication Error (401)

```json
{
    "error": {
        "message": "Invalid credentials",
        "code": "UNAUTHORIZED",
        "statusCode": 401
    }
}
```

#### 3. Authorization Error (403)

```json
{
    "error": {
        "message": "You don't have permission to access this resource",
        "code": "FORBIDDEN",
        "statusCode": 403
    }
}
```

#### 4. Not Found Error (404)

```json
{
    "error": {
        "message": "Patient not found",
        "code": "NOT_FOUND",
        "statusCode": 404
    }
}
```

#### 5. Conflict Error (409)

```json
{
    "error": {
        "message": "Email already exists",
        "code": "CONFLICT",
        "statusCode": 409
    }
}
```

---

## 🧪 Testing

The project includes comprehensive unit and integration tests.

### Running Tests

```bash
# Run all tests
bun run test

# Run unit tests only
bun run test test/unit

# Run integration tests only
bun run test test/integration

# Run tests with coverage
bun run test --coverage

# Run tests in watch mode
bun run test --watch
```

### Test Coverage

Current test coverage:

-   **Unit Tests**: 48/48 passing (100%)

    -   Doctor Controller: 11 tests
    -   Patient Controller: 14 tests
    -   Appointment Controller: 12 tests
    -   All services and utilities covered

-   **Integration Tests**: In progress
    -   HTTP endpoint testing
    -   Database integration
    -   Authentication flow

### Test Documentation

See detailed testing documentation:

-   `test/TEST_RESULTS.md` - Test results and status
-   `test/TESTING_SUMMARY.md` - Testing patterns and guidelines

---

## 🗄️ Database

### Database Schema

The application uses PostgreSQL with Prisma ORM. Schema is defined in `prisma/schema.prisma`.

### Database Commands

```bash
# Generate Prisma client
bun run db:generate

# Push schema changes to database (development)
bun run db:push

# Create a new migration
bun run db:migrate

# View database in Prisma Studio
bun run db:studio

# Reset database (WARNING: deletes all data)
bun run db:reset
```

### Main Tables

-   **Users** - Base user authentication (email, password, role)
-   **Patients** - Patient profiles and information
-   **Doctors** - Doctor profiles with specialization and schedules
-   **Secretaries** - Secretary accounts
-   **Appointments** - Appointment records
-   **TimeSlots** - Available time slots for bookings

---

## 🛠️ Development

### Project Structure

```text
server/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── data-access/      # Database access layer
│   ├── middlewares/      # Express middlewares
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── errors/           # Custom error classes
│   └── app.ts            # Express application setup
├── test/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

### Coding Standards

-   **TypeScript** - Strict mode enabled
-   **ESLint** - Code linting
-   **Prettier** - Code formatting
-   **Conventional Commits** - Commit message format

### Architecture Patterns

-   **Layered Architecture** - Controllers → Services → Data Access
-   **Dependency Injection** - Service composition
-   **Interface Segregation** - Clean service interfaces
-   **Repository Pattern** - Data access abstraction
-   **Factory Pattern** - Object creation

---

## 📝 TODO List

### Testing

-   [x] Unit tests for controllers
-   [x] Unit tests for services
-   [ ] Integration tests refinement
-   [ ] E2E tests

### Documentation

-   [x] API documentation in README
-   [ ] Swagger/OpenAPI documentation
-   [ ] JSDoc for all functions
-   [ ] API collection (Bruno/Postman)

### Features

-   [ ] Email notifications (appointment confirmation/reminder)
-   [ ] File upload (patient documents)
-   [ ] SMS notifications
-   [ ] Multi-language support (i18n)
-   [ ] Advanced search and filtering
-   [ ] Export reports (PDF, Excel)

### Security & Performance

-   [ ] Rate limiting
-   [ ] API key authentication
-   [ ] Input sanitization
-   [ ] SQL injection prevention
-   [ ] XSS protection
-   [ ] Helmet security headers
-   [ ] Request compression
-   [ ] Caching strategy

### DevOps

-   [ ] Docker containerization
-   [ ] CI/CD pipeline
-   [ ] Monitoring and alerting
-   [ ] Logging aggregation
-   [ ] Health check endpoints
-   [ ] Database backups

### Code Quality

-   [x] Winston logging integration
-   [x] Custom error handling
-   [x] Data access layer
-   [ ] Code linting automation
-   [ ] Pre-commit hooks
-   [ ] Code review guidelines

---

## 📄 License

This project is part of the M1 Medecin application.

---

## 👥 Contributors

Backend development team - M1 Medecin Project

---

**Last Updated:** January 2024