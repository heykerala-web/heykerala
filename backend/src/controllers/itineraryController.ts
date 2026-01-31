import { Request, Response } from 'express';
import ItineraryHistory from '../models/ItineraryHistory';
import { generatePDF } from '../utils/pdfGenerator';

// Save itinerary
export const saveItinerary = async (req: Request, res: Response) => {
    try {
        const itineraryData = req.body;

        if (!itineraryData.id || !itineraryData.days) {
            return res.status(400).json({ message: "Invalid itinerary data." });
        }

        const saved = await ItineraryHistory.create({
            method: itineraryData.aiReason ? "ai" : "manual",
            duration: itineraryData.duration?.toString() || "",
            budget: itineraryData.budgetEstimate ? `${itineraryData.budgetEstimate.min}-${itineraryData.budgetEstimate.max}` : "",
            interests: [],
            travelers: itineraryData.travelers || "",
            plan: itineraryData.days.map((day: any) => ({
                day: day.day,
                place: day.activities?.[0]?.name || "",
                activities: day.activities?.map((a: any) => a.name) || [],
                map: JSON.stringify(day.mapPolyline || [])
            })),
            estimatedCost: itineraryData.budgetEstimate?.max || 0,
            rawAI: itineraryData.aiReason || "",
            itineraryData: itineraryData // Store full data
        });

        res.status(201).json({ 
            success: true, 
            id: saved._id,
            message: "Itinerary saved successfully" 
        });
    } catch (error: any) {
        console.error("Error saving itinerary:", error);
        res.status(500).json({ message: "Failed to save itinerary", error: error.message });
    }
};

// Get itinerary by ID
export const getItinerary = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const itinerary = await ItineraryHistory.findById(id);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found." });
        }

        // Return stored full data if available, otherwise reconstruct
        if ((itinerary as any).itineraryData) {
            return res.status(200).json((itinerary as any).itineraryData);
        }

        // Fallback: reconstruct from plan data
        const reconstructed = {
            id: itinerary._id.toString(),
            title: `${itinerary.duration}-Day Kerala Trip`,
            duration: parseInt(itinerary.duration) || 3,
            travelers: itinerary.travelers,
            budgetEstimate: {
                min: itinerary.estimatedCost * 0.9,
                max: itinerary.estimatedCost
            },
            heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
            aiReason: itinerary.rawAI || null,
            days: itinerary.plan.map((p: any) => ({
                day: p.day,
                activities: [],
                mapPolyline: p.map ? JSON.parse(p.map) : []
            })),
            hotels: [],
            budgetBreakdown: {
                stay: 0,
                food: 0,
                travel: 0,
                tickets: 0,
                extras: 0
            }
        };

        res.status(200).json(reconstructed);
    } catch (error: any) {
        console.error("Error getting itinerary:", error);
        res.status(500).json({ message: "Failed to get itinerary", error: error.message });
    }
};

// Generate PDF
export const getItineraryPDF = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const itinerary = await ItineraryHistory.findById(id);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found." });
        }

        // Get full itinerary data
        const itineraryData = (itinerary as any).itineraryData || {
            id: itinerary._id.toString(),
            title: `${itinerary.duration}-Day Kerala Trip`,
            duration: parseInt(itinerary.duration) || 3,
            days: itinerary.plan
        };

        const pdfBuffer = await generatePDF(itineraryData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="itinerary-${id}.pdf"`);
        res.send(pdfBuffer);
    } catch (error: any) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Failed to generate PDF", error: error.message });
    }
};








