# AuthController Tests

This directory contains unit and integration tests for the AuthController.

## Test Files

- **authController.test.ts** (unit) - Unit tests with mocked dependencies
- **authController.test.ts** (integration) - Integration tests with HTTP requests

## Running Tests

```bash
# Run all auth tests
bun test authController

# Run unit tests only
bun test unit/controllers/authController

# Run integration tests only
bun test integration/controllers/authController

# Run with coverage
bun test authController -- --coverage
```

## Test Coverage

### Unit Test Coverage

- ✅ loginPatient - success and error cases
- ✅ registerPatient - success, duplicate email, validation errors
- ✅ loginDoctor - success and error cases
- ✅ loginSecretary - success and error cases

### Integration Test Coverage

- ✅ POST /api/auth/patient/login - 200, 401, 404, 400 responses
- ✅ POST /api/auth/patient/register - 201, 409, 400 responses
- ✅ POST /api/auth/doctor/login - 200, 401 responses
- ✅ POST /api/auth/secretary/login - 200, 404 responses

## Mocking Strategy

### Unit Tests

- Mock `authService` methods
- Mock logger to avoid console output
- Test controller logic in isolation

### Integration Tests

- Mock Prisma database client
- Mock bcrypt for password hashing
- Test full HTTP request/response cycle
- Use supertest for API testing

## Test Data

Example test data can be found in the test files. Each test creates its own mock data to ensure test isolation.

## Adding New Tests

When adding new authentication methods:

1. Add unit tests in `test/unit/controllers/authController.test.ts`
2. Add integration tests in `test/integration/controllers/authController.test.ts`
3. Mock any new dependencies
4. Update this README with coverage information
