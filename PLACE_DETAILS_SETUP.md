# Place Details + Live Weather Feature Setup Guide

## Overview

This feature adds a comprehensive Place Details page with live weather integration for the HeyKerala tourism project.

## Features

✅ **Place Details Page** (`/places/[slug]`)
- Full-width hero banner with place image
- Detailed description and highlights
- Live weather integration
- Interactive Leaflet map
- Nearby attractions
- Related places section
- Breadcrumb navigation
- Responsive design

✅ **Live Weather Integration**
- Real-time weather data from OpenWeatherMap/WeatherAPI
- 10-minute caching for performance
- Temperature, humidity, wind speed, pressure, visibility
- Dynamic weather icons

✅ **Backend API Routes**
- `GET /api/places/slug/:slug` - Get place by slug
- `GET /api/places/related/:slug` - Get related places
- `GET /api/weather?lat=...&lon=...` - Get weather data

## Setup Instructions

### 1. Environment Variables

Add to your `backend/.env` file:

```env
# Weather API (Choose one)
OPENWEATHER_API_KEY=your_openweather_api_key
# OR
WEATHER_API_KEY=your_weatherapi_key
```

**Getting API Keys:**
- **OpenWeatherMap**: Sign up at https://openweathermap.org/api (Free tier available)
- **WeatherAPI.com**: Sign up at https://www.weatherapi.com/ (Free tier available)

### 2. Seed the Database

Run the seed script to populate sample places:

```bash
cd backend
npx ts-node src/seed/placesSeed.ts
```

Or add a script to `backend/package.json`:

```json
{
  "scripts": {
    "seed:places": "ts-node src/seed/placesSeed.ts"
  }
}
```

Then run:
```bash
npm run seed:places
```

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

The server should run on `http://localhost:5000`

### 4. Start the Frontend

```bash
cd client
npm run dev
```

The frontend should run on `http://localhost:3000`

## Usage

### Accessing Place Details

1. Navigate to the home page
2. Click on any trending spot (Munnar, Alleppey, Kovalam, Wayanad)
3. You'll be redirected to `/places/[slug]` (e.g., `/places/munnar`)

### API Endpoints

#### Get Place by Slug
```
GET /api/places/slug/munnar
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Munnar",
    "slug": "munnar",
    "district": "Idukki",
    "category": "Hill Station",
    "description": "...",
    "latitude": 10.0889,
    "longitude": 77.0595,
    "nearby": [...],
    ...
  }
}
```

#### Get Weather
```
GET /api/weather?lat=10.0889&lon=77.0595
```

Response:
```json
{
  "success": true,
  "data": {
    "temperature": 25,
    "feelsLike": 27,
    "condition": "Clouds",
    "description": "scattered clouds",
    "icon": "03d",
    "humidity": 65,
    "windSpeed": 3.2,
    "pressure": 1013,
    "visibility": "10.0",
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  },
  "cached": false
}
```

#### Get Related Places
```
GET /api/places/related/munnar
```

## MongoDB Schema

### Place Model

```typescript
{
  name: string (required)
  slug: string (required, unique)
  district: string (required)
  category: string (required)
  description: string (required)
  image: string (required)
  latitude: number (required)
  longitude: number (required)
  nearby: Array<{
    name: string
    image?: string
    distance?: string
  }>
  rating?: number (0-5)
  highlights?: string[]
  bestTimeToVisit?: string
  entryFee?: string
  openingHours?: string
}
```

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Place.ts              # MongoDB Place model
│   ├── controllers/
│   │   ├── placeController.ts     # Place CRUD operations
│   │   └── weatherController.ts   # Weather API integration
│   ├── routes/
│   │   ├── placeRoutes.ts         # Place API routes
│   │   └── weatherRoutes.ts       # Weather API routes
│   └── seed/
│       └── placesSeed.ts          # Database seed script

client/
├── app/
│   └── places/
│       └── [slug]/
│           └── page.tsx           # Place details page
└── components/
    └── trendingspot.tsx           # Updated with slug links
```

## Customization

### Adding New Places

1. Add place data to `backend/src/seed/placesSeed.ts`
2. Run the seed script
3. The place will be accessible at `/places/[slug]`

### Styling

The page uses:
- TailwindCSS for styling
- ShadCN UI components
- Custom animations (defined in `globals.css`)
- Kerala theme colors (Emerald #047857, Teal #0d9488)

### Weather Cache Duration

To change the cache duration, edit `backend/src/controllers/weatherController.ts`:

```typescript
const CACHE_DURATION = 10 * 60 * 1000; // Change to desired duration
```

## Troubleshooting

### Weather Not Loading

1. Check if API key is set in `.env`
2. Verify API key is valid
3. Check backend logs for errors
4. Ensure backend server is running

### Place Not Found

1. Verify place exists in database
2. Check slug matches exactly (case-insensitive)
3. Run seed script if database is empty

### Map Not Displaying

1. Ensure Leaflet CSS is imported
2. Check browser console for errors
3. Verify coordinates are valid numbers

## Production Considerations

1. **API Rate Limits**: Implement proper rate limiting for weather API
2. **Caching**: Consider using Redis for production caching
3. **Error Handling**: Add more robust error handling
4. **Image Optimization**: Use Next.js Image component for place images
5. **SEO**: Add meta tags and structured data
6. **Analytics**: Track page views and user interactions

## Support

For issues or questions, check:
- Backend logs: `backend/` directory
- Frontend console: Browser DevTools
- API responses: Network tab in DevTools






