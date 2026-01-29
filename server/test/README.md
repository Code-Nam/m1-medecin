# Test Suite

This directory contains unit and integration tests for the server application.

## Structure

```plaintext
test/
├── unit/               # Unit tests (isolated component testing)
│   └── controllers/    # Controller unit tests
├── integration/        # Integration tests (API endpoint testing)
│   └── controllers/    # Controller integration tests
├── mocks/              # Mock data and utilities
└── setup.ts            # Jest setup configuration
```

## Running Tests

```bash
# Run all tests
bun test

# Run unit tests only
bun test -- unit

# Run integration tests only
bun test -- integration

# Run tests in watch mode
bun test -- --watch

# Run tests with coverage
bun test -- --coverage

# Run specific test file
bun test -- authController.test.ts
```

## Test Types

### Unit Tests

- Test individual components in isolation
- Mock all dependencies (services, database, etc.)
- Fast execution
- Focus on business logic

### Integration Tests

- Test API endpoints end-to-end
- Use mocked database
- Test HTTP requests/responses
- Validate middleware and routing

## Writing Tests

### Unit Test Example

```typescript
describe("ControllerName", () => {
    let controller: ControllerName;
    let mockService: jest.Mocked<ServiceType>;

    beforeEach(() => {
        mockService = {
            method: jest.fn(),
        } as any;
        controller = new ControllerName(mockService);
    });

    it("should handle success case", async () => {
        mockService.method.mockResolvedValue(expectedData);
        // ... test implementation
    });
});
```

### Integration Test Example

```typescript
describe("POST /api/resource", () => {
    it("should create resource successfully", async () => {
        const response = await request(app)
            .post("/api/resource")
            .send(testData)
            .expect(201);

        expect(response.body).toHaveProperty("id");
    });
});
```

## Mocking

### Prisma Mock

Use the centralized Prisma mock from `test/mocks/prisma.mock.ts`:

```typescript
import { mockPrismaClient, resetAllMocks } from "../../mocks/prisma.mock";

beforeEach(() => {
    resetAllMocks();
});

// Use in tests
mockPrismaClient.patient.findUnique.mockResolvedValue(mockData);
```

## Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Cover all API endpoints
- Focus on critical business logic and error handling

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear test descriptions
3. **One Assertion Focus**: Test one thing per test
4. **Mock External Dependencies**: Isolate what you're testing
5. **Clean Up**: Reset mocks and state between tests
6. **Use TypeScript**: Maintain type safety in tests
