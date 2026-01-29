@echo off
echo Installing test dependencies...
call bun add -d @types/jest @types/supertest supertest ts-jest ts-node

echo.
echo Dependencies installed!
echo.

echo Running unit tests...
call bun run test:unit

echo.

echo Running integration tests...
call bun run test:integration

echo.

echo Running all tests with coverage...
call bun run test:coverage

echo.
echo All tests completed!
echo.
echo Coverage report generated in ./coverage folder
