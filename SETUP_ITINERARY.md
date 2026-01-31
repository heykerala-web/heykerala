# Plan My Trip - Setup Guide

This guide will help you set up the complete "Plan My Trip" system for Hey Kerala.

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google Gemini API key (optional, for AI itinerary generation)

## 🚀 Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

**Required Dependencies:**
- `puppeteer` - For PDF generation
- `@google/generative-ai` - For AI itinerary generation (already installed)
- `leaflet` & `react-leaflet` - For maps (frontend)

### 2. Frontend Setup

```bash
cd client
npm install
```

**New Dependencies Added:**
- `leaflet` - Map library
- `react-leaflet` - React wrapper for Leaflet
- `@types/leaflet` - TypeScript types

### 3. Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/heykerala
JWT_SECRET=your-secret-key
API_KEY=your-gemini-api-key  # Optional, for AI generation
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🗂️ Project Structure

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   ├── itineraryAIController.ts      # AI itinerary generation
│   │   ├── itineraryManualController.ts  # Manual itinerary generation
│   │   └── itineraryController.ts        # Save, get, PDF endpoints
│   ├── routes/
│   │   ├── itineraryRoutes.ts           # POST /api/itinerary/manual, /ai
│   │   └── itinerariesRoutes.ts         # POST /api/itineraries/save, GET /:id, /:id/pdf
│   ├── models/
│   │   └── ItineraryHistory.ts          # MongoDB model
│   └── utils/
│       └── pdfGenerator.ts              # Puppeteer PDF generation
```

### Frontend
```
client/
├── app/
│   └── plan-trip/
│       ├── page.tsx                     # Form page (existing, unchanged)
│       └── result/
│           └── page.tsx                 # Result page (NEW)
└── components/
    └── itinerary/
        ├── ItineraryHeader.tsx          # Hero section
        ├── DayAccordion.tsx             # Day-by-day timeline
        ├── ActivityCard.tsx              # Individual activity
        ├── LeafletMapView.tsx           # Map component (NO MAPBOX)
        ├── BudgetBreakdown.tsx          # Budget visualization
        ├── HotelsGrid.tsx               # Hotel recommendations
        └── ActionButtons.tsx            # Save, PDF, Share buttons
```

## 🔌 API Endpoints

### Itinerary Generation
- `POST /api/itinerary/manual` - Generate manual itinerary
- `POST /api/itinerary/ai` - Generate AI-powered itinerary

**Request Body:**
```json
{
  "duration": "3-4 days",
  "budget": "Mid-range",
  "travelers": "Couple",
  "interests": ["Backwaters", "Hill Stations"]
}
```

### Itinerary Management
- `POST /api/itineraries/save` - Save itinerary to database
- `GET /api/itineraries/:id` - Get saved itinerary
- `GET /api/itineraries/:id/pdf` - Download PDF

## 🗺️ Map Configuration

**NO MAPBOX** - Uses Leaflet + OpenStreetMap (free, no token required)

- Tile URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Shows markers for all activities
- Shows polylines connecting activities per day
- Auto-centers to first activity

## 📄 Features

### Result Page (`/plan-trip/result`)
- ✅ Reads itinerary data from URL parameter `?data=<encoded JSON>`
- ✅ Hero section with title, duration, travelers, budget
- ✅ AI recommendation display (if AI-generated)
- ✅ Day-by-day accordion timeline
- ✅ Activity cards with images, time, description, cost
- ✅ Interactive Leaflet map with markers and routes
- ✅ Budget breakdown with visual charts
- ✅ Hotel recommendations grid
- ✅ Action buttons: Save, Download PDF, Share WhatsApp
- ✅ Fully responsive design

### Backend Features
- ✅ Manual itinerary generation (rule-based)
- ✅ AI itinerary generation (Gemini API)
- ✅ MongoDB storage for saved itineraries
- ✅ PDF generation with Puppeteer
- ✅ Exact JSON schema matching

## 🎨 UI/UX

- Kerala-themed color scheme (emerald green, teal)
- Modern, responsive design
- Mobile-first approach
- Smooth animations and transitions
- Accessible components

## 🧪 Testing

1. **Test Manual Generation:**
   ```bash
   curl -X POST http://localhost:5000/api/itinerary/manual \
     -H "Content-Type: application/json" \
     -d '{
       "duration": "3-4 days",
       "budget": "Mid-range",
       "travelers": "Couple",
       "interests": ["Backwaters", "Hill Stations"]
     }'
   ```

2. **Test AI Generation:**
   ```bash
   curl -X POST http://localhost:5000/api/itinerary/ai \
     -H "Content-Type: application/json" \
     -d '{
       "duration": "5-7 days",
       "budget": "Luxury",
       "travelers": "Family",
       "interests": ["Culture & Heritage", "Wildlife"]
     }'
   ```

## 🐛 Troubleshooting

### Map not showing?
- Ensure `leaflet` CSS is imported in `globals.css`
- Check browser console for Leaflet errors
- Verify Leaflet CDN markers are accessible

### PDF generation fails?
- Ensure Puppeteer is installed: `npm install puppeteer`
- On Linux, may need: `sudo apt-get install -y chromium-browser`
- Check Puppeteer launch args in `pdfGenerator.ts`

### AI generation fails?
- Verify `API_KEY` or `GEMINI_API_KEY` is set in `.env`
- Check Gemini API quota/limits
- Review error logs in backend console

## 📝 Notes

- The existing `plan-trip/page.tsx` is **NOT MODIFIED** as requested
- All Mapbox references have been **REMOVED**
- Leaflet uses OpenStreetMap (free, no token)
- PDF generation requires Puppeteer (installed automatically)
- Itinerary data is passed via URL params (encoded JSON)

## 🎉 You're All Set!

The complete "Plan My Trip" system is now ready. Users can:
1. Fill out the form on `/plan-trip`
2. Generate manual or AI itineraries
3. View detailed results on `/plan-trip/result`
4. Save, download PDF, or share via WhatsApp

Enjoy building amazing Kerala trip experiences! 🌴








