# MERN Backend Setup Guide

This guide will help you set up and run the MERN backend for the Hey Kerala project.

## ✅ What's Been Installed

All backend dependencies have been installed:
- ✅ Express.js
- ✅ MongoDB (Mongoose)
- ✅ JWT (jsonwebtoken)
- ✅ bcryptjs (password hashing)
- ✅ CORS
- ✅ dotenv
- ✅ express-validator
- ✅ TypeScript types

## 🚀 Quick Start

### Step 1: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/heykerala

# JWT Secret (Change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 2: Set Up MongoDB

#### Option A: Local MongoDB

1. **Install MongoDB:**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB:**
   - Windows: MongoDB should start as a service automatically
   - Mac/Linux: `mongod` or `brew services start mongodb-community`

3. **Verify:** MongoDB should be running on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address (or use `0.0.0.0/0` for development)
6. Get your connection string
7. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heykerala?retryWrites=true&w=majority
   ```

### Step 3: Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev:server

# Or production mode
npm run server
```

The server will start on `http://localhost:5000`

### Step 4: Start the Frontend

In a separate terminal:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
heykerala/
├── server/
│   ├── config/
│   │   └── db.ts          # MongoDB connection
│   ├── models/
│   │   ├── User.ts        # User model
│   │   └── Contact.ts     # Contact model
│   ├── routes/
│   │   ├── auth.ts        # Auth routes (register, login)
│   │   └── contact.ts     # Contact routes
│   ├── middleware/
│   │   └── auth.ts        # JWT authentication middleware
│   ├── index.ts           # Server entry point
│   ├── tsconfig.json      # TypeScript config
│   └── README.md          # Detailed backend docs
├── lib/
│   └── api.ts             # Frontend API utilities
├── app/
│   ├── register/
│   │   └── page.tsx       # Registration page (connected to backend)
│   ├── login/
│   │   └── page.tsx       # Login page (connected to backend)
│   └── contact/
│       └── page.tsx       # Contact page (connected to backend)
└── .env                   # Environment variables (create this)
```

## 🔌 API Endpoints

### Authentication

**Register:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Current User (Protected):**
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

### Contact

**Submit Contact Form:**
```
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question..."
}
```

## 🧪 Testing

### Test with curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Contact
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

### Test in Browser:

1. Start the server: `npm run dev:server`
2. Visit: `http://localhost:5000` - Should see API welcome message
3. Visit: `http://localhost:5000/api/health` - Should see health check

## 🔧 Configuration

### Frontend API URL

The frontend is configured to use `http://localhost:5000/api` by default. To change this:

1. Create `.env.local` in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. Or update `lib/api.ts` directly

### CORS

CORS is configured to allow requests from `http://localhost:3000`. To change:

Update `server/index.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connection timed out`

**Solutions:**
1. Check if MongoDB is running: `mongosh` or check MongoDB service
2. Verify connection string in `.env`
3. For Atlas: Check IP whitelist and credentials
4. Check firewall settings

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change `PORT` in `.env` to a different port (e.g., `5001`)
2. Kill the process using port 5000:
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`
   - Mac/Linux: `lsof -ti:5000 | xargs kill`

### JWT Errors

**Error:** `jwt malformed` or `invalid signature`

**Solutions:**
1. Ensure `JWT_SECRET` is set in `.env`
2. Use a strong, random secret (at least 32 characters)
3. Don't change the secret after users are registered (they won't be able to login)

### TypeScript Errors

**Error:** Type errors in server files

**Solutions:**
1. Ensure all dependencies are installed: `npm install`
2. Check `server/tsconfig.json` is correct
3. Restart TypeScript server in your IDE

## 📝 Next Steps

1. ✅ Backend is set up and running
2. ✅ Frontend is connected to backend
3. 🔄 Test registration and login
4. 🔄 Test contact form
5. 🔄 Add more features (profile, bookings, etc.)

## 🚀 Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
3. Use MongoDB Atlas or managed MongoDB
4. Update `FRONTEND_URL` to production URL
5. Deploy backend to:
   - Heroku
   - Railway
   - Render
   - AWS
   - DigitalOcean

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [JWT Guide](https://jwt.io/introduction)

---

**Need Help?** Check `server/README.md` for detailed API documentation.


