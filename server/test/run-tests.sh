#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Installing test dependencies...${NC}"
bun add -d @types/jest @types/supertest supertest ts-jest ts-node

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Running tests...${NC}"
echo ""

# Run unit tests
echo -e "${YELLOW}Running unit tests...${NC}"
bun run test:unit

echo ""

# Run integration tests
echo -e "${YELLOW}Running integration tests...${NC}"
bun run test:integration

echo ""

# Run all tests with coverage
echo -e "${YELLOW}Running all tests with coverage...${NC}"
bun run test:coverage

echo ""
echo -e "${GREEN}✓ All tests completed!${NC}"
echo ""
echo -e "${YELLOW}Coverage report generated in ./coverage folder${NC}"
