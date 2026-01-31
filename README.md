# Hey Kerala - Travel Platform

Full-stack travel platform for Kerala tourism with modern UI and robust backend API.

## 📁 Project Structure

```
heykerala/
├── client/              # Frontend (Next.js)
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── lib/            # Utilities and API client
│   ├── public/         # Static assets
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Global styles
│   ├── package.json
│   ├── .env.local      # Frontend environment variables
│   ├── next.config.mjs
│   └── tsconfig.json
│
├── backend/            # Backend (Express + MongoDB)
│   ├── config/         # Configuration files
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── package.json
│   ├── .env            # Backend environment variables
│   ├── tsconfig.json
│   └── index.ts        # Server entry point
│
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env` file (already created)
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a strong secret key

4. Start the backend server:
   ```bash
   npm run dev
   ```

   Backend will run on: **http://localhost:5000**

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - `.env.local` is already created
   - Update `NEXT_PUBLIC_API_URL` if your backend runs on a different port

4. Start the frontend:
   ```bash
   npm run dev
   ```

   Frontend will run on: **http://localhost:3000**

## 🛠️ Development

Run both servers in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

## 📦 Environment Variables

### Backend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/heykerala` |
| `JWT_SECRET` | JWT signing secret | **Required** |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (`.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)

### Health Check

- `GET /api/health` - Server health check

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **TypeScript** - Type safety

## 📝 Scripts

### Backend Scripts

```bash
npm run dev      # Start development server with auto-reload
npm run start    # Start production server
npm run build    # Build TypeScript to JavaScript
```

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB: [MongoDB Download](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Update `MONGODB_URI` in backend `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/heykerala
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create database user
4. Whitelist your IP address
5. Get connection string
6. Update `MONGODB_URI` in backend `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heykerala
   ```

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🚀 Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
3. Use MongoDB Atlas or managed MongoDB
4. Update `FRONTEND_URL` to production URL
5. Deploy to:
   - Heroku
   - Railway
   - Render
   - AWS
   - DigitalOcean

### Frontend Deployment

1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Build the project: `npm run build`
3. Deploy to:
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify
   - Any static hosting

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Backend Setup Guide](./BACKEND_SETUP.md)
- [API Tests](./API_TESTS.md)
- [Quick Start Guide](./QUICK_START.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
- Check the documentation in `backend/README.md`
- Review `BACKEND_SETUP.md` for setup issues
- Check `API_TESTS.md` for API examples

---

**Happy Coding! 🎉**






