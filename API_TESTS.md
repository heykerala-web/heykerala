# API Testing Guide

This document provides curl commands to test the authentication endpoints.

## Prerequisites

1. Make sure the server is running:
   ```bash
   npm run dev:server
   ```

2. Make sure MongoDB is running (local or Atlas)

3. Create a `.env` file in the root directory (copy from `.env.example`)

## Test Endpoints

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (Success - 201):**
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

**Expected Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```

**Test Cases:**

**a) Missing fields:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe"
  }'
```

**b) Invalid email:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid-email",
    "password": "password123"
  }'
```

**c) Short password:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123"
  }'
```

**d) Duplicate email:**
```bash
# Run the register command twice with the same email
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (Success - 200):**
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

**Expected Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Test Cases:**

**a) Wrong password:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

**b) Non-existent user:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }'
```

**c) Missing fields:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### 4. Get Current User (Protected Route)

First, get a token from login or register, then use it:

```bash
# Save token from login/register response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (Success - 200):**
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

**Expected Response (Error - 401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**Test Cases:**

**a) No token:**
```bash
curl -X GET http://localhost:5000/api/auth/me
```

**b) Invalid token:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid-token-here"
```

**c) Expired token:**
```bash
# Use an old/expired token
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer expired-token-here"
```

## Complete Test Flow

Here's a complete test flow from registration to protected route:

```bash
# 1. Register a new user
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }')

echo "Register Response: $REGISTER_RESPONSE"

# Extract token (requires jq: npm install -g jq)
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')

# 2. Login with the same user
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Update token from login
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

# 3. Get current user (protected route)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Windows PowerShell Commands

For Windows users, here are PowerShell equivalents:

### Register:
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Login:
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

$token = $response.token
```

### Get Current User:
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
  -Method GET `
  -Headers $headers
```

## Using Postman

1. **Import Collection:**
   - Create a new collection
   - Add requests for each endpoint
   - Set environment variables for `base_url` and `token`

2. **Environment Variables:**
   ```
   base_url: http://localhost:5000/api
   token: (will be set after login)
   ```

3. **Test Script (for login):**
   ```javascript
   if (pm.response.code === 200) {
       const jsonData = pm.response.json();
       pm.environment.set("token", jsonData.token);
   }
   ```

## Expected Status Codes

- `200` - Success (GET, POST successful operations)
- `201` - Created (POST register successful)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials, missing/invalid token)
- `404` - Not Found (user not found)
- `500` - Internal Server Error (server errors)

## Troubleshooting

1. **Connection Refused:**
   - Make sure server is running: `npm run dev:server`
   - Check if port 5000 is available

2. **MongoDB Connection Error:**
   - Verify MongoDB is running
   - Check `MONGODB_URI` in `.env` file
   - For Atlas: Check IP whitelist and credentials

3. **JWT Errors:**
   - Ensure `JWT_SECRET` is set in `.env`
   - Token expires after 7 days

4. **Validation Errors:**
   - Check request body format (must be JSON)
   - Verify all required fields are present
   - Check field types and constraints


