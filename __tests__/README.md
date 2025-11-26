# Test Suite

Comprehensive unit tests for database models and utilities.

## Structure

- `database/event.model.test.ts` - Event model tests (50+ cases)
- `database/booking.model.test.ts` - Booking model tests (40+ cases)
- `lib/mongodb.test.ts` - MongoDB connection tests (15+ cases)
- `database/index.test.ts` - Module export tests (5+ cases)

## Running Tests

\`\`\`bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
\`\`\`

## Coverage

- Event Model: Schema validation, slug generation, date/time normalization, CRUD, timestamps
- Booking Model: Schema validation, email validation, pre-save hooks, unique constraints, CRUD
- MongoDB Connection: Connection establishment, caching, error handling, URI formats
- Database Index: Export verification, type safety

## Prerequisites

MongoDB running on localhost:27017 or configured MONGODB_URI

## Notes

- Uses Jest with Next.js integration
- Test database: mongodb://localhost:27017/test-db
- Data cleanup after each test
- Mocked mongoose for connection tests