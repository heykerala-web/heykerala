# Hey Kerala Backend API

Complete Node.js + Express backend with MongoDB authentication.

## 📁 Project Structure

```
server/
├── config/
│   └── db.ts              # MongoDB connection
├── models/
│   └── User.ts            # User model with password hashing
├── routes/
│   └── auth.ts            # Authentication routes
├── middleware/
│   └── auth.ts            # JWT authentication middleware
├── index.ts               # Express server setup
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Features

- ✅ User registration with password hashing (bcrypt)
- ✅ User login with JWT token generation
- ✅ Protected routes with JWT middleware
- ✅ Input validation with express-validator
- ✅ JSON error responses
- ✅ Modular code structure
- ✅ TypeScript support

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/heykerala
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

### 3. Start Server

```bash
# Development (with auto-reload)
npm run dev:server

# Production
npm run server
```

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Login user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/api/auth/me`
Get current authenticated user (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## 🔐 Security Features

1. **Password Hashing:** Passwords are hashed using bcrypt (salt rounds: 10)
2. **JWT Tokens:** Tokens expire after 7 days
3. **Input Validation:** All inputs validated with express-validator
4. **Protected Routes:** JWT middleware protects sensitive endpoints
5. **Error Handling:** Consistent JSON error responses

## 📝 Code Structure

### Models (`models/User.ts`)
- User schema with Mongoose
- Password hashing middleware (pre-save hook)
- Password comparison method
- Email uniqueness and validation

### Routes (`routes/auth.ts`)
- `/register` - User registration
- `/login` - User authentication
- `/me` - Get current user (protected)

### Middleware (`middleware/auth.ts`)
- `protect` - JWT validation middleware
- Extracts token from Authorization header
- Verifies token and attaches user to request

### Server (`index.ts`)
- Express app setup
- MongoDB connection
- CORS configuration
- Route mounting
- Error handling

## 🧪 Testing

See `API_TESTS.md` for complete curl test commands.

Quick test:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get user (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/heykerala` |
| `JWT_SECRET` | JWT signing secret | **Required** |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 📦 Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `express-validator` - Input validation
- `cors` - CORS middleware
- `dotenv` - Environment variables

## 🐛 Error Responses

All errors return JSON in this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "msg": "Validation error",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET` (min 32 characters)
3. Use MongoDB Atlas or managed MongoDB
4. Update `FRONTEND_URL` to production URL
5. Enable HTTPS
6. Set up proper logging
7. Configure rate limiting
8. Use environment-specific configs

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [express-validator Docs](https://express-validator.github.io/docs/)
