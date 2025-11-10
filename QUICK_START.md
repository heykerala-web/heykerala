# Quick Start Guide - Authentication Backend

## ✅ What's Included

- ✅ Node.js + Express backend
- ✅ MongoDB with Mongoose
- ✅ User authentication (register/login)
- ✅ Password hashing with bcrypt
- ✅ JWT tokens (7 days expiry)
- ✅ Protected routes with auth middleware
- ✅ Input validation with express-validator
- ✅ Modular code structure
- ✅ TypeScript support

## 🚀 Quick Start

### 1. Create `.env` file in root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/heykerala
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

### 2. Start MongoDB (if using local):

```bash
# Windows: MongoDB should start automatically
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 3. Start the server:

```bash
npm run dev:server
```

### 4. Test the API:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📁 File Structure

```
server/
├── config/
│   └── db.ts              # MongoDB connection
├── models/
│   └── User.ts            # User model (password hashing)
├── routes/
│   └── auth.ts            # /api/auth/register, /api/auth/login, /api/auth/me
├── middleware/
│   └── auth.ts            # JWT protection middleware
└── index.ts               # Express server setup
```

## 🔑 Key Features

1. **Password Security:** Passwords hashed with bcrypt (10 salt rounds)
2. **JWT Tokens:** Expire after 7 days, stored in Authorization header
3. **Validation:** All inputs validated with express-validator
4. **Error Handling:** Consistent JSON error responses
5. **Protected Routes:** Use `protect` middleware for auth-required routes

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

## 🔒 Using Protected Routes

```typescript
import { protect } from '../middleware/auth';

router.get('/protected-route', protect, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

## 📚 Documentation

- **Full API Tests:** See `API_TESTS.md`
- **Server README:** See `server/README.md`
- **Backend Setup:** See `BACKEND_SETUP.md`

## 🐛 Common Issues

1. **MongoDB Connection Error:** Check `MONGODB_URI` in `.env`
2. **JWT Errors:** Ensure `JWT_SECRET` is set in `.env`
3. **Port Already in Use:** Change `PORT` in `.env` or kill process on port 5000

## ✨ Next Steps

1. Add more user fields (avatar, bio, etc.)
2. Add password reset functionality
3. Add email verification
4. Add refresh tokens
5. Add rate limiting
6. Add logging


