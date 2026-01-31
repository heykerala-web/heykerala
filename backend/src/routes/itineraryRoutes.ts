import { Router } from 'express';
import { generateAIPlan } from '../controllers/itineraryAIController';
import { generateManualPlan } from '../controllers/itineraryManualController';

const router = Router();

// Itinerary generation endpoints
router.post('/manual', generateManualPlan);
router.post('/ai', generateAIPlan);

export default router;