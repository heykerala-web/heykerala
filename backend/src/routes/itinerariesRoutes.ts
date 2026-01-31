import { Router } from 'express';
import { saveItinerary, getItinerary, getItineraryPDF } from '../controllers/itineraryController';

const router = Router();

// Itinerary management endpoints
router.post('/save', saveItinerary);
router.get('/:id', getItinerary);
router.get('/:id/pdf', getItineraryPDF);

export default router;








