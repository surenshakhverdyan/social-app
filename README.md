# Social Website API

A NestJS-based social website API that provides user authentication, friend management, and user search capabilities.

## Features

- User Authentication
  - Register with personal information
  - Login with email and password
  - JWT-based authentication

- User Search
  - Advanced search by first name, last name, and age
  - Case-insensitive name search
  - Pagination with limit of 50 results

- Friend Management
  - Send friend requests
  - Accept/decline friend requests
  - View pending friend requests
  - View friends list

## Tech Stack

- NestJS
- PostgreSQL
- JSON Web Tokens (JWT)
- Jest

## Database Structure

### Users Table
```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Friendship Requests Table
```sql
CREATE TABLE friendship_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sender_id, receiver_id)
);
```

## API Endpoints

### Authentication
- POST /api/auth/sign-up - Register a new user
- POST /api/auth/sign-in - Login user

### User Management
- GET /api/users/search - Search users by name and age
- POST /api/users/:receiverId/friend-request - Send friend request
- PUT /api/users/friend-requests/:requestId - Update friend request status
- GET /api/users/friend-requests - Get pending friend requests
- GET /api/users/:userId/friends - Get user's friends list

## Project Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a .env file based on .env.example:
```env
CORS_ORIGIN=http://localhost:3000
PORT=3000

JWT_SECRET=your-secret-key
JWT_EXPIRATION_TIME=1h

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your-password
DB_NAME=social_app
```

4. Run the database migrations:
```bash
# The migrations will run automatically when the application starts
npm run start
```

5. Start the development server:
```bash
npm run start:dev
```

## Testing

```bash
# Run unit tests
npm run test
```

## Architecture

The project follows a clean, modular architecture:

- **Modules** - Feature-based modules (Auth, User)
- **Controllers** - Handle HTTP requests
- **Services** - Business logic layer
- **Repositories** - Database interactions
- **DTOs** - Data transfer objects for validation
- **Guards** - Authentication middleware
- **Helpers** - Utility functions
- **Interfaces** - TypeScript interfaces
- **Enums** - TypeScript enums

## Best Practices

- Database migrations for version control
- Input validation using class-validator
- Error handling with custom exceptions
- JWT-based authentication
- Unit testing with Jest
- Clean code principles
- TypeScript for type safety
- Environment configuration
- CORS protection
- Request validation

## License

[MIT licensed](LICENSE)
